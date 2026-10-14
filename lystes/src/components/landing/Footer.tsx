import { useState, type FormEvent } from "react";
import { Link } from "@lystes/lib/lien-lystes";
import { useTranslation } from "react-i18next";
import { ArrowRight, Instagram, Youtube } from "lucide-react";

/**
 * Le français reste écrit ici, en `fr`, et part en valeur par défaut de `t()`.
 * Deux conséquences voulues : le rendu français ne peut pas bouger d'un
 * caractère, et une clé sans traduction affiche la phrase française au lieu
 * de « Footer Help Center ». Voir parseMissingKeyHandler dans i18n/config.ts.
 *
 * Un lien sans `key` est un libellé qui ne se traduit dans aucune langue :
 * nom propre ou sigle international.
 */
/* `to` absent : simple texte (une adresse). Une ancre (#…), un mailto: ou un
   lien externe partent en <a> ; le reste en <Link>. */
type FooterLink = { key?: string; fr: string; to?: string; external?: boolean };
type FooterColumn = { key: string; fr: string; links: FooterLink[] };

const columns: FooterColumn[] = [
  {
    key: "footer.product",
    fr: "Produit",
    links: [
      { fr: "Lystes MCP", to: "/mcp" }, // nom propre
      { key: "footer.integrations", fr: "Intégrations", to: "/integrations" },
      { key: "footer.pricing", fr: "Tarifs", to: "/tarifs" },
      { key: "footer.customers", fr: "Nos clients", to: "/clients" },
      { key: "footer.shops", fr: "Les boutiques", to: "/boutiques" },
      { key: "footer.whatsNew", fr: "Nouveautés", to: "/nouveautes" },
      { key: "footer.affiliate", fr: "Affiliation", to: "/affiliate" },
    ],
  },
  {
    key: "footer.company",
    fr: "Entreprise",
    links: [
      { key: "footer.about", fr: "À propos", to: "/entreprise" },
      { key: "footer.careers", fr: "Carrières", to: "/carrieres" },
      { key: "footer.press", fr: "Presse", to: "/presse" },
      { key: "footer.partners", fr: "Partenaires", to: "/partenaires" },
      /* « Affiliation » vivait ici ET dans « Produit » : une même destination
         listée deux fois dans le même pied de page. Elle reste dans Produit. */
      /* Retiré puis RÉTABLI le 02/08/2026. Le retrait reposait sur un rapport
         de « galerie vide, 0 / 0 » qui était faux : `studio_models` contient
         140 lignes, toutes avec une image, compté en `count=exact` et non par
         échantillon. Le « 0 / 0 » était l'état de chargement mesuré deux
         secondes après l'ouverture, avant la réponse de la requête.
         La leçon vaut plus que la ligne : un compteur à zéro pendant le
         chargement se lit comme un compteur à zéro tout court. */
      { key: "footer.creatorProgram", fr: "Programme créateurs", to: "/creator" },
      { key: "footer.community", fr: "Communauté", to: "https://instagram.com/biolystes", external: true },
      { key: "footer.contact", fr: "Contact", to: "/contact" },
    ],
  },


  {
    key: "footer.resources",
    fr: "Ressources",
    links: [
      /* « Blog » retiré le 02/08/2026 : /blog sert trois faux articles datés de
         décembre 2024 et le sous-titre « News, guides, and trends in AI
         beauty », c'est-à-dire le discours d'avant le pivot, en anglais, et qui
         borne Lystes à la beauté. Une page qu'on n'atteint plus ne dit plus
         rien de faux. L'entrée revient le jour où il y a des articles. */
      { key: "footer.macApp", fr: "Application Mac", to: "/application" },
      { key: "footer.faq", fr: "FAQ", to: "/faq" },
      { key: "footer.helpCenter", fr: "Centre d'aide", to: "/aide" },
      { key: "footer.documentation", fr: "Documentation", to: "/docs" },
      /* Les pages de doc dont le parcours est vérifié en production. Les
         tutoriels d'installation restent hors du pied de page tant que les
         fonctions d'onboarding répondent 404 : y envoyer un marchand, c'est
         lui faire suivre des étapes qui échouent. */
      { key: "footer.productAdvisor", fr: "Le conseiller produit", to: "/docs/equipes/conseiller-produit" },
      /* Claude et ChatGPT sont des noms propres : ils restent écrits dans la
         valeur traduite, seul « Connecteur » bouge d'une langue à l'autre. */
      { key: "footer.connectorClaudeChatgpt", fr: "Connecteur Claude et ChatGPT", to: "/docs/mcp" },
    ],
  },
  {
    key: "footer.trustLegal",
    fr: "Confiance & légal",
    links: [
      { key: "footer.security", fr: "Sécurité", to: "/securite" },
      /* Sigles légaux : ils se traduisent par le sigle officiel du pays et
         non mot à mot. RGPD devient DSGVO en allemand, CGV devient AGB,
         Mentions légales devient Impressum. Un Allemand qui lit « RGPD »
         ne sait pas de quoi on parle. */
      { key: "footer.gdpr", fr: "RGPD", to: "/rgpd" },
      { key: "footer.dpa", fr: "Traitement des données", to: "/dpa" },
      { key: "footer.privacy", fr: "Confidentialité", to: "/privacy" },
      { key: "footer.terms", fr: "CGV", to: "/terms" },
      { key: "footer.legalNotice", fr: "Mentions légales", to: "/legal" },
    ],
  },
];

