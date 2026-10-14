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

   Laissés de côté tant que JP n’a pas tranché (audit du 14/10/2026) : le
   moment où se paie la mise en place en location (acompte de 199 ou 299 €
   dans l’espace client), les pourcentages de remise, « le premier mois
   offert », le tarif horaire hors forfait, la durée d’engagement de
   l’abonnement, le prix exact de chaque référence. */
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import {
  BadgePercent, Check, ChevronLeft, ChevronRight, CreditCard, HandCoins, Heart, KeyRound, PackageCheck,
  Receipt, ShieldCheck, ShoppingBag, Store, Tag, Truck, Wallet, type LucideIcon,
} from "lucide-react";
import { Bande, BoutonRdv, Entete, RondIcone } from "./pied/elements";
import showcaseAmarsi from "@/assets/showcase-amarsi.jpg";
import showcasePeau from "@/assets/showcase-peau.jpg";
import showcase235 from "@/assets/showcase-235.jpg";

const BRICOLAGE = "'Bricolage Grotesque', 'Inter', sans-serif";
const INSECABLE = "\u00a0";

/* 1 249,17 € ; les montants ronds sans centimes. Espace des milliers
   insécable ordinaire : l’espace fine de fr-FR disparaît presque en Bricolage. */
function euros(n: number, centimes?: boolean) {
  const avec = centimes ?? !Number.isInteger(n);
  return n.toLocaleString("fr-FR", { minimumFractionDigits: avec ? 2 : 0, maximumFractionDigits: avec ? 2 : 0 }).replace(/\u202f/g, INSECABLE) + INSECABLE + "€";
}
const ht = (ttc: number) => Math.round((ttc / 1.2) * 100) / 100;

type Etape = { icone: LucideIcon; quand: string; montant: number | null; ligne: string; protege?: boolean; minimum?: boolean };
type Offre = {
  cle: string; nom: string; contenu: string; total: number; totalTitre: string;
  mensuel: number; mensuelTitre: string; mensuelTexte: string; etapes: Etape[];
};

/* Les étapes de paiement d’un pack acheté. */
const ACOMPTE = (montant: number): Etape => ({ icone: Wallet, quand: "Payé à la commande", montant, ligne: "L’acompte lance votre projet." });
const RECUS: Etape = { icone: PackageCheck, quand: "Vos produits arrivent", montant: null, ligne: "Vous les recevez chez vous et vous les testez." };
const PLAISENT = (montant: number, solde = false): Etape => ({
  icone: Heart, quand: "Payé s’ils vous plaisent", montant, protege: true,
  ligne: solde ? "Le solde, seulement si vous continuez." : "2e tranche, seulement si vous continuez.",
});
const SOLDE = (montant: number): Etape => ({ icone: Store, quand: "Payé à la livraison", montant, ligne: "Le solde, à la livraison de votre boutique." });

const achat = (cle: string, nom: string, contenu: string, total: number, abonnement: number, abonnementTexte: string, etapes: Etape[]): Offre => ({
  cle, nom, contenu, total, totalTitre: "Total du " + nom, etapes,
  mensuel: abonnement, mensuelTitre: "Puis l’abonnement, par mois", mensuelTexte: abonnementTexte,
});

/* Packs achetés, dans l’ordre de JP. Source : packs.ts (PACKS_AVEC_SITE). */
const ACHATS: Offre[] = [
  achat("design", "Pack Design", "4 produits, sans boutique", 599, 39, "Accès à tout notre catalogue, sans minimum de commande : vous commandez le produit que vous voulez, quand vous voulez. Un produit pas encore designé : 39 € une fois.",
    [ACOMPTE(199), RECUS, PLAISENT(400, true)]),
  achat("solo", "Pack Solo", "1 produit et votre boutique", 499, 49, "Dès la mise en ligne. Ce que ça vous donne : hébergement, support, logistique et sécurité de votre boutique, sans minimum de commande.",
    [ACOMPTE(199), RECUS, PLAISENT(300, true)]),
  achat("duo", "Pack Duo", "2 produits et votre boutique", 999, 79, "Dès la mise en ligne. Ce que ça vous donne : hébergement, support prioritaire et logistique, sans minimum de commande.",
    [ACOMPTE(199), RECUS, PLAISENT(301), SOLDE(499)]),
  achat("standard", "Pack Standard", "4 produits, boutique complète, expert dédié", 1499, 99, "Dès la mise en ligne. Ce que ça vous donne : hébergement, livraisons, référencement, support et sécurité, sans minimum de commande.",
    [ACOMPTE(199), RECUS, PLAISENT(551), SOLDE(749)]),
  achat("ia", "Pack IA", "8 produits, boutique, diagnostic et contenus IA", 2999, 99, "Dès la mise en ligne. Ce que ça vous donne : tout le Standard, plus diagnostic IA, contenus UGC IA et marketing, sans minimum de commande.",
    [ACOMPTE(299), RECUS, PLAISENT(1201), SOLDE(1499)]),
];

