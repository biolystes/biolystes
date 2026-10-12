/**
 * Le formulaire de contact d'une marque, sans cadre.
 *
 * Un seul formulaire pour les trois cadres voulus par JP le 01/10/2026 : la
 * page /<marque>/contact dans le cadre du multi-lien, la même page nue posée
 * chez la marchande (/embed/contact/<marque>), et le panneau « Nous
 * contacter » de la carte de discussion. Les champs, les libellés, les
 * erreurs et la mention sont ceux de la page du 30/09, mot pour mot : ils
 * ont seulement quitté `BrandContactPage.tsx` pour être partagés.
 *
 * L'envoi, lui, est `envoyerContact` : la même requête partout, avec les mêmes
 * erreurs lues de la même façon.
 */
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { supabase } from "@lystes/integrations/supabase/client";
import { deMarque } from "@lystes/lib/elision";
import {
  lireErreurContact,
  validerContact,
  type ChampContact,
  type FormulaireContact as Valeurs,
} from "@lystes/lib/contact-formulaire";

export const FORMULAIRE_VIDE: Valeurs = { nom: "", email: "", telephone: "", numero_commande: "", message: "" };

export type ResultatEnvoiContact =
  | { etat: "envoye"; contact: { id: string; jeton: string } | null; aUnConseiller: boolean }
  | { etat: "refuse"; champs: ChampContact[]; erreur: string };

/**
 * Valide puis envoie le message à `brand-contact-message`. Ne lève jamais :
 * une erreur revient avec la phrase à montrer et les champs à signaler.
 */
export async function envoyerContact(e: {
  slug: string;
  form: Valeurs;
  piege: string;
  origine: string | null;
  t: TFunction;
}): Promise<ResultatEnvoiContact> {
  const { slug, form, piege, origine, t } = e;
  const invalides = validerContact(form);
  if (invalides.length > 0) return { etat: "refuse", champs: invalides, erreur: "" };
  try {
    const { data, error } = await supabase.functions.invoke("brand-contact-message", {
      body: {
        slug,
        nom: form.nom.trim(),
        email: form.email.trim(),
        telephone: form.telephone.trim() || undefined,
        numero_commande: form.numero_commande.trim() || undefined,
        message: form.message.trim(),
        origine_url: origine ?? undefined,
        site_web: piege || undefined,
      },
    });
    if (error) throw error;
    const r = (data ?? {}) as { contact_id?: string | null; jeton?: string | null; agent?: unknown };
    return {
      etat: "envoye",
      contact: r.contact_id && r.jeton ? { id: r.contact_id, jeton: r.jeton } : null,
      aUnConseiller: Boolean(r.agent),
    };
  } catch (err) {
    const lue = await lireErreurContact(err);
    if (lue.code === "champs_invalides") {
      return {
        etat: "refuse",
        champs: lue.champs.length > 0 ? lue.champs : ["message"],
        erreur: t("contactPage.erreurChamps", "Vérifiez les champs signalés."),
      };
    }
    if (lue.code === "trop_de_messages") {
      const minutes = lue.retryAfter ? Math.max(1, Math.ceil(lue.retryAfter / 60)) : null;
      return {
        etat: "refuse",
        champs: [],
        erreur: minutes
          ? t("contactPage.erreurDebitMinutes", "Plusieurs messages viennent de partir d'ici. Réessayez dans {{minutes}} min.", { minutes })
          : t("contactPage.erreurDebit", "Plusieurs messages viennent de partir d'ici. Réessayez un peu plus tard."),
      };
    }
    if (lue.code === "marque_introuvable") {
      return { etat: "refuse", champs: [], erreur: t("contactPage.erreurMarque", "Cette page de contact n'est plus active.") };
    }
    return {
      etat: "refuse",
      champs: [],
      erreur: t("contactPage.erreurEnvoi", "Votre message n'a pas pu être envoyé. Réessayez dans un instant."),
    };
  }
}

export interface FormulaireContactProps {
  form: Valeurs;
  onForm: (f: Valeurs) => void;
  erreurs: ChampContact[];
  onErreurs: (e: ChampContact[]) => void;
  piege: string;
  onPiege: (v: string) => void;
  erreurEnvoi: string | null;
  onEnvoyer: (e: React.FormEvent) => void;
  /** Le nom de la marque, pour la mention sous le bouton. */
  marque: string;
  /** Une seule colonne : téléphone et numéro de commande l'un sous l'autre (cadre étroit). */
  uneColonne?: boolean;
  /** Préfixe des identifiants de champs, pour deux formulaires sur une même page. */
  prefixe?: string;
  /**
   * Posé chez la marchande : libellés et mention prennent la couleur de texte
   * de sa page (atténuée), au lieu du gris de lystes.ai. Les champs gardent
   * leur fond clair et leur encre sombre, lisibles sur tout site.
   */
  heriteCouleurs?: boolean;
}

