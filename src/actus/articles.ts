/* Les articles de la partie Actus de biolystes.com (/blog).

   12/10/2026. Les quatre articles déjà publiés par JP (coffrets, réseau
   presse, lancer sa marque, biais de l’actif) sont repris ici mot pour mot,
   sans leurs montants (JP : « je ne mets plus aucun prix en ligne »), et huit
   articles neufs expliquent Biolystes et son modèle.

   Règles d’écriture, à garder pour tout nouvel article :
   - les faits viennent des textes validés de l’accueil et des fiches de
     méthode Biolystes ; aucun chiffre inventé, aucun prix ;
   - le laboratoire fabricant n’est jamais nommé (texte, image, nom de
     fichier, métadonnées) ;
   - réglementaire : la base juridique citée, et le doute listé dans
     src/actus/A-VALIDER-AVOCAT.md ;
   - un seul appel à l’action, « Prendre rendez-vous », posé par le gabarit ;
   - apostrophes ’, pas de tiret long, une photo différente par article. */
import type { LucideIcon } from "lucide-react";
import {
  Boxes, Brain, Building2, Calculator, Euro, Eye, FileCheck2, Gift, Globe, Handshake, Landmark, Leaf, Megaphone, Package, PackageCheck, Palette, Receipt,
  Recycle, Scale, ShieldCheck, ShoppingBag, Sparkles, Star, Store, Target, Timer, TrendingUp, Truck, Users, Zap,
} from "lucide-react";

import imgEtude from "@/assets/article-featured.jpg";
import imgCoffrets from "@/assets/coffrets-article.png";
import imgPresse from "@/assets/marie-claire-logo.jpg";
import imgLancer15 from "@/assets/lancer-marque-article.png";
import imgBiais from "@/assets/biais-actif-article.jpg";
import imgSansStock from "@/assets/product-235th-3.jpg";
import imgMarqueBlanche from "@/assets/sevmylook-1.jpg";
import imgReglementaire from "@/assets/product-box.jpg";
import imgCertifications from "@/assets/kaniwa-7.jpg";
/* Copie propre au site (src/assets) : le dossier lystes/ est resynchronisé et
   ne contient pas toujours cette image. */
import imgLivraison from "@/assets/logistique-step.jpg";
import imgDixJours from "@/assets/ecommerce-step.png";
import imgEquipesIA from "@/assets/kaniwa-ugc-4.jpg";
import imgInstituts from "@/assets/salon-coiffure.webp";
/* Portrait du cabinet, repris du panneau « Fiscal et comptable » de lystes.ai
   (petal-diagnostics, src/assets/cabinet/hr-associes-portrait.avif), recadré en 4:3. */
import imgHrAssocies from "@/assets/hr-associes-partenariat.jpg";
/* L’équipe de SB2L Logistique dans son entrepôt, photo transmise par JP,
   recadrée en 4:3. SB2L est le logisticien partenaire, pas le laboratoire :
   son nom peut être cité (le laboratoire fabricant, lui, ne l’est jamais). */
import imgSb2l from "@/assets/sb2l-partenariat.jpg";
/* Photo produit d’Éclose Paris (concentré exfoliant AHA, étui et flacon),
   reprise de sa fiche sur ecloseparis.com et recadrée en 4:3. Aucune image générée. */
import imgEclose from "@/assets/eclose-paris-lancement.jpg";

export type Carte = { titre: string; texte: string; icone?: LucideIcon };

export type Bloc =
  | { t: "p"; texte: string }
  | { t: "h2"; texte: string }
  | { t: "liste"; items: string[]; numerotee?: boolean }
  | { t: "cartes"; items: Carte[] }
  | { t: "chiffre"; valeur: string; texte: string; note?: string }
  | { t: "note"; texte: string }
  /** `contre` : la colonne de gauche est ce qu’on déconseille (✕), celle de droite ce qu’on recommande (✓). */
  | { t: "comparaison"; gauche: { titre: string; items: string[] }; droite: { titre: string; items: string[] }; contre?: boolean };

export type Article = {
  slug: string;
  /** Titre affiché. */
  titre: string;
  /** Balise <title>, 60 caractères environ. */
  titreSeo: string;
  /** Meta description, 155 caractères environ. */
  description: string;
  /** Chapeau sous le titre. */
  chapo: string;
  categorie: string;
  /** AAAA-MM-JJ */
  date: string;
  image: string;
  alt: string;
  /** Image posée sur fond gris, entière (logo, packshot détouré). */
  imageEntiere?: boolean;
  /** Phrase au-dessus du bouton « Prendre rendez-vous ». */
  appel: string;
  corps: Bloc[];
  /** Lien vers une page existante au lieu du gabarit (étude /etudes). */
  url?: string;
  /** Article écrit mais caché : absent de /blog, de la pop-up actus et de
      articles.json, page introuvable. JP le rend visible en retirant la ligne. */
  masque?: boolean;
};

