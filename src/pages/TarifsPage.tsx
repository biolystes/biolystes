/* /tarifs : la page des prix de Biolystes (JP, 14/10/2026 : « crée une page
   de prix, que tu ne mettras pas dans le menu »). Exception voulue à la règle
   « aucun prix en ligne » : la page n’est liée nulle part (ni menu, ni pied de
   page, ni plan du site) et porte <meta name="robots" content="noindex">.

   Ce que la page doit faire comprendre en dix secondes (JP) : vous ne payez
   le reste que si nos produits vous plaisent. L’acompte lance le projet ; la
   cliente reçoit ses produits ; s’ils ne lui plaisent pas, elle s’arrête, n’a
   payé que l’acompte et garde logo et branding ; s’ils lui plaisent, elle
   paie la tranche suivante, puis le solde à la livraison du site.

   Peu de chiffres à l’écran (JP) : d’abord la famille (« Avec boutique en
   ligne », puis « Acheter » : Solo, Duo, Standard, IA, ou « Louer » :
   Standard, IA ; « Sans boutique en ligne » : Design seul, aucune location),
   puis le pack en pastilles ; seuls les
   montants du pack choisi s’affichent (Standard par défaut). C’est un choix par onglets voulu par JP, pas un
   repliable : le contenu du pack choisi est à plat. Puis la réassurance de
   la page de rendez-vous de biolystes.pro (carrousels repris tels quels),
   ce que coûte chaque vente, le rendez-vous. Aucun calcul de revenu de la
   cliente (JP : « décourageant »).

   Sources :
   - packs, tranches, abonnements et location : src/data/packs.ts de
     biolystes.pro (dépôt commandcenterbiolystes), source unique, TTC ;
   - location IA à 199 € par mois (JP, 14/10/2026, au lieu de 299) ;
   - « à partir de » 199 € par mois, abonnement « ce que ça vous donne »
     (packs.ts, abo.desc ; « sans minimum de commande » : CGV de
     biolystes.pro, art. 8 bis.4, et packs.ts pour Solo et Duo ; texte du
     Pack Design : JP, 14/10/2026) ;
   - texte du paiement sur plusieurs mois : JP, mot pour mot (jamais « le site reste à
     Biolystes ») ;
   - abonnement à partir de la mise en ligne du site (contrat, art. 8) ;
   - produit en plus : 39 € TTC, une fois (contrat, annexe A.1) ;
   - préparation comprise, port au tarif du transporteur (contrat, art. 8.3) ;
   - frais Stripe 1,5 % + 0,25 € (barème public de Stripe, cartes standard
     de l’Espace économique européen, lu le 14/10/2026) ;
   - carrousels : src/pages/RdvPage.tsx (« Ils ont lancé leur marque avec
     nous ») et src/components/tarifs/DiscoverLinks.tsx (« Dans les
     coulisses », « Qui sommes-nous ») de biolystes.pro. Une vidéo des
     coulisses (exp-52, identique à exp-43) est retirée : aucune image deux
     fois sur la page.
   HT = TTC ÷ 1,2.

   Montants : src/data/offres.ts, vérifiés par
   src/test/garde-alignement-offres.test.ts. « Payer sur plusieurs mois »
   (JP, 14/10/2026 soir) : sélection offerte, acompte à la validation de la
   sélection, reste de la mise en place (acompte déduit) à la livraison du
   site, puis la mensualité, abonnement compris. À l’achat, l’abonnement est
   payant et démarre une fois le solde réglé, site livré.

   Laissés de côté tant que JP n’a pas tranché (audit du 14/10/2026) : les
   pourcentages de remise, « le premier mois
   offert », le tarif horaire hors forfait, la durée d’engagement de
   l’abonnement, le prix exact de chaque référence. */
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import {
  ArrowUpRight, BadgePercent, Camera, Check, ChevronLeft, ChevronRight, ClipboardCheck, CreditCard, FlaskConical, HandCoins, Heart, Instagram, KeyRound, PackageCheck,
  Palette, PenTool, Receipt, ShieldCheck, Store, Tag, Truck, Wallet, type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import VisionEtagesBloc from "@lystes/features/solutions/VisionEtagesBloc";
import { Bande, BoutonRdv, Entete, RondIcone } from "./pied/elements";
import { ABONNEMENT_DEMARRE_SITE, PRODUIT_EN_PLUS, peutAjouterProduit, packAchat, packPlusieursMois, type PackAchat, type PackPlusieursMois } from "@/data/offres";
import showcaseAmarsi from "@/assets/showcase-amarsi.jpg";
import showcasePeau from "@/assets/showcase-peau.jpg";
import showcase235 from "@/assets/showcase-235.jpg";
import feedInstagramEclose from "@/assets/feed-instagram-eclose.jpg";

const BRICOLAGE = "'Bricolage Grotesque', 'Inter', sans-serif";
const INSECABLE = "\u00a0";

/* 1 249,17 € ; les montants ronds sans centimes. Espace des milliers
   insécable ordinaire : l’espace fine de fr-FR disparaît presque en Bricolage. */
function euros(n: number, centimes?: boolean) {
  const avec = centimes ?? !Number.isInteger(n);
  return n.toLocaleString("fr-FR", { minimumFractionDigits: avec ? 2 : 0, maximumFractionDigits: avec ? 2 : 0 }).replace(/\u202f/g, INSECABLE) + INSECABLE + "€";
}
/* Les deux derniers mots restent ensemble : jamais un mot seul en fin de ligne. */
const colle = (t: string) => t.replace(/ (\S+)$/, "\u00a0$1");
const ht = (ttc: number) => Math.round((ttc / 1.2) * 100) / 100;

type Etape = { icone: LucideIcon; quand: string; montant: number | null; ligne: string; protege?: boolean; minimum?: boolean; offert?: boolean };
type Offre = {
  slug: string; comprend: string[];
  cle: string; nom: string; contenu: string; total: number; totalTitre: string;
  mensuel: number; mensuelTitre: string; mensuelTexte: string; etapes: Etape[];
};

/* Les étapes de paiement d’un pack acheté. */
const ACOMPTE = (montant: number): Etape => ({ icone: Wallet, quand: "Payé à la validation", montant, ligne: "Une fois votre sélection validée, l’acompte lance votre projet." });
/* Étape 0 (JP, 14/10/2026, compétence tarifs-biolystes, « Le parcours
   complet ») : la sélection et les fiches INCI sont offertes ; rien à payer
   avant d'avoir validé ses produits. */
const SELECTION: Etape = { icone: ClipboardCheck, quand: "Avant tout paiement", montant: null, offert: true, ligne: "Votre sélection et vos fiches INCI, offertes : avec notre IA ou nos experts produits." };
const RECUS: Etape = { icone: PackageCheck, quand: "Vos produits arrivent", montant: null, ligne: "En une dizaine de jours, chez vous : vous les testez." };
const PLAISENT = (montant: number, solde = false): Etape => ({
  icone: Heart, quand: "Payé s’ils vous plaisent", montant, protege: true,
  ligne: solde ? "Le solde, seulement si vous continuez." : "2e tranche, seulement si vous continuez.",
});
const SOLDE = (montant: number): Etape => ({ icone: Store, quand: "Payé à la livraison", montant, ligne: "Le solde, à la livraison de votre boutique." });

/* Ce que comprend chaque pack : copie mot pour mot du champ `features` de
   src/data/packs.ts de biolystes.pro (main du 14/10/2026, commit 1328d01),
   sans les lignes chiffrées, comme sur biolystes.pro/offre/<slug>
   (OffrePage.tsx). À resynchroniser si packs.ts change. */
const COMPREND: Record<string, string[]> = {
  design: ["4 produits personnalisés", "Création de logo", "Charte graphique", "Design de produit et packaging", "Photos IA hyperréalistes", "Envoi de vos produits finis sous 10 jours ouvrés", "Sans site e-commerce", "Rupture possible à réception (vous gardez logo, charte, packaging)"],
  solo: ["1 design de produit personnalisé", "Logo + charte + packaging", "Photos IA + contenu textuel", "Site e-commerce", "Automatisation livraison", "Zéro stock minimum"],
  duo: ["2 designs de produits personnalisés", "Logo + charte + packaging", "Photos IA + contenu textuel", "Site e-commerce", "Support prioritaire", "Zéro stock minimum"],
  standard: ["4 designs de produits personnalisés", "Logo + charte + packaging", "Site e-commerce complet + SEO", "Automatisation livraison", "Contenu textuel + Photographie IA", "Expert produit dédié", "CRO standard"],
  ia: ["8 designs de produits personnalisés", "Tout le Pack Standard", "Feed Instagram", "Notre suite de solutions IA"],
  "standard-location": ["Tout le Pack Standard (site + 4 designs de produits)", "Abonnement inclus dans la mensualité", "Sans engagement, arrêt à tout moment sans frais", "Site à vous dès que le total est atteint (1 499 € au total)", "Arrêt avant : site désactivé, vous gardez logo, charte et packaging", "Mensualité minimum : versez plus ou soldez quand vous voulez", "Klarna possible sur la mise en place"],
  "ia-location": ["Tout le Pack IA (8 designs de produits + feed Instagram + notre suite de solutions IA)", "Abonnement inclus dans la mensualité", "Sans engagement, arrêt à tout moment sans frais", "Site à vous dès que le total est atteint (2 999 € au total)", "Arrêt avant : site désactivé, vous gardez logo, charte et packaging", "Mensualité minimum : versez plus ou soldez quand vous voulez", "Klarna possible sur la mise en place"],
};
const OFFRE_URL = "https://biolystes.pro/offre/";

/* Ce que comprend l'acompte (JP, 14/10/2026, mot pour mot ; « (offert) » : le
   logo n'est facturé ni dans l'acompte ni dans les packs). */
const ACOMPTE_COMPREND: { icone: LucideIcon; texte: string }[] = [
  { icone: Palette, texte: "Votre logo (offert) et votre branding" },
  { icone: PenTool, texte: "Le design de vos produits" },
  { icone: FlaskConical, texte: "La fabrication de vos produits" },
  { icone: Truck, texte: "L’envoi chez vous" },
  { icone: Camera, texte: "Les photos de vos designs de produits" },
];

/* Les étapes d'un pack acheté : sélection offerte, acompte, réception,
   puis la tranche (ou le reste) s'ils plaisent, et le solde à la livraison
   du site s'il y en a un. */
const etapesAchat = (p: PackAchat): Etape[] => [
  SELECTION, ACOMPTE(p.acompte), RECUS,
  ...(p.aLivraisonSite === null ? [PLAISENT(p.aReception, true)] : [PLAISENT(p.aReception), SOLDE(p.aLivraisonSite)]),
];
const achat = (cle: PackAchat["cle"], nom: string, contenu: string, abonnementTexte: string): Offre => {
  const p = packAchat(cle);
  return {
    slug: cle, comprend: COMPREND[cle], cle, nom, contenu, total: p.prix, totalTitre: "Total du " + nom, etapes: etapesAchat(p),
    mensuel: p.abonnement, mensuelTitre: "Puis l’abonnement, par mois", mensuelTexte: abonnementTexte,
  };
};

/* Packs achetés, dans l’ordre de JP. Source : packs.ts (PACKS_AVEC_SITE),
   montants dans src/data/offres.ts. L'abonnement est payant en plus, y
   compris pour le Standard (JP, 14/10/2026 soir : jamais « inclus » à
   l'achat). */
const ACHATS: Offre[] = [
  achat("design", "Pack Design produit", "4 designs de produits, sans site", "Accès à tout notre catalogue, sans minimum de commande : vous commandez le produit que vous voulez, quand vous voulez. Un produit pas encore designé : 39 € une fois."),
  achat("solo", "Pack Solo", "1 design de produit + site e-commerce", "Dès la mise en ligne. Ce que ça vous donne : hébergement, support, logistique et sécurité de votre boutique, sans minimum de commande."),
  achat("duo", "Pack Duo", "2 designs de produits + site e-commerce", ABONNEMENT_DEMARRE_SITE + " Ce que ça vous donne : hébergement, support prioritaire et logistique, sans minimum de commande."),
  achat("standard", "Pack Standard", "4 designs de produits + site complet + expert dédié", ABONNEMENT_DEMARRE_SITE + " Ce que ça vous donne : hébergement, livraisons, référencement, support et sécurité, sans minimum de commande."),
  achat("ia", "Pack IA", "8 designs de produits, feed Instagram et notre suite de solutions IA", ABONNEMENT_DEMARRE_SITE + " Ce que ça vous donne : tout le Standard, le feed Instagram et notre suite de solutions IA, sans minimum de commande."),
];

/* Payer sur plusieurs mois (location avec option d'achat au contrat ; le mot
   ne s'affiche pas). Décision de JP du 14/10/2026 (soir) : même début que
   l'achat, puis le reste de la mise en place à la livraison du site, puis
   la mensualité, abonnement compris. Le site est à la cliente une fois le
   total réglé. */
const plusieursMois = (cle: PackPlusieursMois["cle"], nom: string, contenu: string): Offre => {
  const p = packPlusieursMois(cle);
  return {
    slug: cle + "-location", comprend: COMPREND[cle + "-location"], cle, nom, contenu,
    total: p.total, totalTitre: "Total pour que le site soit à vous",
    etapes: [
      SELECTION, ACOMPTE(p.acompte), RECUS,
      { icone: KeyRound, quand: "Payé à la livraison du site", montant: p.resteMiseEnPlace,
        ligne: "Le reste de la mise en place (" + euros(p.miseEnPlace) + " moins l’acompte), si vous continuez." },
      { icone: Receipt, quand: "Puis chaque mois, au minimum", montant: p.mensualiteMin, minimum: true, ligne: "Abonnement inclus. Versez plus, ou soldez quand vous voulez." },
    ],
    mensuel: p.mensualiteMin, mensuelTitre: "La mensualité, abonnement inclus",
    mensuelTexte: "Vous pouvez verser plus chaque mois, ou solder quand vous voulez, pour que le site soit à vous plus vite.",
  };
};
const LOCATIONS: Offre[] = [
  plusieursMois("standard", "Pack Standard", "4 designs de produits + site complet + expert dédié"),
  plusieursMois("ia", "Pack IA", "8 designs de produits, feed Instagram et notre suite de solutions IA"),
];

/* Une valeur courte par carte, une phrase dessous. */
const FRAIS: { icone: LucideIcon; titre: string; valeur: string; ligne: string }[] = [
  { icone: HandCoins, titre: "Commission sur vos ventes", valeur: "0" + INSECABLE + "€", ligne: "Vos ventes sont à vous, vous fixez vos prix." },
  { icone: Tag, titre: "Prix d’achat d’un produit", valeur: "Selon le produit", ligne: "Formule, flacon et impression à votre marque compris." },
  { icone: PackageCheck, titre: "Préparation des commandes", valeur: "0" + INSECABLE + "€", ligne: "Comprise dans le prix d’achat du produit." },
  { icone: Truck, titre: "Livraison", valeur: "Tarif transporteur", ligne: "Payée par votre cliente, ou offerte par vous." },
  { icone: CreditCard, titre: "Paiement par carte (Stripe)", valeur: "1,5" + INSECABLE + "% + 0,25" + INSECABLE + "€", ligne: "Prélevés par Stripe à chaque" + INSECABLE + "paiement." },
  { icone: BadgePercent, titre: "Grandes quantités", valeur: "Dès 100 unités", ligne: "Des remises s’appliquent, détaillées au" + INSECABLE + "rendez-vous." },
];

/* Les carrousels de la page de rendez-vous de biolystes.pro, repris tels quels. */
const SHOWCASE_ITEMS = [
  { type: "video" as const, src: "/videos/showcase-1.mp4" },
  { type: "image" as const, src: showcaseAmarsi, alt: "Amarsi : Cosmétiques capillaires" },
  { type: "video" as const, src: "/videos/showcase-2.mp4" },
  { type: "image" as const, src: showcasePeau, alt: "Jolie Peau : Soins visage" },
  { type: "video" as const, src: "/videos/showcase-3.mp4" },
  { type: "image" as const, src: showcase235, alt: "235 : Soins homme" },
];
const COULISSES = [
  "/videos/exp-3.mov", "/videos/exp-5.mov", "/videos/exp-11.mp4", "/videos/exp-12.mp4", "/videos/exp-42.mov",
  "/videos/exp-43.mov", "/videos/exp-46.mov", "/videos/exp-50.mov", "/videos/exp-51.mov",
];

function Montant({ ttc, petit = false, minimum = false }: { ttc: number; petit?: boolean; minimum?: boolean }) {
  return (
    <div>
      {minimum && <p className="mb-1.5 text-[0.8125rem] text-muted-foreground">À partir de</p>}
      <p className={(petit ? "text-[1.75rem] md:text-[2rem]" : "text-[2.25rem] md:text-[2.5rem]") + " leading-none tracking-tight text-foreground tabular-nums whitespace-nowrap"}
        style={{ fontFamily: BRICOLAGE, fontWeight: 400 }}>
        {euros(ttc)} <span className="text-[0.875rem] tracking-normal text-muted-foreground">TTC</span>
      </p>
      <p className="mt-1.5 text-[0.8125rem] text-muted-foreground tabular-nums">{euros(ht(ttc), true)} HT</p>
    </div>
  );
}

/* Petit rond noir d'icône, 36 px partout : sous 850 px, lystes/src/index.css
   ramène de force .w-8.h-8 à 17 px (celui de RondIcone petit). */
function PetitRond({ icone: Icone }: { icone: LucideIcon }) {
  return (
    <span className="w-[2.25rem] h-[2.25rem] shrink-0 rounded-full bg-foreground text-background flex items-center justify-center">
      <Icone className="w-[1.125rem] h-[1.125rem]" strokeWidth={1.5} />
    </span>
  );
}

/* « Au minimum » est dans l’étiquette de l’étape, pas au-dessus du montant :
   les montants de la frise restent alignés. */
/* La frise : horizontale dès 1024 px, verticale et centrée en dessous (une
   seule présentation par largeur, jamais d’entre-deux). */
function Frise({ etapes }: { etapes: Etape[] }) {
  const n = etapes.length;
  return (
    <ol className={"grid gap-0 lg:gap-6 max-w-[420px] lg:max-w-none mx-auto " + (n === 5 ? "lg:grid-cols-5" : n === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
      {etapes.map((e, i) => (
        <li key={e.quand} className="relative flex lg:flex-col lg:items-center lg:text-center gap-4 pb-8 lg:pb-0 last:pb-0">
          {i < n - 1 && <span aria-hidden="true" className="lg:hidden absolute left-[19px] top-12 bottom-2 w-px bg-border" />}
          {i < n - 1 && <span aria-hidden="true" className="hidden lg:block absolute top-5 left-[calc(50%_+_36px)] right-[calc(12px_-_50%)] h-px bg-border" />}
          <div className="relative shrink-0">
            <RondIcone icone={e.icone} />
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-background border border-border text-[0.6875rem] font-semibold text-foreground flex items-center justify-center tabular-nums">{i}</span>
          </div>
          <div className="min-w-0 lg:mt-1">
            {/* Ordinateur : deux lignes réservées, étiquette posée en bas, pour que
                les montants restent alignés d'une étape à l'autre. */}
            <p className="text-[0.75rem] tracking-[0.14em] uppercase text-foreground lg:min-h-[3.2em] lg:flex lg:items-end lg:justify-center">
              <span><span className={e.protege ? "rounded bg-[#e1f3c5] px-1.5 py-0.5 [box-decoration-break:clone]" : undefined}>{colle(e.quand)}</span></span>
            </p>
            <div className="mt-3">
              {e.offert
                ? <p className="text-[2.25rem] md:text-[2.5rem] leading-none tracking-tight text-foreground" style={{ fontFamily: BRICOLAGE, fontWeight: 400 }}>0&nbsp;€</p>
                : e.montant === null
                ? <p className="text-[1.75rem] md:text-[2rem] leading-none tracking-tight text-foreground" style={{ fontFamily: BRICOLAGE, fontWeight: 400 }}>Rien à&nbsp;payer</p>
                : <Montant ttc={e.montant} />}
            </div>
            <p className="mt-3 text-[0.9375rem] text-foreground/80 leading-snug text-pretty">{colle(e.ligne)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* Onglets sobres (JP, 14/10/2026 : « trop de boutons ») : du texte, un trait
   sous l'onglet actif, rien sous les autres. Au doigt comme au clavier
   (flèches). Trois tailles : la formule, le mode de paiement, le pack. */
function Onglets<T extends string>({ label, options, valeur, onChange, niveau, gauche = false }: {
  label: string; options: { cle: T; nom: string }[]; valeur: T; onChange: (v: T) => void; niveau: 1 | 2 | 3;
  /** Dans une carte : alignés à gauche, plus petits, sans trait de fond. */
  gauche?: boolean;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const clavier = (e: KeyboardEvent, i: number) => {
    const pas = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!pas) return;
    e.preventDefault();
    const j = (i + pas + options.length) % options.length;
    onChange(options[j].cle);
    refs.current[j]?.focus();
  };
  const pastilles = niveau === 3;
  const taille = gauche ? "text-[0.8125rem] sm:text-[0.875rem] pb-1.5" : niveau === 1 ? "text-[1rem] sm:text-[1.125rem] pb-3" : niveau === 2 ? "text-[0.9375rem] sm:text-[1rem] pb-2.5" : "text-[0.9375rem] pb-2";
  return (
    <div role="tablist" aria-label={label}
      className={gauche ? "flex justify-start gap-5 sm:gap-6" : "flex justify-center " + (niveau === 1 ? "gap-6 sm:gap-10 border-b border-border" : niveau === 2 ? "gap-6 sm:gap-8" : "gap-5 sm:gap-7")}>
      {options.map((o, i) => {
        const actif = o.cle === valeur;
        return (
          <Button variant="ghost" key={o.cle} ref={(el) => { refs.current[i] = el; }} type="button" role="tab" aria-selected={actif}
            tabIndex={actif ? 0 : -1} onClick={() => onChange(o.cle)} onKeyDown={(e) => clavier(e, i)}
            className={pastilles
              ? "h-10 min-w-[60px] rounded-full border border-foreground px-5 py-2 text-[0.9375rem] font-normal " + (actif ? "bg-foreground text-background hover:bg-foreground hover:text-background" : "bg-background text-foreground hover:bg-secondary hover:text-foreground")
              : "relative h-auto rounded-sm bg-transparent px-0 pt-0 -mb-px text-center leading-snug text-balance hover:bg-transparent focus-visible:ring-foreground focus-visible:ring-offset-4 " + taille + " " +
                (actif ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground")}>
            {o.nom}
            {!pastilles && <span aria-hidden="true" className={"absolute left-0 right-0 bottom-0 h-[2px] rounded-full " + (actif ? "bg-foreground" : "bg-transparent")} />}
          </Button>
        );
      })}
    </div>
  );
}

/* Carrousel horizontal à flèches (même mécanique que biolystes.pro/rdv). */
function Carrousel({ titre, children }: { titre: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const defiler = (sens: number) => ref.current?.scrollBy({ left: sens * 220, behavior: "smooth" });
  const fleche = "absolute top-1/2 -translate-y-1/2 z-10 bg-background border border-border rounded-full p-1.5 hover:bg-secondary transition-colors";
  return (
    <div className="space-y-3">
      <p className="text-[1.0625rem] font-semibold text-foreground" style={{ fontFamily: BRICOLAGE }}>{titre}</p>
      <div className="relative">
        <button type="button" aria-label="Précédent" onClick={() => defiler(-1)} className={fleche + " left-2"}>
          <ChevronLeft className="h-4 w-4 text-foreground" />
        </button>
        <div ref={ref} className="flex gap-3 overflow-x-auto snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
          {children}
        </div>
        <button type="button" aria-label="Suivant" onClick={() => defiler(1)} className={fleche + " right-2"}>
          <ChevronRight className="h-4 w-4 text-foreground" />
        </button>
      </div>
    </div>
  );
}

type Famille = "boutique" | "sans";
/* Libellés du choix de paiement (JP, 14/10/2026). Les mots « louer » et
   « location » ne s'affichent pas sur la page : ils restent au contrat. */
const LIBELLES_MODE = { achat: "Payer en une fois", location: "Payer sur plusieurs mois" };
const SOUS_TITRES_MODE = {
  achat: "Le site est à vous. Acompte, puis le reste seulement si nos produits vous plaisent.",
  location: "Sans engagement. Le site devient le vôtre une fois le total réglé.",
};
const AVEC_BOUTIQUE = ACHATS.filter((o) => o.cle !== "design");
const SANS_BOUTIQUE = ACHATS.find((o) => o.cle === "design") as Offre;

/* Marges (JP, 14/10/2026 : « partout ») : sous 850 px, lystes/src/index.css
   ramène de force .px-6 à 16 px, .p-6 à 16 px et .p-5 à 12 px. D'où des
   valeurs explicites, les mêmes pour toute la page : gouttière de 20 px au
   téléphone, 24 px au-delà ; intérieur des cartes 24 px, 32 px dès 768 px. */

/* Le dernier site lancé, vu en vrai (JP, 14/10/2026) : ecloseparis.com en
   iframe (le site ne l'interdit pas : ni X-Frame-Options, ni
   frame-ancestors, vérifié le 14/10/2026), réduit à la largeur du cadre.
   15/10/2026 : retour aux proportions d'origine — le site entier visible,
   le fil Instagram passe à droite dans une carte de même style.
   Ordinateur : écran 1440 × 900 dans une fenêtre de navigateur ; téléphone :
   écran 390 × 844 dans un cadre de téléphone. Une seule iframe chargée. */
const ECLOSE_URL = "https://ecloseparis.com";
const INSTAGRAM_URL = "https://www.instagram.com/ecloseparis/";
/* L'iframe est plus haute que le cadre : le bandeau de cookies et le bouton
   de conseil du site, fixés en bas de sa fenêtre, tombent hors du cadre. */
const MARGE_CACHEE = 420;
function ApercuSite() {
  const cadre = useRef<HTMLDivElement>(null);
  const [largeur, setLargeur] = useState(0);
  const [hauteur, setHauteur] = useState(0);
  const [telephone, setTelephone] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const suivre = () => setTelephone(mq.matches);
    mq.addEventListener("change", suivre);
    return () => mq.removeEventListener("change", suivre);
  }, []);
  useEffect(() => {
    const el = cadre.current;
    if (!el) return;
    const ro = new ResizeObserver(() => { setLargeur(el.clientWidth); setHauteur(el.clientHeight); });
    ro.observe(el);
    return () => ro.disconnect();
  }, [telephone]);
  /* Écran plus haut que la fenêtre (JP : le site défile comme le fil
     Instagram, avec le même moteur) : 1440 × 2 200, l'iframe rend donc une
     longue page qui passe lentement dans le cadre. */
  const ecran = telephone ? { w: 390, h: 844 } : { w: 1440, h: 2200 };
  const echelle = largeur ? largeur / ecran.w : 0;
  /* Le site défile avec le même moteur que le fil Instagram : une seule
     animation (.defile-feed), la distance parcourue passée par élément via
     --defile-distance. La hauteur visible vient du cadre (flex-1) : les deux
     cartes s'arrêtent au même niveau, sans fond blanc dessous. */
  const distance = Math.max(0, (ecran.h + MARGE_CACHEE) * echelle - hauteur);
  const iframe = (
    <iframe src={ECLOSE_URL} title="Éclose Paris, le site" loading="lazy" tabIndex={-1} aria-hidden="true"
      className="absolute top-0 left-0 border-0 pointer-events-none origin-top-left"
      style={{ width: ecran.w, height: ecran.h + MARGE_CACHEE, transform: `scale(${echelle})`, visibility: echelle ? "visible" : "hidden" }} />
  );
  return (
    <div className="flex flex-col min-w-0 space-y-4 h-full">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="text-[1.0625rem] font-semibold text-foreground" style={{ fontFamily: BRICOLAGE }}>Le dernier site lancé : Éclose Paris</p>
        <a href={ECLOSE_URL} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-foreground/40 px-5 py-2 text-[0.9375rem] font-medium text-foreground transition-colors hover:bg-foreground hover:text-background">
          Voir le site <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
        </a>
      </div>

      {telephone ? (
        <div className="mx-auto w-[260px] rounded-[2.25rem] border-[7px] border-foreground bg-foreground overflow-hidden">
          <div ref={cadre} className="relative w-full overflow-hidden rounded-[1.75rem] bg-background" style={{ aspectRatio: `${ecran.w} / ${ecran.h}` }}>
            {iframe}
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-[477px] rounded-2xl border border-border bg-background overflow-hidden">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 h-9 border-b border-border shrink-0">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-border" /><span className="w-2.5 h-2.5 rounded-full bg-border" /><span className="w-2.5 h-2.5 rounded-full bg-border" />
            </span>
            <span className="text-center text-[0.75rem] text-muted-foreground">ecloseparis.com</span>
            <span className="w-[42px]" aria-hidden="true" />
          </div>
          <div ref={cadre} className="relative flex-1 w-full overflow-hidden">
            {iframe}
          </div>
        </div>
      )}
    </div>
  );
}

/* Le fil Instagram d'Éclose Paris, à droite du site, fixe (pas de défilement).
   Sa barre du haut a la même hauteur que la barre ecloseparis.com du site,
   avec l'icône Instagram et @Éclose Paris, pour que les deux cartes soient
   alignées. */
function FilInstagram() {
  return (
    <div className="flex flex-col min-w-0 space-y-4 h-full">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="text-[1.0625rem] font-semibold text-foreground" style={{ fontFamily: BRICOLAGE }}>Fil Instagram</p>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-foreground/40 px-5 py-2 text-[0.9375rem] font-medium text-foreground transition-colors hover:bg-foreground hover:text-background">
          Voir Instagram <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
        </a>
      </div>
      <div className="flex flex-col h-[477px] rounded-2xl border border-border bg-background overflow-hidden">
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 px-4 h-9 border-b border-border shrink-0 text-[0.75rem] text-muted-foreground hover:text-foreground">
          <Instagram className="h-3.5 w-3.5" strokeWidth={1.75} /> @Éclose Paris
        </a>
        <div className="relative flex-1 w-full overflow-hidden">
          <img src={feedInstagramEclose} alt="Publications Instagram d'Éclose Paris"
            className="absolute inset-0 h-full w-full object-cover object-top" />
        </div>
      </div>
    </div>
  );
}

export default function TarifsPage() {
  const [famille, setFamille] = useState<Famille>("boutique");
  /* La location n'existe qu'avec une boutique en ligne (JP). */
  const [modeBoutique, setModeBoutique] = useState<"achat" | "location">("achat");
  const [cleBoutique, setCleBoutique] = useState("standard");
  /* Le paiement sur plusieurs mois n'existe que pour les packs qui ont une
     formule sur plusieurs mois (Standard, IA) : ailleurs, ses onglets
     n'apparaissent pas et le paiement se fait en une fois. */
  const avecMois = famille === "boutique" && LOCATIONS.some((o) => o.cle === cleBoutique);
  const mode = avecMois && modeBoutique === "location" ? "location" : "achat";
  const offre = famille === "sans" ? SANS_BOUTIQUE
    : mode === "location" ? LOCATIONS.find((o) => o.cle === cleBoutique) ?? LOCATIONS[0]
    : AVEC_BOUTIQUE.find((o) => o.cle === cleBoutique) ?? AVEC_BOUTIQUE[0];
  const acompte = offre.etapes[1].montant ?? 0;

  return (
    <>
      <Helmet>
        <title>Tarifs | Biolystes</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* ═══ LE CHOIX, PUIS LE PAIEMENT DU PACK CHOISI ═══ */}
      <section className="bg-background pt-12 md:pt-20 pb-12 md:pb-16 px-[1.25rem] md:px-[1.5rem]">
        <Entete niveau={1} surtitre="Tarifs"
          noir="Vous ne payez le reste" gris={"que si nos produits vous" + INSECABLE + "plaisent."} />

        <div className="max-w-5xl mx-auto mt-8 md:mt-10 space-y-4">
          <Onglets label="Votre formule" niveau={1} valeur={famille} onChange={(v) => setFamille(v as Famille)}
            options={[{ cle: "boutique", nom: "Avec boutique en ligne" }, { cle: "sans", nom: "Sans boutique en ligne" }]} />
          {famille === "boutique" && <p className="text-center text-[0.9375rem] text-foreground/80 text-pretty">{SOUS_TITRES_MODE[mode]}</p>}
          {famille === "boutique" && <Onglets label="Votre pack" niveau={3} valeur={cleBoutique} onChange={setCleBoutique}
            options={AVEC_BOUTIQUE.map((o) => ({ cle: o.cle, nom: o.nom.replace("Pack ", "") }))} />}
          <p className="text-center text-[0.9375rem] text-muted-foreground text-pretty">
            <span className="text-foreground font-semibold">{offre.nom}</span> : {famille === "sans" ? "vos produits à votre marque, sans site — pensé pour les instituts, ou pour celles et ceux qui ne souhaitent pas avoir de e-commerce avec nos services" : offre.contenu}.
            {famille !== "sans" && <span className="block mt-1">{peutAjouterProduit(offre.cle)
              ? <>Un produit en plus&nbsp;? {euros(PRODUIT_EN_PLUS)} TTC par design de produit, paiement unique.</>
              : <>Pour ajouter plus de produits, passez au pack supérieur. Aucun produit supplémentaire dans le {offre.nom}.</>}</span>}
          </p>
        </div>

        {/* 1. Le prix, en haut, sans défiler (JP, 14/10/2026) : le total du pack
            et l'acompte demandé ; à côté, l'abonnement. Sur plusieurs mois : le
            total pour que le site soit à la cliente, l'acompte et le reste de la
            mise en place, et la mensualité (à partir de), abonnement compris. */}
        <div className={"max-w-5xl mx-auto rounded-2xl bg-secondary " + "mt-8 md:mt-10 p-[1.5rem] md:p-[2rem] grid md:grid-cols-2 gap-6 md:gap-10 items-center"}>
          <div>
            {/* Le mode de paiement, dans la carte, en haut à gauche (JP, 14/10/2026).
                Seulement pour Standard et IA. */}
            {avecMois && (
              <div className="mb-5">
                <Onglets label="Comment payer" niveau={2} gauche valeur={modeBoutique} onChange={(v) => setModeBoutique(v as "achat" | "location")}
                  options={[{ cle: "achat", nom: LIBELLES_MODE.achat }, { cle: "location", nom: LIBELLES_MODE.location }]} />
              </div>
            )}
            <p className="text-[0.75rem] tracking-[0.14em] uppercase text-foreground">{offre.totalTitre}</p>
            <div className="mt-3"><Montant ttc={offre.total} /></div>
            {mode === "achat" && <p className="mt-3 text-[0.9375rem] text-foreground font-medium text-pretty">Dont un acompte de {euros(acompte)} TTC, payé à la commande.</p>}
            {mode === "location" && <p className="mt-3 text-[0.9375rem] text-foreground font-medium text-pretty">Dont un acompte de {euros(acompte)} TTC, puis {euros(offre.etapes[3].montant ?? 0)} TTC à la livraison du&nbsp;site.</p>}
          </div>
          <div className="md:border-l md:border-border md:pl-10">
            <p className="text-[0.75rem] tracking-[0.14em] uppercase text-foreground">{offre.mensuelTitre}</p>
            <div className="mt-3"><Montant ttc={offre.mensuel} petit minimum={mode === "location"} /></div>
            {offre.mensuelTexte && <p className="mt-2 text-[0.9375rem] text-foreground/80 text-pretty">{offre.mensuelTexte}</p>}
          </div>
        </div>

        {/* 2. Pourquoi un acompte (achat) : texte de JP, mot pour mot (compétence
            tarifs-biolystes, « Pourquoi l'acompte », 14/10/2026). */}
        {mode === "achat" ? (
          <div className="max-w-5xl mx-auto mt-4 rounded-2xl border border-foreground p-[1.5rem] md:p-[2rem] grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-8 lg:gap-12">
            <div>
              <div className="flex items-center gap-3">
                <RondIcone icone={ShieldCheck} />
                <h2 className="text-[1.25rem] md:text-[1.5rem] !font-semibold text-foreground leading-snug" style={{ fontFamily: BRICOLAGE, textTransform: "none" }}>
                  Pourquoi un acompte&nbsp;?
                </h2>
              </div>
              <p className="mt-4 text-[0.9375rem] md:text-base text-foreground/80 leading-relaxed text-pretty">
                Avant de vous engager vraiment, vous devez vérifier que nos produits tiennent leurs promesses. Avec l’acompte, nous créons votre logo et votre branding, nous fabriquons vos produits et nous vous les envoyons. Vous les recevez à votre marque, et c’est seulement là que vous décidez de continuer avec nous, ou non.
              </p>
              <div className="mt-5 rounded-xl bg-[#e1f3c5] p-[1.5rem] md:p-[2rem]">
                <p className="text-[1rem] md:text-[1.0625rem] text-foreground leading-relaxed text-pretty" style={{ fontFamily: BRICOLAGE }}>
                  Pendant cette première étape, nous prenons à notre charge une grande partie de la création de vos produits. Nous le faisons parce que nous sommes sûrs de leur qualité.
                </p>
                {/* Le rendez-vous, dans l'encadré vert (JP, 14/10/2026). */}
                <BoutonRdv className="mt-5 !justify-start" />
              </div>
            </div>
            <div className="lg:border-l lg:border-border lg:pl-12">
              <p className="text-[0.75rem] tracking-[0.14em] uppercase text-foreground">Ce que comprend l’acompte</p>
              <ul className="mt-4 space-y-3">
                {ACOMPTE_COMPREND.map((x) => (
                  <li key={x.texte} className="flex items-center gap-3 text-[0.9375rem] md:text-base text-foreground">
                    <PetitRond icone={x.icone} />
                    <span className="text-pretty">{x.texte}</span>
                  </li>
                ))}
              </ul>
              {/* Aperçu de ce que la cliente va recevoir (JP, 15/10/2026) : la vidéo
                  au format des cartes showcase, empilée en pleine largeur sous la
                  liste (JP, 15/10 : retour à la disposition d'origine, le texte à
                  droite n'était voulu que pour le mobile). */}
              <p className="mt-6 text-[0.75rem] tracking-[0.14em] uppercase text-foreground">Un aperçu de ce que vous recevez</p>
              <div className="mt-3 w-[200px] h-[260px] rounded-xl overflow-hidden bg-muted">
                <video src="/videos/showcase-2.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
              </div>
              <div className="mt-5">
                {/* Le logo est offert (JP, 14/10/2026) : coupe court aux « j'ai déjà mon logo ». */}
                <p className="text-[0.9375rem] text-foreground font-medium text-pretty">Le logo est offert : il n’est pas compté dans le prix.</p>
                <p className="mt-5 text-[0.75rem] tracking-[0.14em] uppercase text-foreground">Si les produits ne vous conviennent pas</p>
                <p className="mt-2 text-[0.9375rem] md:text-base text-foreground/80 leading-relaxed text-pretty">
                  Vous vous arrêtez là, sans rien payer de plus ({euros(acompte)} TTC d’acompte au total), et vous gardez votre logo et votre branding.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto mt-4 rounded-2xl border border-foreground p-[1.5rem] md:p-[2rem] flex items-start gap-4">
            <RondIcone icone={KeyRound} />
            <div className="min-w-0">
              <h2 className="text-[1.125rem] md:text-[1.25rem] !font-semibold text-foreground leading-snug text-pretty" style={{ fontFamily: BRICOLAGE, textTransform: "none" }}>
                Sans engagement
              </h2>
              <p className="mt-2 text-[0.9375rem] md:text-base text-foreground/80 leading-relaxed text-pretty">
                Vos produits ne vous plaisent pas à réception&nbsp;? Vous arrêtez là&nbsp;: vous n’avez payé que l’acompte ({euros(acompte)} TTC), et vous gardez votre logo et votre branding.
              </p>
              <p className="mt-2 text-[0.9375rem] md:text-base text-foreground/80 leading-relaxed text-pretty">
                Ensuite, vous arrêtez quand vous voulez. Si vous arrêtez avant d’avoir réglé la totalité, le site est simplement désactivé. Vous gardez votre logo, votre charte et votre packaging.
              </p>
            </div>
          </div>
        )}

        {/* 3. Seulement ensuite, les modalités de paiement : la frise. */}
        <p className="max-w-5xl mx-auto mt-12 md:mt-16 text-center text-[0.75rem] tracking-[0.14em] uppercase text-foreground">Comment se passe le paiement</p>
        <div className="max-w-5xl mx-auto mt-8 md:mt-10">
          <Frise etapes={offre.etapes} />
        </div>

        {/* Le rendez-vous : en achat, il est dans l'encadré vert de « Pourquoi un
            acompte ? » (JP, 14/10/2026) ; sur plusieurs mois, sous la frise. */}
        {mode === "location" && <BoutonRdv className="mt-10 md:mt-12" />}


        {/* Ce que comprend le pack choisi (mêmes mots que biolystes.pro/offre/<slug>). */}
        <div className="max-w-5xl mx-auto mt-4 rounded-2xl border border-border p-[1.5rem] md:p-[2rem]">
          <p className="text-[0.75rem] tracking-[0.14em] uppercase text-foreground">{colle("Ce que comprend le " + offre.nom)}</p>
          <ul className="mt-4 grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
            {offre.comprend.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-[0.9375rem] text-foreground/80 leading-snug">
                <Check className="h-4 w-4 mt-0.5 shrink-0 text-foreground" strokeWidth={2} />
                <span className="text-pretty">{colle(f)}</span>
              </li>
            ))}
          </ul>
          <a href={OFFRE_URL + offre.slug} target="_blank" rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground">
            Voir le détail de l’offre <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
          </a>
        </div>
      </section>

      {/* ═══ COMMENT ÇA FONCTIONNE : LES ÉTAPES ═══
          Le bloc des étapes de l'accueil (VisionEtagesBloc secteur="bio") :
          les onglets Sélection → Assurance, la scène par étape et le
          carrousel de sélection. Il porte ses propres styles et son titre. */}
      <section className="bg-background pb-12 md:pb-16">
        <div className="max-w-[1072px] mx-auto px-[1.25rem] md:px-[1.5rem] pt-12 md:pt-16">
          <Entete surtitre="Notre process" noir="Pour réussir" gris="votre lancement." />
        </div>
        <VisionEtagesBloc secteur="bio" />
      </section>

      {/* ═══ CE QUE NOTRE SUITE IA FAIT POUR VOS VENTES ═══
          Le bloc des étages de /agents-ia (VisionEtagesBloc) : les onglets
          Vos produits → Vos équipes, les visites et la fiche de démonstration.
          Il porte ses propres styles : rien à ajouter à la page. */}
      <section className="bg-background pb-12 md:pb-16">
        <div className="max-w-[1072px] mx-auto px-[1.25rem] md:px-[1.5rem] pt-12 md:pt-16">
          <Entete surtitre="Notre suite IA" noir="Ce que nos équipes IA font" gris="pour vos ventes." />
        </div>
        <VisionEtagesBloc />
      </section>


      {/* ═══ RÉASSURANCE : LES CARROUSELS DE BIOLYSTES.PRO/RDV ═══ */}
      <Bande gris>
        <div className="max-w-[1072px] mx-auto px-[1.25rem] md:px-[1.5rem] space-y-10">
          <Entete surtitre="Ils nous font confiance" noir="Des marques bien réelles," gris="déjà lancées." />
          {/* Le site lancé, en grand, et à côté le fil Instagram : les deux
              défilent avec le même moteur, à la même hauteur (JP, 15/10/2026). */}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] items-stretch">
            <div className="order-1 min-w-0"><ApercuSite /></div>
            <div className="order-2 min-w-0"><FilInstagram /></div>
          </div>

          <Carrousel titre="Ils ont lancé leur marque avec nous">
            {SHOWCASE_ITEMS.map((item) => (
              <div key={item.src} className="snap-start flex-shrink-0 w-[200px] h-[260px] rounded-xl overflow-hidden bg-muted">
                {item.type === "image"
                  ? <img src={item.src} alt={item.alt} className="w-full h-full object-cover" loading="lazy" />
                  : <video src={item.src} autoPlay loop muted playsInline className="w-full h-full object-cover" />}
              </div>
            ))}
          </Carrousel>
          <Carrousel titre="Dans les coulisses">
            {COULISSES.map((src) => (
              <div key={src} className="snap-start flex-shrink-0 w-[180px] h-[320px] rounded-xl overflow-hidden bg-muted">
                <video src={src} autoPlay muted loop playsInline preload="metadata" className="w-full h-full object-cover" />
              </div>
            ))}
          </Carrousel>
          <div className="space-y-2">
            <p className="text-[1.0625rem] font-semibold text-foreground" style={{ fontFamily: BRICOLAGE }}>Qui sommes-nous</p>
            <div className="rounded-xl border border-border bg-background p-[1.5rem] md:p-[2rem]">
              <p className="text-sm font-medium text-foreground text-pretty">Biolystes est une activité de LYSTES SAS, dirigée par Jean Pierre Bias</p>
              <p className="text-xs text-muted-foreground mt-1 text-pretty">immatriculée au RCS de Paris sous le numéro 907 951 867, dont le siège est au 26 rue du Général Beuret, 75015</p>
            </div>
          </div>
        </div>
      </Bande>

      {/* ═══ CE QUE COÛTE CHAQUE VENTE ═══ */}
      <Bande>
        <div className="max-w-[1072px] mx-auto px-[1.25rem] md:px-[1.5rem]">
          <Entete className="mb-10" surtitre="Une fois en ligne" noir="Ce que coûte" gris="chaque vente." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FRAIS.map((f) => (
              /* Téléphone : icône à gauche, carte courte ; dès 640 px, icône au-dessus. */
              <div key={f.titre} className="bg-secondary rounded-2xl p-[1.5rem] md:p-[2rem] flex sm:flex-col items-start gap-4 sm:gap-0">
                <PetitRond icone={f.icone} />
                <div className="min-w-0 sm:mt-4">
                  <p className="text-[0.8125rem] text-muted-foreground leading-snug">{f.titre}</p>
                  <p className="mt-1 text-[1.25rem] sm:text-[1.375rem] leading-tight tracking-tight text-foreground" style={{ fontFamily: BRICOLAGE }}>{f.valeur}</p>
                  <p className="mt-1.5 sm:mt-2 text-[0.875rem] text-foreground/80 leading-snug text-pretty">{f.ligne}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Bande>

      {/* ═══ RENDEZ-VOUS ═══ */}
      <Bande gris>
        <div className="max-w-[48rem] mx-auto px-[1.25rem] md:px-[1.5rem]">
          <Entete surtitre="Votre projet" noir="On en parle" gris={"en" + INSECABLE + "rendez-vous."}
            texte="Nous choisissons ensemble le pack, les produits et l’échéancier." />
          <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[0.9375rem] text-foreground/80">
            {["Sans stock", "Sans minimum", "Sans commission"].map((x) => (
              <li key={x} className="flex items-center gap-2"><Check className="h-4 w-4 text-foreground" strokeWidth={2} />{x}</li>
            ))}
          </ul>
          <BoutonRdv className="mt-8" />
        </div>
      </Bande>
    </>
  );
}