export function FormulaireContact({
  form,
  onForm,
  erreurs,
  onErreurs,
  piege,
  onPiege,
  erreurEnvoi,
  onEnvoyer,
  marque,
  uneColonne = false,
  prefixe = "contact",
  heriteCouleurs = false,
}: FormulaireContactProps) {
  const { t } = useTranslation();
  const gris = heriteCouleurs ? "opacity-70" : "text-[#6b6b6b]";

  const champ = (id: ChampContact) => {
    const enErreur = erreurs.includes(id);
    return {
      id: `${prefixe}-${id}`,
      value: form[id],
      "aria-invalid": enErreur || undefined,
      "aria-describedby": enErreur ? `${prefixe}-${id}-erreur` : undefined,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onForm({ ...form, [id]: e.target.value });
        if (enErreur) onErreurs(erreurs.filter((x) => x !== id));
      },
      className: `w-full rounded-[6px] px-[14px] text-[16px] sm:text-[14px] text-[#111] outline-none focus-visible:ring-2 focus-visible:ring-[#111] ${
        enErreur ? "bg-[#fdecec]" : "bg-[#f4f4f4]"
      }`,
    };
  };

  const libelle = (id: ChampContact, texte: string, facultatif = false) => (
    <label htmlFor={`${prefixe}-${id}`} className={`flex items-baseline justify-between mb-1.5 text-[12px] ${gris}`}>
      <span className={erreurs.includes(id) ? "text-[#b42318]" : undefined}>{texte}</span>
      {facultatif && <span>{t("contactPage.facultatif", "facultatif")}</span>}
    </label>
  );

  const messageErreur = (id: ChampContact, texte: string) =>
    erreurs.includes(id) ? (
      <p id={`${prefixe}-${id}-erreur`} className="mt-1 text-[12px] text-[#b42318]">
        {texte}
      </p>
    ) : null;

  return (
    <form onSubmit={onEnvoyer} noValidate className="space-y-4" aria-label={t("contactPage.formulaire", "Formulaire de contact")}>
      <div>
        {libelle("nom", t("contactPage.nom", "Votre nom"))}
        <input {...champ("nom")} autoComplete="name" className={`${champ("nom").className} h-11`} />
        {messageErreur("nom", t("contactPage.nomManquant", "Indiquez votre nom."))}
      </div>
      <div>
        {libelle("email", t("contactPage.email", "E-mail"))}
        <input
          {...champ("email")}
          type="email"
          inputMode="email"
          autoComplete="email"
          className={`${champ("email").className} h-11`}
        />
        {messageErreur("email", t("contactPage.emailInvalide", "Indiquez un e-mail valide, pour recevoir la réponse."))}
      </div>
      {/* Deux colonnes dès 640 px sur une page large. Dans un cadre étroit
          (multi-lien : 285 px de contenu), « N° de commande » et « facultatif »
          ne tenaient pas dans 134 px : une colonne. */}
      <div className={uneColonne ? "grid grid-cols-1 gap-4" : "grid grid-cols-1 sm:grid-cols-2 gap-4"}>
        <div>
          {libelle("telephone", t("contactPage.telephone", "Téléphone"), true)}
          <input
            {...champ("telephone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className={`${champ("telephone").className} h-11`}
          />
          {messageErreur("telephone", t("contactPage.telephoneInvalide", "Chiffres, espaces, +, points et tirets seulement."))}
        </div>
        <div>
          {libelle("numero_commande", t("contactPage.numeroCommande", "N° de commande"), true)}
          <input
            {...champ("numero_commande")}
            autoComplete="off"
            className={`${champ("numero_commande").className} h-11`}
          />
          {messageErreur("numero_commande", t("contactPage.numeroInvalide", "Lettres, chiffres, / et - seulement."))}
        </div>
      </div>
      <div>
        {libelle("message", t("contactPage.message", "Votre message"))}
        <textarea
          {...champ("message")}
          rows={5}
          className={`${champ("message").className} py-3 resize-none leading-[1.5]`}
        />
        {messageErreur("message", t("contactPage.messageManquant", "Écrivez votre message."))}
      </div>

      {/* Piège à robots : invisible pour une personne, rempli par un robot. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden">
        <label htmlFor={`${prefixe}-site-web`}>Site web</label>
        <input
          id={`${prefixe}-site-web`}
          name="site_web"
          tabIndex={-1}
          autoComplete="off"
          value={piege}
          onChange={(e) => onPiege(e.target.value)}
        />
      </div>

      {erreurEnvoi && (
        <p role="alert" className="rounded-[6px] bg-[#fdecec] px-[14px] py-3 text-[14px] text-[#b42318]">
          {erreurEnvoi}
        </p>
      )}

      <button
        type="submit"
        className="w-full h-[52px] rounded-[6px] bg-[#111] text-white text-[14px] font-extrabold uppercase tracking-[.12em] hover:bg-[#333] transition-colors"
      >
        {t("contactPage.envoyer", "Envoyer")}
      </button>
      <p className={`text-[12px] leading-[1.5] ${gris}`}>
        {t(
          "contactPage.mentionEnvoi",
          "Le conseiller {{deMarque}} vous répond dès l'envoi. S'il lui manque une information, {{marque}} vous recontacte par e-mail ou par téléphone.",
          /* « d'Éclose Paris », jamais « de Éclose Paris » (JP, 30/09). */
          { marque, deMarque: deMarque(marque) },
        )}
      </p>
    </form>
  );
}
