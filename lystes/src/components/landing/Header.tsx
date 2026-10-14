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

/* biolystes.com (13/10/2026, JP) : le sélecteur de langue (drapeau et globe)
   est caché pour le moment, en ordinateur et dans le menu du téléphone.
   Le rallumer : passer cette constante à true. Voir lystes/ECARTS-VOULUS.md. */
const AFFICHER_LANGUE = false;

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
  /* biolystes.com : /agents-ia, lue sur la vraie adresse (voir plus bas). */
  const surAgents = typeof window !== "undefined" && window.location.pathname.startsWith("/agents-ia");
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
      aria-label="E-commerce ou agents IA"
    >
      {/* biolystes.com (13/10/2026, JP) : une vraie bascule dans le site,
          sans rechargement. « E-commerce » = /, « Agents IA » = /agents-ia
          (l'accueil de lystes.ai repris). La page présente « / » à l'en-tête
          (CommeSurAccueil) : la pastille active lit donc la vraie adresse. */}
      {/* replace={false} : la page présente « / » à l'en-tête, et un lien vers
          l'adresse « actuelle » remplacerait l'entrée d'historique au lieu
          d'en ajouter une (le bouton Précédent sauterait une page). */}
      <Link to="/" replace={false} className={`${base} ${surAgents ? repos : actif}`} aria-current={surAgents ? undefined : "page"}>
        E-commerce
      </Link>
      <Link to="/agents-ia" replace={false} className={`${base} ${surAgents ? actif : repos}`} aria-current={surAgents ? "page" : undefined}>
        Agents IA
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
                {/* biolystes.com (13/10/2026, JP) : ni « Entreprise », ni « Équipes
                    IA », ni « Lab », ni « Tarifs ». La langue reste, cachée par
                    AFFICHER_LANGUE. */}
                {AFFICHER_LANGUE && <HeaderLanguageSelector overlay={light} />}
              </nav>
              {connecte ? (
                <HeaderProfileMenu light={light} />
              ) : (
                <>
                  {/* biolystes.com (13/10/2026, JP) : « S'inscrire » vers l'espace
                      client, en second ; le rendez-vous reste le bouton principal. */}
                  <a
                    href="https://lystes.ai/biolystes/inscription"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center h-11 px-5 rounded-full border text-sm font-medium whitespace-nowrap transition ${
                      light ? "border-white/60 text-white hover:bg-white/10" : "border-black/15 text-foreground hover:bg-[#f3f4f5]"
                    }`}
                  >
                    S'inscrire
                  </a>
                  {/* biolystes.com : un seul appel à l'action, le rendez-vous. */}
                  <a
                    href="https://biolystes.pro/rdv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group inline-flex items-center gap-2 pl-5 pr-1.5 py-1.5 rounded-full text-sm font-medium transition ${
                      light ? "bg-white/20 backdrop-blur-md text-white hover:bg-white/30" : "bg-black text-white hover:opacity-90"
                    }`}
                  >
                    <span className="whitespace-nowrap">Prendre rendez-vous</span>
                    <span
                      className={`flex items-center justify-center w-8 h-8 rounded-full transition-transform group-hover:rotate-45 ${
                        light ? "bg-white text-black" : "bg-white text-black"
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </a>
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
              <>
              {/* biolystes.com (13/10/2026, JP) : « S'inscrire » en second, à
                  contour. Tient à 375 px ; sous 360 px il ne reste que dans le menu. */}
              <a
                href="https://lystes.ai/biolystes/inscription"
                target="_blank"
                rel="noopener noreferrer"
                className={`hidden min-[360px]:inline-flex items-center rounded-full border px-3.5 py-[7px] text-[12.5px] font-medium whitespace-nowrap ${
                  light ? "border-white/60 text-white" : "border-black/15 text-foreground"
                }`}
              >
                S'inscrire
              </a>
              <a
                href="https://biolystes.pro/rdv"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center rounded-full px-3.5 py-2 text-[12.5px] font-medium ${
                  light ? "bg-white text-black" : "bg-black text-white"
                }`}
              >
                Rendez-vous
              </a>
              </>
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
            {/* biolystes.com (13/10/2026, JP) : ni « Entreprise », ni « Équipes
                IA », ni « Lab », ni « Tarifs ». La bascule, cachée dans l’en-tête
                du téléphone, prend leur place ; la langue suit AFFICHER_LANGUE. */}
            <Link to="/" replace={false} onClick={() => setMobileMenuOpen(false)} className="block border-b border-white/14 py-4 px-1.5 text-[16px] font-medium">
              E-commerce
            </Link>
            <Link to="/agents-ia" replace={false} onClick={() => setMobileMenuOpen(false)} className="block border-b border-white/14 py-4 px-1.5 text-[16px] font-medium">
              Agents IA
            </Link>
            {AFFICHER_LANGUE && (
              <div className="border-b border-white/14 py-3 px-1.5">
                <HeaderLanguageSelector overlay />
              </div>
            )}

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
                <a
                  href="https://biolystes.pro/rdv"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 h-[46px] rounded-full bg-white text-black text-sm font-medium"
                >
                  Prendre rendez-vous
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}
              {/* biolystes.com (13/10/2026, JP) : « S'inscrire » sous le rendez-vous,
                  à contour (l'ancienne place de « Connexion »). */}
              {!connecte && (
                <a
                  href="https://lystes.ai/biolystes/inscription"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center h-[46px] rounded-full border border-white/45 text-white text-sm font-medium"
                >
                  S'inscrire
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