/* Location. Source : packs.ts (PACKS_LOCATION) : mise en place, puis un
   loyer ; le site est acquis au prix du pack acheté. */
const location = (cle: string, nom: string, contenu: string, miseEnPlace: number, loyer: number, acquis: number): Offre => ({
  cle, nom, contenu, total: miseEnPlace, totalTitre: "Mise en place", etapes: [
    { icone: KeyRound, quand: "Mise en place", montant: miseEnPlace, ligne: "Pour lancer votre projet." },
    { icone: Receipt, quand: "Puis chaque mois", montant: loyer, minimum: true, ligne: "Vous pouvez verser plus chaque mois, ou solder quand vous voulez, pour que le site soit à vous plus vite." },
    { icone: Store, quand: "Le site est à vous", montant: acquis, ligne: "Une fois ce montant payé au total.", protege: true },
  ],
  mensuel: loyer, mensuelTitre: "Par mois", mensuelTexte: "",
});
const LOCATIONS: Offre[] = [
  location("standard", "Pack Standard", "tout le Standard, payé sur plusieurs mois", 499, 199, 1499),
  location("ia", "Pack IA", "tout le Pack IA, payé sur plusieurs mois", 599, 199, 2999),
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

/* La frise : horizontale dès 1024 px, verticale et centrée en dessous (une
   seule présentation par largeur, jamais d’entre-deux). */
function Frise({ etapes }: { etapes: Etape[] }) {
  const n = etapes.length;
  return (
    <ol className={"grid gap-0 lg:gap-6 max-w-[420px] lg:max-w-none mx-auto " + (n === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
      {etapes.map((e, i) => (
        <li key={e.quand} className="relative flex lg:flex-col lg:items-center lg:text-center gap-4 pb-8 lg:pb-0 last:pb-0">
          {i < n - 1 && <span aria-hidden="true" className="lg:hidden absolute left-[19px] top-12 bottom-2 w-px bg-border" />}
          {i < n - 1 && <span aria-hidden="true" className="hidden lg:block absolute top-5 left-[calc(50%_+_36px)] right-[calc(12px_-_50%)] h-px bg-border" />}
          <div className="relative shrink-0">
            <RondIcone icone={e.icone} />
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-background border border-border text-[0.6875rem] font-semibold text-foreground flex items-center justify-center tabular-nums">{i + 1}</span>
          </div>
          <div className="min-w-0 lg:mt-1">
            <p className="text-[0.75rem] tracking-[0.14em] uppercase text-foreground">
              <span className={e.protege ? "rounded bg-[#e1f3c5] px-1.5 py-0.5 -mx-1.5" : undefined}>{e.quand}</span>
            </p>
            <div className="mt-3">
              {e.montant === null
                ? <p className="text-[1.75rem] md:text-[2rem] leading-none tracking-tight text-foreground" style={{ fontFamily: BRICOLAGE, fontWeight: 400 }}>Rien à&nbsp;payer</p>
                : <Montant ttc={e.montant} minimum={e.minimum} />}
            </div>
            <p className="mt-3 text-[0.9375rem] text-foreground/80 leading-snug text-pretty">{e.ligne}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* Groupe de choix, au doigt comme au clavier (flèches, comme des onglets). */
function Choix<T extends string>({ label, options, valeur, onChange, grand = false, petit = false }: {
  label: string; options: { cle: T; nom: string; icone?: LucideIcon }[]; valeur: T; onChange: (v: T) => void; grand?: boolean; petit?: boolean;
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
  return (
    <div role="radiogroup" aria-label={label} className={"flex flex-wrap justify-center " + (grand ? "gap-3" : petit ? "gap-1.5 sm:gap-2" : "gap-2.5")}>
      {options.map((o, i) => {
        const actif = o.cle === valeur;
        const Icone = o.icone;
        return (
          <button key={o.cle} ref={(el) => { refs.current[i] = el; }} type="button" role="radio" aria-checked={actif}
            tabIndex={actif ? 0 : -1} onClick={() => onChange(o.cle)} onKeyDown={(e) => clavier(e, i)}
            className={"inline-flex items-center justify-center gap-2 rounded-full border font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 " +
              (grand ? "w-full sm:w-auto h-14 px-7 text-[1.0625rem] " : petit ? "h-10 px-3.5 sm:px-5 text-[0.875rem] sm:text-[0.9375rem] " : "h-12 px-6 text-[1rem] ") +
              (actif ? "bg-foreground text-background border-foreground" : "bg-background text-foreground border-foreground/20 hover:border-foreground")}>
            {Icone && <Icone className="h-5 w-5" strokeWidth={1.5} />}
            {o.nom}
            {actif && petit && <Check className="h-4 w-4" strokeWidth={2} />}
          </button>
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
        <button type="button" aria-label="Précédent" onClick={() => defiler(-1)} className={fleche + " -left-3"}>
          <ChevronLeft className="h-4 w-4 text-foreground" />
        </button>
        <div ref={ref} className="flex gap-3 overflow-x-auto snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
          {children}
        </div>
        <button type="button" aria-label="Suivant" onClick={() => defiler(1)} className={fleche + " -right-3"}>
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

export default function TarifsPage() {
  const [famille, setFamille] = useState<Famille>("boutique");
  /* La location n'existe qu'avec une boutique en ligne (JP). */
  const [modeBoutique, setModeBoutique] = useState<"achat" | "location">("achat");
  const [cleBoutique, setCleBoutique] = useState("standard");
  const [cleLocation, setCleLocation] = useState("standard");
  const mode = famille === "boutique" && modeBoutique === "location" ? "location" : "achat";
  const offre = famille === "sans" ? SANS_BOUTIQUE
    : mode === "location" ? LOCATIONS.find((o) => o.cle === cleLocation) ?? LOCATIONS[0]
    : AVEC_BOUTIQUE.find((o) => o.cle === cleBoutique) ?? AVEC_BOUTIQUE[0];
  const acompte = offre.etapes[0].montant ?? 0;

  return (
    <>
      <Helmet>
        <title>Tarifs | Biolystes</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* ═══ LE CHOIX, PUIS LE PAIEMENT DU PACK CHOISI ═══ */}
      <section className="bg-background pt-12 md:pt-20 pb-12 md:pb-16 px-6">
        <Entete niveau={1} surtitre="Tarifs"
          noir="Vous ne payez le reste" gris={"que si nos produits vous" + INSECABLE + "plaisent."} />

        <div className="max-w-5xl mx-auto mt-8 md:mt-10 space-y-4">
          <Choix label="Votre formule" grand valeur={famille} onChange={(v) => setFamille(v as Famille)}
            options={[
              { cle: "boutique", nom: "Avec boutique en ligne", icone: Store },
              { cle: "sans", nom: "Sans boutique en ligne", icone: ShoppingBag },
            ]} />
          {famille === "boutique" && <Choix label="Comment payer" valeur={modeBoutique} onChange={(v) => setModeBoutique(v as "achat" | "location")}
            options={[{ cle: "achat", nom: LIBELLES_MODE.achat, icone: Wallet }, { cle: "location", nom: LIBELLES_MODE.location, icone: KeyRound }]} />}
          {famille === "boutique" && <p className="text-center text-[0.9375rem] text-foreground/80 text-pretty">{SOUS_TITRES_MODE[mode]}</p>}
          {famille === "boutique" && mode === "achat" && <Choix label="Votre pack" petit valeur={cleBoutique} onChange={setCleBoutique}
            options={AVEC_BOUTIQUE.map((o) => ({ cle: o.cle, nom: o.nom.replace("Pack ", "") }))} />}
          {mode === "location" && <Choix label="Votre pack, payé sur plusieurs mois" petit valeur={cleLocation} onChange={setCleLocation}
            options={LOCATIONS.map((o) => ({ cle: o.cle, nom: o.nom.replace("Pack ", "") }))} />}
          <p className="text-center text-[0.9375rem] text-muted-foreground text-pretty">
            <span className="text-foreground font-semibold">{offre.nom}</span> : {famille === "sans" ? "vos produits à votre marque, sans site" : offre.contenu}.
            {famille !== "sans" && <span className="block mt-1">Un produit en plus&nbsp;? 39&nbsp;€ TTC par produit, paiement unique, pour son&nbsp;design.</span>}
          </p>
        </div>

        <div className="max-w-5xl mx-auto mt-10 md:mt-12">
          <Frise etapes={offre.etapes} />
        </div>

        {/* Ce qui protège la cliente (achat) ; ce que dit la location. */}
        <div className="max-w-5xl mx-auto mt-10 md:mt-12 rounded-2xl border border-foreground p-6 md:p-8 flex items-start gap-4">
          <RondIcone icone={mode === "achat" ? ShieldCheck : KeyRound} />
          <div className="min-w-0">
            <h2 className="text-[1.125rem] md:text-[1.25rem] !font-semibold text-foreground leading-snug text-pretty" style={{ fontFamily: BRICOLAGE, textTransform: "none" }}>
              {mode === "achat" ? <>Ils ne vous plaisent pas&nbsp;?</> : <>Sans engagement</>}
            </h2>
            <p className="mt-2 text-[0.9375rem] md:text-base text-foreground/80 leading-relaxed text-pretty">
              {mode === "achat"
                ? <>Vous vous arrêtez là : vous ne payez rien de plus que l’acompte ({euros(acompte)} TTC), et vous gardez votre logo et votre branding, même pour un autre laboratoire.</>
                : <>Vous arrêtez quand vous voulez. Si vous arrêtez avant d’avoir réglé la totalité, le site est simplement désactivé. Vous gardez votre logo, votre charte et votre packaging.</>}
            </p>
          </div>
        </div>

        {/* Le total et l’abonnement du pack acheté (en location, la frise dit déjà tout). */}
        {mode === "achat" && <div className="max-w-5xl mx-auto mt-4 rounded-2xl bg-secondary p-6 md:p-8 grid md:grid-cols-2 gap-6 md:gap-10 items-center">
          <div>
            <p className="text-[0.75rem] tracking-[0.14em] uppercase text-foreground">{offre.totalTitre}</p>
            <div className="mt-3"><Montant ttc={offre.total} /></div>
          </div>
          <div className="md:border-l md:border-border md:pl-10">
            <p className="text-[0.75rem] tracking-[0.14em] uppercase text-foreground">{offre.mensuelTitre}</p>
            <div className="mt-3"><Montant ttc={offre.mensuel} petit /></div>
            {offre.mensuelTexte && <p className="mt-2 text-[0.9375rem] text-foreground/80 text-pretty">{offre.mensuelTexte}</p>}
          </div>
        </div>}
      </section>

      {/* ═══ RÉASSURANCE : LES CARROUSELS DE BIOLYSTES.PRO/RDV ═══ */}
      <Bande gris>
        <div className="max-w-[1072px] mx-auto px-6 space-y-10">
          <Entete surtitre="Ils nous font confiance" noir="Des marques bien réelles," gris="déjà lancées." />
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
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-sm font-medium text-foreground text-pretty">Biolystes est une activité de LYSTES SAS, dirigée par Jean Pierre Bias</p>
              <p className="text-xs text-muted-foreground mt-1 text-pretty">immatriculée au RCS de Paris sous le numéro 907 951 867, dont le siège est au 26 rue du Général Beuret, 75015</p>
            </div>
          </div>
        </div>
      </Bande>

      {/* ═══ CE QUE COÛTE CHAQUE VENTE ═══ */}
      <Bande>
        <div className="max-w-[1072px] mx-auto px-6">
          <Entete className="mb-10" surtitre="Une fois en ligne" noir="Ce que coûte" gris="chaque vente." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FRAIS.map((f) => (
              /* Téléphone : icône à gauche, carte courte ; dès 640 px, icône au-dessus. */
              <div key={f.titre} className="bg-secondary rounded-2xl p-5 sm:p-6 flex sm:flex-col items-start gap-4 sm:gap-0">
                <RondIcone icone={f.icone} petit />
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
        <div className="max-w-3xl mx-auto px-6">
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
