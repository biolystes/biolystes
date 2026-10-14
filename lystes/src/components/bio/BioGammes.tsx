import { motion } from "framer-motion";
import { Droplet, Hourglass, Wind, Bath, Sun, Paintbrush, User, Gift } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Les gammes du catalogue, sur /bio (12/10/2026).
 *
 * Source : la moisson du catalogue du laboratoire du 10/10/2026
 * (~/lystes-agents/catalogue-labo/catalogue-dernier.json, compétence
 * catalogue-labo). Chaque nom ci-dessous est le titre d’une fiche active ;
 * les trois solaires, publiés en anglais, sont traduits mot à mot. Les
 * produits dont le titre promet d’éclaircir la peau sont écartés (ligne
 * rouge légale de Biolystes). Aucun prix ni volume : ils changent.
 */
type Gamme = { icone: LucideIcon; titre: string; produits: string[] };

export const GAMMES: Gamme[] = [
  { icone: Droplet, titre: "Soins du visage", produits: ["Crème de jour hydratante", "Concentré Peeling AHA", "Eau micellaire nettoyante"] },
  { icone: Hourglass, titre: "Soins anti-âge", produits: ["Crème Peptide Ageless Jour et Nuit", "Crème de nuit anti-âge au collagène", "Crème hydratante alternative au rétinol"] },
  { icone: Wind, titre: "Soins capillaires", produits: ["Shampooing hydratant", "Masque capillaire réparateur à la kératine", "Huile fortifiante au romarin"] },
  { icone: Bath, titre: "Soins du corps", produits: ["Huile corporelle Omega 6-9", "Crème pour le corps peaux sensibles", "Déodorant à bille sans aluminium"] },
  { icone: Sun, titre: "Soins solaires", produits: ["Stick solaire SPF 50, sans teinte", "Stick solaire SPF 50, teinté", "Protection solaire SPF 30, teintée"] },
  { icone: Paintbrush, titre: "Maquillage", produits: ["Fond de teint aux peptides", "Anti-cernes correcteur", "Mascara allongeant et volumisant"] },
  { icone: User, titre: "Soins pour homme", produits: ["Crème visage à l’acide hyaluronique", "Gel visage au zinc sans huile", "Huile à barbe adoucissante"] },
  { icone: Gift, titre: "Coffrets", produits: ["Coffret cadeau anti-âge", "Coffret cadeau Rituel d’hydratation", "Coffret cadeau « Hydratation en profondeur »"] },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
};

const sansAccents = (v: string) => v.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function BioGammes({ recherche, onRecherche }: { recherche: string; onRecherche: (v: string) => void }) {
  const q = sansAccents(recherche.trim());
  /* La recherche de la bannière garde les gammes qui contiennent le mot, et
     dans chacune les produits qui y répondent. Aucun résultat : on le dit. */
  const filtrees = q
    ? GAMMES.map((g) => {
        const gammeTrouvee = sansAccents(g.titre).includes(q);
        const produits = gammeTrouvee ? g.produits : g.produits.filter((p) => sansAccents(p).includes(q));
        return { ...g, produits };
      }).filter((g) => g.produits.length > 0)
    : GAMMES;

  return (
    <div className="mt-16">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-foreground">Nos gammes</p>
          <h3 className="mt-3 text-xl md:text-2xl font-light tracking-tight text-foreground leading-snug text-balance">
            Visage, corps, cheveux, maquillage : composez votre gamme
          </h3>
        </div>
      </div>

      {filtrees.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {filtrees.map((g, i) => (
            <motion.div key={g.titre} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="bg-background p-4 md:p-5 rounded-xl">
              <div className="w-10 h-10 mb-3 rounded-full bg-secondary flex items-center justify-center">
                <g.icone className="h-5 w-5 text-foreground" strokeWidth={1.5} />
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-2">{g.titre}</h4>
              <ul className="space-y-1.5">
                {g.produits.map((p) => (
                  <li key={p} className="text-xs text-foreground leading-relaxed text-pretty">{p}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="bg-background rounded-xl p-6 text-sm text-foreground text-center text-pretty">
          Aucun produit de ces gammes ne correspond à « {recherche} ». Le catalogue complet compte plus de 100 références : nous le parcourons avec vous en rendez-vous.
        </p>
      )}
    </div>
  );
}
