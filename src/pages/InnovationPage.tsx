/* /innovation (JP, 14/10/2026) : « Toujours plus d’innovation ». Ce que la
   page /cosmetique de lystes.ai montre, repris pour Biolystes en quatre
   parties de même forme : le suivi de soins sur mesure (diagnostic IA et Cure
   90 jours), votre magazine, vos événements, vos points de vente (boutique
   ou institut, QR codes). Dans le menu principal (« Innovation »).

   Rien n’est redessiné :
   - le maillage du visage est le composant de lystes.ai (FaceMeshScanner,
     recopié dans lystes/ par sync.py), avec sa photo ;
   - les en-têtes, bandes, cartes, coches et boutons sont ceux des pages du
     pied de page (src/pages/pied/elements.tsx, repris de l’accueil) ;
   - les visuels sont ceux de /cosmetique (écrans de la Cure 90 jours, stand
     connecté, QR code en rayon) et les captures des magazines Brume, Écrin,
     Élunesse des étages de l’accueil (public/bio-presse).
   Les textes reprennent ceux de /cosmetique. Retirés faute de source : les
   repères chiffrés (×3,1, ×4,1, +72 %, ×6,2, +48 %) et les barres « sans
   l’IA / avec l’IA » (3,02 % / 6,76 %, 4 % / 31 %). Aucun prix.

   Cadre, en-tête et pied de page : src/pages/pied/CadrePied.tsx. */
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { CalendarCheck, ChevronLeft, ChevronRight, QrCode, ScanFace, Ticket, type LucideIcon } from "lucide-react";
import SEO from "@/components/SEO";
import { FaceMeshScanner } from "@lystes/features/landing-particuliers/components/diagnostic/FaceMeshScanner";
import SafeVideo from "@lystes/components/bio/SafeVideo";
import { Bande, BoutonsAction, Entete, ListeCoches, Texte, TitreCarte } from "./pied/elements";
import visageDiagnostic from "@/assets/innovation/visage-diagnostic.jpg";

/* Les quatre parties, dans l’ordre de la page et du sommaire. */
const PARTIES = [
  { id: "suivi-de-soins", titre: "Suivi de soins sur mesure" },
  { id: "magazine", titre: "Votre magazine" },
  { id: "evenements", titre: "Vos événements" },
  { id: "points-de-vente", titre: "Vos points de vente" },
];

/* Les deux derniers mots restent ensemble : jamais un mot seul sur la
   dernière ligne (JP). Jamais un deux-points en début de ligne. */
const colle = (t: string) => t.replace(/ ([:;?!])/g, "\u00a0$1").replace(/ (\S+)$/, "\u00a0$1");

/* Une rangée : le visuel, puis la carte de texte (dessous au téléphone,
   à côté dès 1024 px). Même forme pour toutes les parties. */
function Rangee({ visuel, icone, titre, texte, points, carteBlanche }: {
  visuel: ReactNode;
  icone: LucideIcon;
  titre: string;
  texte: string;
  points: string[];
  /* Sur une bande grise, la carte est blanche ; sur une bande blanche, grise. */
  carteBlanche: boolean;
}) {
  return (
    <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 items-stretch">
      {visuel}
      <div className={(carteBlanche ? "bg-background" : "bg-secondary") + " rounded-2xl p-[1.5rem] lg:p-[2rem] flex flex-col justify-center gap-5"}>
        <TitreCarte icone={icone}>{titre}</TitreCarte>
        <Texte>{colle(texte)}</Texte>
        <ListeCoches elements={points.map(colle)} />
      </div>
    </div>
  );
}

/* ─── 1. Le maillage du visage : le composant de lystes.ai, sur fond noir ─── */
function CarteMaillage() {
  return (
    <div className="rounded-2xl bg-[#0d0d0d] p-[1.5rem] lg:p-[2rem] flex items-center justify-center min-h-[22rem]">
      <div className="w-full max-w-[400px]">
        <FaceMeshScanner imageUrl={visageDiagnostic} />
      </div>
    </div>
  );
}

/* Les deux écrans de la Cure 90 jours montrés sur /cosmetique : le programme,
   puis le programme nutrition. */
