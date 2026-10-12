import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Slider } from "@lystes/components/ui/slider";
import { computeAgentCounts } from "@lystes/hooks/useAgentCounts";
import Organigramme from "@lystes/components/team/Organigramme";
import { CadreReproduit } from "./CadreReproduit";
import { MARQUE_DEMO, PRODUITS_DEMO } from "./demoLystes";
import { Encart, type Agent, type Pied, type Pointe, type TailleCadre } from "../VisionEtages";

/**
 * Étage 5, « Vos équipes » (12/10/2026, JP) : deux écrans.
 *   - Organigramme IA : l'organigramme de l'accueil (Hierarchy.tsx), son
 *     compteur « produits / agents dédiés », son curseur de 10 à 1000
 *     produits, puis Organigramme en variante `landing` : le manager
 *     général, les directeurs Eva, Raphaël, Lucas et Maya, leurs managers et
 *     leurs équipes. Rendu dans un cadre de même origine (CadreReproduit)
 *     pour garder ses règles d'ordinateur, puis réduit à la largeur du cadre.
 *   - Brand AI : la carte vivante du cerveau (public/cerveau-carte, le moteur
 *     de CerveauConstellation), nourrie de la marque de démonstration
 *     Lystes & Partners, jamais d'une marque cliente.
 *
 * Même présentation que le back-office : la vue en haut, l'encart dessous
 * sur ordinateur ; au téléphone, l'encart vient sous le visuel
 * (VisionEtages).
 */

type EcranEquipes = "organigramme" | "cerveau";

const POSTES: { agent: Agent; ecran: EcranEquipes }[] = [
  {
    agent: {
      nom: "Organigramme IA",
      mission: "vos équipes d’agents, produit par produit",
      role: "Composer vos équipes d’agents selon la taille de votre catalogue, d’un manager général à quatre directions, puis à leurs managers et leurs équipes.",
      unique: "Chaque produit ajouté reçoit ses agents dédiés, rangés au bon endroit. Vous voyez qui fait quoi, et à qui chaque agent rend compte.",
    },
    ecran: "organigramme",
  },
  {
    agent: {
      nom: "Brand AI",
      mission: "le cerveau commun de votre marque",
      role: "Réunir ce que votre marque sait, catalogue, échanges, essais, ventes, clients et réputation, pour que tous vos agents lisent la même source.",
      unique: "Sa carte vivante montre ce que vos agents savent et ce qui leur manque. Vous expliquez votre marque une fois, et chaque équipe en parle de la même façon.",
    },
    ecran: "cerveau",
  },
];

export const AGENTS_EQUIPES: Agent[] = POSTES.map((p) => p.agent);

/* ---------- Organigramme IA ---------- */

/* La largeur de l'écran rendu : au-dessus de 768 px, l'organigramme prend sa
   mise en page d'ordinateur (trois équipes côte à côte). Au téléphone, sa
   mise en page de téléphone, comme sur l'accueil. */
const ECRAN_ORGA_ORDI = 768;
const ECRAN_ORGA_TEL = 390;
/* Le produit de départ de l'accueil (Hierarchy.tsx) ; le curseur y monte
   depuis 10 à l'ouverture de l'étape. */
const PRODUITS_ACCUEIL = 180;

