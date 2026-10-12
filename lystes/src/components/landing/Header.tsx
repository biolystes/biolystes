import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "@lystes/lib/lien-lystes";
import { ArrowRight, ArrowUpRight, ChevronDown, X, Sparkles, FlaskConical } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@lystes/integrations/supabase/client";
import { HeaderLanguageSelector } from "@lystes/components/landing/HeaderLanguageSelector";
import { HeaderProfileMenu } from "@lystes/components/landing/HeaderProfileMenu";
import { SolutionsDropdown, useGroupesMenu, useMenuText } from "@lystes/features/solutions/SolutionsDropdown";
import { LabDropdown, LAB_ENTREES } from "@lystes/features/solutions/LabDropdown";

interface HeaderProps {
  minimal?: boolean;
  /** Header posé sur un fond sombre (hero vidéo) : texte + logo blancs tant qu'on n'a pas scrollé. */
  overlay?: boolean;
  /** Barre d'annonce optionnelle rendue au-dessus de la navigation. */
  topBar?: React.ReactNode;
}

/**
 * La bascule Ecommerce / Entreprises.
 *
 * Elle a d'abord vécu dans le hero, en position absolue. Deux corrections n'y
 * ont pas suffi, pour une raison de fond : le logo et le hero n'ont pas le
 * même conteneur. Mesuré en 1440, le logo va de 75 à 121 quand le contenu du
 * hero commence à 168. Aucun couple de nombres écrit dans le hero ne pouvait
 * la caler contre le logo à toutes les largeurs.
 *
 * Elle est donc ici, sur la même ligne de flex que le logo : elle le suit sans
 * un seul nombre en dur. Sur téléphone elle redescend dans le hero, faute de
 * place dans l'en-tête.
 *
 * Elle ne s'affiche que sur les deux pages qu'elle relie. Partout ailleurs,
 * l'en-tête est exactement celui d'avant.
 */
const PAGES_BASCULE = ["/", "/business"];

/**
 * Où elle s'affiche :
 *
 *   >= 640 px   dans l'en-tête, à droite du logo      dans="entete"
 *   <  640 px   dans le hero, au-dessus du sur-titre  dans="hero"
 *
 * Sur téléphone, l'en-tête n'a pas la place : logo, pastille, bouton et menu
 * ne tiennent pas sur une ligne, l'en-tête débordait de 62 px sur un écran de
 * 320, mesuré. JP l'a donc voulue dans le hero à cette taille. Les deux
 * emplacements sont exclusifs, chacun se cache où l'autre s'affiche : jamais
 * les deux à l'écran en même temps.
 */
export function BasculeCible({ light, dans = "entete" }: { light: boolean; dans?: "entete" | "hero" }) {
  const { pathname } = useLocation();
  if (!PAGES_BASCULE.includes(pathname)) return null;

  const surBusiness = pathname === "/business";
  const base =
    "inline-flex items-center h-[19px] px-[7px] text-[9.5px] sm:h-[23px] sm:px-[9px] sm:text-[11px] rounded-full font-semibold leading-none whitespace-nowrap no-underline transition-colors";
  const actif = "bg-white text-black";
  const repos = light ? "text-white/70 hover:text-white" : "text-black/55 hover:text-black";
  const emplacement =
    dans === "hero"
      ? "inline-flex sm:hidden mb-3 self-start"
      : "hidden sm:inline-flex";

  return (
    <nav
      className={`${emplacement} items-center gap-[2px] sm:gap-1 rounded-full p-[3px_4px] sm:p-[5px_6px] ${
        light ? "bg-white/[0.12]" : "bg-black/[0.06]"
      }`}
      aria-label="Ecommerce ou entreprises"
    >
      <Link to="/" className={`${base} ${surBusiness ? repos : actif}`} aria-current={surBusiness ? undefined : "page"}>
        Ecommerce
      </Link>
      <Link
        to="/business"
        className={`${base} ${surBusiness ? actif : repos}`}
        aria-current={surBusiness ? "page" : undefined}
      >
        Entreprises
      </Link>
    </nav>
  );
}

