/* /entreprise (20/11/2026) : structure de nightjar.co/studio, contenu réécrit
   pour Biolystes, photos originales (pas celles de Nightjar). */
import studio from "@/assets/entreprise/studio-biolystes.jpg.asset.json";
import equipe from "@/assets/entreprise/equipe-biolystes.jpg.asset.json";
import soin from "@/assets/entreprise/soin-biolystes.jpg.asset.json";
import { Bande, BoutonRdv, Texte } from "./pied/elements";

const serif = { fontFamily: "'Instrument Serif', serif" };
const VALEURS = [
  { t: "Oser le « et si ? »", d: "Chaque marque commence par une intuition. Nous la prenons au sérieux, et nous cherchons avec vous la formule, le flacon et le nom qui lui donneront corps." },
  { t: "Cultiver la différence", d: "Peaux, budgets, univers : aucune cliente ne se ressemble. C’est cette diversité qui nourrit nos idées et rend chaque marque unique." },
  { t: "Viser plus haut", d: "Formules d’origine naturelle, conformité au règlement CE 1223/2009, contrôle à chaque lot : l’exigence n’est pas notre objectif, c’est notre point de départ." },
];

function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <div className="max-w-3xl mx-auto px-5 space-y-5">
      <h2 className="text-[2rem] md:text-[2.75rem] leading-tight text-foreground" style={serif}>{titre}</h2>
      {children}
    </div>
  );
}

export default function EntreprisePage() {
  return (
    <main>
      <Bande>
        <div className="max-w-5xl mx-auto px-5 text-center space-y-8">
          <p className="text-xs tracking-[0.3em] uppercase text-foreground">Entreprise</p>
          <h1 className="text-[3.5rem] md:text-[6rem] leading-none text-foreground" style={serif}>Le studio</h1>
          <img src={studio.url} alt="L’atelier Biolystes" className="w-full rounded-[2rem] object-cover aspect-[16/9]" />
        </div>
      </Bande>

      <Bande>
        <Section titre="Plus qu’une marque blanche.">
          <Texte>Nous fabriquons des cosmétiques, mais un mot nous gêne un peu : « produit ». Derrière chaque flacon, il y a une personne qui se lance, avec une idée et beaucoup d’envie.</Texte>
          <Texte>Dans la course au plus vite, au moins cher, on oublie souvent l’essentiel : la proximité. Notre rôle n’est pas seulement de livrer des soins, c’est de vous accompagner jusqu’à ce que votre marque vous ressemble vraiment.</Texte>
        </Section>
      </Bande>

      <Bande gris>
        <div className="max-w-5xl mx-auto px-5 space-y-10">
          <h2 className="text-center text-[2rem] md:text-[2.75rem] text-foreground" style={serif}>Nos valeurs font le studio</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {VALEURS.map((v) => (
              <div key={v.t} className="rounded-[2rem] bg-background space-y-3" style={{ padding: 28 }}>
                <h3 className="text-xl text-foreground" style={serif}>{v.t}</h3>
                <Texte>{v.d}</Texte>
              </div>
            ))}
          </div>
        </div>
      </Bande>

      <Bande>
        <div className="max-w-5xl mx-auto px-5 grid md:grid-cols-2 gap-10 items-center">
          <img src={equipe.url} alt="L’équipe Biolystes à l’atelier" className="w-full rounded-[2rem] object-cover aspect-[4/5]" />
          <div className="space-y-5">
            <h2 className="text-[2rem] md:text-[2.75rem] leading-tight text-foreground" style={serif}>Une équipe soudée</h2>
            <Texte>Prendre soin de nos équipes et de nos clientes, c’est ce qui rend le reste possible. On retrousse nos manches sur les sujets difficiles, et personne ne reste sur le côté.</Texte>
            <Texte>Échantillons partagés, essais de textures, fous rires d’atelier : pour créer les meilleures marques, il faut les meilleures personnes, au meilleur d’elles-mêmes.</Texte>
          </div>
        </div>
      </Bande>

      <Bande gris>
        <div className="max-w-5xl mx-auto px-5 grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-5 md:order-1 order-2">
            <h2 className="text-[2rem] md:text-[2.75rem] leading-tight text-foreground" style={serif}>Aimer, pas seulement apprécier</h2>
            <Texte>Un bon soin, ça se ressent. Formules, packaging et image sont notre socle, mais ce qui nous anime, c’est le lien que votre marque créera avec ses clientes.</Texte>
            <Texte>Nous ne nous arrêtons pas au cahier des charges : nous cherchons ce qui fera qu’on adopte votre crème, qu’on la recommande, qu’on y revienne.</Texte>
          </div>
          <img src={soin.url} alt="Une goutte de sérum appliquée sur la main" className="w-full rounded-[2rem] object-cover aspect-[4/5] md:order-2 order-1" />
        </div>
      </Bande>

      <Bande>
        <div className="max-w-3xl mx-auto px-5 text-center space-y-4">
          <h2 className="text-[2rem] md:text-[2.75rem] text-foreground" style={serif}>Optimisme</h2>
          <Texte>Avancer vaut mieux qu’attendre la perfection. Agir vaut mieux que s’agiter.</Texte>
          <p className="text-2xl text-foreground" style={serif}>Le bon moment, c’est maintenant.</p>
          <BoutonRdv className="pt-4" />
        </div>
      </Bande>
    </main>
  );
}