function CarteCure() {
  return (
    <div className="rounded-2xl bg-background p-[1rem] lg:p-[1.25rem] grid grid-cols-5 gap-3 items-center">
      <img src="/innovation/cure-programme-90-jours.webp" width={900} height={1176} loading="lazy" decoding="async"
        alt="L’espace de la cliente : programme de 90 jours, score capillaire et recettes de la semaine"
        className="col-span-2 w-full h-auto rounded-[10px]" />
      <img src="/innovation/cure-programme-nutrition.webp" width={1200} height={1107} loading="lazy" decoding="async"
        alt="Le programme nutrition : recettes choisies pour leur apport, coach IA qui adapte le plan"
        className="col-span-3 w-full h-auto rounded-[10px]" />
    </div>
  );
}

/* ─── 2. Le réseau de magazines : captures entières, 3:4 ─── */
const MAGAZINES = [
  { src: "/bio-presse/mag-brume-accueil.webp", nom: "Brume", rubrique: "Actu beauté et tendances" },
  { src: "/bio-presse/mag-ecrin-accueil.webp", nom: "Écrin", rubrique: "L’éditorial beauté" },
  { src: "/bio-presse/mag-elunesse-neurosciences.webp", nom: "Élunesse", rubrique: "Science et beauté" },
  { src: "/bio-presse/mag-brume-cheveux.webp", nom: "Brume", rubrique: "La rubrique cheveux" },
  { src: "/bio-presse/mag-ecrin-green.webp", nom: "Écrin", rubrique: "La rubrique green" },
  { src: "/bio-presse/mag-elunesse-cheveux.webp", nom: "Élunesse", rubrique: "La rubrique cheveux" },
];

function CarrouselMagazines() {
  const piste = useRef<HTMLDivElement>(null);
  const [actif, setActif] = useState(0);
  const [nbVisibles, setNbVisibles] = useState(3);

  const mesurer = useCallback(() => {
    const el = piste.current;
    const carte = el?.firstElementChild as HTMLElement | null;
    if (!el || !carte) return;
    const pas = carte.offsetWidth + 16;
    setNbVisibles(Math.max(1, Math.round(el.clientWidth / pas)));
    setActif(Math.round(el.scrollLeft / pas));
  }, []);

  useEffect(() => {
    mesurer();
    window.addEventListener("resize", mesurer);
    return () => window.removeEventListener("resize", mesurer);
  }, [mesurer]);

  const aller = (i: number) => {
    const el = piste.current;
    const carte = el?.firstElementChild as HTMLElement | null;
    if (!el || !carte) return;
    el.scrollTo({ left: i * (carte.offsetWidth + 16), behavior: "smooth" });
  };
  const dernier = Math.max(0, MAGAZINES.length - nbVisibles);

  return (
    <div>
      <div ref={piste} onScroll={mesurer}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {MAGAZINES.map((m) => (
          <figure key={m.src} className="snap-start shrink-0 w-[78%] sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)] m-0">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-secondary border border-border">
              <img src={m.src} width={720} height={960} loading="lazy" decoding="async"
                alt={`Le magazine ${m.nom}, ${m.rubrique.toLowerCase()}`} className="w-full h-full object-cover object-top" />
            </div>
            <figcaption className="pt-3 px-1">
              <p className="text-[1.0625rem] !font-semibold text-foreground leading-snug"
                style={{ fontFamily: "'Bricolage Grotesque', 'Inter', sans-serif" }}>{m.nom}</p>
              <p className="text-[0.875rem] text-muted-foreground">{m.rubrique}</p>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-center gap-4">
        <button type="button" aria-label="Magazine précédent" onClick={() => aller(Math.max(0, actif - 1))} disabled={actif <= 0}
          className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center disabled:opacity-30 transition-opacity">
          <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <div className="flex gap-2" aria-hidden="true">
          {Array.from({ length: dernier + 1 }, (_, i) => (
            <span key={i} className={"h-2 rounded-full transition-all " + (i === Math.min(actif, dernier) ? "w-6 bg-foreground" : "w-2 bg-foreground/25")} />
          ))}
        </div>
        <button type="button" aria-label="Magazine suivant" onClick={() => aller(Math.min(dernier, actif + 1))} disabled={actif >= dernier}
          className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center disabled:opacity-30 transition-opacity">
          <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

/* ─── 3. Le stand connecté : la vidéo de /cosmetique, allégée (540 px, muette) ─── */
/* Le QR code posé sur la vidéo comme une carte de table (JP, 14/10/2026) :
   un vrai QR code, généré une fois (paquet qrcode, public/innovation/
   qr-evenements.svg), qui mène à cette partie de la page. La vidéo n’est
   pas retouchée. */
function CarteEvenement() {
  return (
    <div className="rounded-2xl overflow-hidden bg-[#0d0d0d] aspect-[4/5] relative">
      <div className="absolute inset-0">
        <SafeVideo src="/innovation/evenement.mp4" poster="/innovation/evenement-affiche.webp" className="w-full h-full object-cover" lazy />
      </div>
      <a href="#evenements" className="absolute left-4 bottom-4 lg:left-6 lg:bottom-6 flex items-center gap-3 rounded-2xl bg-background p-3 pr-4 shadow-[0_8px_30px_rgba(0,0,0,0.25)] max-w-[calc(100%-2rem)]">
        <img src="/innovation/qr-evenements.svg" width={96} height={96} alt="QR code vers la page des stands connectés de Biolystes"
          className="w-[5.5rem] h-[5.5rem] lg:w-24 lg:h-24 shrink-0 [image-rendering:pixelated]" />
        <span className="text-[0.875rem] leading-snug text-foreground !font-medium" style={{ fontFamily: "'Bricolage Grotesque', 'Inter', sans-serif" }}>
          Scannez, et découvrez<br />nos stands connectés
        </span>
      </a>
    </div>
  );
}

/* ─── 4. Le QR code en rayon : les deux visuels de /cosmetique, en fondu ─── */
const RAYON = [
  { src: "/innovation/distribution-slide-2.webp", alt: "Une cliente scanne le QR code d’un flacon en rayon : le produit lui répond sur son téléphone" },
  { src: "/innovation/distribution-slide-3.webp", alt: "Des flacons et un tube portant leur QR code" },
];

function CarteRayon() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % RAYON.length), 3500);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="rounded-2xl overflow-hidden bg-secondary aspect-[4/5] relative">
      {RAYON.map((r, n) => (
        <img key={r.src} src={r.src} alt={r.alt} width={800} height={1000} loading="lazy" decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: n === i ? 1 : 0 }} />
      ))}
    </div>
  );
}