export function Header({ minimal = false, overlay = false, topBar }: HeaderProps) {

  const { pathname } = useLocation();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openAcc, setOpenAcc] = useState<string | null>(null);
  // Les entrées du menu déroulant « Équipes IA » ont leur propre traduction.
  const tr = useMenuText();
  /* Le menu suit l'adresse : les métiers d'entreprise sur /business et ses six
     pages, les équipes ecommerce partout ailleurs, accueil compris. */
  const groupesMenu = useGroupesMenu();

  // Le header défile avec la page : aucun état de scroll, aucun changement de couleur.
  // Texte clair uniquement quand il est posé sur un hero sombre.
  const light = overlay;

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  /* 02/09/2026 (JP) : une marchande connectée ne voit plus « Connexion » ni
     « S'inscrire » — elle voit un avatar qui ouvre ses espaces. */
  const [connecte, setConnecte] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setConnecte(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setConnecte(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const linkClass = (path: string) =>
    `text-sm font-medium whitespace-nowrap transition-colors px-3 xl:px-4 py-2 rounded-full ${
      light
        ? "text-white/85 hover:bg-white/10 hover:text-white"
        : pathname === path
          ? "bg-[#f3f4f5] text-foreground"
          : "text-foreground/70 hover:text-foreground hover:bg-[#f3f4f5]"
    }`;

  return (
    <header
      className="absolute top-0 left-0 right-0 z-[9999999] bg-transparent"
    >
      {topBar}
      <div
        className="container"
        style={pathname === "/"
          ? { height: "72px", width: "100%", maxWidth: "none", paddingInline: "clamp(28px, 6.15vw, 104px)" }
          : { height: "72px" }}
      >
        <div className="flex justify-between items-center h-full">

          {/* Logo, et la bascule Ecommerce / Entreprises juste à sa droite */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/" className="flex items-center gap-2.5 text-foreground no-underline shrink-0">
              <img
                src="https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/logo/lystes.PNG"
                alt="Lystes AI"
                className={`h-[46px] max-h-[54px] w-auto animate-spin-slow ${light ? "brightness-0 invert" : ""}`}
              />
            </Link>
            <BasculeCible light={light} />
          </div>

          {!minimal && (
            <div className="hidden lg:flex items-center gap-4">
              {/* Une entrée de plus avec « Lab » (12/10/2026) : sous 1280 px, les
                  pastilles se resserrent pour que l'en-tête tienne sur une
                  ligne à 1024, accueil compris (marges plus larges). */}
              <nav className="flex items-center gap-1 xl:gap-2" aria-label={t("header.mainNav", "Navigation principale")}>
                <Link to="/entreprise" className={linkClass("/entreprise")}>
                  {t("header.company", "Entreprise")}
                </Link>
                <SolutionsDropdown overlay={light} />
                {/* « Lab » (12/10/2026, JP) : /bio et /crea. Même liste
                    dans le menu du téléphone, plus bas. */}
                <LabDropdown overlay={light} />
                {/* « Intégrations » a quitté la barre le 27/08/2026, sur demande
                    de JP. La route /integrations reste OUVERTE : masquer n'est
                    pas supprimer, et une adresse déjà partagée doit continuer
                    de répondre. Pour la remettre, décommenter ici ET dans la
                    barre du téléphone, plus bas : elles sont écrites
                    séparément, et n'en remettre qu'une la ferait réapparaître
                    d'un seul côté. */}
                {/* « Sécurité » et « FAQ » ont quitté la barre le 11/10/2026,
                    sur demande de JP : elles restent accessibles en pied de
                    page. Les routes /securite et /faq restent OUVERTES :
                    masquer n'est pas supprimer. Pour les remettre, décommenter
                    ici ET dans la barre du téléphone, plus bas. */}
                <Link to="/tarifs" className={linkClass("/tarifs")}>
                  {t("header.pricing", "Tarifs")}
                </Link>
                <HeaderLanguageSelector overlay={light} />
              </nav>
              {connecte ? (
                <HeaderProfileMenu light={light} />
              ) : (
                <>
                  <Link
                    to="/auth"
                    className={`text-sm font-medium transition-colors ${
                      light ? "text-white/85 hover:text-white" : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {t("header.login", "Connexion")}
                  </Link>
                  <Link
                    to="/auth?mode=signup"
                    className={`group inline-flex items-center gap-2 pl-5 pr-1.5 py-1.5 rounded-full text-sm font-medium transition ${
                      light ? "bg-white/20 backdrop-blur-md text-white hover:bg-white/30" : "bg-black text-white hover:opacity-90"
                    }`}
                  >
                    <span className="whitespace-nowrap">{t("header.hire", "S'inscrire en 5 min")}</span>
                    <span
                      className={`flex items-center justify-center w-8 h-8 rounded-full transition-transform group-hover:rotate-45 ${
                        light ? "bg-white text-black" : "bg-white text-black"
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Mobile : bouton S'inscrire + burger. Connectée, la marchande voit
              son avatar, comme sur ordinateur : « S'inscrire » lui faisait
              croire qu'elle n'avait plus de compte. */}
          <div className="lg:hidden flex items-center gap-2">
            {connecte ? (
              <HeaderProfileMenu light={light} />
            ) : (
              <Link
                to="/auth?mode=signup"
                className={`inline-flex items-center rounded-full px-3.5 py-2 text-[12.5px] font-medium ${
                  light ? "bg-white text-black" : "bg-black text-white"
                }`}
              >
                {t("header.signup", "S'inscrire")}
              </Link>
            )}
            <button
              className={`w-10 h-10 flex items-center justify-center rounded-full ${
                light ? "bg-white/16 text-white" : "bg-black/5 text-foreground"
              }`}
              onClick={() => setMobileMenuOpen(true)}
              aria-label={t("header.menu", "Menu")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                className="w-[18px] h-[18px]"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ===== Panneau mobile ===== */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[99999999]">
          <div className="absolute inset-0 bg-[#0c0c0c]/60 backdrop-blur-2xl" />
          <button
            className="absolute top-[17px] right-4 z-10 w-[30px] h-[30px] flex items-center justify-center rounded-full bg-white/10 text-white/90 hover:bg-white/20 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
            aria-label={t("header.close", "Fermer")}
          >
            <X className="w-[15px] h-[15px]" strokeWidth={1.4} />
          </button>

          <div className="relative h-full overflow-y-auto px-4 pt-[76px] pb-8 text-white">
            <Link to="/entreprise" onClick={() => setMobileMenuOpen(false)} className="block border-b border-white/14 py-4 px-1.5 text-[16px] font-medium">
              {t("header.company", "Entreprise")}
            </Link>

            {/* Accordéon équipes IA */}
            <div className="border-b border-white/14">
              <button
                type="button"
                onClick={() => setOpenAcc((v) => (v === "teams" ? null : "teams"))}
                className="w-full flex items-center justify-between py-4 px-1.5 text-[16px] font-medium"
              >
                {tr("Équipes IA")}
                <ChevronDown className={`w-4 h-4 opacity-60 transition-transform ${openAcc === "teams" ? "rotate-180" : ""}`} />
              </button>
              {openAcc === "teams" && (
                <div className="px-1.5 pb-3">
                  {groupesMenu.map((g) => (
                    <div key={g.label}>
                      <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/50 pt-2.5 pb-1">
                        {tr(g.label)}
                      </div>
                      {g.entries.map((e) => {
                        const Icon = e.Icon;
                        return (
                          <Link
                            key={e.id}
                            to={e.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2.5 py-2.5 text-[14px]"
                          >
                            <span className="w-7 h-7 rounded-lg bg-white/12 flex items-center justify-center shrink-0">
                              <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                            </span>
                            {tr(e.title)}
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* « Lab » à plat, sans accordéon (12/10/2026, JP) : un titre,
                les deux liens et leur ligne de description. Même liste que
                le menu de l'ordinateur (LAB_ENTREES). */}
            <div className="border-b border-white/14 px-1.5 pt-4 pb-3">
              <div className="text-[16px] font-medium pb-1">{tr("Lab")}</div>
              {LAB_ENTREES.map((e) => {
                const Icon = e.Icon;
                return (
                  <Link
                    key={e.id}
                    to={e.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-start gap-2.5 py-2.5"
                  >
                    <span className="w-7 h-7 rounded-lg bg-white/12 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14px] leading-snug">{tr(e.title)}</span>
                      <span className="block text-[12px] leading-snug text-white/60 mt-0.5 text-pretty">{tr(e.tagline)}</span>
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* « Intégrations » masquée le 27/08/2026, comme dans la barre
                bureau plus haut. Les deux vont ensemble. */}
            {/* « Sécurité » et « FAQ » masquées le 11/10/2026, comme dans la
                barre bureau plus haut. Les deux vont ensemble. */}
            <Link to="/tarifs" onClick={() => setMobileMenuOpen(false)} className="block border-b border-white/14 py-4 px-1.5 text-[16px] font-medium">
              {t("header.pricing", "Tarifs")}
            </Link>

            <div className="flex flex-col gap-2.5 mt-6">
              {connecte ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 h-[46px] rounded-full bg-white text-black text-sm font-medium"
                >
                  {t("header.monEspace", "Mon espace")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth?mode=signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 h-[46px] rounded-full bg-white text-black text-sm font-medium"
                  >
                    {t("header.hire", "S'inscrire en 5 min")}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center h-[46px] rounded-full border border-white/45 text-white text-sm font-medium"
                  >
                    {t("header.login", "Connexion")}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
