/* /entreprise (20/11/2026) : reproduction de la mise en page de nightjar.co/studio
   (grand titre, colonnes de texte étroites, collage de photos superposées, citations
   manuscrites), contenu adapté à Biolystes. Photos originales : celles de Nightjar
   montrent leur équipe et leurs locaux, elles ne sont pas reprises.
   Les positions sont exprimées sur une maquette de 1280 × H px puis converties en %. */
import { ReactNode } from "react";
import bureau from "@/assets/entreprise/studio-bureau.jpg.asset.json";
import atelier from "@/assets/entreprise/studio-atelier.jpg.asset.json";
import dejeuner from "@/assets/entreprise/studio-dejeuner.jpg.asset.json";
import ecran from "@/assets/entreprise/studio-ecran.jpg.asset.json";
import portrait from "@/assets/entreprise/studio-portrait.jpg.asset.json";
import chien from "@/assets/entreprise/studio-chien.jpg.asset.json";
import reunion from "@/assets/entreprise/studio-reunion.jpg.asset.json";
import equipe2 from "@/assets/entreprise/studio-equipe2.jpg.asset.json";
import labo from "@/assets/entreprise/studio-labo.jpg.asset.json";
import rue from "@/assets/entreprise/studio-rue.jpg.asset.json";
import sourire from "@/assets/entreprise/studio-sourire.jpg.asset.json";
import salle from "@/assets/entreprise/studio-salle.jpg.asset.json";
import studio from "@/assets/entreprise/studio-biolystes.jpg.asset.json";
import soin from "@/assets/entreprise/soin-biolystes.jpg.asset.json";
import equipe from "@/assets/entreprise/equipe-biolystes.jpg.asset.json";