/* Le pied de page de Biolystes (JP, 14/10/2026 : « on n'a plus accès aux
   pages, conditions générales ») : même gabarit, mais les liens de Biolystes
   au lieu de ceux de Lystes. Les pages propres à biolystes.com y sont en
   adresse entière, la page /bio étant aussi servie par lystes.ai ; les liens
   légaux restent /legal, /privacy, /terms, que biolystes.com traduit vers ses
   propres pages (lib/lien-lystes.tsx). */
const BIOLYSTES = "https://www.biolystes.com";
const colonnesBiolystes: FooterColumn[] = [
  {
    key: "footer.bio.marque", fr: "Biolystes",
    links: [
      /* Comme « À propos » en tête de la colonne Entreprise de lystes.ai. */
      { fr: "À propos", to: BIOLYSTES + "/a-propos", external: false },
      { fr: "Comment ça marche", to: BIOLYSTES + "/#section-comprend", external: false },
      { fr: "Nos engagements", to: BIOLYSTES + "/#section-qualite", external: false },
      { fr: "La livraison", to: BIOLYSTES + "/#section-livraison", external: false },
      { fr: "Le catalogue", to: BIOLYSTES + "/#section-catalogue", external: false },
      { fr: "Questions fréquentes", to: BIOLYSTES + "/faq", external: false },
    ],
  },
  {
    key: "footer.bio.lancer", fr: "Se lancer",
    links: [
      { fr: "S’inscrire", to: "https://lystes.ai/biolystes/inscription", external: true },
      { fr: "Prendre rendez-vous", to: "https://biolystes.pro/rdv", external: true },
      { fr: "Pourquoi cette offre", to: BIOLYSTES + "/pourquoi-cette-offre", external: true },
      { fr: "Notre étude", to: BIOLYSTES + "/etudes", external: true },
      { fr: "Actus", to: BIOLYSTES + "/blog", external: true },
    ],
  },
  {
    key: "footer.bio.contact", fr: "Contact",
    links: [
      { fr: "hello@biolystes.com", to: "mailto:hello@biolystes.com" },
      { fr: "6 avenue Émile Deschanel, 75007 Paris" },
      { fr: "Instagram", to: "https://instagram.com/biolystes", external: true },
    ],
  },
  {
    key: "footer.bio.legal", fr: "Légal",
    links: [
      { fr: "Mentions légales", to: "/legal" },
      { fr: "Politique de confidentialité", to: "/privacy" },
      { fr: "CGV", to: "/terms" },
    ],
  },
];

// Réseaux sociaux réels. Ajoute LinkedIn / X ici quand tu as les URLs.
const socials = [
  { label: "Instagram", href: "https://instagram.com/biolystes", Icon: Instagram },
  { label: "YouTube", href: "https://youtube.com/@lystesai", Icon: Youtube },
];

const LOGO_URL =
  "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/logo/lystes.PNG";

