/* Six témoignages d'anciennes clientes de Biolystes (JP, 21/10/2026 : « vraies
   anciennes clientes »). Textes de JP repris tels quels ; seule la typographie
   est corrigée par `typo` : guillemets français, espace insécable avant
   « : ; ? ! » et avant « », apostrophe courbe, jamais de tiret long.
   Prénom et initiale seulement : ni photo, ni étoile, ni note, ni marque.
   Même liste dans biolystes.pro (src/data/temoignages.ts) : à garder identique. */

export type Temoignage = { prenom: string; titre?: string; texte: string };

/** Typographie française : insécables avant : ; ? ! et » ; après «. */
export function typo(t: string): string {
  return t
    .replace(/'/g, "’")
    .replace(/ ([:;?!»])/g, " $1")
    .replace(/« /g, "« ")
    .replace(/(\d) (mois|ans?|semaines?)/g, "$1 $2");
}

const BRUT: Temoignage[] = [
  {
    prenom: "Amanda B.",
    titre: "Résultats visibles dès le troisième mois",
    texte: "« Honnêtement, j'ai un peu galéré au début : je ne savais pas trop comment présenter les produits ni à qui m'adresser. J'ai pris le temps de me former, de tester les soins et d'écouter les retours de mes premières clientes. Aujourd'hui, ça va beaucoup mieux : mes ventes sont plus régulières et j'ai enfin une vraie dynamique. Merci à la team pour sa patience et sa réactivité. »",
  },
  {
    prenom: "Joseph M.",
    titre: "Résultats rapides grâce à ma communauté",
    texte: "« J'ai eu des résultats directement, parce que ma communauté a été très réceptive dès le lancement. La qualité des produits a fait la différence : les retours sur les textures et l'efficacité ont été très positifs. J'ai pu vendre dès les premières semaines sans avoir à justifier longuement le prix. Merci à l'équipe pour l'accompagnement et la qualité du suivi. »",
  },
  {
    prenom: "Fanta C.",
    titre: "Au bout de 3 mois, la machine était lancée",
    texte: "« Les deux premiers mois ont servi à construire ma clientèle et à comprendre ce qui fonctionnait. Au bout de 3 mois, j'ai commencé à développer mon chiffre d'affaires de façon plus stable. Les produits sont de bonne qualité et les clientes reviennent, ce qui change tout. L'équipe est hyper réactive, super disponible quand j'ai une question. »",
  },
  {
    prenom: "Nadège P.",
    titre: "Quatre mois pour trouver mon rythme",
    texte: "« Je ne vais pas dire que tout a été facile : il a fallu environ 4 mois pour vraiment trouver mon rythme et mes bons canaux de vente. Mais la qualité des produits m'a aidée à créer de la confiance rapidement. Une fois les premiers avis clients arrivés, les ventes ont décollé. Merci à la team pour les conseils et le suivi régulier. »",
  },
  {
    prenom: "Sophie M.",
    titre: "Des premières ventes dès le lancement",
    texte: "« J'ai eu la chance d'avoir une audience déjà intéressée par la cosmétique naturelle, donc les premières ventes sont arrivées assez vite. Ce qui m'a surprise, c'est la fidélisation : les clientes reviennent et recommandent les produits autour d'elles. La qualité est vraiment au rendez-vous, et l'équipe m'a bien accompagnée sur les contenus et le positionnement. »",
  },
  {
    prenom: "Rosine A.",
    titre: "Une montée en puissance progressive",
    texte: "« Au début, j'ai dû apprendre à vendre, à créer du contenu et à gérer les questions clientes. Ce n'était pas évident tous les jours, mais j'ai progressé étape par étape. Aujourd'hui, après quelques mois, j'ai une activité plus fluide et des ventes plus régulières. Merci à l'équipe pour sa disponibilité : c'est rassurant de ne pas être seule face aux décisions. »",
  },
];

export const TEMOIGNAGES: Temoignage[] = BRUT.map((t) => ({
  prenom: t.prenom,
  titre: t.titre ? typo(t.titre) : undefined,
  texte: typo(t.texte),
}));

/* Avis audio (JP, 21/10/2026) : extrait de 1 minute du vocal d'une cliente à
   « la team expert Biolystes » (source : ~/Documents/biolystes-documents/
   temoignages/2026-10-21-vocal-cliente.ogg, du passage « quand j'ai ouvert le
   colis » à « rien à envier aux autres marques »). Fichiers dans public/audio.
   Accord de la cliente pour publier sa voix : confirmé par JP le 21/10/2026. */
/** INTERRUPTEUR : false = la carte « Avis audio » n'est pas affichée. Accord de
 *  la cliente confirmé par JP le 21/10/2026, donc true ; repasser à false pour
 *  retirer sa voix. */
export const AVIS_AUDIO_PUBLIE = true;
/** Signature affichée : le prénom seul, comme les six avis écrits (Odile,
 *  21/10/2026 : anonymiser au maximum pour éviter les recherches des leads).
 *  Ni nom de marque, ni lien vers son site. */
export const AVIS_AUDIO_NOM = "Corinne";
export const AVIS_AUDIO = {
  sources: [
    { src: "/audio/avis-cliente-biolystes.m4a", type: "audio/mp4" },
    { src: "/audio/avis-cliente-biolystes.mp3", type: "audio/mpeg" },
  ],
  /** Durée de l'extrait, affichée avant le chargement du fichier. */
  duree: 60,
  citation: typo("« Quand j'ai ouvert le colis, très sincèrement, j'ai eu la larme à l'œil. »"),
  /* Transcription de l'extrait, relue sur l'enregistrement. */
  transcription: typo(
    "Quand j'ai ouvert le colis, très sincèrement, j'ai eu la larme à l'œil. Très honnêtement, j'ai eu la larme à l'œil et j'ai vraiment été bluffée par la qualité du packaging. Très sincèrement, parce que c'est vrai qu'on voit le catalogue, on voit les millilitres, etc. Mais en réalité, je n'avais pas, en fait, de visibilité sur est-ce que la pompe va être petite, est-ce que le pot va être petit, quelle taille ça aura. Et très sincèrement, quand je les ai eus, j'ai été bluffée déjà par la qualité du packaging, par la qualité des produits et par la qualité globale de l'étiquetage, etc. Franchement, je me suis dit : waouh, mais c'est dingue. C'est réel, quoi. C'est réel, mais c'est super quali, en fait. J'ai une beauté entre les mains et j'ai vraiment, vraiment rien à envier aux autres marques.",
  ),
};