const W = 1280;
const H = 5450;
const pos = (x: number, y: number, w?: number, h?: number) => ({
  left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%`,
  ...(w ? { width: `${(w / W) * 100}%` } : {}),
  ...(h ? { height: `${(h / H) * 100}%` } : {}),
});

type P = { src: string; x: number; y: number; w: number; h: number; nb?: boolean; z?: number; alt: string };
const PHOTOS: P[] = [
  { src: bureau.url, x: 622, y: 250, w: 277, h: 416, alt: "Le bureau Biolystes" },
  { src: atelier.url, x: 442, y: 930, w: 328, h: 216, z: 2, alt: "Un moodboard de marque" },
  { src: dejeuner.url, x: 376, y: 1066, w: 328, h: 216, z: 1, alt: "Pause déjeuner" },
  { src: ecran.url, x: 1024, y: 942, w: 230, h: 340, z: 2, alt: "Création d’un packaging" },
  { src: labo.url, x: 934, y: 1066, w: 120, h: 220, nb: true, z: 1, alt: "Au laboratoire" },
  { src: portrait.url, x: 508, y: 1982, w: 164, h: 214, nb: true, z: 2, alt: "Portrait" },
  { src: chien.url, x: 672, y: 2010, w: 230, h: 286, z: 1, alt: "La mascotte de l’atelier" },
  { src: soin.url, x: 384, y: 2172, w: 230, h: 308, nb: true, alt: "Un soin appliqué sur la main" },
  { src: reunion.url, x: 894, y: 2112, w: 384, h: 240, nb: true, alt: "Réunion d’équipe" },
  { src: studio.url, x: 1068, y: 2342, w: 212, h: 160, nb: true, z: 2, alt: "L’atelier" },
  { src: equipe.url, x: 0, y: 3340, w: 260, h: 150, nb: true, alt: "L’équipe" },
  { src: equipe2.url, x: 730, y: 3290, w: 496, h: 200, nb: true, alt: "Afterwork" },
  { src: rue.url, x: 36, y: 3546, w: 272, h: 334, nb: true, alt: "Dans les rues de Paris" },
  { src: sourire.url, x: 928, y: 3442, w: 346, h: 200, nb: true, alt: "Sourire" },
  { src: salle.url, x: 796, y: 4570, w: 344, h: 520, z: 2, alt: "Le studio en fin de journée" },
  { src: atelier.url, x: 646, y: 4630, w: 150, h: 500, z: 1, alt: "L’atelier" },
];

const Main = ({ x, y, rot, children }: { x: number; y: number; rot: number; children: ReactNode }) => (
  <p className="absolute text-[17px] leading-tight text-foreground/70 whitespace-pre-line"
    style={{ ...pos(x, y), fontFamily: "'Caveat', 'Segoe Script', cursive", transform: `rotate(${rot}deg)` }}>
    {children}
  </p>
);
const Titre = ({ x, y, children }: { x: number; y: number; children: ReactNode }) => (
  <h2 className="absolute text-[24px] !font-normal text-foreground" style={{ ...pos(x, y), letterSpacing: "-0.01em" }}>{children}</h2>
);
const Bloc = ({ x, y, w = 300, children }: { x: number; y: number; w?: number; children: ReactNode }) => (
  <div className="absolute flex flex-col text-[14px] leading-[1.45] text-foreground" style={{ ...pos(x, y, w), gap: "1.2em" }}>{children}</div>
);
const Mono = ({ x, y, children }: { x: number; y: number; children: ReactNode }) => (
  <h5 className="absolute text-[10px] uppercase tracking-wide text-foreground" style={{ ...pos(x, y), fontFamily: "ui-monospace, monospace" }}>{children}</h5>
);

export default function EntreprisePage() {
  return (
    <main className="bg-secondary overflow-hidden">
      <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}`, fontFamily: "'Inter', sans-serif" }}>
        <h1 className="absolute text-[64px] !font-normal leading-none text-foreground" style={{ ...pos(16, 230), letterSpacing: "-0.02em" }}>Studio</h1>

        {PHOTOS.map((p, i) => (
          <img key={i} src={p.src} alt={p.alt} loading={i < 2 ? "eager" : "lazy"}
            className={"absolute object-cover" + (p.nb ? " grayscale" : "")}
            style={{ ...pos(p.x, p.y, p.w, p.h), zIndex: p.z ?? 0 }} />
        ))}

        <Titre x={120} y={420}>Plus qu’une marque blanche.</Titre>
        <Bloc x={120} y={490}>
          <p>Nous fabriquons des cosmétiques, mais un petit mot nous gêne un peu : « produit ».</p>
          <p>Dans la course au plus vite, au moins cher, on oublie facilement l’essentiel : la proximité.</p>
          <p>À son meilleur, une marque rapproche les gens. Elle fait ressentir, elle fait partager. C’est notre plus grande responsabilité de fabricant. Alors oui, on parle encore de « produits », mais derrière chaque flacon il y a une personne qui se lance, et nous l’accompagnons de tout cœur.</p>
        </Bloc>
        <Main x={1040} y={570} rot={-6}>{"« Une marque, c’est une idée\nqui prend vie. »\n— Odile"}</Main>

        <Titre x={120} y={1640}>Nos valeurs font le studio</Titre>
        <Mono x={120} y={1720}>Oser le « et si ? »</Mono>
        <Mono x={448} y={1720}>Cultiver la différence</Mono>
        <Mono x={774} y={1720}>Viser plus haut</Mono>
        <Bloc x={120} y={1760} w={240}><p>« Et si ? » : deux petits mots derrière chaque nouvelle marque. De l’intuition à la première commande, la curiosité nous guide.</p></Bloc>
        <Bloc x={448} y={1760} w={240}><p>Créer du lien, c’est notre métier, et il naît de la diversité des idées. Chaque peau, chaque univers est différent. Et c’est très bien ainsi.</p></Bloc>
        <Bloc x={774} y={1760} w={240}><p>Formules d’origine naturelle, conformité au règlement CE 1223/2009, contrôle de chaque lot : l’exigence n’est pas un objectif, c’est un point de départ.</p></Bloc>
        <Main x={440} y={2420} rot={-4}>{"« Ici, on teste tout\nsur nous d’abord. »\n— Myrlène"}</Main>

        <Titre x={1280 - 580} y={2780}>Une belle journée à l’atelier</Titre>
        <Bloc x={700} y={2850}>
          <p>Prendre soin de nos équipes et de nos clientes, c’est ce qui rend le reste possible. Savoir la chance qu’on a, et la cultiver.</p>
          <p>On avance ensemble. On retrousse nos manches sur les sujets difficiles, et personne ne reste sur le côté. Pour lancer les meilleures marques, il faut les meilleures personnes, au meilleur d’elles-mêmes.</p>
          <p>Échantillons partagés, essais de textures, fous rires et goûters d’atelier : on ne voudrait être nulle part ailleurs (sauf peut-être en vacances au soleil, mais c’est difficile à battre).</p>
        </Bloc>
        <Main x={520} y={3600} rot={-5}>{"« On ne lance pas une marque,\non lance une histoire ! »\n— Julianna"}</Main>

        <Titre x={120} y={4250}>Éclairer chaque détail</Titre>
        <Bloc x={120} y={4310} w={320}>
          <p>Il y a une différence entre apprécier et adorer. Un bon soin, ça se ressent. Formules, packaging et image sont notre socle, mais ce qui nous anime, c’est le lien que votre marque créera avec ses clientes.</p>
          <p>Chaque choix peut transformer la façon dont on vit votre marque. C’est pourquoi nous ne nous arrêtons pas au cahier des charges : nous cherchons ce qui fera qu’on adopte votre crème, qu’on la recommande et qu’on y revienne. Tout commence par le lien.</p>
        </Bloc>
        <Main x={1060} y={4300} rot={-6}>{"« Le détail fait\ntoute la différence. »\n— Marion"}</Main>

        <Titre x={120} y={4934}>Optimisme</Titre>
        <Bloc x={120} y={5000}>
          <p>Avancer vaut mieux qu’attendre la perfection.<br />Agir vaut mieux que s’agiter.<br />Le bon moment, c’est maintenant. Lançons votre marque.</p>
        </Bloc>
      </div>
    </main>
  );
}