const tousLesArticles: Article[] = [
  /* ─────────────── Partenariat HR & Associés (13/10/2026), à la une ───────────────
     La photo montre le directeur du cabinet (JP). Son nom n’est pas connu :
     le texte n’en a pas besoin, et aucune citation ne lui est prêtée.
     « HR\u00a0&\u00a0Associés » : espaces insécables, le nom ne se coupe jamais. */
  {
    slug: "partenariat-hr-associes",
    titre: "Biolystes s’associe à HR\u00a0&\u00a0Associés pour vous accompagner dans vos démarches administratives, comptables et fiscales",
    titreSeo: "Biolystes et HR & Associés, cabinet comptable | Biolystes",
    description: "Création de société, comptabilité, TVA, fiscalité, déclarations : Biolystes s’associe au cabinet HR\u00a0&\u00a0Associés pour accompagner les créatrices de marques cosmétiques.",
    chapo: "Lancer sa marque cosmétique, c’est aussi créer une société, tenir une comptabilité et déclarer sa TVA. Pour que ces démarches ne freinent plus votre lancement, Biolystes s’associe au cabinet HR\u00a0&\u00a0Associés.",
    categorie: "Partenariat",
    date: "2026-10-13",
    image: imgHrAssocies,
    alt: "Le directeur du cabinet HR\u00a0&\u00a0Associés, partenaire de Biolystes",
    appel: "Parlons de votre projet, et de l’accompagnement comptable qui va avec.",
    corps: [
      { t: "h2", texte: "Pourquoi ce partenariat" },
      { t: "p", texte: "Les créatrices que nous accompagnons nous posent souvent les mêmes questions avant leur première vente. Quel statut choisir ? Faut-il facturer la TVA ? Que déclarer, et quand ? Ces questions ne relèvent pas de notre métier. Elles relèvent de celui d’un expert-comptable." },
      { t: "p", texte: "Nous avons donc choisi de travailler avec **HR\u00a0&\u00a0Associés**, le cabinet comptable des e-commerçants. Le cabinet accompagne les marques en ligne sur leur comptabilité, leur fiscalité et leur pilotage financier, de la TVA e-commerce au suivi de marge." },
      { t: "p", texte: "Le directeur du cabinet et son équipe deviennent les interlocuteurs des marques Biolystes pour toutes les questions administratives, comptables et fiscales." },
      { t: "h2", texte: "Ce que le cabinet prend en charge pour votre marque" },
      { t: "cartes", items: [
        { icone: Building2, titre: "La création de votre société", texte: "Choix du statut, rédaction des statuts, immatriculation : votre marque démarre sur une structure adaptée à votre activité." },
        { icone: Calculator, titre: "La comptabilité", texte: "Tenue comptable, bilan, liasse fiscale et comptes annuels, préparés par des experts qui connaissent la vente en ligne." },
        { icone: Receipt, titre: "La TVA", texte: "Déclarations de TVA, et TVA e-commerce quand vous vendez à des particuliers dans d’autres pays de l’Union européenne." },
        { icone: Landmark, titre: "La fiscalité et les déclarations", texte: "Impôt sur les sociétés, déclaration de revenus du dirigeant, rémunération : chaque échéance est suivie." },
      ] },
      { t: "h2", texte: "Les formalités, sans y passer vos soirées" },
      { t: "p", texte: "Une marque qui vend a des obligations qui reviennent chaque mois, chaque trimestre et chaque année. Le cabinet s’en charge aussi :" },
      { t: "liste", items: [
        "Les modifications de statuts, l’approbation des comptes et leur dépôt.",
        "Les bulletins de paie et les déclarations sociales, le jour où vous embauchez.",
        "L’assistance en cas de contrôle fiscal ou URSSAF.",
        "Un tableau de bord mensuel et un prévisionnel de trésorerie pour piloter votre marque.",
      ] },
      { t: "h2", texte: "Comment en profiter" },
      { t: "p", texte: "Parlez-en lors de votre rendez-vous avec un expert Biolystes. Nous faisons le point sur votre projet, puis nous vous mettons en relation avec HR\u00a0&\u00a0Associés pour les démarches qui vous concernent." },
      { t: "note", texte: "Biolystes reste votre interlocuteur pour la gamme, la fabrication et la boutique. HR\u00a0&\u00a0Associés prend le relais pour tout ce qui touche à votre société, à vos comptes et à vos déclarations." },
    ],
  },
  /* ─────────────── Partenariat SB2L Logistique, deuxième article ───────────────
     Même date que HR & Associés : à date égale, l’ordre de ce tableau décide,
     donc HR & Associés reste premier (et à la une). Faits donnés par JP :
     livraison en 24 à 48 heures, tarifs de livraison 50 % moins élevés, zone
     de livraison étendue au monde entier, produits mêlés aux nôtres chez le
     logisticien et packaging personnalisé plus librement. */
  {
    slug: "partenariat-sb2l-logistique",
    titre: "Biolystes s’associe à SB2L Logistique : vos clientes livrées en 24 à 48 heures, partout dans le monde",
    titreSeo: "Biolystes et SB2L Logistique : livraison en 24 à 48 h | Biolystes",
    description: "Livraison Express en 24 à 48 heures, tarifs de livraison 50 % moins élevés, expédition dans le monde entier : le nouveau partenariat logistique de Biolystes avec SB2L.",
    chapo: "Grâce à notre partenariat avec le logisticien SB2L, vos clientes reçoivent leur commande en 24 à 48 heures, avec des frais de livraison 50 % moins élevés, et la zone de livraison s’étend au monde entier.",
    categorie: "Partenariat",
    date: "2026-10-13",
    image: imgSb2l,
    alt: "L’équipe de SB2L Logistique dans son entrepôt, un colis prêt à expédier en main",
    appel: "Parlons du mode Express pour vos meilleures ventes.",
    corps: [
      { t: "h2", texte: "Pourquoi ce partenariat" },
      { t: "p", texte: "Une cliente qui attend son colis une semaine, parfois deux, ne rachète pas. Le mode Express répond à ce réflexe : un petit stock de vos meilleures ventes, sans minimum, placé chez notre logisticien, et des commandes livrées en 24 à 48 heures." },
      { t: "p", texte: "Pour aller plus vite, livrer moins cher et livrer plus loin, nous nous associons désormais à **SB2L Logistique**. Son entrepôt accueille le stock Express des marques Biolystes, et ses équipes expédient chaque commande directement, sous votre marque." },
      { t: "h2", texte: "Ce que ce partenariat change pour votre marque" },
      { t: "cartes", items: [
        { icone: Zap, titre: "Livraison en 24 à 48 heures", texte: "Les commandes partent du stock déjà chez le logisticien : vos clientes sont livrées en 24 à 48 heures." },
        { icone: Euro, titre: "Des tarifs de livraison 50 % moins élevés", texte: "Le partenariat avec SB2L nous permet de vous faire profiter de tarifs de livraison 50 % moins élevés." },
        { icone: Globe, titre: "La livraison dans le monde entier", texte: "La zone de livraison s’agrandit : vos produits partent désormais vers le monde entier." },
        { icone: Boxes, titre: "Votre stock chez notre logisticien", texte: "Mêlez d’autres produits aux nôtres et personnalisez plus librement votre packaging." },
      ] },
      { t: "h2", texte: "L’offre Express, étape par étape" },
      { t: "p", texte: "Votre stock chez notre logisticien : vous y placez les produits de votre choix, sans minimum, mêlés aux nôtres, et vous personnalisez plus librement votre packaging. Livré dans le monde entier. Vous réapprovisionnez au rythme de vos ventes, juste ce qu’il faut. Ensuite, à chaque commande :" },
      { t: "cartes", items: [
        { icone: ShoppingBag, titre: "Commande client", texte: "Votre client passe commande sur votre boutique en ligne." },
        { icone: Boxes, titre: "Prélevé dans votre stock", texte: "Nos produits et les vôtres, déjà chez le logisticien." },
        { icone: Package, titre: "Emballage", texte: "Votre packaging, personnalisé plus librement." },
        { icone: Truck, titre: "Expédition", texte: "Expédié directement par le logisticien." },
        { icone: PackageCheck, titre: "Livré", texte: "En 24 à 48 heures." },
      ] },
      { t: "h2", texte: "Standard ou Express" },
      { t: "p", texte: "Le mode Standard reste le chemin du lancement : aucun stock, chaque produit fabriqué à la demande. Dès qu’un produit trouve son rythme, placez-le en Express : il est prélevé chez le logisticien et livré en 24 à 48 heures, partout dans le monde." },
      { t: "note", texte: "Dans les deux modes, chaque colis part sous votre nom de marque : votre cliente ne voit que vous, de l’emballage au bon de livraison." },
    ],
  },
  /* ─────────────── Éclose Paris (13/10/2026), juste sous HR & Associés ───────────────
     Même date que HR & Associés : le tri de /blog et de articles.json est stable,
     donc à date égale l’ordre de ce tableau décide. HR & Associés reste à la une.
     Faits tirés de ecloseparis.com (accueil, Concept, fiches) et du dossier
     Biolystes d’Éclose : aucun chiffre, aucune date de lancement, aucune citation,
     aucun nom de fondatrice. Pas de verbe médical (traiter, guérir) : cosmétique. */
  {
    slug: "eclose-paris-lancement",
    /* Caché le 13/10/2026 à la demande de JP : « pour le moment, n’affiche pas l’article, mais cache-le ». */
    masque: true,
    titre: "Éclose\u00a0Paris nous fait confiance pour lancer sa marque de soins du corps dédiée à la kératose\u00a0pilaire",
    titreSeo: "Éclose Paris lance sa marque avec Biolystes | Biolystes",
    description: "Éclose Paris crée des soins du corps pour les peaux à kératose pilaire. Gamme, stratégie de lancement, boutique et widget Lystes : ce que Biolystes a pris en charge.",
    chapo: "Éclose\u00a0Paris s’adresse aux peaux qui ont du grain : la kératose pilaire, ces petits grains sur les bras et les cuisses. Pour lancer sa marque, elle a choisi Biolystes.",
    categorie: "Nos marques",
    date: "2026-10-13",
    image: imgEclose,
    alt: "Concentré exfoliant AHA d’Éclose\u00a0Paris, étui violet et flacon compte-gouttes à son nom",
    appel: "Vous aussi, vous avez une marque en tête ? Parlons de votre gamme.",
    corps: [
      { t: "h2", texte: "Une marque née d’un geste" },
      { t: "p", texte: "La kératose pilaire ne fait pas mal, mais elle se voit et se sent sous les doigts. Beaucoup finissent par tirer sur leurs manches pour cacher leurs bras. **Éclose\u00a0Paris** est née de ce réflexe, pour que la kératose pilaire cesse de dicter ce qu’on porte." },
      { t: "p", texte: "Son idée de départ : un rituel régulier, doux et agréable à suivre fait plus qu’un gommage agressif une fois par mois. Les formules desquamantes affinent le grain de peau sans l’irriter, les textures nourrissantes gardent la souplesse retrouvée. La marque le dit elle-même : pas de promesse miracle, des gestes quotidiens." },
      { t: "h2", texte: "Une gamme pensée en deux temps" },
      { t: "p", texte: "Le rituel Éclose libère d’abord en douceur l’excès de kératine qui bouche les follicules, puis nourrit la peau pour qu’elle reste souple. La gamme suit cette logique :" },
      { t: "cartes", items: [
        { icone: Sparkles, titre: "Exfolier en douceur", texte: "Un concentré peeling aux AHA, soin de nuit qui affine le grain de peau, et un exfoliant visage et corps, un gommage doux pour lisser les grains." },
        { icone: Leaf, titre: "Nourrir chaque jour", texte: "Une crème corps à l’urée et au panthénol pour les peaux rugueuses, et une huile corporelle aux oméga 6 et 9 qui protège la douceur retrouvée." },
        { icone: ShieldCheck, titre: "Nettoyer sans agresser", texte: "Un nettoyant visage et corps à la formule minimaliste, pensé pour les peaux sensibles." },
      ] },
      { t: "h2", texte: "Ce que Biolystes a pris en charge" },
      { t: "cartes", items: [
        { icone: PackageCheck, titre: "La gamme", texte: "Les soins viennent du catalogue Biolystes et sont fabriqués sous le nom Éclose\u00a0Paris, avec son packaging." },
        { icone: Target, titre: "La stratégie de lancement", texte: "Un plan de lancement complet : la cible, le message, puis la crédibilité à construire avant la première publicité." },
        { icone: Store, titre: "La boutique en ligne", texte: "Le site ecloseparis.com, retravaillé pour que chaque visiteuse trouve son soin et passe à l’achat." },
        { icone: Brain, titre: "Les outils Lystes", texte: "Sur chaque fiche, le widget Lystes répond aux questions des clientes, affiche les avis et propose un diagnostic de peau." },
      ] },
      { t: "h2", texte: "Découvrir Éclose\u00a0Paris" },
      { t: "p", texte: "Le rituel, la gamme et le diagnostic de peau sont à découvrir sur **ecloseparis.com**." },
    ],
  },
  /* ─────────────── Nouveaux articles (12/10/2026) ─────────────── */
  {
    slug: "lancer-marque-cosmetique-sans-stock",
    titre: "Lancer sa marque cosmétique sans acheter de stock",
    titreSeo: "Lancer sa marque cosmétique sans stock | Biolystes",
    description: "Fabrication à la demande, sous votre nom, expédiée chez votre client : comment Biolystes permet de lancer une marque bio et végane sans stock ni minimum.",
    chapo: "Le stock est la première raison pour laquelle une marque s’arrête avant d’avoir vendu. Chez Biolystes, chaque produit est fabriqué quand votre client l’achète.",
    categorie: "Modèle",
    date: "2026-10-12",
    image: imgSansStock,
    alt: "Flacons de soins d’une marque cliente Biolystes dans leur colis d’expédition",
    appel: "Parlons de votre future gamme, sans stock à financer.",
    corps: [
      { t: "h2", texte: "Le piège du stock" },
      { t: "p", texte: "La majorité des créateurs investissent jusqu’à 90 % de leur budget dans l’achat de stock (étude interne Biolystes, voir notre page Études). Une fois la marque lancée, il ne reste plus rien pour se faire connaître. Sans visibilité, pas de ventes. Le stock dort, la trésorerie fond, et le projet s’arrête." },
      { t: "p", texte: "Nous avons construit Biolystes pour retirer cet obstacle en premier : **pas de stock à acheter, pas de minimum de commande**." },
      { t: "h2", texte: "Fabriqué à la demande, sous votre nom" },
      { t: "liste", numerotee: true, items: [
        "Votre client passe commande sur votre boutique en ligne.",
        "Le laboratoire fabrique le produit à la demande, sous votre nom, avec votre packaging.",
        "Le colis est expédié directement chez votre client.",
      ] },
      { t: "p", texte: "Chaque commande part sous votre nom de marque. Votre client ne voit que votre marque, de l’emballage au bon de livraison." },
      { t: "h2", texte: "Ce que vous gardez, ce que nous prenons en charge" },
      { t: "cartes", items: [
        { icone: Package, titre: "Aucun stock", texte: "Vous ne financez pas de production d’avance. Votre budget reste disponible pour faire connaître la marque." },
        { icone: Boxes, titre: "Aucun minimum", texte: "Commandez 1, 10 ou 1 000 produits selon vos besoins réels, y compris pour vos points de vente." },
        { icone: Truck, titre: "Aucune logistique", texte: "De la production à la demande à l’expédition sous votre marque, nous nous occupons de tout." },
      ] },
      { t: "h2", texte: "Et si vous voulez livrer plus vite ?" },
      { t: "p", texte: "Le mode Express existe pour cela : vous placez un petit stock, sans minimum, chez notre logisticien, et vos clients sont livrés en 24 à 48 heures. Nous détaillons les deux modes dans l’article consacré au mode Standard et au mode Express." },
      { t: "note", texte: "Sans stock ne veut pas dire sans engagement de votre part : vendre reste votre métier. Notre rôle est de vous donner une marque prête à vendre, sans immobiliser votre trésorerie avant la première commande." },
    ],
  },
  {
    slug: "marque-blanche-ou-formulation-sur-mesure",
    titre: "Marque blanche ou formulation sur mesure : que choisir pour se lancer ?",
    titreSeo: "Marque blanche ou sur mesure en cosmétique | Biolystes",
    description: "Formule existante certifiée ou formule créée pour vous : délais, risque produit, certifications. Ce qui change vraiment pour lancer votre marque cosmétique.",
    chapo: "Créer sa propre formule fait rêver. Partir d’une formule existante, certifiée et éprouvée, permet de vendre tout de suite. Voici comment trancher.",
    categorie: "Guide",
    date: "2026-10-12",
    image: imgMarqueBlanche,
    alt: "Huile fortifiante d’une marque cliente, flacon et étui à son nom",
    appel: "Composons ensemble une gamme qui ressemble à votre marque.",
    corps: [
      { t: "h2", texte: "Deux chemins vers le même rayon" },
      { t: "p", texte: "En **marque blanche**, vous choisissez des formules déjà développées, certifiées et fabriquées par un laboratoire, puis elles sont habillées à votre marque : nom, étiquette, packaging. En **formulation sur mesure**, un laboratoire développe une formule nouvelle pour vous." },
      { t: "h2", texte: "Ce que coûte vraiment le sur-mesure" },
      { t: "cartes", items: [
        { icone: Timer, titre: "Le temps", texte: "Trouver la bonne formule, le bon dosage, le bon équilibre. Certains de nos clients avaient passé huit mois, un an, parfois des années en allers-retours avec des laboratoires, sans jamais finaliser un seul produit." },
        { icone: FileCheck2, titre: "Les certifications", texte: "COSMOS, ECOCERT, notification CPNP, ISO 22716 : chaque nouvelle formule doit cocher toutes ces cases. Par vous-même, cela prend des années." },
        { icone: Scale, titre: "Le risque produit", texte: "Avec votre propre formulation, la responsabilité du produit et de son dossier vous revient. En marque blanche, elle est portée par le dispositif du laboratoire fabricant." },
      ] },
      { t: "h2", texte: "Ce que vous gagnez en partant d’une formule existante" },
      { t: "liste", items: [
        "Plus de 100 formules certifiées bio et véganes, visage, corps, cheveux, maquillage, solaire, homme, coffrets.",
        "Des formules sans parabènes, sans silicones, sans PEG, sans filtres UV chimiques, sans microplastiques et sans colorants artificiels.",
        "Des produits que vous recevez et testez avant de lancer votre marque.",
        "Une marque en ligne en 10 jours ouvrés, au lieu de plusieurs mois.",
      ] },
      { t: "h2", texte: "La marque, pas la formule, fait la différence" },
      { t: "p", texte: "Votre cliente cherche un résultat : une peau hydratée, des cheveux plus forts. Elle ne compare pas les listes d’ingrédients ligne à ligne. Ce qui la fait acheter, c’est votre univers, votre conseil, la confiance que vous inspirez. Nous détaillons ce raisonnement dans « Le biais de l’actif »." },
      { t: "note", texte: "Le sur-mesure garde tout son sens plus tard, quand votre marque a des clientes, des ventes et du recul. Lancer d’abord avec des formules existantes, puis compléter la gamme : c’est l’approche que nous recommandons." },
    ],
  },
  {
    slug: "personne-responsable-dip-cpnp",
    titre: "Personne Responsable, DIP et CPNP : le réglementaire cosmétique expliqué simplement",
    titreSeo: "Personne Responsable, DIP, CPNP expliqués | Biolystes",
    description: "Qui est la Personne Responsable d’un cosmétique, à quoi servent le DIP et la notification CPNP, ce que dit l’étiquette : les bases du règlement CE n° 1223/2009.",
    chapo: "Avant de vendre un cosmétique en Europe, trois sigles reviennent sans cesse. Voici ce qu’ils recouvrent, et qui s’en charge quand vous lancez votre marque avec Biolystes.",
    categorie: "Réglementaire",
    date: "2026-10-12",
    image: imgReglementaire,
    alt: "Flacon de sérum et son étui, étiquetés au nom d’une marque cliente",
    appel: "Posez-nous vos questions réglementaires en rendez-vous.",
    corps: [
      { t: "p", texte: "Le texte de référence est le **règlement européen CE n° 1223/2009** relatif aux produits cosmétiques. Il fixe une règle simple : tout cosmétique mis sur le marché européen a une Personne Responsable, établie dans l’Union, qui en garantit la conformité." },
      { t: "h2", texte: "La Personne Responsable" },
      { t: "p", texte: "Par défaut, une marque qui commercialise un produit sous son nom en est la Personne Responsable. Le règlement prévoit toutefois, à son article 4, paragraphe 3, que cette fonction peut être confiée par mandat écrit à une personne établie dans l’Union européenne, qui l’accepte par écrit." },
      { t: "p", texte: "C’est le dispositif sur lequel repose la marque blanche Biolystes : le laboratoire fabricant, établi dans l’Union européenne et dont la fabrication suit la norme ISO 22716, assume la fonction de Personne Responsable pour les produits de votre marque. Le mandat vous est remis avant la mise sur le marché de vos produits." },
      { t: "h2", texte: "Le DIP, Dossier d’Information Produit" },
      { t: "p", texte: "Chaque produit a son dossier : description, rapport sur la sécurité, méthode de fabrication, preuves des effets revendiqués. Il est établi et conservé par la Personne Responsable, et reste à la disposition des autorités. La formule détaillée qu’il contient n’est pas remise à la marque." },
      { t: "p", texte: "Le rapport sur la sécurité est établi par un évaluateur qualifié pour chaque formule mise sur le marché européen. Un usage différent de celui prévu (un autre conditionnement, une autre zone d’application) doit être couvert par cette évaluation : c’est pour cela que nous ne modifions jamais un produit à la légère." },
      { t: "h2", texte: "La notification CPNP" },
      { t: "p", texte: "Avant la mise sur le marché, chaque produit est notifié sur le portail européen des produits cosmétiques, le CPNP. La notification est réalisée par la Personne Responsable." },
      { t: "h2", texte: "Ce que dit l’étiquette" },
      { t: "p", texte: "L’article 19 du règlement impose plusieurs mentions, dont le nom et l’adresse de la Personne Responsable. C’est une obligation légale : l’étiquette de votre produit porte donc votre marque, et les coordonnées de la Personne Responsable." },
      { t: "h2", texte: "Qui fait quoi" },
      { t: "cartes", items: [
        { icone: ShieldCheck, titre: "Conformité des formules", texte: "Garantie par le laboratoire fabricant." },
        { icone: FileCheck2, titre: "DIP et notification CPNP", texte: "Établis, conservés et réalisés par le laboratoire, Personne Responsable." },
        { icone: Eye, titre: "Cosmétovigilance et allégations", texte: "Surveillance et vérification gérées par le laboratoire." },
        { icone: Store, titre: "Votre rôle", texte: "Vendre sous votre marque, en reprenant les allégations validées pour chaque produit." },
      ] },
      { t: "note", texte: "Les allégations se justifient. Une crème peut être « hydratante » si son dossier le démontre ; aucun cosmétique ne « traite » ni ne « guérit ». Nous vous aidons à rédiger vos fiches produits dans ce cadre." },
    ],
  },
  {
    slug: "certifications-cosmos-ecocert",
    titre: "COSMOS, ECOCERT, ISO 22716 : ce que garantissent les certifications de vos produits",
    titreSeo: "Certifications COSMOS et ECOCERT expliquées | Biolystes",
    description: "COSMOS Natural ou Organic, ECOCERT, ISO 22716, végan, non testé sur les animaux : ce que signifie chaque mention sur les produits de votre marque.",
    chapo: "Une marque bio et végane se juge d’abord sur ses preuves. Voici ce que recouvrent les certifications des formules Biolystes, et comment les lire produit par produit.",
    categorie: "Qualité",
    date: "2026-10-12",
    image: imgCertifications,
    alt: "Flacon pompe d’une marque cliente posé sur une pierre, ambiance naturelle",
    appel: "Choisissons ensemble des formules certifiées pour votre marque.",
    corps: [
      { t: "h2", texte: "COSMOS, le référentiel européen du cosmétique bio et naturel" },
      { t: "p", texte: "COSMOS est un référentiel commun à plusieurs organismes européens de certification. Il existe en deux niveaux : **COSMOS Natural**, pour les formules d’origine naturelle, et **COSMOS Organic**, qui exige en plus une part d’ingrédients issus de l’agriculture biologique." },
      { t: "h2", texte: "ECOCERT, l’organisme qui contrôle" },
      { t: "p", texte: "ECOCERT est un organisme de certification indépendant qui contrôle le respect du référentiel. La plupart de nos formules sont certifiées Ecocert COSMOS, en Natural ou en Organic. La certification de chaque référence figure sur sa fiche : nous vous la donnons produit par produit, jamais en bloc." },
      { t: "h2", texte: "Les autres garanties de nos formules" },
      { t: "cartes", items: [
        { icone: ShieldCheck, titre: "ISO 22716", texte: "Les bonnes pratiques de fabrication des cosmétiques, suivies par le laboratoire." },
        { icone: Leaf, titre: "Végan", texte: "Formulations végétaliennes, parfums véganes." },
        { icone: Sparkles, titre: "Non testé sur les animaux", texte: "Aucune expérimentation animale, à aucun stade." },
        { icone: Recycle, titre: "Packaging recyclable", texte: "Emballages conçus pour être recyclables." },
      ] },
      { t: "h2", texte: "Ce que nos formules ne contiennent pas" },
      { t: "p", texte: "Tous nos produits sont formulés sans parabènes, sans silicones, sans PEG, sans filtres UV chimiques, sans microplastiques et sans colorants artificiels." },
      { t: "h2", texte: "Lire une fiche produit" },
      { t: "liste", items: [
        "La certification exacte : COSMOS Natural ou COSMOS Organic.",
        "Le pourcentage d’ingrédients d’origine naturelle et le pourcentage d’ingrédients biologiques.",
        "La liste INCI complète, avec la légende de ses symboles.",
        "Les mentions « testé dermatologiquement » ou « sans allergène sur l’étiquette », seulement quand la fiche les porte.",
      ] },
      { t: "note", texte: "Pour une cliente exigeante (peaux sensibles, haute tolérance, cahier des charges précis), nous préparons un dossier des compositions INCI produit par produit, avant toute décision." },
    ],
  },
  {
    slug: "mode-standard-ou-mode-express",
    titre: "Mode Standard ou mode Express : comment vos clients sont livrés",
    titreSeo: "Livraison : mode Standard ou mode Express | Biolystes",
    description: "Fabrication à la demande et livraison en 6 à 7 jours, ou petit stock chez notre logisticien et livraison en 24 à 48 heures : les deux modes Biolystes.",
    chapo: "Deux façons de livrer vos clients, sous votre marque, sans jamais gérer un entrepôt. Vous pouvez commencer par l’une et passer à l’autre quand vos ventes le justifient.",
    categorie: "Logistique",
    date: "2026-10-12",
    image: imgLivraison,
    alt: "Préparation d’un colis dans l’entrepôt du logisticien",
    appel: "Choisissons le mode de livraison adapté à votre lancement.",
    corps: [
      { t: "h2", texte: "Le mode Standard : zéro stock, livré en 6 à 7 jours" },
      { t: "liste", numerotee: true, items: [
        "Votre client passe commande sur votre boutique en ligne.",
        "Le laboratoire fabrique le produit à la demande, sous votre nom, avec votre packaging.",
        "Le colis est expédié directement chez votre client.",
      ] },
      { t: "p", texte: "C’est le mode idéal pour lancer : aucun stock nécessaire, aucun risque d’invendus." },
      { t: "h2", texte: "Le mode Express : livré en 24 à 48 heures" },
      { t: "liste", numerotee: true, items: [
        "Vous achetez uniquement le stock nécessaire, sans minimum de quantité, et il est placé chez notre logisticien.",
        "Vous réapprovisionnez en une semaine, au rythme de vos ventes : juste ce qu’il faut, sans risque de surstock.",
        "Vos clients reçoivent leur commande en 24 à 48 heures, expédiée directement par le logisticien.",
      ] },
      { t: "h2", texte: "Comment choisir" },
      { t: "comparaison",
        gauche: { titre: "Mode Standard", items: ["Aucun stock", "Livraison en 6 à 7 jours", "Pour lancer et tester vos produits"] },
        droite: { titre: "Mode Express", items: ["Un petit stock, sans minimum", "Livraison en 24 à 48 heures", "Pour vos meilleures ventes"] },
      },
      { t: "p", texte: "Dans les deux cas, chaque commande est expédiée sous votre nom de marque. Votre client ne voit que votre marque, de l’emballage au bon de livraison." },
      { t: "h2", texte: "Et si un colis arrive abîmé ?" },
      { t: "p", texte: "Votre client vous contacte, vous nous transmettez la réclamation avec une photo. Le remplacement est pris en charge sous 30 jours après la livraison, lorsque c’est notre laboratoire qui gère la livraison." },
    ],
  },
  {
    slug: "de-la-selection-a-la-boutique-en-10-jours",
    titre: "De la sélection de produits à la boutique en ligne : les 10 jours ouvrés d’un lancement",
    titreSeo: "Lancer sa marque en 10 jours ouvrés, étape par étape | Biolystes",
    description: "Sélection de produits, packaging, produits reçus, photos, boutique en ligne, logistique : le déroulé d’un lancement de marque avec Biolystes.",
    chapo: "Un lancement Biolystes suit toujours le même ordre. Chaque étape a un responsable, et vous validez avant que la suivante commence.",
    categorie: "Lancement",
    date: "2026-10-12",
    image: imgDixJours,
    alt: "Page d’accueil de la boutique en ligne d’une marque cliente Biolystes",
    imageEntiere: true,
    appel: "Votre lancement commence par un rendez-vous.",
    corps: [
      { t: "h2", texte: "1. La sélection de produits" },
      { t: "p", texte: "Tout part de votre brief, lu mot à mot : votre univers, vos envies de parfum, vos contraintes (sans parfum, sans huiles essentielles), votre cible, votre marché. Nous choisissons d’abord un principe d’organisation (un rituel autour d’une famille olfactive, une même routine pour elle et pour lui), puis les produits, chacun vérifié : nom exact, format, certification, composition." },
      { t: "p", texte: "Vous recevez un document de sélection qui explique chaque choix, et ce qui n’est pas possible, dit honnêtement." },
      { t: "h2", texte: "2. Le design du packaging" },
      { t: "p", texte: "Vous nous fournissez votre logo et vos inspirations. Nous créons une identité visuelle avec des étiquettes et des packagings professionnels pour votre marque." },
      { t: "h2", texte: "3. Les produits chez vous" },
      { t: "p", texte: "Vous commandez les produits choisis pour les découvrir et les valider avant de lancer votre marque. C’est le moyen de tester sans risque." },
      { t: "h2", texte: "4. Les photos" },
      { t: "p", texte: "Nous réalisons un set complet de photos : packshots produits et images d’ambiance, pour votre site et vos campagnes." },
      { t: "h2", texte: "5. La boutique en ligne" },
      { t: "p", texte: "Nous créons et configurons votre boutique, prête à vendre, sans investissement technique de votre part." },
      { t: "h2", texte: "6. La logistique" },
      { t: "p", texte: "De la production à la demande à l’expédition sous votre marque, nous nous occupons de tout. Vous choisissez le mode Standard ou le mode Express." },
      { t: "h2", texte: "7. En option, l’accompagnement" },
      { t: "p", texte: "Pour mettre toutes les chances de votre côté, vous pouvez être accompagné par des experts qui ont 18 ans d’expérience dans ce secteur." },
      { t: "chiffre", valeur: "10 à 15 j", texte: "de la sélection des produits à la boutique prête à vendre.", note: "Sélection, packaging, produits reçus, photos, boutique et logistique." },
    ],
  },
  {
    slug: "equipes-ia-apres-le-lancement",
    titre: "Après le lancement : des équipes IA pour vendre vos produits",
    titreSeo: "Vendre après le lancement avec des équipes IA | Biolystes",
    description: "Conseiller produit, FAQ, avis, photos, SEO : avec Lystes, chaque fiche produit de votre marque reçoit une équipe d’agents IA qui aide à vendre.",
    chapo: "Une boutique en ligne ne vend pas seule. Une question sans réponse, et votre client est déjà chez la concurrence. Après le lancement, Biolystes s’appuie sur Lystes.",
    categorie: "Après le lancement",
    date: "2026-10-12",
    image: imgEquipesIA,
    alt: "Cliente qui présente un soin d’une marque lancée avec Biolystes",
    appel: "Voyons ensemble comment vendre après le lancement.",
    corps: [
      { t: "h2", texte: "Le problème : des visiteurs qui repartent" },
      { t: "p", texte: "Peu de visiteurs lisent vos fiches produits en entier. Ils veulent une réponse précise avant d’acheter. Sans vendeur pour la donner, ils quittent le site." },
      { t: "h2", texte: "Une équipe d’agents IA sur chaque fiche produit" },
      { t: "p", texte: "**Lystes**, la plateforme d’agents IA de la même équipe que Biolystes, place sur chaque fiche produit des conseillers qui répondent à vos clients, jour et nuit et dans leur langue. Ils s’améliorent à chaque conversation : ils repèrent les réponses qui mènent à l’achat et vous remontent les points de friction." },
      { t: "cartes", items: [
        { icone: Users, titre: "Expert produit", texte: "Répond à chaque question sur le produit, pour lever les doutes avant l’achat." },
        { icone: Target, titre: "Diagnostic", texte: "Analyse une photo de la peau ou des cheveux et recommande le bon produit, comme en institut." },
        { icone: Star, titre: "Avis", texte: "Une page d’avis par produit, indexée sur Google, avec un agent qui répond." },
        { icone: Palette, titre: "Photos et UGC", texte: "Des photos du produit en situation et des contenus de créatrices, sans shooting ni tournage." },
        { icone: Globe, titre: "SEO", texte: "Des fiches et des articles écrits pour ressortir sur Google et sur ChatGPT." },
        { icone: Brain, titre: "Données", texte: "Les conversations croisées avec vos ventes : les attentes de vos clients et leurs points de blocage." },
      ] },
      { t: "h2", texte: "Pourquoi c’est utile à une marque qui démarre" },
      { t: "p", texte: "Une agence photo, une agence SEO, une agence social media se paient chacune séparément. Chez Lystes, ces métiers deviennent des équipes IA, intégrées à votre marque et disponibles 24 h sur 24. Vous vendez davantage aux visiteurs que vous avez déjà, avant d’en acheter de nouveaux." },
      { t: "note", texte: "Pour découvrir les équipes une par une : lystes.ai. Pour savoir lesquelles servent votre marque dès le lancement, parlons-en en rendez-vous." },
    ],
  },
  {
    slug: "instituts-salons-reassort-sans-minimum",
    titre: "Instituts, centres médicaux, salons : vos soins à votre marque, sans minimum",
    titreSeo: "Votre marque de soins en institut, sans minimum | Biolystes",
    description: "Instituts, centres médicaux esthétiques, salons de coiffure : commandez 1, 10 ou 1 000 produits à votre marque, livrés dans votre établissement.",
    chapo: "Vendre vos propres soins dans votre établissement, sans immobiliser de stock en réserve : c’est ce que permet le réassort sans minimum.",
    categorie: "Professionnels",
    date: "2026-10-12",
    image: imgInstituts,
    alt: "Salon de coiffure, espace de vente et fauteuils",
    appel: "Parlons de vos soins à votre marque pour votre établissement.",
    corps: [
      { t: "p", texte: "Vous êtes un institut, un centre médical, un salon de coiffure ? Pas besoin de minimum de stock pour vos points de vente physiques. Commandez 1, 10 ou 1 000 produits selon vos besoins réels." },
      { t: "h2", texte: "Comment se passe une commande" },
      { t: "cartes", items: [
        { icone: ShoppingBag, titre: "Commande automatisée", texte: "Vous passez vos commandes via notre plateforme, avec votre branding." },
        { icone: Zap, titre: "Fabrication rapide", texte: "Le laboratoire fabrique le produit commandé en 72 heures, avec votre branding." },
        { icone: PackageCheck, titre: "Livraison directe", texte: "Le logisticien récupère votre colis au laboratoire et l’expédie dans votre établissement, en moins de 15 jours." },
      ] },
      { t: "h2", texte: "Ils nous font confiance" },
      { t: "p", texte: "Wirtzkin, centre médical esthétique spécialisé dans les soins de la peau, a choisi Biolystes pour la production de ses produits cosmétiques bio et véganes." },
      { t: "h2", texte: "Prolonger le soin à la maison" },
      { t: "p", texte: "Un QR code sur le packaging peut placer un coach IA derrière chaque produit : il aide votre client à bien l’utiliser chez lui, et à revenir vers vous quand il faut le racheter." },
    ],
  },

  /* ─────────────── Articles publiés par JP, repris sans montants ─────────────── */
  {
    slug: "etude-92-pourcent",
    titre: "92 % des porteurs de projets cosmétiques sur mesure n’ont toujours pas lancé leur marque 7 mois après",
    titreSeo: "",
    description: "Étude interne Biolystes, échantillon de 30 porteurs de projets, suivi sur 7 mois. Pourquoi la formulation sur mesure bloque la majorité des projets.",
    chapo: "",
    categorie: "Étude",
    date: "2026-03-12",
    image: imgEtude,
    alt: "Visage de femme en lumière naturelle",
    appel: "",
    corps: [],
    url: "/etudes",
  },
  {
    slug: "coffrets",
    titre: "Désormais Biolystes propose des coffrets clés en main",
    titreSeo: "Coffrets cosmétiques : panier moyen et ventes | Biolystes",
    description: "Des coffrets cosmétiques bio prêts à vendre pour augmenter votre panier moyen et fidéliser vos clients, sans minimum de commande.",
    chapo: "Augmentez votre panier moyen et fidélisez vos clients avec des collections prêtes à vendre.",
    categorie: "Nouveauté",
    date: "2026-03-12",
    image: imgCoffrets,
    alt: "Coffret et flacons blancs d’une collection de soins",
    imageEntiere: true,
    appel: "Intégrez des coffrets à votre gamme dès aujourd’hui.",
    corps: [
      { t: "h2", texte: "Le constat" },
      { t: "p", texte: "Le panier moyen est l’un des leviers les plus puissants pour augmenter le chiffre d’affaires d’une marque cosmétique. Pourtant, la majorité des jeunes marques ne proposent que des produits à l’unité, sans offre structurée pour encourager l’achat multiple." },
      { t: "p", texte: "Les coffrets cadeaux et les routines complètes répondent à un besoin concret du consommateur : ne pas avoir à choisir, bénéficier d’un ensemble cohérent, et offrir un produit qui a de l’allure." },
      { t: "h2", texte: "Pourquoi intégrer des coffrets à votre gamme" },
      { t: "cartes", items: [
        { icone: TrendingUp, titre: "Augmenter le panier moyen", texte: "Un coffret de trois produits se vend plus cher qu’un produit à l’unité, et sa valeur perçue est supérieure : le client a l’impression de faire une bonne affaire en achetant un ensemble plutôt que des produits séparés." },
        { icone: Star, titre: "Renforcer l’image de marque", texte: "Un coffret bien présenté, avec un packaging soigné et une cohérence produit, positionne immédiatement votre marque comme premium. C’est aussi un excellent outil pour les fêtes, la Saint-Valentin, la fête des mères, ou comme cadeau d’entreprise." },
        { icone: Gift, titre: "Fidéliser les clients", texte: "Quand un client découvre trois ou quatre produits d’un coup, il est beaucoup plus susceptible de racheter ses préférés à l’unité ensuite. Le coffret agit comme une découverte premium qui crée de la fidélisation naturelle." },
      ] },
      { t: "h2", texte: "Nos coffrets disponibles" },
      { t: "cartes", items: [
        { titre: "Trio anti-âge", texte: "Crème anti-âge, sérum peptides, crème yeux 3 en 1. Une routine anti-âge complète." },
        { titre: "Luminous Skin", texte: "Démaquillant biphasé, sérum collagène, crème yeux. Éclat et jeunesse." },
        { titre: "Trio Glowy Skin", texte: "Lait démaquillant, crème hydratante, huile nourrissante. Une routine glow quotidienne." },
        { titre: "Hydratation profonde", texte: "Gel double boost, sérum hydratant. Une hydratation intense." },
        { titre: "Routine soin de la peau", texte: "Mousse nettoyante, sérum vitamine C, crème anti-âge, crème yeux. Une routine complète en quatre produits." },
      ] },
      { t: "chiffre", valeur: "0", texte: "minimum de commande. Commandez un seul coffret ou cent, sans stock à gérer.", note: "Coffrets certifiés bio et végans, packaging recyclable, personnalisable à votre marque." },
      { t: "h2", texte: "Comment ça marche" },
      { t: "liste", numerotee: true, items: [
        "Vous choisissez les coffrets qui correspondent à votre positionnement.",
        "Nos designers personnalisent le packaging à votre marque : logo, couleurs, identité.",
        "Votre client commande, nous fabriquons, nous livrons directement chez lui.",
        "Vous n’avez aucun stock à gérer, aucune logistique à organiser.",
      ] },
    ],
  },
  {
    slug: "reseau-presse",
    titre: "Accédez à notre réseau presse Marie Claire",
    titreSeo: "Plan de notoriété presse, Marie Claire | Biolystes",
    description: "Nos clients peuvent bénéficier d’articles sponsorisés dans Marie Claire pour faire connaître leur marque auprès d’une audience qualifiée.",
    chapo: "Faites connaître votre marque grâce à des articles sponsorisés dans l’un des plus grands magazines féminins. Service sur devis.",
    categorie: "Presse",
    date: "2026-03-12",
    image: imgPresse,
    alt: "Logo du magazine Marie Claire",
    imageEntiere: true,
    appel: "Lancez votre marque et bénéficiez d’une visibilité presse.",
    corps: [
      { t: "h2", texte: "Le défi de la visibilité" },
      { t: "p", texte: "Quand on lance une marque cosmétique, le plus grand défi n’est pas le produit. C’est la visibilité. Avoir un excellent produit ne sert à rien si personne ne le connaît. Et les canaux classiques, réseaux sociaux et publicité payante, prennent du temps à produire des résultats." },
      { t: "p", texte: "La presse reste l’un des leviers les plus puissants pour installer la crédibilité d’une marque. Un article dans un magazine reconnu crée une légitimité immédiate que des mois de publications Instagram ne peuvent pas égaler." },
      { t: "chiffre", valeur: "3M+", texte: "de lectrices mensuelles, une audience qualifiée, passionnée par la beauté et le bien-être.", note: "Marie Claire est une référence de la presse féminine depuis plus de 80 ans. Être mentionné dans ses pages, c’est un signal de confiance fort pour vos futurs clients." },
      { t: "h2", texte: "Plan de notoriété : ce que ça change pour votre marque" },
      { t: "cartes", items: [
        { icone: Eye, titre: "Crédibilité instantanée", texte: "Un article sponsorisé dans Marie Claire positionne votre marque aux côtés des grands noms de la beauté. Vos clients potentiels voient votre marque dans un contexte premium, ce qui facilite la conversion." },
        { icone: Globe, titre: "Visibilité SEO durable", texte: "Un article en ligne sur marieclaire.fr reste indexé par Google. Contrairement à une story qui disparaît en 24 heures ou à une publicité qui s’arrête avec le budget, il continue de générer du trafic et de la crédibilité pendant des mois." },
        { icone: Users, titre: "Audience qualifiée", texte: "Les lectrices de Marie Claire correspondent au profil des consommatrices de cosmétiques bio et premium : femmes actives, attentives à leur bien-être. Une audience qu’il serait coûteux de cibler aussi précisément par la publicité." },
        { icone: Megaphone, titre: "Levier de vente directe", texte: "L’article inclut un lien direct vers votre boutique en ligne. Chaque lectrice intéressée accède à vos produits en un clic." },
      ] },
      { t: "h2", texte: "Comment ça marche" },
      { t: "liste", numerotee: true, items: [
        "Vous lancez votre marque avec Biolystes.",
        "Vous accédez à notre réseau presse partenaire.",
        "Nous rédigeons un article sponsorisé qui met en valeur votre marque et vos produits.",
        "L’article est publié sur marieclaire.fr avec un lien vers votre boutique.",
        "Vous bénéficiez d’une visibilité durable auprès de ses lectrices.",
      ] },
      { t: "note", texte: "L’accès au réseau presse est réservé aux clients Biolystes. C’est un levier de visibilité que la plupart des jeunes marques ne peuvent pas se permettre seules." },
    ],
  },
  {
    slug: "lancer-marque",
    titre: "Comment lancer sa marque cosmétique bio en 15 jours",
    titreSeo: "Lancer sa marque cosmétique en 10 jours ouvrés | Biolystes",
    description: "Comment lancer votre marque de cosmétiques bio et véganes en 10 jours ouvrés avec Biolystes, sans stock ni minimum de commande.",
    chapo: "Zéro stock, zéro logistique, des formules certifiées COSMOS et ECOCERT. Le guide complet.",
    categorie: "Guide",
    date: "2026-02-22",
    image: imgLancer15,
    alt: "Femme qui présente un soin de sa marque devant un miroir",
    appel: "Lancez votre marque cosmétique bio et végane, clé en main.",
    corps: [
      { t: "h2", texte: "Lancer une marque cosmétique, un parcours semé d’embûches" },
      { t: "p", texte: "La demande en cosmétique bio et naturelle ne cesse de croître, portée par des consommateurs de plus en plus exigeants sur la composition de leurs produits." },
      { t: "p", texte: "Pourtant, lancer une marque cosmétique reste un parcours semé d’embûches. Entre les laboratoires, les certifications, le packaging, le site e-commerce, la logistique et le marketing, un entrepreneur isolé peut facilement passer plus d’un an avant de vendre son premier produit." },
      { t: "p", texte: "**Biolystes a ramené ce parcours à 10 jours ouvrés.** Voici comment." },
      { t: "h2", texte: "Étape 1 : la mise en place de votre marque" },
      { t: "cartes", items: [
        { icone: ShieldCheck, titre: "Sélection des produits", texte: "Plus de 100 formules certifiées bio et véganes. Vous choisissez les produits qui correspondent à votre positionnement avec l’aide d’un expert produit : visage, corps, cheveux, maquillage, solaire, homme, coffrets." },
        { icone: Zap, titre: "Création de l’identité visuelle", texte: "Un chef de projet pilote l’ensemble : identité visuelle, design du packaging recyclable, photos, contenu du site. Un seul interlocuteur, pas de va-et-vient entre prestataires." },
        { icone: Globe, titre: "Boutique en ligne prête à vendre", texte: "Site e-commerce complet, référencement, hébergement, nom de domaine. Tout est configuré pour que vous puissiez vendre dès le premier jour." },
      ] },
      { t: "h2", texte: "Étape 2 : la gestion au quotidien" },
      { t: "p", texte: "Une fois votre marque lancée, tout devient automatique :" },
      { t: "liste", items: [
        "Votre client commande sur votre site.",
        "Le laboratoire fabrique le produit à la demande.",
        "Le produit est expédié directement chez votre client, sous votre nom de marque.",
        "Vous n’avez aucun stock à gérer, aucune logistique.",
        "Des équipes IA travaillent jour et nuit : conseil produit, diagnostic, contenus.",
      ] },
      { t: "chiffre", valeur: "15 j", texte: "de la sélection des produits à la mise en ligne de votre boutique.", note: "Zéro stock, certifications incluses, site e-commerce complet." },
      { t: "h2", texte: "Combien ça coûte" },
      { t: "p", texte: "L’accompagnement comprend des **frais de lancement** et un **abonnement mensuel** (hébergement, gestion des livraisons, support, référencement, nom de domaine, chat IA). Les tarifs détaillés vous sont présentés lors d’un rendez-vous avec un expert." },
    ],
  },
  {
    slug: "biais-actif",
    titre: "Le biais de l’actif : pourquoi l’ingrédient ne fait pas le produit",
    titreSeo: "Le biais de l’actif star en cosmétique | Biolystes",
    description: "Pourquoi se focaliser sur un seul actif freine le lancement de votre marque cosmétique, et comment l’éviter.",
    chapo: "Pour le client final, le plus important, c’est que le produit fonctionne. Pas la liste des actifs sur l’étiquette.",
    categorie: "Réflexion",
    date: "2026-02-15",
    image: imgBiais,
    alt: "Gousses de cardamome vertes en gros plan",
    appel: "Lancez votre marque cosmétique bio et végane, clé en main.",
    corps: [
      { t: "h2", texte: "L’observation qui a tout changé" },
      { t: "p", texte: "En accompagnant des dizaines de porteurs de projets cosmétiques, nous avons observé un schéma récurrent : la majorité des entrepreneurs sont obsédés par un ingrédient précis, au point de bloquer tout leur projet dessus." },
      { t: "p", texte: "« Je veux absolument de l’huile de marula. » « Il me faut du rétinol dans ma formule. » « Je ne lancerai rien sans cet actif précis. »" },
      { t: "p", texte: "Cette obsession pour l’ingrédient est ce que nous appelons le **biais de l’actif**. C’est l’une des principales raisons pour lesquelles tant de projets cosmétiques n’aboutissent jamais." },
      { t: "h2", texte: "Le piège de l’ingrédient miracle" },
      { t: "cartes", items: [
        { icone: Sparkles, titre: "L’ingrédient n’est pas le produit", texte: "Un ingrédient, aussi noble soit-il, ne fait pas un produit cosmétique. Un bon produit, c’est une formulation complète, équilibrée, stable, testée, certifiée, et présentée dans un packaging qui inspire confiance." },
        { icone: Users, titre: "Le client ne raisonne pas comme le créateur", texte: "Quand une cliente cherche un sérum anti-âge, elle ne pense pas « je veux du rétinol ». Elle pense « je veux moins de rides ». Si un sérum au bakuchiol, alternative naturelle au rétinol, lui donne satisfaction, elle sera tout aussi contente. Elle ne vérifie pas la liste INCI, elle vérifie si le produit lui convient." },
        { icone: Target, titre: "Le vrai différenciateur, c’est la marque", texte: "Personne n’a le monopole d’un ingrédient. Huile de marula, rétinol, vitamine C, acide hyaluronique : ces actifs sont disponibles pour tout le monde. Ce qui fait la différence, c’est le positionnement, l’image de marque, la capacité à se faire connaître et à créer une relation avec ses clients." },
      ] },
      { t: "comparaison",
        gauche: { titre: "Approche « ingrédient »", items: ["12 mois et plus de développement", "Un stock minimum à financer", "Plus de budget pour le marketing", "92 % des projets sur mesure pas lancés après 7 mois"] },
        droite: { titre: "Approche « résultat »", items: ["10 jours ouvrés pour lancer", "Zéro stock", "Le budget reste libre pour le marketing", "Des formules certifiées, prêtes à vendre"] },
        contre: true,
      },
      { t: "h2", texte: "L’approche rationnelle" },
      { t: "p", texte: "La stratégie la plus intelligente est de commencer par lancer avec des produits existants, certifiés et de qualité, qui répondent au même besoin que celui que vous visez. Se constituer une clientèle, valider le marché, générer des ventes." },
      { t: "p", texte: "Et compléter ensuite sa gamme avec du sur-mesure, quand les moyens et le recul le permettent. C’est une approche progressive, pragmatique, qui maximise les chances de succès." },
      { t: "note", texte: "Cet article n’a pas pour but de décourager la formulation sur mesure. Il a pour but de vous alerter sur un biais qui bloque de nombreux projets. Si vous en êtes conscient, vous serez mieux armé pour prendre des décisions rationnelles." },
    ],
  },
];

/** Les articles visibles : les articles cachés (`masque`) n’en font pas partie. */
export const articles = tousLesArticles.filter((a) => !a.masque);

export const articlesDuGabarit = articles.filter((a) => !a.url);

export function articleParSlug(slug: string | undefined) {
  return articlesDuGabarit.find((a) => a.slug === slug);
}

const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
export function dateLisible(iso: string) {
  const [a, m, j] = iso.split("-").map(Number);
  return `${j}${j === 1 ? "er" : ""} ${MOIS[m - 1]} ${a}`;
}

/** Espaces insécables avant ? ! : ; et dans « … », et entre les deux derniers
 *  mots : aucun signe ni aucun mot ne part seul à la ligne (JP). */
const INS = String.fromCharCode(160); // espace insécable
export function typo(texte: string) {
  return texte
    .replace(/ ([?!:;\u00bb])/g, INS + "$1")
    .replace(/\u00ab /g, "\u00ab" + INS)
    .replace(/(\d) (%|j\b|jours|heures|ans|mois|produits)/g, "$1" + INS + "$2")
    .replace(/ (\S{1,18})$/, INS + "$1");
}