export default function InnovationPage() {
  return (
    <>
      <SEO
        title="Innovation | Biolystes"
        description="Diagnostic IA et Cure 90 jours, réseau de magazines, stands connectés, QR codes en boutique et en institut : les outils IA de votre marque cosmétique."
        path="/innovation"
      />

      {/* ═══ HAUT DE PAGE ═══ */}
      <section className="bg-background pt-12 md:pt-20 pb-10 md:pb-12 px-[1.25rem] md:px-[1.5rem]">
        <Entete niveau={1} surtitre="Innovation"
          noir="Toujours plus d’innovation," gris={"pour votre e\u2011commerce, votre boutique ou institut, ou vos événements."}
          aLaLigne={false}
          texte={colle("Des agents IA formés sur vos produits accompagnent vos clientes avant, pendant et après l’achat : en ligne, en rayon et sur vos stands.")} />
        <nav aria-label="Parties de la page" className="max-w-3xl mx-auto mt-8 md:mt-10 flex flex-wrap justify-center gap-2.5">
          {PARTIES.map((p) => (
            <a key={p.id} href={`#${p.id}`}
              className="rounded-full border border-border bg-background px-4 py-2 text-[0.875rem] text-foreground hover:bg-secondary transition-colors">
              {p.titre}
            </a>
          ))}
        </nav>
      </section>

      {/* ═══ 1. SUIVI DE SOINS SUR MESURE ═══ */}
      <Bande gris id="suivi-de-soins">
        <div className="max-w-6xl mx-auto px-[1.25rem] md:px-[1.5rem] space-y-4 lg:space-y-6">
          <Entete className="mb-8 md:mb-10" surtitre="Suivi de soins sur mesure"
            noir="Un diagnostic IA," gris={"puis un suivi de 90 jours."}
            texte={colle("Votre cliente sait enfin ce dont sa peau ou ses cheveux ont besoin, et vos produits l’accompagnent après l’achat.")} />
          <Rangee carteBlanche visuel={<CarteMaillage />} icone={ScanFace}
            titre="Le diagnostic IA, peau et cheveux"
            texte="Une photo suffit, sans questionnaire. L’IA repère les signes visibles : imperfections, déshydratation, sensibilité, casse ou rougeurs. Elle en tire un bilan et une routine sur mesure, avec vos produits."
            points={[
              "Chaque cliente, un profil mesuré : hydratation, densité, porosité, critère par critère.",
              "Les zones à surveiller, repérées zone par zone.",
              "L’IA apprend de chaque bilan et vous remonte les besoins qui reviennent chez vos clientes.",
            ]} />
          <Rangee carteBlanche visuel={<CarteCure />} icone={CalendarCheck}
            titre="La Cure 90 jours, après l’achat"
            texte="Un plan de suivi après l’achat, prolongé par un programme nutrition. Chaque recette est choisie pour son apport ciblé, fer, oméga-3, biotine ou zinc, en cohérence avec le programme de votre cliente."
            points={[
              "Un coach IA adapte le plan à ses allergies, ses préférences et ses contraintes.",
              "Son diagnostic est suivi semaine après semaine, dans son espace.",
              "Vos produits la conseillent à domicile, pour la fidéliser.",
            ]} />
        </div>
      </Bande>

      {/* ═══ 2. VOTRE MAGAZINE ═══ */}
      <Bande id="magazine">
        <div className="max-w-6xl mx-auto px-[1.25rem] md:px-[1.5rem]">
          <Entete className="mb-8 md:mb-10" surtitre="Votre magazine"
            noir="Vos produits racontés" gris={"dans un réseau de magazines."}
            texte={colle("Brume, Écrin et Élunesse, nos magazines partenaires, ont chacun leur ligne éditoriale. Qui tape le nom de votre marque sur Google trouve de vrais articles.")} />
          <CarrouselMagazines />
        </div>
      </Bande>

      {/* ═══ 3. VOS ÉVÉNEMENTS ═══ */}
      <Bande gris id="evenements">
        <div className="max-w-6xl mx-auto px-[1.25rem] md:px-[1.5rem]">
          <Entete className="mb-8 md:mb-10" surtitre="Vos événements"
            noir="Des stands connectés" gris={"à des agents IA sur mesure."}
            texte={colle("Activations live, stands connectés, expériences immersives : vos agents IA prolongent l’événement bien au-delà de la soirée.")} />
          <Rangee carteBlanche visuel={<CarteEvenement />} icone={Ticket}
            titre="Chaque visiteuse devient un contact qualifié"
            texte="Chaque invitée repart avec un assistant qui se souvient d’elle : ses préférences, son diagnostic, ses essais. Vous capitalisez sur l’émotion du moment pour nourrir la relation longtemps après."
            points={[
              "Les préférences, diagnostics et essais de chaque invitée, captés à chaud, au moment où son intérêt est au plus haut.",
              "Des contacts vraiment qualifiés pour vos campagnes d’après l’événement, pas une simple liste d’e-mails.",
              "L’échange continue après la soirée, avec l’assistant reçu sur place.",
            ]} />
        </div>
      </Bande>

      {/* ═══ 4. VOS POINTS DE VENTE ═══ */}
      <Bande id="points-de-vente">
        <div className="max-w-6xl mx-auto px-[1.25rem] md:px-[1.5rem]">
          <Entete className="mb-8 md:mb-10" surtitre="Vos points de vente"
            noir="En boutique ou en institut," gris={"vos produits prennent la parole."}
            texte={colle("Chaque référence devient un agent IA qui explique ses bénéfices, oriente le choix et accompagne l’utilisation après l’achat.")} />
          <Rangee carteBlanche={false} visuel={<CarteRayon />} icone={QrCode}
            titre="Un QR code sur le packaging"
            texte="Votre cliente scanne le flacon, et le produit répond à ses questions comme le ferait votre meilleure conseillère, sans mobiliser votre équipe."
            points={[
              "En rayon comme à domicile : le même produit répond avant et après l’achat.",
              "Vos équipes se concentrent sur la vente et le soin.",
              "Vous voyez ce qui motive ou freine vos clientes, puis comment elles utilisent vos produits, de quoi affiner vos fiches et vos prochaines gammes.",
            ]} />
        </div>
      </Bande>

      {/* ═══ PASSEZ À L’ACTION ═══ */}
      <Bande gris>
        <div className="max-w-[48rem] mx-auto px-[1.25rem] md:px-[1.5rem]">
          <Entete surtitre="Passez à l’action" noir="Parlons de votre projet" gris={"en rendez-vous."}
            texte="Nous vous présentons ces outils et ce qu’ils feraient pour votre marque." />
          <BoutonsAction className="mt-8" />
        </div>
      </Bande>
    </>
  );
}
