import { LYSTES_ENV } from "@lystes/integrations/supabase/env";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Camera, ChevronDown, Loader2, RotateCcw, Sparkles, X } from "lucide-react";
import { supabase } from "@lystes/integrations/supabase/client";
import { toast } from "sonner";
import type { ShotExperience } from "./shot-experience";
import { FaceMeshScan } from "./FaceMeshScan";
import { describeExperienceError } from "./shot-experience-error";
import { IndicatorsRadarChart } from "@lystes/components/agent/ConcernsRadarChart";
import {
  detectDiagnosticZone,
  ZONE_LABEL,
  type DiagnosticZone,
} from "@lystes/features/diagnostic-zone/diagnostic-zone";

interface Props {
  experience: Exclude<ShotExperience, { mode: "none" }>;
  productName: string;
  productImageUrl?: string;
  /** Brief produit scrappé — sert à générer la section "en quoi ce produit peut m'aider". */
  product?: Record<string, unknown>;
  sourceUrl?: string;
  /**
   * Identité du conseiller qui propose l'expérience. Quand elle est fournie,
   * l'en-tête porte son nom et son avatar : le diagnostic doit se lire comme la
   * suite de la conversation, pas comme une application qui s'ouvre par-dessus.
   * Omise sur /shot, où la modale est déjà ancrée dans le fil de discussion.
   */
  agent?: { name: string; avatarUrl?: string; teamLabel?: string };
  /**
   * Plein écran sur téléphone au lieu de la feuille à 92 % de hauteur. Utilisé
   * par la démo de la page d'accueil, où la modale s'ouvre par-dessus une iframe
   * et où laisser voir la page dessous casserait l'illusion de continuité.
   */
  fullScreenOnMobile?: boolean;
  onClose: () => void;
}

type Step = "photo" | "running" | "result";

interface Biometrics {
  fitzpatrick_phototype?: string;
  urgency_level?: "green" | "amber" | "red";
  confidence_factors?: string[];
  specific_metrics?: Record<string, string | number | boolean>;
}

interface DiagnosticResult {
  /** Type lisible renvoyé par l'analyse, ex. « Peau normale à mixte ». */
  detected_type?: string;
  summary?: string;
  indicators?: Array<{ indicator: string; score: number; interpretation?: string }>;
  concerns?: string[];
  characteristics?: string[];
  confidence_score?: number;
  biometrics?: Biometrics;
}

const CHAT_URL = `${LYSTES_ENV.VITE_SUPABASE_URL}/functions/v1/shot-product-chat-v2`;

const URGENCY_LABEL: Record<string, string> = {
  green: "Aucun signal d'alerte",
  amber: "Points à surveiller",
  red: "Avis professionnel conseillé",
};

const METRIC_LABEL: Record<string, string> = {
  pore_density: "Densité des pores",
  hydration_index: "Indice d'hydratation",
  pigment_mapping: "Cartographie pigmentaire",
  symmetry_score: "Symétrie du visage",
  photoaging_index: "Photo-vieillissement",
  barrier_score: "Barrière cutanée",
  skin_texture: "Texture de peau",
  porosity: "Porosité",
  density_index: "Densité capillaire",
  damage_map: "Cartographie des dommages",
  curl_definition: "Définition des boucles",
  shrinkage_ratio: "Taux de rétractation",
  scalp_sebum_score: "Sébum du cuir chevelu",
};

function prettyMetric(key: string) {
  return METRIC_LABEL[key] ?? key.replace(/_/g, " ");
}

/** Zone analysée, pour reconstituer un libellé lisible quand le modèle ne renvoie qu'un adjectif. */
const DIAGNOSTIC_SUBJECT: Record<string, string> = {
  skin: "Peau",
  hair: "Cheveux",
  scalp: "Cuir chevelu",
  teeth: "Dents",
  lips: "Lèvres",
  beard: "Barbe",
  nails: "Ongles",
};

/**
 * Le modèle renvoie parfois « normale » au lieu de « Peau normale à mixte ».
 * On préfixe alors la zone analysée et on capitalise, pour que la ligne
 * « Type de peau » ne se réduise jamais à un adjectif en minuscule.
 */
export function formatDetectedType(
  raw: string | null | undefined,
  diagnosticType?: string,
): string {
  const value = raw?.trim();
  if (!value) return "Profil analysé";

  const subject = diagnosticType ? DIAGNOSTIC_SUBJECT[diagnosticType] : undefined;
  const startsWithSubject = Object.values(DIAGNOSTIC_SUBJECT).some((s) =>
    value.toLowerCase().startsWith(s.toLowerCase()),
  );

  const labelled = subject && !startsWithSubject ? `${subject} ${value}` : value;
  return labelled.charAt(0).toUpperCase() + labelled.slice(1);
}


