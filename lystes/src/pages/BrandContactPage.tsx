/**
 * Page publique « Nous contacter » d'une marque : /:slug/contact
 * et sa version intégrable : /embed/contact/:slug (iframe, shortcode, script).
 *
 * Demande de JP du 30/09/2026 : le formulaire de contact qui répond.
 *
 * 1. La cliente remplit un formulaire classique : nom, e-mail, téléphone,
 *    numéro de commande facultatif, message.
 * 2. Dès l'envoi, pendant que `brand-contact-message` enregistre le message,
 *    la page bascule sur le chat : le MÊME que l'orbe des sites
 *    (`BrandAdvisorChatCard`), amorcé par le message du formulaire.
 * 3. Le conseiller répond avec les données réelles de la boutique, ou demande
 *    ce qui lui manque (numéro de commande, produit…). Ce qu'il demande est
 *    affiché sous la conversation, avec la raison : il n'accède aux données
 *    d'une commande qu'avec son numéro ET l'e-mail saisi.
 *
 * Le message est enregistré quoi qu'il arrive au chat : une réponse manquée
 * n'est jamais un message perdu, il passe « À recontacter » côté serveur.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2, Check } from "lucide-react";
import { deMarque } from "@lystes/lib/elision";
import { BrandAdvisorChatCard } from "@lystes/components/brand/BrandAdvisorChatCard";
import { CadreMultiLien } from "@lystes/components/brand/CadreMultiLien";
import { envoyerContact, FormulaireContact, FORMULAIRE_VIDE } from "@lystes/components/brand/FormulaireContact";
import { useApparenceMultiLien } from "@lystes/hooks/useApparenceMultiLien";
import { lireStyleHote } from "@lystes/lib/style-hote";
import {
  normaliserOrigine,
  validerContact,
  type ChampContact,
  type FormulaireContact as Valeurs,
} from "@lystes/lib/contact-formulaire";

type Phase = "formulaire" | "conversation" | "transmis";
type Statut = { statut: "repondu" | "a_recontacter"; manque: string[] } | null;

/* Les valeurs de la maquette validée par JP (maquette-bouton, Main.dc.html) :
   gris #f4f4f4 pour les champs et les encadrés, noir #111 pour l'action,
   rayons de 6 et 12, Bricolage Grotesque pour les titres. Aucune ombre, aucune
   bordure : le fond de couleur sépare déjà. */
const GRIS = "#f4f4f4";

