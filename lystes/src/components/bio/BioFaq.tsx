import { Warehouse, PackageOpen, CalendarClock, Truck, BadgeCheck, FlaskConical } from "lucide-react";
import FaqAPlat, { type QuestionAPlat } from "@lystes/components/landing/FaqAPlat";

/**
 * Questions fréquentes de /bio (12/10/2026). Tout à plat, sans repliable
 * (règle de JP). Chaque réponse reprend un fait déjà écrit sur la page ou
 * dans les conditions de Biolystes ; rien n’est ajouté. La question de la
 * Personne Responsable est laissée de côté tant que JP ne l’a pas validée :
 * le règlement CE 1223/2009 en fait par défaut la marque (article 4).
 * La mise en page est partagée avec /crea (FaqAPlat, 12/10/2026).
 */

const QUESTIONS: QuestionAPlat[] = [
  {
    icone: Warehouse,
    q: "Faut-il acheter du stock ?",
    r: "Non. Le laboratoire fabrique chaque produit à la demande, sous votre nom et avec votre packaging, puis l’expédie chez votre client.",
  },
  {
    icone: PackageOpen,
    q: "Y a-t-il une quantité minimale ?",
    r: "Aucune. Commandez 1, 10 ou 1 000 produits selon vos besoins réels, y compris pour vos points de vente.",
  },
  {
    icone: CalendarClock,
    q: "Combien de temps pour lancer ma marque ?",
    r: "Comptez 10 jours ouvrés pour la mise en ligne, à partir de votre acompte et de vos éléments (sélection, logo, textes). Le délai est suspendu pendant que nous attendons vos réponses ou vos validations. Il couvre la sélection des produits, le design du packaging, la réception des produits, les photos, la boutique en ligne et la logistique.",
  },
  {
    icone: Truck,
    q: "En combien de temps mes clients sont-ils livrés ?",
    r: "En 6 à 7 jours en mode standard, fabriqué à la demande. En 24 à 48 heures en mode express, depuis le stock placé chez notre logisticien.",
  },
  {
    icone: BadgeCheck,
    q: "Quelles certifications ont les produits ?",
    r: "La plupart de nos formules sont certifiées Ecocert COSMOS, en Natural ou en Organic. La certification de chaque référence figure sur sa fiche, et la fabrication suit la norme ISO 22716.",
  },
  {
    icone: FlaskConical,
    q: "Puis-je essayer les produits avant de me lancer ?",
    r: "Oui. Vous commandez les produits choisis pour les découvrir et les valider avant de lancer votre marque.",
  },
];

export default function BioFaq() {
  return <FaqAPlat questions={QUESTIONS} titre="Ce que l’on nous demande" gris={"avant de se\u00a0lancer."} />;
}