/** Expérience interactive de démonstration : essayage virtuel ou diagnostic biométrique. */
export function ShotExperienceModal({
  experience,
  productName,
  productImageUrl,
  product,
  sourceUrl,
  agent,
  fullScreenOnMobile = false,
  onClose,
}: Props) {
  const [step, setStep] = useState<Step>("photo");
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(null);
  const [productFit, setProductFit] = useState<string>("");
  const [fitLoading, setFitLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  /** Cible du bouton « Ce que ce produit peut faire pour vous ». */
  const productFitRef = useRef<HTMLDivElement>(null);
  /**
   * L'analyse revient souvent avant la fin du scan. On la met de côté et on
   * n'affiche le résultat qu'une fois l'animation allée à son terme : couper le
   * balayage en plein milieu donnait l'impression d'un diagnostic bâclé.
   */
  const [pendingDiagnostic, setPendingDiagnostic] = useState<DiagnosticResult | null>(null);
  const [scanDone, setScanDone] = useState(false);
  /** Zone réellement analysée, affinée depuis la fiche produit. */
  const [analysedZone, setAnalysedZone] = useState<DiagnosticZone | null>(null);

  const readFile = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  /** Génère "en quoi ce produit peut m'aider" à partir du diagnostic, via le même agent produit. */
  const loadProductFit = useCallback(
    async (analysis: DiagnosticResult) => {
      setFitLoading(true);
      setProductFit("");
      try {
        const metrics = analysis.biometrics?.specific_metrics ?? {};
        const brief = [
          `Résultat du diagnostic ${experience.mode === "diagnostic" ? experience.diagnosticType === "hair" ? "cheveux" : "peau" : ""} du client :`,
          analysis.summary ? `Synthèse : ${analysis.summary}` : "",
          analysis.indicators?.length
            ? `Indicateurs : ${analysis.indicators
                .map((i) => `${i.indicator} ${i.score}%`)
                .join(", ")}`
            : "",
          analysis.concerns?.length ? `Préoccupations : ${analysis.concerns.join(", ")}` : "",
          analysis.biometrics?.fitzpatrick_phototype
            ? `Phototype Fitzpatrick : ${analysis.biometrics.fitzpatrick_phototype}`
            : "",
          Object.keys(metrics).length
            ? `Mesures biométriques : ${Object.entries(metrics)
                .map(([k, v]) => `${prettyMetric(k)} = ${v}`)
                .join(", ")}`
            : "",
          "",
          `Explique en 3 à 5 phrases maximum, en t'adressant directement au client (tutoiement exclu, vouvoiement), EN QUOI CE PRODUIT PRÉCIS (${productName}) peut l'aider au regard de ce diagnostic.`,
          "Appuie-toi uniquement sur les caractéristiques réelles du produit. Ne propose AUCUNE routine, aucune étape matin/soir, aucun autre produit. Si le produit ne répond que partiellement au besoin, dis-le honnêtement. Pas de titre, pas de liste, uniquement un court paragraphe.",
        ]
          .filter(Boolean)
          .join("\n");

        const resp = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LYSTES_ENV.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            product: product ?? {},
            sourceUrl,
            messages: [{ role: "user", content: brief }],
          }),
        });
        if (!resp.ok || !resp.body) throw new Error("fit_unavailable");

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let acc = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6).trim();
            if (!payload || payload === "[DONE]") continue;
            try {
              const parsed = JSON.parse(payload);
              const delta =
                parsed?.choices?.[0]?.delta?.content ?? parsed?.delta ?? parsed?.content ?? "";
              if (delta) {
                acc += delta;
                setProductFit(acc);
              }
            } catch {
              /* ignore */
            }
          }
        }
      } catch (e) {
        console.error("[ShotExperience] product fit", e);
      } finally {
        setFitLoading(false);
      }
    },
    [experience, product, productName, sourceUrl],
  );

  /** Bascule sur le résultat quand l'analyse ET l'animation sont terminées. */
  useEffect(() => {
    if (step !== "running" || !pendingDiagnostic || !scanDone) return;
    setDiagnostic(pendingDiagnostic);
    setStep("result");
    void loadProductFit(pendingDiagnostic);
  }, [step, pendingDiagnostic, scanDone, loadProductFit]);

  const run = useCallback(
    async (photo: string) => {
      setPendingDiagnostic(null);
      setScanDone(false);
      setStep("running");
      try {
        if (experience.mode === "tryon") {
          const { data, error } = await supabase.functions.invoke("virtual-tryon", {
            body: {
              userPhoto: photo,
              productPhoto: productImageUrl,
              productType: experience.productType,
              productName,
              source: "demo",
            },
          });
          if (error) throw error;
          const img = data?.generatedImage || data?.result_photo_url;
          if (!img) throw new Error("Aucun rendu généré");
          setResultImage(img);
          if (data.persistError) {
            console.error("virtual-tryon persist error:", data.persistError);
            toast.warning("Votre essayage a bien été généré, mais n'a pas pu être enregistré dans votre historique.");
          }
          setStep("result");
        } else {
          /* La zone est affinee depuis la fiche produit : une creme pour le cou
             ne doit pas declencher un diagnostic du visage. Sans signal net, on
             garde le type detecte par shot-experience. */
          const zone = detectDiagnosticZone(
            [productName, typeof product?.description === "string" ? product.description : null]
              .filter(Boolean)
              .join(" "),
            experience.diagnosticType,
          );
          setAnalysedZone(zone);

          const { data, error } = await supabase.functions.invoke("customer-analyze-photo", {
            body: {
              imageBase64: photo.split(",")[1] ?? photo,
              mimeType: "image/jpeg",
              type: zone,
              language: "fr",
            },
          });
          if (error) throw error;
          if (!data?.analysis) throw new Error("Analyse indisponible");
          const analysis = data.analysis as DiagnosticResult;
          if (data.persistError) {
            console.error("customer-analyze-photo persist error:", data.persistError);
            toast.warning("Votre diagnostic a bien été généré, mais n'a pas pu être enregistré dans votre historique.");
          }
          // Mis en attente : c'est la fin du scan qui déclenchera l'affichage.
          setPendingDiagnostic(analysis);
        }
      } catch (e) {
        console.error("[ShotExperience]", e);
        // Jamais le message brut de supabase-js : « Failed to send a request to
        // the Edge Function » ne dit rien au visiteur et le fait partir.
        const lisible = await describeExperienceError(e);
        // 8 s au lieu des 3 s par défaut : le message tient sur deux lignes et
        // porte une marche à suivre, il faut le temps de le lire.
        toast.error(lisible.message, { description: lisible.nextAction, duration: 8000 });
        setStep("photo");
      }
    },
    [experience, productImageUrl, productName, product],
  );

  const onPick = async (file?: File | null) => {
    if (!file) return;
    const dataUrl = await readFile(file);
    setUserPhoto(dataUrl);
    run(dataUrl);
  };

  const isTryOn = experience.mode === "tryon";
  const bio = diagnostic?.biometrics;
  const metrics = Object.entries(bio?.specific_metrics ?? {});
  const isHairDiagnostic =
    experience.mode === "diagnostic" && experience.diagnosticType === "hair";
  /**
   * Mis en avant en tête de rapport, comme le « type détecté » du widget.
   * On affiche bien le type sous le libellé « Type de peau » : le phototype
   * Fitzpatrick répond à une autre question et passe en seconde ligne.
   */
  const detectedType = formatDetectedType(
    diagnostic?.detected_type ?? diagnostic?.characteristics?.[0],
    experience.mode === "diagnostic" ? experience.diagnosticType : undefined,
  );
  const phototypeLabel = bio?.fitzpatrick_phototype
    ? `Phototype Fitzpatrick ${bio.fitzpatrick_phototype}`
    : null;
  /** Le radar attend une interprétation pour chaque indicateur, l'analyse peut l'omettre. */
  const radarIndicators = (diagnostic?.indicators ?? []).map((i) => ({
    indicator: i.indicator,
    score: i.score,
    interpretation: i.interpretation ?? "",
  }));

  const reset = () => {
    setResultImage(null);
    setDiagnostic(null);
    setPendingDiagnostic(null);
    setScanDone(false);
    setProductFit("");
    setStep("photo");
  };

  /**
   * Rendu dans un portail sur le body : la carte produit et le widget de chat
   * créent des contextes d'empilement (isolation, sticky, filtres), qui piégeaient
   * la modale sous la grille de photos malgré son z-index. Un portail la sort de
   * tout ancêtre et garantit qu'elle passe au-dessus de la page.
   */
  const kindLabel = isTryOn ? "Essayage virtuel" : "Diagnostic biométrique IA";

  return createPortal(
    <div
      /* En plein écran, on passe au-dessus du bandeau promotionnel de la page
         d'accueil (un <header> en z-index 9999999) : sinon il recouvre le nom de
         l'agent et surtout la croix de fermeture, que le visiteur ne peut plus
         atteindre. Sur /shot la modale reste à z-100, rien ne change. */
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center p-0 sm:p-6 ${
        fullScreenOnMobile
          ? "z-[10000000] items-stretch sm:items-center"
          : "z-[100] items-end sm:items-center"
      }`}
    >
      <div
        className={`bg-white w-full sm:max-w-[420px] overflow-hidden flex flex-col ${
          fullScreenOnMobile
            ? "h-[100dvh] sm:h-auto rounded-none sm:rounded-[28px] max-h-none sm:max-h-[92vh]"
            : "rounded-t-[28px] sm:rounded-[28px] max-h-[92vh]"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
          {/* L'identité du conseiller reste affichée pendant toute l'expérience :
              le visiteur ne doit jamais avoir l'impression d'avoir quitté la
              conversation pour un outil posé à côté. */}
          {agent ? (
            <div className="min-w-0 flex items-center gap-2.5">
              {agent.avatarUrl && (
                <img
                  src={agent.avatarUrl}
                  alt=""
                  className="w-8 h-8 rounded-[10px] object-cover shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-neutral-900 leading-tight truncate">
                  {agent.name}
                </p>
                <p className="text-[9px] uppercase tracking-[0.16em] text-neutral-400 truncate">
                  {agent.teamLabel ?? kindLabel}
                </p>
              </div>
            </div>
          ) : (
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-[0.16em] text-neutral-400">{kindLabel}</p>
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0"
          >
            <X className="w-4 h-4 text-neutral-600" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto">
          {step === "photo" && (
            <div className="text-center">
              {productImageUrl && isTryOn && (
                <img
                  src={productImageUrl}
                  alt={productName}
                  className="w-24 h-24 object-cover rounded-2xl mx-auto mb-4 border border-neutral-200"
                />
              )}
              <p className="text-[13px] text-neutral-600 leading-snug mb-5">
                {isTryOn
                  ? "Ajoutez une photo de face, bien éclairée. L'IA place le produit sur vous en quelques secondes."
                  : "Ajoutez un selfie net et sans maquillage. L'IA réalise une analyse biométrique du visage, puis vous explique en quoi ce produit peut vous aider."}
              </p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={(e) => onPick(e.target.files?.[0])}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full h-12 rounded-full bg-neutral-900 text-white text-[13px] font-semibold inline-flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Ajouter ma photo
              </button>
              <p className="text-[10px] text-neutral-400 mt-3">
                Photo utilisée uniquement pour cette démonstration.
              </p>
            </div>
          )}

          {step === "running" && (
            <div className="py-2 flex flex-col items-center gap-4">
              {!isTryOn && userPhoto ? (
                <>
                  <FaceMeshScan photo={userPhoto} onCycleEnd={() => setScanDone(true)} />
                  <p className="text-[11px] text-neutral-500 tracking-wide">
                    Maillage biométrique du visage en cours…
                  </p>
                </>
              ) : (
                <div className="py-12 flex flex-col items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-neutral-900" />
                  <p className="text-[12px] text-neutral-500">Génération de votre essayage…</p>
                </div>
              )}
            </div>
          )}

          {step === "result" && isTryOn && resultImage && (
            <div>
              <img
                src={resultImage}
                alt="Rendu essayage"
                className="w-full rounded-2xl border border-neutral-200"
              />
              <button
                type="button"
                onClick={reset}
                className="mt-4 w-full h-11 rounded-full border border-neutral-200 text-[12px] font-medium inline-flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Refaire avec une autre photo
              </button>
            </div>
          )}

          {/* Rapport calqué sur celui des widgets Shopify/WooCommerce
              (`components/agent/AnalysisResults`) : sections en cartes grises,
              type détecté mis en avant, indicateurs commentés, radar du profil.
              Seule la routine est remplacée par la lecture du produit courant. */}
          {step === "result" && !isTryOn && diagnostic && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-apple-gray-light text-foreground rounded-tag text-xs font-medium">
                  ✓ Diagnostic terminé
                </div>
                <h2 className="font-semibold text-lg text-foreground">Votre diagnostic</h2>
              </div>

              {/* Ordre voulu : le profil pose qui est la personne, le constat en
                  découle, puis on l'emmène vers le produit. Le reste du détail
                  vient après, pour qui veut creuser. */}
              <div className="bg-apple-gray-light rounded-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground">
                    {analysedZone ? `Type — ${ZONE_LABEL[analysedZone]}` : isHairDiagnostic ? "Type de cheveux" : "Type de peau"}
                  </span>
                  {typeof diagnostic.confidence_score === "number" && (
                    <span className="text-[10px] bg-background text-foreground px-2 py-1 rounded-tag">
                      Fiabilité : {diagnostic.confidence_score}%
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {userPhoto && <FaceMeshScan photo={userPhoto} size={64} static />}
                  <div className="min-w-0 space-y-1.5">
                    <p className="font-semibold text-base text-foreground">{detectedType}</p>
                    {phototypeLabel && (
                      <p className="text-[11px] text-muted-foreground">{phototypeLabel}</p>
                    )}
                    {bio?.urgency_level && (
                      <span
                        className={`inline-block text-[9px] uppercase tracking-[0.14em] px-2 py-1 rounded-tag ${
                          bio.urgency_level === "red"
                            ? "bg-red-50 text-red-700"
                            : bio.urgency_level === "amber"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {URGENCY_LABEL[bio.urgency_level]}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Le constat, à même la page : c'est la lecture qu'on veut faire
                  lire, pas une section parmi d'autres. */}
              {diagnostic.summary && (
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap px-1">
                  {diagnostic.summary}
                </p>
              )}

              <button
                type="button"
                onClick={() =>
                  productFitRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                className="w-full rounded-btn bg-foreground text-background py-3.5 text-sm font-medium inline-flex items-center justify-center gap-2"
              >
                Ce que ce produit peut faire pour vous
                <ChevronDown className="w-4 h-4" />
              </button>

              {radarIndicators.length > 0 && (
                <IndicatorsRadarChart
                  indicators={radarIndicators}
                  diagnosticType={isHairDiagnostic ? "hair" : "skin"}
                  title={isHairDiagnostic ? "Profil capillaire" : "Profil cutané"}
                  badge="Analyse IA"
                />
              )}

              {diagnostic.indicators?.length ? (
                <div className="bg-apple-gray-light rounded-card p-5 space-y-4">
                  <h3 className="font-medium text-sm text-foreground">Indicateurs clés</h3>
                  {diagnostic.indicators.slice(0, 6).map((ind) => (
                    <div key={ind.indicator} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground">{ind.indicator}</span>
                        <span className="text-muted-foreground font-medium">{ind.score}%</span>
                      </div>
                      <div className="h-1 bg-apple-gray-medium rounded-full overflow-hidden">
                        <div
                          className="h-full bg-foreground rounded-full"
                          style={{ width: `${ind.score}%` }}
                        />
                      </div>
                      {ind.interpretation && (
                        <p className="text-xs text-muted-foreground">{ind.interpretation}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}

              {diagnostic.concerns?.length ? (
                <div className="bg-apple-gray-light rounded-card p-5">
                  <h3 className="font-medium text-sm text-foreground mb-3">
                    Problématiques détectées
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {diagnostic.concerns.map((c) => (
                      <span
                        key={c}
                        className="px-3 py-1 bg-background text-foreground rounded-tag text-[11px]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {metrics.length ? (
                <div className="bg-apple-gray-light rounded-card p-5">
                  <h3 className="font-medium text-sm text-foreground mb-3">
                    Mesures biométriques
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {metrics.slice(0, 8).map(([k, v]) => (
                      <div key={k} className="bg-background rounded-xl px-3 py-2">
                        <p className="text-[10px] text-muted-foreground leading-tight">
                          {prettyMetric(k)}
                        </p>
                        <p className="text-[13px] text-foreground font-medium">{String(v)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Remplace la routine du widget : une seule lecture, celle du produit courant.
                  Cible du bouton placé sous le graphe. */}
              <div
                ref={productFitRef}
                className="bg-apple-gray-light rounded-card p-5 space-y-4 scroll-mt-4"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                  <h3 className="font-medium text-sm text-foreground">
                    En quoi ce produit peut vous aider
                  </h3>
                </div>

                <div className="bg-background rounded-[16px] p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    {productImageUrl && (
                      <img
                        src={productImageUrl}
                        alt={productName}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                      />
                    )}
                    <div className="min-w-0 space-y-1">
                      {/* Sur deux lignes plutôt que tronqué : les noms de fiches
                          produit sont longs et la coupe perdait la référence. */}
                      <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">
                        {productName}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Lu au regard de votre diagnostic
                      </p>
                    </div>
                  </div>

                  {/* Filet pointillé : sépare sans poser de bordure. */}
                  <div className="border-t border-dashed border-neutral-200" />

                  {productFit ? (
                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {productFit}
                    </p>
                  ) : fitLoading ? (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Analyse du produit au regard de votre diagnostic…
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Analyse indisponible pour le moment.
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={reset}
                className="w-full rounded-btn bg-apple-gray-light py-3.5 text-sm font-medium text-foreground inline-flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Refaire l'analyse
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