export default function BrandContactPage({ integre = false }: { integre?: boolean }) {
  const { t } = useTranslation();
  const params = useParams<{ slug?: string; brandSlug?: string }>();
  /* `/:brandSlug/forms` montait déjà cette page : sans ce repli, le slug y
     valait undefined et la page tournait sans fin. */
  const slug = params.slug ?? params.brandSlug ?? "";
  const [recherche] = useSearchParams();
  const origine = integre ? normaliserOrigine(recherche.get("origine")) : null;
  /* Posée chez la marchande, la page prend la police et la couleur de texte
     de l'endroit où le script l'a posée (public/lystes-contact.js). */
  const hote = integre ? lireStyleHote(recherche) : { police: null, encre: null };

  /* La marque, lue comme le multi-lien la lit : son logo et son nom habillent
     le cadre, son compte sert au conseiller. */
  const { apparence, chargement } = useApparenceMultiLien(slug);
  const [phase, setPhase] = useState<Phase>("formulaire");
  const [form, setForm] = useState<Valeurs>(FORMULAIRE_VIDE);
  const [piege, setPiege] = useState("");
  const [erreurs, setErreurs] = useState<ChampContact[]>([]);
  const [erreurEnvoi, setErreurEnvoi] = useState<string | null>(null);
  const [contact, setContact] = useState<{ id: string; jeton: string } | null>(null);
  const [statut, setStatut] = useState<Statut>(null);
  const racineRef = useRef<HTMLDivElement>(null);

  /* Intégrée dans un iframe, la page annonce sa hauteur à la page hôte, qui
     n'applique la valeur que si elle vient de lystes.ai (public/lystes-contact.js). */
  useEffect(() => {
    if (!integre || typeof window === "undefined" || window.parent === window) return;
    const noeud = racineRef.current;
    if (!noeud || typeof ResizeObserver === "undefined") return;
    const annoncer = () => {
      window.parent.postMessage(
        { type: "lystes-contact:hauteur", slug, hauteur: Math.ceil(noeud.scrollHeight) },
        "*",
      );
    };
    const obs = new ResizeObserver(annoncer);
    obs.observe(noeud);
    annoncer();
    return () => obs.disconnect();
  }, [integre, slug, chargement]);

  /* Intégrée : le fond de lystes.ai ne doit pas peindre un rectangle blanc
     sur la page de la marchande. */
  useEffect(() => {
    if (!integre || typeof document === "undefined") return;
    const avant = [document.documentElement.style.background, document.body.style.background];
    document.documentElement.style.background = "transparent";
    document.body.style.background = "transparent";
    return () => {
      document.documentElement.style.background = avant[0];
      document.body.style.background = avant[1];
    };
  }, [integre]);

  const marque = apparence ? { account_id: apparence.accountId, logo: apparence.logoUrl } : null;
  const nom = apparence?.nom ?? slug;

  const envoyer = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreurEnvoi(null);
    const invalides = validerContact(form);
    setErreurs(invalides);
    if (invalides.length > 0) return;

    /* La bascule est immédiate : la cliente voit son message partir dans le
       chat pendant que le serveur l'enregistre. */
    setContact(null);
    setStatut(null);
    setPhase("conversation");
    const r = await envoyerContact({ slug, form, piege, origine, t });
    if (r.etat === "envoye") {
      if (r.contact && r.aUnConseiller && marque?.account_id) {
        setContact(r.contact);
      } else {
        /* Pas de conseiller actif (ou piège à robots) : le message est
           enregistré, la page le confirme sans simuler de conversation. */
        setPhase("transmis");
      }
      return;
    }
    setPhase("formulaire");
    if (r.champs.length > 0) setErreurs(r.champs);
    setErreurEnvoi(r.erreur || null);
  };

  if (chargement) {
    return (
      <div className={`${integre ? "" : "min-h-screen "}flex items-center justify-center py-16`}>
        <Loader2 className="w-5 h-5 animate-spin text-stone-400" aria-label={t("contactPage.chargement", "Chargement")} />
      </div>
    );
  }

  if (!marque) {
    return (
      <div ref={racineRef} className={integre ? "p-4" : "min-h-screen bg-white"}>
        <div className="mx-auto max-w-xl px-4 py-16 text-center text-sm text-[#444]">
          {t("contactPage.introuvable", "Cette page de contact n'existe pas ou n'est plus active.")}
        </div>
      </div>
    );
  }

  const proprietes: ProprietesContact = {
    integre,
    nom,
    phase,
    form,
    onForm: setForm,
    erreurs,
    onErreurs: setErreurs,
    piege,
    onPiege: setPiege,
    erreurEnvoi,
    onEnvoyer: envoyer,
    hote,
    statut,
    enregistre: Boolean(contact),
    conseiller: marque && (
        <BrandAdvisorChatCard
          accountId={marque.account_id}
          brandName={nom}
          logoUrl={marque.logo}
          premierMessage={form.message.trim()}
          contact={contact}
          contactEnAttente={!contact}
          integre={integre}
          onStatut={setStatut}
        />
    ),
  };
  const contenu = <ContenuContact {...proprietes} />;

  /* Cadre nu : juste le formulaire, chez la marchande. Ni en-tête ni retour,
     la police et la couleur de texte de sa page. */
  if (integre) {
    return (
      <div
        ref={racineRef}
        className="bg-transparent"
        style={{ color: hote.encre ?? "#111", fontFamily: hote.police ?? undefined }}
      >
        {/* Toute la largeur de l'emplacement, sans centrer : centré dans 576 px,
            le formulaire décrochait du titre de la page hôte (32 px dans une
            colonne de 640, mesuré le 01/10). La marque règle la largeur par
            l'endroit où elle le pose. */}
        <div className="w-full py-2">
          {contenu}
          <p className={`mt-5 text-[11px] ${hote.encre ? "opacity-70" : "text-[#6b6b6b]"}`}>
            {t("contactPage.propulse", "propulsé par")}{" "}
            <span className={hote.encre ? "font-semibold" : "font-semibold text-[#111]"}>lystes.ai</span>
          </p>
        </div>
      </div>
    );
  }

  /* Cadre du multi-lien : le logo, le nom, la carte et le pied de
     lystes.ai/<marque>. Le cadre porte le retour et « Propulsé par ». */
  /* L'encre #111 de la maquette vaut pour le contenu seulement : posée sur
     tout le cadre, elle noircissait le nom de la marque, que le multi-lien
     écrit dans la couleur du texte de la page (mesuré le 01/10). */
  return (
    <VueContact
      racineRef={racineRef}
      cadre={{
        nom,
        logoUrl: apparence?.logoUrl,
        verifie: apparence?.verifie,
        retour: { chemin: `/${apparence?.slug ?? slug}`, multiLien: Boolean(apparence?.slugMultiLien) },
      }}
      {...proprietes}
    />
  );
}