function VueOrganigramme({ animer }: { animer: boolean }) {
  const [produits, setProduits] = useState(animer ? 10 : PRODUITS_ACCUEIL);
  const touche = useRef(false);
  useEffect(() => {
    if (!animer) return;
    const debut = performance.now();
    let raf = 0;
    const pas = (t: number) => {
      if (touche.current) return;
      const k = Math.min(1, (t - debut) / 1400);
      const e = 1 - Math.pow(1 - k, 3);
      setProduits(Math.round(10 + (PRODUITS_ACCUEIL - 10) * e));
      if (k < 1) raf = requestAnimationFrame(pas);
    };
    raf = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(raf);
  }, [animer]);
  /* Les mêmes réglages que l'accueil : 140 créateurs UGC, diagnostic actif. */
  const counts = computeAgentCounts(produits, 140, true);
  return (
    <div className="lyv-q-orga" data-lyv-q-orga="">
      <h3 className="text-[28px] font-thin tracking-tight mb-4 leading-[1.1] text-center" data-lyv-q-compteur="">
        <span className="font-['Inter'] italic whitespace-nowrap">{produits} produits</span>{" "}
        <span className="font-['Inter'] italic text-muted-foreground whitespace-nowrap">{counts.grandTotal} agents dédiés</span>
      </h3>
      <div className="w-full max-w-[400px] mx-auto mt-8 mb-8">
        <div className="flex items-center justify-between text-[12px] text-muted-foreground mb-2">
          <span>10 produits</span>
          <span>1000 produits</span>
        </div>
        <Slider
          value={[produits]}
          onValueChange={(v) => { touche.current = true; setProduits(v[0]); }}
          min={10}
          max={1000}
          step={1}
          className="w-full"
          aria-label="Nombre de produits"
        />
      </div>
      <Organigramme variant="landing" fixedProductCount={produits} />
    </div>
  );
}

const CSS_ORGA = `
html,body{ margin:0; background:#fff; overflow:hidden !important; }
/* Les quatre directeurs sur une seule rangée, comme sur l'accueil. */
.lyv-q-orga .flex-wrap{ flex-wrap:nowrap; }
.lyv-q-orga{ display:flow-root; padding:28px 12px 12px; font-family:'Inter','Satoshi',-apple-system,BlinkMacSystemFont,sans-serif;
  color:hsl(var(--foreground)); background:#fff; -webkit-font-smoothing:antialiased; }
`;

/* ---------- Brand AI : la carte du cerveau ---------- */

type Feuille = { name: string; desc: string; skills: string[]; tools: string[]; level: "autonomous" | "assisted" | "plan"; icone?: string };
type Fonction = { name: string; jobs: Feuille[] };

const ICONES = ["box", "layers", "tag", "file", "clipboard", "list", "database", "shield", "key", "route", "magnet", "percent"];
const feuilles = (noms: string[], niveaux: Feuille["level"][] = [], desc = ""): Feuille[] =>
  noms.map((name, i) => ({ name, desc, skills: [], tools: [], level: niveaux[i] ?? "autonomous", icone: ICONES[i % ICONES.length] }));
const fonction = (name: string, jobs: Feuille[]): Fonction => ({ name, jobs });

/* Le savoir de la marque de démonstration. Aucun chiffre : seulement ce que
   les agents savent (point plein), ce qui reste à confirmer (cerclé) et ce
   que personne n'a encore donné à lire (en creux). */
