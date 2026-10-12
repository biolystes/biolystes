import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "@lystes/lib/lien-lystes";
import {
  ChevronDown,
  Bot,
  Palette,
  TrendingUp,
  Sparkles,
  MessageCircle,
  Shirt,
  ScanFace,
  Store,
  PartyPopper,
  Camera,
  Video,
  Search,
  UserRound,
  BarChart3,
  Star,
  Newspaper,
  Megaphone,
  PhoneCall,
  ClipboardList,
  Briefcase,
  Calculator,
  Scale,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { SOLUTIONS, type SolutionId } from "./solutions.config";
import { useTranslation } from "react-i18next";
import { getJsxT } from "@lystes/i18n/jsx-locale";


// Traductions du menu : dictionnaires src/i18n/locales/jsx/menu.<lang>.json
// (clé = chaîne française exacte ; repli = FR)
export const useMenuText = () => {
  const { i18n } = useTranslation();
  return getJsxT("menu", i18n.language || "fr");
};


interface SolutionsDropdownProps {
  size?: "sm" | "default";
  className?: string;
  /** Rendu clair sur fond sombre (hero vidéo) : déclencheur blanc + panneau verre foncé. */
  overlay?: boolean;
}

export type MenuEntry = {
  id: string;
  title: string;
  tagline: string;
  href: string;
  Icon: LucideIcon;
};

export type MenuGroup = {
  label: string;
  Icon: LucideIcon;
  entries: MenuEntry[];
};
type Group = MenuGroup;

const entryFromSolution = (id: SolutionId, Icon: LucideIcon, override?: Partial<MenuEntry>): MenuEntry => {
  const s = SOLUTIONS[id];
  return {
    id,
    title: override?.title ?? s.menu.title,
    tagline: override?.tagline ?? s.menu.tagline,
    href: override?.href ?? s.href,
    Icon,
  };
};

const FEATURED: MenuEntry = entryFromSolution("agents-autonomes", Sparkles, {
  tagline: "Une équipe d'agents IA qui pilote votre e-commerce 24/7.",
});

/**
 * LES ENTREES MASQUEES DU MENU, SANS SUPPRESSION.
 *
 * Demande de JP le 27/08/2026 : « cache ces pages », « sans les supprimer ».
 *
 * Masquer n'est pas supprimer, et la difference compte :
 * - `solutions.config.ts` garde les huit entrees et tout leur contenu ;
 * - les routes restent ouvertes, donc une adresse deja partagee continue de
 *   repondre et un lien dans un email ne casse pas ;
 * - rouvrir une entree, c'est retirer un nom de cette liste, rien d'autre.
 *
 * UNE SEULE LISTE DECIDE. La journee du 27/08 a coute une panne a cause de
 * deux listes qui devaient dire la meme chose et ne la disaient plus
 * (PACKS_OUVERTS face a PACKS_INCLUS_LANCEMENT). On n'en tient qu'une, et
 * elle est lue a un seul endroit, juste en dessous.
 */
const MASQUEES: readonly SolutionId[] = [
  /* JP, 10/09/2026 : les équipes coach, avis, SEO, marketing, analytics et
     journalistes ont désormais leur espace complet — elles reviennent dans le
     menu. Seuls le point de vente et l'événementiel restent masqués. */
  "point-de-vente",
  "evenementiel",
];


/** Le menu tel qu'il est ECRIT. Ce qui s'AFFICHE passe par `GROUPS`, plus bas. */
const GROUPES_ECRITS: Group[] = [
  {
    label: "Lystes Agents",
    Icon: Bot,
    entries: [
      entryFromSolution("expert-produit", MessageCircle, {
        tagline: "Un conseiller IA qui répond, qualifie et vend 24/7.",
      }),
      entryFromSolution("essayage", Shirt, {
        tagline: "Vos clients essaient vos produits avant d'acheter.",
      }),
      entryFromSolution("diagnostic", ScanFace, {
        tagline: "Analyse peau/cheveux et recommande les bons produits.",
      }),
      entryFromSolution("point-de-vente", Store, {
        tagline: "Un vendeur IA derrière chaque produit, en rayon.",
      }),
      entryFromSolution("evenementiel", PartyPopper, {
        tagline: "Activations live, stands connectés, leads qualifiés.",
      }),
      entryFromSolution("coach-domicile", UserRound, {
        tagline: "Accompagne le client après l'achat et fidélise.",
      }),
    ],
  },
  {
    label: "Lystes Créatives",
    Icon: Palette,
    entries: [
      entryFromSolution("creation", Camera, {
        tagline: "Photos, ads et mockups générés à la chaîne.",
      }),
      entryFromSolution("ugc", Video, {
        title: "Équipe IA UGC",
        tagline: "Créateurs virtuels et vidéos UGC à la chaîne.",
      }),
      entryFromSolution("journalistes", Newspaper, {
        tagline: "Articles sponsorisés publiés dans nos magazines, indexés sur Google.",
      }),
    ],
  },
  {
    label: "Lystes Marketing",
    Icon: TrendingUp,
    entries: [
      entryFromSolution("marketing", Megaphone, {
        tagline: "Campagnes, emails et pubs pilotés par la data.",
      }),
      entryFromSolution("seo", Search, {
        tagline: "Fiches, meta et mots-clés optimisés en continu.",
      }),
      entryFromSolution("analytics", BarChart3, {
        title: "Équipe IA de data analyste",
        tagline: "Frictions, objections et déclencheurs d'achat.",
      }),
      entryFromSolution("avis", Star, {
        tagline: "Collecte, répond et référence vos avis, produit par produit.",
      }),
    ],
  },
];

/**
 * Le menu tel qu'il s'AFFICHE : les entrees masquees en sont retirees, et un
 * groupe qui se retrouve vide disparait avec elles. Sans ce second filtre, le
 * titre d'un groupe resterait seul au-dessus du vide.
 */
/**
 * LE MENU DE `/business`.
 *
 * Une entreprise sans catalogue n'a que faire d'un essayage ou d'un diagnostic
 * de peau. Le menu change donc avec la cible : sur `/business` et sur les six
 * pages metier, « Equipes IA » montre les metiers d'entreprise. Partout
 * ailleurs, y compris sur l'accueil, il ne bouge pas d'un pixel.
 *
 * Les groupes Creatives et Marketing sont repris tels quels : photographes,
 * UGC, journalistes, marketing, SEO, analystes et avis valent aussi hors
 * ecommerce.
 */
const GROUPES_BUSINESS: Group[] = [
  {
    label: "Lystes Entreprise",
    Icon: Briefcase,
    entries: [
      entryFromSolution("standard", PhoneCall),
      entryFromSolution("assistant-direction", ClipboardList),
      entryFromSolution("commercial", TrendingUp),
      entryFromSolution("comptable", Calculator),
      entryFromSolution("juridique", Scale),
      entryFromSolution("recrutement", UsersRound),
    ],
  },
  ...GROUPES_ECRITS.filter((g) => g.label !== "Lystes Agents"),
];

/** Les adresses ou le menu bascule en entreprise. */
const CHEMINS_BUSINESS = [
  "/business",
  "/solutions/standard",
  "/solutions/assistant-direction",
  "/solutions/commercial",
  "/solutions/comptable",
  "/solutions/juridique",
  "/solutions/recrutement",
];

/**
 * Le menu a afficher pour l'adresse courante. UNE SEULE liste decide, comme
 * pour les entrees masquees : `CHEMINS_BUSINESS` juste au-dessus.
 */
export function useGroupesMenu(): Group[] {
  const { pathname } = useLocation();
  const business = CHEMINS_BUSINESS.some(
    (c) => pathname === c || pathname.startsWith(c + "/")
  );
  const source = business ? GROUPES_BUSINESS : GROUPES_ECRITS;
  return source
    .map((g) => ({
      ...g,
      entries: g.entries.filter(
        (e) => business || !MASQUEES.includes(e.id as SolutionId)
      ),
    }))
    .filter((g) => g.entries.length > 0);
}

export const GROUPS: Group[] = GROUPES_ECRITS.map((g) => ({
  ...g,
  entries: g.entries.filter((e) => !MASQUEES.includes(e.id as SolutionId)),
})).filter((g) => g.entries.length > 0);

function EntryRow({ entry, onClick, overlay }: { entry: MenuEntry; onClick: () => void; overlay?: boolean }) {
  const { Icon } = entry;
  const tr = useMenuText();
  return (
    <Link
      to={entry.href}
      onClick={onClick}
      className={`group/entry flex items-start gap-3 rounded-lg p-2.5 transition-colors ${
        overlay ? "hover:bg-white/[0.08]" : "hover:bg-[#f5f5f7]"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
          overlay ? "bg-white/[0.12] text-white" : "bg-[#f9f9f9] text-[#1d1d1f] group-hover/entry:bg-white"
        }`}
      >
        <Icon className="h-4 w-4" strokeWidth={1.5} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block text-[13px] font-medium leading-tight ${overlay ? "text-white" : "text-[#1d1d1f]"}`}>
          {tr(entry.title)}
        </span>
        <span
          className={`mt-0.5 block text-[11px] leading-snug line-clamp-2 ${
            overlay ? "text-white/70" : "text-[#86868b]"
          }`}
        >
          {tr(entry.tagline)}
        </span>
      </span>
    </Link>
  );
}

export function SolutionsDropdown({ size = "sm", className, overlay = false }: SolutionsDropdownProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const tr = useMenuText();
  /* Le menu suit l'adresse : entreprise sur /business, ecommerce ailleurs. */
  const groupes = useGroupesMenu();
  const FeaturedIcon = FEATURED.Icon;

  return (
    <div
      className="group relative z-[9999999]"
      style={{ fontFamily: "'Jost', sans-serif" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onFocus={() => setOpen(true)}
        className={`inline-flex items-center rounded-full px-4 ${size === "sm" ? "h-9 text-sm" : "h-10 text-sm"} font-medium transition-colors ${
          overlay
            ? "text-white/85 hover:bg-white/10 hover:text-white"
            : "text-foreground/70 hover:bg-[#f3f4f5] hover:text-foreground"
        } ${className ?? ""}`}
        style={{ fontFamily: "'Jost', sans-serif" }}
      >
        {tr("Équipes IA")}
        <ChevronDown className="ml-1 h-4 w-4 opacity-60" />
      </button>

      <div
        className={`absolute left-1/2 -translate-x-1/2 top-full z-[9999999] pt-2 ${open ? "block" : "hidden"} group-hover:block group-focus-within:block`}
      >
        <div
          role="menu"
          className={`w-[92vw] max-w-[880px] md:w-[880px] p-3 rounded-2xl ${
            overlay
              ? "border border-white/10 bg-[#1a1817]/95 backdrop-blur-xl shadow-none"
              : "border border-[#e5e5e7] bg-white shadow-lg"
          }`}
          style={{ fontFamily: "'Jost', sans-serif" }}
        >

          {/* Groups */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {groupes.map((g) => {
              return (
                <div key={g.label} className="min-w-0">
                  <div className="px-2.5 pt-6 pb-1 mb-1.5">
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${
                        overlay ? "text-white/72" : "text-[#1d1d1f]"
                      }`}
                    >
                      {tr(g.label)}
                    </span>
                  </div>
                  <ul className="flex flex-col">
                    {g.entries.map((e) => (
                      <li key={e.id}>
                        <EntryRow entry={e} onClick={close} overlay={overlay} />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
