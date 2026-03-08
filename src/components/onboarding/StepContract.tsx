import { useEffect, useState, useRef, useCallback } from "react";
import { useOnboardingStore, PACKS } from "@/stores/onboardingStore";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Download, Loader2, CheckCircle2 } from "lucide-react";
import SignaturePad from "@/components/contract/SignaturePad";
import { toast } from "sonner";

export default function StepContract() {
  const { profile, brand, products, pack, setStep, setContractSigned, setContractId, contractId } = useOnboardingStore();
  const { user } = useAuth();
  const [contractHtml, setContractHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [luApprouve, setLuApprouve] = useState("");
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const packInfo = PACKS[pack];

  // Generate client block based on profile
  const generateClientBloc = useCallback(() => {
    const p = profile;
    if (p.statut_juridique === "societe") {
      return `${p.raison_sociale || ""}, ${p.forme_juridique || ""}<br/>Siège social : ${p.siege_social || ""}<br/>RCS / SIRET : ${p.rcs_siret || ""}<br/>${p.numero_tva ? `TVA : ${p.numero_tva}<br/>` : ""}Représentée par ${p.representant_nom || ""}, en qualité de ${p.representant_qualite || ""}<br/>Ci-après nommée « Le Client ».`;
    }
    if (p.statut_juridique === "auto_entrepreneur") {
      return `${p.civilite || ""} ${p.prenom} ${p.nom}<br/>Auto-entrepreneur, SIRET : ${p.rcs_siret || ""}<br/>Domicilié(e) : ${p.adresse}, ${p.code_postal} ${p.ville}, ${p.pays}<br/>Email : ${p.email} — Tél : ${p.telephone}<br/>Ci-après nommé(e) « Le Client ».`;
    }
    return `${p.civilite || ""} ${p.prenom} ${p.nom}<br/>${p.date_naissance ? `Né(e) le ${p.date_naissance}, ` : ""}${p.nationalite ? `de nationalité ${p.nationalite}` : ""}<br/>Domicilié(e) : ${p.adresse}, ${p.code_postal} ${p.ville}, ${p.pays}<br/>Email : ${p.email} — Tél : ${p.telephone}<br/>Ci-après nommé(e) « Le Client ».`;
  }, [profile]);

  // Fetch template and generate contract
  useEffect(() => {
    const generate = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // Get active template
        const { data: template } = await supabase
          .from("contract_templates")
          .select("*")
          .eq("active", true)
          .single();

        if (!template) {
          toast.error("Aucun template de contrat trouvé");
          setLoading(false);
          return;
        }

        // Generate contract number
        const { data: numData } = await supabase.rpc("generate_contract_number");
        const numero = numData || `BIO-${new Date().getFullYear()}-00000`;

        const today = new Date().toLocaleDateString("fr-FR");
        const productsHtml = products.map((p) => `<li>${p.name}${p.price ? ` — ${p.price.toFixed(2)} €` : ""}</li>`).join("");

        let html = template.contenu_html
          .replace(/{client_bloc}/g, generateClientBloc())
          .replace(/{pack_nom}/g, packInfo.label)
          .replace(/{pack_setup_prix}/g, packInfo.setup_price.toLocaleString("fr-FR"))
          .replace(/{abonnement_prix}/g, packInfo.monthly_price.toString())
          .replace(/{abonnement_nom}/g, packInfo.monthly_name)
          .replace(/{date_contrat}/g, today)
          .replace(/{numero_contrat}/g, numero)
          .replace(/{brand_name}/g, brand.brand_name)
          .replace(/{produits_selectionnes}/g, `<ul style="padding-left: 20px;">${productsHtml}</ul>`);

        setContractHtml(html);

        // Create draft contract in DB
        const { data: contract, error } = await supabase
          .from("onboarding_contracts")
          .insert({
            user_id: user.id,
            numero_contrat: numero,
            pack,
            montant_setup: packInfo.setup_price,
            montant_abonnement: packInfo.monthly_price,
            contenu_html: html,
            produits_selectionnes: products as any,
            brand_name: brand.brand_name,
            template_id: template.id,
          })
          .select()
          .single();

        if (error) {
          // Might already exist, try to fetch
          const { data: existing } = await supabase
            .from("onboarding_contracts")
            .select("*")
            .eq("user_id", user.id)
            .eq("statut", "brouillon")
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          if (existing) {
            setContractId(existing.id);
            setContractHtml(existing.contenu_html);
          }
        } else if (contract) {
          setContractId(contract.id);
        }
      } catch (err) {
        console.error(err);
        toast.error("Erreur lors de la génération du contrat");
      }
      setLoading(false);
    };
    generate();
  }, [user]);

  // Scroll tracking
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
    if (atBottom) setHasScrolledToBottom(true);
  };

  // Sign contract
  const handleSign = async () => {
    if (!contractId || !signatureDataUrl || !user) return;
    setSigning(true);
    try {
      // Upload signature image
      const blob = await (await fetch(signatureDataUrl)).blob();
      const fileName = `signatures/${contractId}.png`;
      await supabase.storage.from("contracts").upload(fileName, blob, { contentType: "image/png", upsert: true });

      const { data: { publicUrl } } = supabase.storage.from("contracts").getPublicUrl(fileName);

      // Compute simple hash (for demo — real SHA-256 in edge function)
      const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(contractHtml));
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

      // Update contract
      const { error } = await supabase
        .from("onboarding_contracts")
        .update({
          statut: "signe",
          signed_at: new Date().toISOString(),
          contenu_hash: hashHex,
          signature_image_url: publicUrl,
          signature_ua: navigator.userAgent,
        })
        .eq("id", contractId);

      if (error) throw error;

      setSigned(true);
      setContractSigned(true);
      toast.success("Contrat signé avec succès !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la signature");
    }
    setSigning(false);
  };

  const canSign = hasScrolledToBottom && accepted && luApprouve.toLowerCase() === "lu et approuvé" && signatureDataUrl;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Génération de votre contrat...</p>
      </div>
    );
  }

  if (signed) {
    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold mb-2 text-foreground">Contrat signé !</h2>
        <p className="text-muted-foreground mb-8">Votre contrat a été signé avec succès. Vous pouvez maintenant procéder au paiement.</p>
        <Button onClick={() => setStep(5)} size="lg" className="w-full">
          Procéder au paiement <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-foreground">Votre contrat</h1>
      <p className="text-muted-foreground mb-6">Lisez attentivement le contrat, puis signez-le pour continuer.</p>

      {/* Scroll progress */}
      <div className="mb-4">
        <div className="text-xs text-muted-foreground mb-1">
          {hasScrolledToBottom ? "✓ Contrat lu en entier" : "↓ Scrollez jusqu'en bas pour signer"}
        </div>
      </div>

      {/* Contract viewer */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-[60vh] overflow-y-auto border border-border rounded-2xl bg-white p-0 mb-6"
      >
        <div dangerouslySetInnerHTML={{ __html: contractHtml }} />
      </div>

      {/* Download */}
      <Button
        variant="outline"
        size="sm"
        className="mb-6"
        onClick={() => {
          const w = window.open("", "_blank");
          if (w) {
            w.document.write(`<html><head><title>Contrat</title></head><body>${contractHtml}</body></html>`);
            w.print();
          }
        }}
      >
        <Download className="w-4 h-4 mr-2" /> Télécharger / Imprimer
      </Button>

      {/* Signature section */}
      {hasScrolledToBottom && (
        <div className="border border-border rounded-2xl p-6 space-y-6 bg-secondary/20">
          <h3 className="text-lg font-bold text-foreground">Signature électronique</h3>

          <div className="flex items-start gap-3">
            <Checkbox
              checked={accepted}
              onCheckedChange={(v) => setAccepted(!!v)}
              id="accept"
            />
            <label htmlFor="accept" className="text-sm text-muted-foreground cursor-pointer">
              J'ai lu et j'accepte les termes du contrat ci-dessus
            </label>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Saisissez « Lu et approuvé »
            </label>
            <Input
              value={luApprouve}
              onChange={(e) => setLuApprouve(e.target.value)}
              placeholder="Lu et approuvé"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Signez ci-dessous
            </label>
            <SignaturePad onSave={setSignatureDataUrl} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setStep(3)} size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" /> Retour
            </Button>
            <Button
              onClick={handleSign}
              className="flex-1"
              size="lg"
              disabled={!canSign || signing}
            >
              {signing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Signer le contrat
            </Button>
          </div>
        </div>
      )}

      {!hasScrolledToBottom && (
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep(3)} size="lg">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour
          </Button>
        </div>
      )}
    </div>
  );
}