function chargeCerveau() {
  const corps = PRODUITS_DEMO.filter((p) => !/visage|AHA|Coffret/.test(p.nom)).map((p) => p.nom);
  const visage = PRODUITS_DEMO.filter((p) => /visage|AHA/.test(p.nom)).map((p) => p.nom);
  const coffrets = PRODUITS_DEMO.filter((p) => /Coffret/.test(p.nom)).map((p) => p.nom);
  const arbre = [
    { name: "Catalogue", sub: "produits · contenus · savoir de marque", color: "#8B5CF6", intro: "Ce que vos agents savent de vos produits.",
      functions: [
        fonction("Soins du corps", feuilles(corps)),
        fonction("Soins du visage", feuilles(visage)),
        fonction("Coffrets", feuilles(coffrets)),
        fonction("Savoir de marque", feuilles(["Histoire de la marque", "Ton de voix", "Engagements", "Ingrédients phares", "Charte graphique"], ["autonomous", "autonomous", "assisted", "autonomous", "plan"])),
      ] },
    { name: "Équipes", sub: "agents · experts · coachs", color: "#3B82F6", intro: "Les agents qui lisent ce savoir.",
      functions: [
        fonction("Conversion", feuilles(["Expert produit", "Diagnostiqueur", "Agent FAQ", "Responsable avis"])),
        fonction("Créatif", feuilles(["Photographe", "Créateur UGC", "Graphiste"], ["autonomous", "autonomous", "assisted"])),
        fonction("Marketing", feuilles(["Community manager", "Expert GEO", "Rédacteur SEO"])),
        fonction("Analytics", feuilles(["Data analyst", "Plan d’action", "Copilote"])),
      ] },
    { name: "Échanges", sub: "conversations · sujets · leçons", color: "#F59E0B", intro: "Ce que disent vos clientes.",
      functions: [
        fonction("Questions fréquentes", feuilles(["Peau sensible", "Odeur", "Fréquence d’usage", "Grossesse"], ["autonomous", "autonomous", "autonomous", "assisted"])),
        fonction("Objections", feuilles(["Prix", "Texture", "Délais de livraison"])),
        fonction("Leçons apprises", feuilles(["Réponses qui mènent à l’achat", "Questions sans réponse"], ["autonomous", "assisted"])),
      ] },
    { name: "Essais", sub: "diagnostics · essayages", color: "#10B981", intro: "Ce que révèlent les diagnostics.",
      functions: [
        fonction("Diagnostics de peau", feuilles(["Peau sèche", "Peau mixte", "Grain irrégulier"])),
        fonction("Essayages", feuilles(["Avant-après"], ["plan"])),
      ] },
    { name: "Ventes", sub: "commandes · paniers · retours", color: "#EF4444", intro: "Ce qui se vend, et ce qui bloque.",
      functions: [
        fonction("Commandes", feuilles(["Produits les plus vendus", "Panier moyen", "Saisonnalité"], ["autonomous", "autonomous", "assisted"])),
        fonction("Paniers abandonnés", feuilles(["Étape de sortie", "Relances"], ["autonomous", "assisted"])),
        fonction("Retours", feuilles(["Motifs de retour"], ["plan"])),
      ] },
    { name: "Clients", sub: "clientes · contacts · avatars", color: "#EC4899", intro: "À qui parlent vos agents.",
      functions: [
        fonction("Avatar client", feuilles(["Âge", "Carnation", "Préoccupations", "Style de vie"])),
        fonction("Provenance des visites", feuilles(["Instagram", "Newsletter", "ChatGPT", "Google"])),
      ] },
    { name: "Réputation", sub: "avis · visites · rendez-vous", color: "#14B8A6", intro: "Ce qu’on dit de votre marque.",
      functions: [
        fonction("Avis", feuilles(["Avis cinq étoiles", "Avis à traiter"], ["autonomous", "assisted"])),
        fonction("Presse", feuilles(["Articles en magazine"], ["plan"])),
        fonction("Rendez-vous", feuilles(["Expert-comptable"], ["assisted"])),
      ] },
  ];
  return {
    arbre,
    playbook: {},
    skillMeta: {},
    skillTexte: {},
    hub: `Brand AI · ${MARQUE_DEMO}`,
    hubEntry: {
      desc: "Le seul endroit où tous vos agents viennent lire. Ce qu’ils y trouvent, ils peuvent le dire à une cliente ; ce qui n’y est pas, ils l’ignorent.",
      components: arbre.map((f) => f.name),
      replaces: "Réexpliquer votre marque à chaque outil, chaque prestataire, chaque nouvelle recrue.",
      ladder: {
        manual: "Personne n’a encore nourri cette partie. Vos agents ne peuvent rien en dire.",
        assisted: "Vos agents font le gros du travail, quelqu’un valide avant que ça parte.",
        autonomous: "Vos agents s’en occupent seuls. Vous relisez de temps en temps et vous décidez de la direction.",
      },
      notes: "Marque de démonstration : les points de la carte sont des exemples.",
      human: "Tout le monde y écrit, une seule personne en répond.",
      files: [],
    },
    fondations: [],
    humain: {
      manual: "Personne n’a encore nourri cette partie. Vos agents ne peuvent rien en dire.",
      assisted: "Vos agents font le gros du travail, quelqu’un valide avant que ça parte.",
      autonomous: "Vos agents s’en occupent seuls. Vous relisez de temps en temps et vous décidez de la direction.",
    },
    /* Les libellés français de la carte (dashboard.cerveau.carte). */
    libelles: {
      agent: "agent", agents: "agents", agentCouvre: "sait en parler", agentsCouvrent: "savent en parler",
      agentsTitre: "LES AGENTS", agentsVoir: "Voir sa fiche", aideConstruire: "Besoin d’un coup de main ?",
      auGlance: "EN UN COUP D’ŒIL", autonome: "entièrement autonome", avantTout: "AVANT TOUT LE RESTE", besoins: "IL FAUT",
      branche: "RELIÉ À", ceQueCaCouvre: "CE QUE ÇA COUVRE", ceQuiVitDedans: "CE QU’IL Y A DEDANS", ceQuilRemplace: "CE QUE ÇA VOUS ÉVITE",
      chercher: "Chercher", commencerPar: "Commencez par", copier: "Copier le résumé", copierTexte: "Copier", couvre: "Ce qu’il couvre",
      enCours: "EN COURS", enLigne: "RENSEIGNÉ", ficheTag: "FICHE", jobs: "éléments", lEchelle: "LES TROIS ÉTAPES", lHumain: "VOTRE RÔLE",
      lesChiffres: "LES CHIFFRES", lesFonctions: "CE QU’ELLE CONTIENT", navigation: "NAVIGATION", niveauAssiste: "à confirmer",
      niveauAutonome: "vos agents savent", niveauManuel: "rien à lire", notes: "À SAVOIR", pasCommence: "Vide",
      placeholderNote: "Vos remarques sur cette partie du savoir.", reposeSur: "REPOSE SUR", retour: "TOUTES LES FAMILLES",
      seDecomposeEn: "SE DÉCOMPOSE EN", statutEnCours: "En cours", statutFait: "Renseigné", statutVide: "Vide", surTotal: "SUR",
      telecharger: "Télécharger", vosNotes: "VOS NOTES", votreCarte: "VOTRE CARTE", votreStatut: "OÙ VOUS EN ÊTES",
    },
  };
}