/** Ce que le contenu de la page reçoit : la page le tient de son état, la
 *  visite « Vos outils » de l'accueil (12/10/2026) de sa démonstration. */
export interface ProprietesContact {
  integre: boolean;
  nom: string;
  phase: Phase;
  form: Valeurs;
  onForm: (v: Valeurs) => void;
  erreurs: ChampContact[];
  onErreurs: (e: ChampContact[]) => void;
  piege: string;
  onPiege: (v: string) => void;
  erreurEnvoi: string | null;
  onEnvoyer: (e: React.FormEvent) => void;
  hote: { police: string | null; encre: string | null };
  statut: Statut;
  enregistre: boolean;
  /** La carte du conseiller, posée pendant la conversation. */
  conseiller: ReactNode;
  /** Préfixe des identifiants des champs. */
  prefixe?: string;
}

/** Le contenu de la page : titre, formulaire, conversation ou confirmation. */
export function ContenuContact({
  integre,
  nom,
  phase,
  form,
  onForm,
  erreurs,
  onErreurs,
  piege,
  onPiege,
  erreurEnvoi,
  onEnvoyer,
  hote,
  statut,
  enregistre,
  conseiller,
  prefixe,
}: ProprietesContact) {
  const { t } = useTranslation();
  return (
    <>
      {!integre && (
        <header className="mb-6">
          {/* 24 px et non 28/32 : la carte du multi-lien laisse 285 px de
              contenu, et le titre doit y tenir sur une ligne dans les sept
              langues (« Neem contact met ons » est le plus long). */}
          <h1 className="m-0 font-['Bricolage_Grotesque',Georgia,serif] font-medium text-[24px] leading-[1.15] tracking-[-0.01em]">
            {t("contactPage.titre", "Nous contacter")}
          </h1>
          <p className="mt-1 text-[14px] leading-[1.55] text-[#444]">
            {t(
              "contactPage.accroche",
              "Écrivez à {{marque}} : son conseiller vous répond aussitôt, et votre message reste transmis.",
              { marque: nom },
            )}
          </p>
        </header>
      )}

      {phase === "formulaire" && (
        <FormulaireContact
          form={form}
          onForm={onForm}
          erreurs={erreurs}
          onErreurs={onErreurs}
          piege={piege}
          onPiege={onPiege}
          erreurEnvoi={erreurEnvoi}
          onEnvoyer={onEnvoyer}
          marque={nom}
          uneColonne={!integre}
          heriteCouleurs={integre && Boolean(hote.encre)}
          prefixe={prefixe}
        />
      )}

      {phase === "conversation" && (
        <div>
          {conseiller}
          <EtatDemande statut={statut} marque={nom} email={form.email.trim()} enregistre={enregistre} />
        </div>
      )}

      {phase === "transmis" && (
        <div className="rounded-[12px] p-6 text-center" style={{ background: GRIS }}>
          <Check className="mx-auto mb-3 w-5 h-5 text-[#111]" aria-hidden="true" />
          <h2 className="text-[18px] font-semibold mb-1">{t("contactPage.transmisTitre", "Message envoyé")}</h2>
          <p className="text-[14px] leading-[1.55] text-[#444]">
            {t("contactPage.transmisTexte", "{{marque}} a bien reçu votre demande et vous répondra à l'adresse {{email}}.", {
              marque: nom,
              email: form.email.trim(),
            })}
          </p>
        </div>
      )}
    </>
  
  );
}

