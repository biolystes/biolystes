/* /formules-et-ingredients : les formules du catalogue Biolystes, leurs
   ingrédients clés et le cadre qui les entoure (JP, 13/11/2026 : « deux pages
   sur biolystes.com, dans le menu »). Cadre, en-tête et pied de page :
   src/pages/pied/CadrePied.tsx. Pièces communes : src/pages/pied/cartes-standard.tsx.

   Règles tenues ici :
   - aucun nom de laboratoire, aucun prix ;
   - jamais « fabrication à la commande » : le laboratoire prépare et expédie ;
   - chaque affirmation a sa preuve : les fréquences d'ingrédients viennent de la
     liste INCI des produits actifs du catalogue (arrondies vers le bas, « plus de
     N produits ») ; « la plupart » des formules sont certifiées COSMOS ;
   - plan et sujets seulement : aucun texte repris d'une page d'un tiers. */
import {
  BadgeCheck, ClipboardCheck, Microscope, PawPrint, Scale, Truck, Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { BoutonRdv, Entete } from "./pied/elements";
import { BlocImage, Banniere, Carte, Cartes, Zone } from "./pied/cartes-standard";
import { t } from "@/lib/typographie-fr";
import imgEntete from "@/assets/formules/formules-entete-creme-rose.webp";
import imgApproche from "@/assets/formules/approche-mousse-trefle.webp";
import imgDeveloppement from "@/assets/formules/developpement-formules-laboratoire.webp";
import imgProduction from "@/assets/formules/production-cuves-inox.webp";
import imgHuiles from "@/assets/formules/ingredient-huiles-vegetales.webp";
import imgExtraits from "@/assets/formules/ingredient-extraits-de-plantes.webp";
import imgHyaluronique from "@/assets/formules/ingredient-acide-hyaluronique.webp";
import imgAloe from "@/assets/formules/ingredient-aloe-vera.webp";
import imgKarite from "@/assets/formules/ingredient-beurre-de-karite.webp";
import imgVitamineE from "@/assets/formules/ingredient-vitamine-e.webp";
import imgPca from "@/assets/formules/ingredient-pca-sodique.webp";
import imgFlorales from "@/assets/formules/ingredient-eaux-florales.webp";

const SEO_DESCRIPTION =
  "Des formules existantes, la plupart certifiées COSMOS, produites par un laboratoire européen certifié ISO 22716 : approche, ingrédients, cadre réglementaire.";

export default function FormulesIngredientsPage() {
  return (
    <>
      <SEO
        title="Formules et ingrédients | Biolystes"
        description={SEO_DESCRIPTION}
        path="/formules-et-ingredients"
      />

      {/* ═══ HAUT DE PAGE : bannière image, titre à gauche ═══ */}
      <Banniere image={imgEntete} alt="Une noix de crème rose pâle sur un fond corail"
        surtitre="Formules et ingrédients" noir="Des formules existantes," gris="certifiées et éprouvées."
        texte="Vous choisissez parmi des soins déjà conçus, contrôlés et produits par notre laboratoire européen certifié, puis vous les habillez à votre marque." />

      {/* ═══ NOTRE APPROCHE : trois blocs image et texte, comme la page modèle ═══ */}
      <Zone gris>
        <Entete className="mb-10 md:mb-14" surtitre="Notre approche" noir="Partir d’une formule éprouvée"
          gris="plutôt que d’une page blanche." />
        <div className="space-y-12 md:space-y-16">
          <BlocImage image={imgApproche} alt="De la mousse verte et des feuilles de trèfle"
            titre="Des formules prêtes"
            texte="Une formule sur mesure demande des mois de développement. Les nôtres existent déjà : vous les choisissez avec un expert produit et vous vendez dès que votre boutique est en ligne." />
          <BlocImage inverse image={imgDeveloppement} alt="Des mains gantées versent un liquide dans une éprouvette"
            titre="Des ingrédients lisibles"
            texte="Chaque fiche du catalogue donne la liste INCI complète, le taux d’ingrédients d’origine naturelle et bio, et la certification du produit. Vous lisez ce que contient une formule avant de la choisir." />
          <BlocImage image={imgProduction} alt="Des cuves en inox dans un laboratoire de production"
            titre="Une production encadrée"
            texte="Notre laboratoire européen certifié ISO 22716 produit les formules et prépare chaque commande à votre marque : votre nom, votre logo, l’étiquette et la boîte quand le produit en a une." />
        </div>
      </Zone>

      {/* ═══ LES INGRÉDIENTS ═══ */}
      <Zone id="ingredients">
        <Entete className="mb-8 md:mb-10" surtitre="Les ingrédients" noir="Des actifs connus,"
          gris={"des textures végétales."} aLaLigne={false}
          texte={t("Huit familles d’ingrédients que l’on retrouve dans de nombreux produits du catalogue.")} />
        <Cartes colonnes={4} rail>
          <Carte image={imgHuiles} alt="Des gouttes d’huile jaune" titre="Huiles végétales"
            texte="Tournesol, jojoba, argan, rose musquée : elles nourrissent la peau et le cheveu et soutiennent la barrière cutanée."
            note="Dans plus de 60 produits" />
          <Carte image={imgExtraits} alt="Des feuilles de ginkgo" titre="Extraits de plantes"
            texte="Fleurs, feuilles, racines : des extraits végétaux qui apaisent, adoucissent et protègent la peau."
            note="Dans plus de 100 produits" />
          <Carte image={imgHyaluronique} alt="Des bulles transparentes sur un fond clair" titre="Acide hyaluronique"
            texte="Il retient l’eau dans les couches superficielles de la peau et lui donne de la souplesse."
            note="Dans plus de 60 produits" />
          <Carte image={imgAloe} alt="Un gel transparent en vagues" titre="Aloe vera"
            texte="Il hydrate et apaise. On le retrouve dans les soins du visage, du corps et du cheveu."
            note="Dans plus de 50 produits" />
          <Carte image={imgKarite} alt="Un beurre végétal crémeux, blanc et brun" titre="Beurre de karité"
            texte="Un beurre végétal nourrissant, apprécié pour les peaux sèches et les soins du corps."
            note="Dans plus de 20 produits" />
          <Carte image={imgVitamineE} alt="Des gouttes d’huile claires" titre="Vitamine E"
            texte="Un antioxydant naturel, qui protège de l’oxydation les huiles de la formule."
            note="Dans plus de 70 produits" />
          <Carte image={imgPca} alt="Des cristaux translucides" titre="PCA sodique"
            texte="Un composant naturel de l’hydratation de la peau, qui retient l’humidité."
            note="Dans plus de 50 produits" />
          <Carte image={imgFlorales} alt="Une fleur rose en gros plan" titre="Eaux florales"
            texte="Rose, camomille, tilleul, sureau : elles adoucissent et apaisent la peau."
            note="Dans une vingtaine de produits" />
        </Cartes>
      </Zone>

      {/* ═══ CE QUE NOUS PRENONS EN CHARGE ═══ */}
      <Zone gris>
        <Entete className="mb-8 md:mb-10" surtitre="De la formule à votre cliente" noir="Ce que nous prenons"
          gris="en charge." aLaLigne={false} />
        <Cartes colonnes={3}>
          <Carte icone={Users} titre="Le choix des formules"
            texte="Un expert produit vous aide à choisir les formules qui correspondent à votre positionnement : visage, corps, cheveux ou maquillage." />
          <Carte icone={ClipboardCheck} titre="La conformité"
            texte="Chaque formule respecte le règlement cosmétique européen : sécurité évaluée, Personne Responsable dans l’Union européenne, étiquettes conformes. Vous n’avez pas de dossier réglementaire à monter." />
          <Carte icone={Truck} titre="La préparation et l’expédition"
            texte="Le laboratoire prépare chaque commande à votre marque et l’expédie directement chez votre cliente, avec un numéro de suivi." />
        </Cartes>
      </Zone>

      {/* ═══ LES REPÈRES ═══ */}
      <Zone>
        <Entete className="mb-8 md:mb-10" surtitre="Les repères" noir="Des certifications"
          gris={"que vous pouvez montrer."} aLaLigne={false} />
        <Cartes colonnes={4}>
          <Carte icone={BadgeCheck} titre="COSMOS"
            texte="Le référentiel européen du cosmétique naturel et biologique. La plupart de nos formules sont certifiées COSMOS Natural ou COSMOS Organic par Ecocert." />
          <Carte icone={Microscope} titre="ISO 22716"
            texte="La norme des bonnes pratiques de fabrication cosmétique, suivie par notre laboratoire européen certifié." />
          <Carte icone={Scale} titre="Règlement (CE) n° 1223/2009"
            texte="Le texte européen qui encadre tous les cosmétiques : sécurité, étiquetage, Personne Responsable." />
          <Carte icone={PawPrint} titre="Aucun test sur les animaux"
            texte="Les tests sont interdits en Europe pour les cosmétiques finis comme pour leurs ingrédients." />
        </Cartes>
      </Zone>

      {/* ═══ SUITE ═══ */}
      <Zone gris>
        <div className="max-w-[48rem] mx-auto">
          <Entete surtitre="Une question sur une formule ?" noir="Parlons de votre sélection" gris={"en rendez-vous."}
            texte={t("Un expert produit répond à vos questions sur les formules et les ingrédients.")} />
          <BoutonRdv className="mt-8" />
          <p className="mt-6 text-center text-[0.9375rem]">
            <Link to="/standard-de-beaute-propre" className="underline underline-offset-4 text-foreground hover:text-foreground/70">
              {t("Voir notre standard de beauté propre")}
            </Link>
          </p>
        </div>
      </Zone>
    </>
  );
}
