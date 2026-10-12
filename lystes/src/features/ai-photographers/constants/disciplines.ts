/**
 * Les quatre métiers créatifs partagent EXACTEMENT la même technologie que le
 * photographe personnalisé (upload de références → `analyze-photographer-style`
 * → `custom_photographers` → `calibrate-photographer` → session de génération).
 * On ne réécrit rien : seul le vocabulaire change, via la colonne `discipline`.
 */
export type DisciplineCreative =
  | 'photographe'
  | 'graphiste'
  | 'ugc'
  | 'community'
  | 'journaliste'
  | 'marketing';

export interface DisciplineConfig {
  id: DisciplineCreative;
  /** Segment d'URL : /dashboard/ai-photographers/create/<slug> */
  slug: string;
  titreCreation: string;
  singulier: string;
  pluriel: string;
  onglet: string;
  sousTitre: string;
  labelReferences: string;
  placeholderNom: string;
  placeholderSpecialite: string;
}

export const DISCIPLINES: Record<DisciplineCreative, DisciplineConfig> = {
  photographe: {
    id: 'photographe',
    slug: 'photographe',
    titreCreation: 'Créer mon photographe',
    singulier: 'Photographe IA',
    pluriel: 'Photographes IA',
    onglet: 'Photographes IA',
    sousTitre:
      "Uploadez des références, l'IA capture le style et vous génère des shootings variés dans cette signature.",
    labelReferences: 'Références visuelles * (3–6 photos)',
    placeholderNom: 'ex. Nolan',
    placeholderSpecialite: 'ex. Beauty éditorial',
  },
  graphiste: {
    id: 'graphiste',
    slug: 'graphiste',
    titreCreation: 'Créer mon graphiste',
    singulier: 'Graphiste IA',
    pluriel: 'Graphistes IA',
    onglet: 'Graphistes IA',
    sousTitre:
      "Uploadez vos visuels de référence, l'IA capture la direction artistique et la rejoue sur vos produits.",
    labelReferences: 'Références graphiques * (3–6 visuels)',
    placeholderNom: 'ex. Studio Nord',
    placeholderSpecialite: 'ex. Affiches produit',
  },
  ugc: {
    id: 'ugc',
    slug: 'createur-ugc',
    titreCreation: 'Créer mon créateur UGC',
    /* 15/09/2026 (JP) : « et maintenant Agence UGC IA ». Comme pour la
       communication, seuls les LIBELLES changent : `id` et `slug` restent
       `ugc`, parce que des lignes en base les portent deja. */
    singulier: 'Agence UGC IA',
    pluriel: 'Agences UGC IA',
    onglet: 'Agences UGC IA',
    sousTitre:
      "Uploadez des contenus de référence, l'IA capture le ton UGC et le rejoue avec vos produits.",
    labelReferences: 'Références UGC * (3–6 contenus)',
    placeholderNom: 'ex. Lina',
    placeholderSpecialite: 'ex. Unboxing skincare',
  },
  community: {
    id: 'community',
    slug: 'community-manager',
    titreCreation: 'Créer mon agence de communication',
    /* 14/09/2026 (JP) : « community managers sera renommé en agence de
       communication IA ». Seuls les LIBELLÉS changent : `id` et `slug`
       restent `community` / `community-manager`, parce que des lignes en
       base les portent déjà. Renommer une clé pour changer un mot à l'écran
       orpheline les profils que les marchandes ont créés. */
    singulier: 'Agence de communication IA',
    pluriel: 'Agences de communication IA',
    onglet: 'Agences de communication IA',
    sousTitre:
      "Uploadez le moodboard du feed Instagram visé : l'IA en tire la ligne éditoriale et produit des posts dans ce style.",
    labelReferences: 'Moodboard du feed * (3–6 images)',
    placeholderNom: 'ex. Feed Pastel',
    placeholderSpecialite: 'ex. Feed Instagram minimal',
  },
  // Le journaliste rend du texte, pas une image : ses « références » sont des
  // articles déjà écrits, dont l'IA reprend la voix.
  journaliste: {
    id: 'journaliste',
    slug: 'journaliste',
    titreCreation: 'Créer mon journaliste',
    singulier: 'Journaliste IA',
    pluriel: 'Journalistes IA',
    onglet: 'Journalistes IA',
    sousTitre:
      "Choisissez une voix : l'IA écrit vos articles dans cette signature, à partir des questions de vos clientes.",
    labelReferences: 'Articles de référence * (3–6 textes)',
    placeholderNom: 'ex. Camille',
    placeholderSpecialite: 'ex. Enquête beauté',
  },
  /* 14/09/2026 (JP) : « rajouter agence marketing IA, exactement le même
     gabarit que Lucie, sauf que les images générées seront plus des images
     avec un design publicitaire ».

     Même moule que `community` : mêmes écrans, même semaine, même équipe,
     même planche. Ce qui change tient dans les références qu'on lui donne et
     dans ce qu'elle en tire : une accroche, un prix, un bouton, une promesse
     lisible en un dixième de seconde. Une agence de communication cherche la
     cohérence d'un feed ; celle-ci cherche le clic. */
  marketing: {
    id: 'marketing',
    slug: 'agence-marketing',
    titreCreation: 'Créer mon agence marketing',
    singulier: 'Agence marketing IA',
    pluriel: 'Agences marketing IA',
    onglet: 'Agences marketing IA',
    sousTitre:
      "Uploadez les publicités qui vous inspirent : l'IA en tire la mise en page, l'accroche et l'appel à l'action, et les rejoue avec vos produits.",
    labelReferences: 'Publicités de référence * (3–6 visuels)',
    placeholderNom: 'ex. Studio Signal',
    placeholderSpecialite: 'ex. Publicités Meta conversion',
  },
};

export const LISTE_DISCIPLINES = Object.values(DISCIPLINES);

export function disciplineDepuisSlug(slug: string | undefined): DisciplineConfig {
  return LISTE_DISCIPLINES.find((d) => d.slug === slug) ?? DISCIPLINES.photographe;
}
