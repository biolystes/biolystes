import { useEffect, useState } from "react";
import { Loader2, X, ImagePlus } from "lucide-react";
import { supabase } from "@lystes/integrations/supabase/client";
import { titreEnFrancais } from "@lystes/lib/titre-produit";
import { Input } from "@lystes/components/ui/input";
import { Textarea } from "@lystes/components/ui/textarea";
import { Label } from "@lystes/components/ui/label";
import { Button } from "@lystes/components/ui/button";
import { toast } from "sonner";
import { ReviewAuthDialog } from "./ReviewAuthDialog";

interface Props {
  accountId: string;
  productId?: string | null;
  productName?: string;
  onSubmitted?: () => void;
  /**
   * Le jeton du lien reçu par e-mail (demande d'avis après achat, ou testeuse),
   * lu dans « ?avis= » par la page produit (02/10/2026). Il tient lieu d'adresse
   * e-mail et rattache l'avis à la commande ou à la campagne, côté serveur.
   */
  jetonDemande?: string | null;
}

type LienDemande = { produit_offert: boolean; prenom: string | null };

export function ReviewSubmitForm({ accountId, productId, productName, onSubmitted, jetonDemande }: Props) {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittedOk, setSubmittedOk] = useState(false);
  const [publieDirect, setPublieDirect] = useState(false);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [firstName, setFirstName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [location, setLocation] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [lien, setLien] = useState<LienDemande | null>(null);

  /* Le lien de la demande : valable seulement s'il porte sur CE produit et
     qu'il est parti. Sinon le formulaire reste le formulaire ordinaire. */
  useEffect(() => {
    if (!jetonDemande || !productId) {
      setLien(null);
      return;
    }
    let annule = false;
    supabase.functions
      .invoke("avis-public?action=demande&j=" + encodeURIComponent(jetonDemande), { method: "GET" })
      .then(({ data }) => {
        if (annule) return;
        const d = data as { valide?: boolean; produit_offert?: boolean; prenom?: string | null; produits?: string[] } | null;
        if (d?.valide && (d.produits ?? []).includes(productId)) {
          setLien({ produit_offert: d.produit_offert === true, prenom: d.prenom ?? null });
          if (d.prenom) setFirstName((actuel) => actuel || String(d.prenom));
        } else setLien(null);
      })
      .catch(() => undefined);
    return () => {
      annule = true;
    };
  }, [jetonDemande, productId]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email });
        const meta: any = data.user.user_metadata ?? {};
        if (meta.name && !firstName) setFirstName(meta.name.split(" ")[0]);
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email });
      } else {
        setUser(null);
      }
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Photo trop lourde (max 2 Mo)");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const safe = `${Date.now()}.${ext}`;
      const path = `${user.id}/${safe}`;
      const { error } = await supabase.storage
        .from("review-photos")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("review-photos").getPublicUrl(path);
      setPhotos((p) => [...p, data.publicUrl]);
    } catch (err: any) {
      toast.error(err.message ?? "Erreur d'upload");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (content.trim().length < 20) {
      toast.error("Le contenu doit faire au moins 20 caractères.");
      return;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user && !lien && !emailRe.test(authorEmail.trim())) {
      toast.error("Email requis");
      return;
    }
    setLoading(true);
    try {
      // `submit-review` répond 404 en production alors que son code est au
      // dépôt et que ce formulaire est monté sur les deux pages de marque :
      // le visiteur remplissait, envoyait, et rien n'était enregistré. C'est
      // ce qui explique 13 avis authentiques pour 44 boutiques. La fonction
      // est republiée à l'identique sous un nouveau nom, sans être réécrite.
      const { data, error } = await supabase.functions.invoke("submit-review-v2", {
        body: {
          account_id: accountId,
          product_id: productId ?? null,
          rating,
          title: title.trim() || null,
          content: content.trim(),
          first_name: firstName.trim() || "Client",
          location: location.trim() || null,
          photos,
          ...(user || lien ? {} : { author_email: authorEmail.trim() }),
          ...(lien && jetonDemande ? { jeton_demande: jetonDemande } : {}),
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      /* 30/09/2026 : l'avis est publié tout de suite, seul un spam détecté
         reste à part. Le message suit le statut renvoyé par le serveur. */
      const publie = (data as any)?.moderation_status === "published";
      setPublieDirect(publie);
      toast.success(publie ? "Merci, votre avis est publié." : "Merci, votre avis sera publié après vérification.");
      setSubmittedOk(true);
      onSubmitted?.();
      // réinitialisation du formulaire
      setRating(5);
      setTitle("");
      setContent("");
      setLocation("");
      setAuthorEmail("");
      setPhotos([]);
    } catch (err: any) {
      toast.error(err.message ?? "Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  }

  if (submittedOk) {
    return (
      <div className="bg-neutral-50 p-8 text-center">
        <h3 className="font-editorial text-2xl font-normal">Merci pour votre avis</h3>
        {/* Le message dit ce qui se passe vraiment : l'avis part en file de
            modération, il n'est pas en ligne. Annoncer 72 heures plutôt que 24
            parce que c'est un délai tenable. */}
        <p className="mt-2 text-sm text-stone-600">
          {publieDirect
            ? "Il est en ligne sur la page du produit."
            : "Il sera vérifié puis publié sous 72 heures."}
        </p>

        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setSubmittedOk(false)}
        >
          Publier un autre avis
        </Button>
      </div>
    );
  }

  return (
    <>
      <form id="avis-formulaire" onSubmit={handleSubmit} className="scroll-mt-6 bg-neutral-50 p-6 sm:p-8 space-y-5">
        <div>
          <h3 className="font-editorial text-2xl font-normal">
            Laisser un avis{productName ? ` sur ${titreEnFrancais(productName)}` : ""}
          </h3>
          <p className="mt-1 text-sm text-stone-500">
            Votre retour aide d'autres clients à choisir en confiance.
          </p>
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wider text-stone-500">Votre note</Label>
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((n) => {
              const active = (hoverRating || rating) >= n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
                  className="transition-transform hover:scale-105"
                >
                  <svg viewBox="-2 -2 28 28" className="w-7 h-7" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M-2 -2 H26 V26 H-2 Z M12 4 L14.5 9.5 L20.5 10 L16 14 L17.5 20 L12 16.8 L6.5 20 L8 14 L3.5 10 L9.5 9.5 Z"
                      fill={active ? "#202329" : "#E8E8E9"}
                    />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              maxLength={60}
              placeholder="Camille"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="location">Ville (optionnel)</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={120}
              placeholder="Paris"
            />
          </div>
        </div>

        {lien && (
          <div className="space-y-1 text-[11px] text-stone-500">
            <p>Vous laissez votre avis depuis le lien reçu par e-mail : votre adresse n'est pas demandée.</p>
            {lien.produit_offert && <p className="font-medium text-stone-700">Votre avis sera publié avec la mention « Produit offert ».</p>}
          </div>
        )}

        {!user && !lien && (
          <div className="space-y-1.5">
            <Label htmlFor="authorEmail">Email</Label>
            <Input
              id="authorEmail"
              type="email"
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              required
              maxLength={255}
              placeholder="vous@exemple.com"
            />
            <p className="text-[11px] text-stone-500">
              Non affiché publiquement. Utilisé pour vérifier l'authenticité.
            </p>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="title">Titre (optionnel)</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            placeholder="En quelques mots, votre ressenti"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="content">Votre avis</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            minLength={20}
            maxLength={2000}
            rows={5}
            placeholder="Décrivez votre expérience, la texture, les résultats…"
          />
          <p className="text-[11px] text-stone-500">{content.length}/2000 — minimum 20 caractères</p>
        </div>

        {user && (
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-stone-500">Photos (optionnel, 3 max)</Label>
            <div className="flex flex-wrap gap-2">
              {photos.map((url, i) => (
                <div key={url} className="relative h-20 w-20 bg-white">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotos((p) => p.filter((_, idx) => idx !== i))}
                    className="absolute -top-1 -right-1 bg-black text-white w-5 h-5 flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {photos.length < 3 && (
                <label className="h-20 w-20 bg-white border border-dashed border-stone-300 flex items-center justify-center cursor-pointer hover:bg-[#f3f4f5]">
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-stone-500" />
                  ) : (
                    <ImagePlus className="w-5 h-5 text-stone-500" />
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={handlePhoto}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-black text-white hover:opacity-90"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publier mon avis"}
          </Button>
          {!user && (
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="text-xs text-stone-500 underline underline-offset-2 hover:text-stone-800"
            >
              Déjà client ? Se connecter
            </button>
          )}
        </div>

        <p className="text-[11px] text-stone-500">
          Publication immédiate. Pas de contenu publicitaire ni de données personnelles.
        </p>

      </form>

      <ReviewAuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        onAuthenticated={() => setAuthOpen(false)}
      />
    </>
  );
}