/* Le fragment d'adresse que lit le moteur : du JSON en UTF-8, en base 64
   (même encodage que CerveauConstellation). */
function adresseCerveau(): string {
  const octets = new TextEncoder().encode(JSON.stringify(chargeCerveau()));
  let binaire = "";
  for (let i = 0; i < octets.length; i += 8192) binaire += String.fromCharCode(...octets.subarray(i, i + 8192));
  return `/cerveau-carte/index.html#${btoa(binaire)}`;
}

/* ---------- La visite ---------- */

const ECART_ENCART = 14;
/* La carte du cerveau est rendue plus grande que le cadre, puis réduite :
   à la taille du cadre, le moteur zoomait si près que les noms des familles
   sortaient par les bords. */
const CARTE_ORDI = { w: 980, h: 760 };
const CARTE_TEL = { w: 780, h: 920 };
const HAUTEUR_VUE_ORDI = 520;

export default function VisiteEquipes({ etape, survol, mobile, pied, taille, prete }: {
  etape: number;
  survol: (s: boolean) => void;
  mobile: boolean;
  pied: Pied;
  taille: (t: TailleCadre) => void;
  prete?: (p: boolean) => void;
}) {
  const boite = useRef<HTMLDivElement>(null);
  const refEncart = useRef<HTMLDivElement>(null);
  const [largeur, setLargeur] = useState(0);
  const [hEncart, setHEncart] = useState(150);
  /* La hauteur de l'organigramme rendu, en pixels de l'écran. */
  const [hOrga, setHOrga] = useState(0);
  const [cerveauCharge, setCerveauCharge] = useState(false);
  const rang = Math.min(Math.max(etape, 0), POSTES.length - 1);
  const poste = POSTES[rang];
  const ecranOrga = mobile ? ECRAN_ORGA_TEL : ECRAN_ORGA_ORDI;
  const adresse = useMemo(adresseCerveau, []);
  const animer = useMemo(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  /* La vue : l'organigramme entier, réduit à la largeur du cadre ; la carte
     du cerveau, à sa taille. */
  const s = largeur ? Math.min(1.05, largeur / ecranOrga) : 0;
  const carte = mobile ? CARTE_TEL : CARTE_ORDI;
  const sCarte = largeur ? largeur / carte.w : 0.5;
  const hVue = poste.ecran === "organigramme"
    ? (hOrga ? Math.ceil(hOrga * s) : HAUTEUR_VUE_ORDI)
    : Math.round(carte.h * sCarte);
  const hauteurCadre = hVue + (mobile ? 0 : ECART_ENCART + hEncart);
  const pretVue = poste.ecran === "organigramme" ? hOrga > 0 : cerveauCharge;

  useLayoutEffect(() => {
    const b = boite.current;
    if (!b) return;
    const maj = () => {
      setLargeur(b.clientWidth);
      taille({ w: b.clientWidth, h: b.clientHeight });
    };
    maj();
    const ro = new ResizeObserver(maj);
    ro.observe(b);
    return () => ro.disconnect();
  }, [taille]);

  useLayoutEffect(() => {
    const el = refEncart.current;
    if (!el) return;
    const maj = () => setHEncart((h) => (Math.abs(h - el.offsetHeight) > 1 ? el.offsetHeight : h));
    maj();
    const ro = new ResizeObserver(maj);
    ro.observe(el);
    return () => ro.disconnect();
  });

  useEffect(() => {
    prete?.(pretVue);
  }, [pretVue, prete]);

  /* L'organigramme se mesure dans son cadre, à chaque changement (le curseur
     change le nombre d'agents, la rotation des équipes leur hauteur). */
  const cadreOrga = useRef<HTMLIFrameElement | null>(null);
  const [docOrga, setDocOrga] = useState<Document | null>(null);
  useEffect(() => {
    if (poste.ecran !== "organigramme" || !docOrga) return;
    let ro: ResizeObserver | null = null;
    let raf = 0;
    /* Le portail rend l'écran juste après : on attend sa racine. */
    const brancher = () => {
      const racine = docOrga.querySelector<HTMLElement>("[data-lyv-q-orga]");
      if (!racine) { raf = requestAnimationFrame(brancher); return; }
      /* scrollHeight : ce qui déborde de la racine compte aussi (le bas
         des équipes restait hors champ au téléphone). */
      const maj = () => setHOrga((h) => (Math.abs(h - racine.scrollHeight) > 1 ? racine.scrollHeight : h));
      maj();
      ro = new ResizeObserver(maj);
      ro.observe(racine);
      for (const enfant of racine.children) ro.observe(enfant);
    };
    brancher();
    return () => { cancelAnimationFrame(raf); ro?.disconnect(); };
  }, [docOrga, poste.ecran]);
  /* Retour à l'organigramme : son cadre est neuf, il se remesure. */
  useEffect(() => {
    if (poste.ecran !== "organigramme") { setDocOrga(null); setHOrga(0); }
  }, [poste.ecran]);

  /* Le point : sous la carte du manager général, au centre du cerveau. */
  const [pointOrga, setPointOrga] = useState<{ x: number; y: number } | null>(null);
  useEffect(() => {
    if (poste.ecran !== "organigramme" || !docOrga || !s) return;
    let raf = 0;
    const suivre = () => {
      const chef = docOrga.querySelector<HTMLElement>("[data-lyv-q-orga] .bg-foreground.rounded-xl");
      if (chef) {
        const r = chef.getBoundingClientRect();
        const n = { x: Math.round((r.left + r.width / 2) * s), y: Math.round(r.bottom * s) };
        setPointOrga((o) => (o && o.x === n.x && o.y === n.y ? o : n));
      }
      raf = requestAnimationFrame(suivre);
    };
    raf = requestAnimationFrame(suivre);
    return () => cancelAnimationFrame(raf);
  }, [docOrga, poste.ecran, s]);
  const point = poste.ecran === "organigramme"
    ? pointOrga ?? { x: largeur / 2, y: 0 }
    : { x: largeur / 2, y: Math.round(hVue / 2) };
  const pointe: Pointe | null = { cote: "haut", decalage: Math.max(14, Math.min(largeur - 14, point.x)) };

  return (
    <div
      className={"lyv-boutique lyv-q-visite" + (mobile ? " tel" : "")}
      ref={boite}
      style={{ height: hauteurCadre }}
      onPointerEnter={(ev) => { if (ev.pointerType === "mouse") survol(true); }}
      onPointerLeave={() => survol(false)}
    >
      <style>{CSS_BOITE}</style>
      <div className="lyv-q-vue" style={{ height: hVue }}>
        {poste.ecran === "organigramme" ? (
          <CadreReproduit
            key="orga"
            className="lyv-q-cadre"
            title="L’organigramme de vos équipes IA"
            tabIndex={-1}
            style={{ width: ecranOrga, height: hOrga || 1600, transform: `scale(${s || 0.5})` }}
            refCadre={(n) => { cadreOrga.current = n; }}
            pret={() => setDocOrga(cadreOrga.current?.contentDocument ?? null)}
            styleEnPlus={CSS_ORGA}
            rendu={() => <VueOrganigramme animer={animer} />}
          />
        ) : (
          <iframe
            key="cerveau"
            className="lyv-q-carte"
            src={adresse}
            title={`Brand AI, le cerveau de ${MARQUE_DEMO}`}
            style={{ width: carte.w, height: carte.h, transform: `scale(${sCarte})` }}
            onLoad={() => setCerveauCharge(true)}
            allow="fullscreen"
          />
        )}
      </div>
      {pretVue && <span className="lyv-pouls" style={{ left: point.x, top: point.y }} aria-hidden="true" />}
      {!mobile && (
        <div
          ref={refEncart}
          className="lyv-encart-pose lyv-q-encart"
          style={{ left: 0, top: hVue + ECART_ENCART, width: largeur }}
        >
          <Encart agent={poste.agent} loupe={null} pointe={pointe} pied={pied} survol={survol} />
        </div>
      )}
    </div>
  );
}

const CSS_BOITE = `
.lyv-boutique.lyv-q-visite{ aspect-ratio:auto; overflow:visible; background:transparent; border-radius:0; transition:height .35s ease; }
.lyv-q-vue{ position:absolute; left:0; top:0; width:100%; overflow:hidden; border-radius:12px; background:#fff; transition:height .35s ease; }
.lyv-q-cadre{ position:absolute; left:0; top:0; border:0; display:block; transform-origin:0 0; background:#fff; }
.lyv-q-carte{ position:absolute; left:0; top:0; border:0; display:block; transform-origin:0 0; background:#0E1118; }
.lyv-q-visite .lyv-encart-pose .lyv-encart-texte{ padding-top:1px; }
.lyv-q-visite.tel .lyv-q-vue{ border-radius:10px; }
@media (prefers-reduced-motion:reduce){ .lyv-q-vue, .lyv-boutique.lyv-q-visite{ transition:none; } }
`;
export { MARQUE_DEMO as MARQUE_EQUIPES } from "./demoLystes";