export function Footer({ marque = "lystes" }: { marque?: "lystes" | "biolystes" } = {}) {
  const { t } = useTranslation();
  const bio = marque === "biolystes";
  const colonnes = bio ? colonnesBiolystes : columns;
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Sans backend newsletter pour l'instant : on ouvre un email pré-rempli.
    // À rebrancher sur Brevo plus tard.
    window.location.href = `mailto:${bio ? "hello@biolystes.com" : "contact@lystes.ai"}?subject=${encodeURIComponent(
      "Inscription newsletter"
    )}&body=${encodeURIComponent(`Merci de m'inscrire à la newsletter : ${email}`)}`;
  };

  return (
    <footer className="lystes-footer" style={{ background: "rgb(225, 243, 197)" }}>
      <div className="container py-16 overflow-hidden">
        {/* Colonne des liens élargie (12/10/2026) : « Programme créateurs » et
            « Traitement des données » tiennent sur une ligne, sans mot seul. */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-16">

          {/* Bloc marque + newsletter + réseaux (50%) */}
          <div className="max-w-sm">

            <Link to="/" className="inline-flex items-center gap-2.5">
              <img src={LOGO_URL} alt="Lystes AI" className="h-[46px] max-h-[54px] w-auto animate-spin-slow lystes-footer-logo" />
              
            </Link>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
              {bio
                ? "Votre marque de cosmétiques bio et véganes, sans stock, en ligne en 10 jours."
                : t(
                  "footer.baseline",
                  "Une équipe d’agents IA pour chaque produit. Conseil, création, marketing et data, à chaque point de contact.",
                )}
            </p>

            <form onSubmit={handleSubscribe} className="mt-7">
              <label htmlFor="footer-newsletter" className="block text-sm font-medium mb-2">
                {bio ? "Recevez nos nouveautés" : t("footer.newsletterLabel", "Recevez nos nouveautés")}
              </label>
              <div className="flex items-center gap-2 border-b border-border focus-within:border-foreground transition-colors py-1">
                <input
                  id="footer-newsletter"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={bio ? "Votre e-mail" : t("footer.newsletterPlaceholder", "Votre email")}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  aria-label={t("footer.newsletterSubmit", "S'inscrire à la newsletter")}
                  className="grid place-items-center h-8 w-8 rounded-full bg-foreground text-background hover:opacity-90 transition"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="flex items-center gap-4 mt-7">
              {/* Biolystes : Instagram seulement (la chaîne YouTube est celle de Lystes). */}
              {socials.filter((r) => !bio || r.label === "Instagram").map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Colonnes de liens (50%) — Confiance plus large pour "Traitement des données" */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-10 lg:gap-x-4 xl:gap-x-5 min-w-0">
            {colonnes.map((col) => {
              const titre = bio ? col.fr : t(col.key, col.fr);
              return (
                <nav key={col.key} aria-label={titre} className="min-w-0">
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-4 leading-snug">
                    {titre}
                  </h3>
                  <ul className="space-y-2.5">
                    {col.links.map((link) => {
                      /* Biolystes : pas de coupure de mot (« Descha-nel »), JP 14/10/2026. */
                      const cl = "block text-sm leading-snug text-muted-foreground hover:text-foreground transition-colors " + (bio ? "" : "break-words hyphens-auto");
                      const libelle = link.key ? t(link.key, link.fr) : link.fr;
                      return (
                        <li key={(link.to ?? "") + link.fr}>
                          {!link.to ? <span className={cl}>{libelle}</span>
                            : bio && (link.external || link.to.startsWith("#") || link.to.startsWith("http") || link.to.startsWith("mailto:"))
                            ? <a href={link.to} className={cl} {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{libelle}</a>
                            : <Link to={link.to} className={cl}>{libelle}</Link>}
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              );
            })}
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          {/* L'année est calculée au rendu : elle sera juste en 2027 sans
              que personne ait à y penser. Elle disait 2024 dans les 14
              fichiers de langue, c'est exactement ce qu'on évite. */}
          <p>
            {bio
              ? `© ${new Date().getFullYear()} Biolystes. Tous droits réservés.`
              : t("footer.copyright", {
                year: new Date().getFullYear(),
                defaultValue: "© {{year}} Lystes AI. Tous droits réservés.",
              })}
          </p>
          {/* Cette ligne pointait aussi vers /security, qui est déjà dans la
              colonne « Confiance & légal » : deux entrées pour une destination.
              C'est un énoncé de confiance, pas un élément de navigation, il
              reste donc en texte. La navigation vers la page sécurité passe par
              la colonne. */}
          <p>
            {bio
              ? "Certifié COSMOS et ECOCERT · Conforme au règlement CE 1223/2009"
              : t(
                "footer.certifications",
                "Infrastructure certifiée SOC 2 Type 2 et ISO 27001 · Conforme RGPD",
              )}
          </p>
        </div>
      </div>
    </footer>
  );
}