/**
 * La page de contact dans le cadre du multi-lien : le logo, le nom, la carte et
 * le pied de lystes.ai/<marque>. Le cadre porte le retour et « Propulsé par ».
 * L'encre #111 de la maquette vaut pour le contenu seulement : posée sur tout
 * le cadre, elle noircissait le nom de la marque, que le multi-lien écrit dans
 * la couleur du texte de la page (mesuré le 01/10).
 */
export function VueContact({
  racineRef,
  cadre,
  ...proprietes
}: ProprietesContact & {
  racineRef?: React.Ref<HTMLDivElement>;
  cadre: { nom: string; logoUrl?: string | null; verifie?: boolean; retour: { chemin: string; multiLien: boolean } | null };
}) {
  return (
    <div ref={racineRef}>
      <CadreMultiLien nom={cadre.nom} logoUrl={cadre.logoUrl} verifie={cadre.verifie} retour={cadre.retour}>
        <main style={{ color: "#111" }}>
          <ContenuContact {...proprietes} />
        </main>
      </CadreMultiLien>
    </div>
  );
}

/**
 * Sous la conversation : ce que la cliente doit savoir de sa demande.
 * Rien n'est affirmé que le serveur n'a pas conclu.
 * Exporté pour la visite « Vos outils » de /accueil-v2.
 */
export function EtatDemande({
  statut,
  marque,
  email,
  enregistre,
}: {
  statut: Statut;
  marque: string;
  email: string;
  enregistre: boolean;
}) {
  const { t } = useTranslation();

  if (!statut) {
    return (
      <p className="mt-1 text-[13px] leading-[1.5] text-[#6b6b6b]" role="status">
        {enregistre
          ? t("contactPage.etatEnregistre", "Votre message est enregistré. Le conseiller {{deMarque}} vous répond ici.", { marque, deMarque: deMarque(marque) })
          : t("contactPage.etatEnvoi", "Envoi de votre message…")}
      </p>
    );
  }

  if (statut.manque.length > 0) {
    return (
      <div className="rounded-[12px] p-4" style={{ background: GRIS }} role="status" data-etat="manque">
        <p className="text-[14px] font-semibold">
          {t("contactPage.manqueTitre", "Pour vous répondre tout de suite, le conseiller a besoin de :")}
        </p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {statut.manque.map((m) => (
            /* Rayon 6, celui des champs de la maquette : pas de gélule. */
            <li key={m} className="rounded-[6px] bg-white px-3 py-1 text-[13px] text-[#111]">
              {m}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[13px] leading-[1.5] text-[#444]">
          {t(
            "contactPage.manqueRaison",
            "Il n'accède aux données d'une commande qu'avec son numéro et l'e-mail saisi. Répondez-lui ci-dessus. Sinon, {{marque}} vous recontactera.",
            { marque },
          )}
        </p>
      </div>
    );
  }

  if (statut.statut === "repondu") {
    return (
      <div className="rounded-[12px] p-4" style={{ background: GRIS }} role="status" data-etat="repondu">
        <p className="text-[14px] font-semibold">{t("contactPage.reponduTitre", "Réponse donnée")}</p>
        <p className="mt-1 text-[13px] leading-[1.5] text-[#444]">
          {t(
            "contactPage.reponduTexte",
            "Si elle ne vous suffit pas, dites-le au conseiller ci-dessus : {{marque}} a votre message et vous recontactera.",
            { marque },
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[12px] p-4" style={{ background: GRIS }} role="status" data-etat="a_recontacter">
      <p className="text-[14px] font-semibold">
        {t("contactPage.recontactTitre", "{{marque}} vous recontacte", { marque })}
      </p>
      <p className="mt-1 text-[13px] leading-[1.5] text-[#444]">
        {t(
          "contactPage.recontactTexte",
          "Votre message est transmis. La réponse arrivera à l'adresse {{email}}, ou par téléphone si vous l'avez indiqué.",
          { email },
        )}
      </p>
    </div>
  );
}
