/** Catalogue éditeurs du 02/09/2026 repris de Lystes AI.
 * Les tarifs et le paiement ne sont pas importés dans la version publique. */
export const LECTORATS = ['Femme', 'Homme', 'Mixte'] as const;
export type Lectorat = typeof LECTORATS[number];
export const POSITIONNEMENTS = ['Mode & beauté', 'Luxe', 'People', 'Famille & bien-être', 'Économie & actualité', 'Business & marketing'] as const;
export type Positionnement = typeof POSITIONNEMENTS[number];
export interface Magazine {
  editeur: string;
  /** Lectorat principal revendiqué par le titre. */
  lectorat: Lectorat;
  positionnement: Positionnement;
  thematiques: string[];
  tf: number;
  dr: number;
  rd: number;
  visites: number;
}
export const MAGAZINES: Magazine[] = [
  { editeur: 'vogue.fr', lectorat: 'Femme', positionnement: 'Luxe', thematiques: ['Culture & Art', 'Shopping & Promo', 'Mode & Beauté', 'Lifestyle & Vie pratique'], tf: 64, dr: 82, rd: 11798, visites: 954277 },
  { editeur: 'gqmagazine.fr', lectorat: 'Homme', positionnement: 'Mode & beauté', thematiques: ['Culture & Art', 'Shopping & Promo', 'Lifestyle & Vie pratique', 'Santé & Bien-être'], tf: 54, dr: 75, rd: 5353, visites: 532963 },
  { editeur: 'fr.euronews.com', lectorat: 'Mixte', positionnement: 'Économie & actualité', thematiques: ['Culture & Art', 'Economie & Société', 'Business & Entreprise', 'Tourisme & Voyage'], tf: 38, dr: 90, rd: 8746, visites: 229800 },
  { editeur: 'purepeople.com', lectorat: 'Femme', positionnement: 'People', thematiques: ['Loisirs & Divertissement', 'Mode & Beauté', 'Lifestyle & Vie pratique'], tf: 57, dr: 71, rd: 5455, visites: 1477845 },
  { editeur: 'grazia.fr', lectorat: 'Femme', positionnement: 'Mode & beauté', thematiques: [], tf: 55, dr: 75, rd: 5518, visites: 330043 },
  { editeur: 'strategies.fr', lectorat: 'Mixte', positionnement: 'Business & marketing', thematiques: ['Business & Entreprise', 'Education & Emploi', 'Marketing & Communication'], tf: 59, dr: 77, rd: 4737, visites: 12850 },
  { editeur: 'forbes.fr', lectorat: 'Mixte', positionnement: 'Économie & actualité', thematiques: ['Business & Entreprise'], tf: 35, dr: 83, rd: 10237, visites: 14761 },
  { editeur: 'cbnews.fr', lectorat: 'Mixte', positionnement: 'Business & marketing', thematiques: ['Business & Entreprise'], tf: 52, dr: 76, rd: 3452, visites: 12235 },
  { editeur: 'madame.lefigaro.fr', lectorat: 'Femme', positionnement: 'Luxe', thematiques: ['Culture & Art', 'Loisirs & Divertissement', 'Mode & Beauté', 'Lifestyle & Vie pratique'], tf: 45, dr: 91, rd: 10553, visites: 609500 },
  { editeur: 'latribune.fr', lectorat: 'Mixte', positionnement: 'Économie & actualité', thematiques: ['Economie & Société'], tf: 65, dr: 85, rd: 23223, visites: 137845 },
  { editeur: 'femmeactuelle.fr', lectorat: 'Femme', positionnement: 'Famille & bien-être', thematiques: ['Mode & Beauté', 'Famille & Enfant', 'Santé & Bien-être'], tf: 58, dr: 81, rd: 10756, visites: 1106315 },
  { editeur: 'voici.fr', lectorat: 'Femme', positionnement: 'People', thematiques: ['Shopping & Promo', 'Loisirs & Divertissement', 'Mode & Beauté', 'Lifestyle & Vie pratique'], tf: 55, dr: 73, rd: 5010, visites: 1454644 },
  { editeur: 'marieclaire.fr', lectorat: 'Femme', positionnement: 'Mode & beauté', thematiques: ['Culture & Art', 'Economie & Société', 'Shopping & Promo', 'Mode & Beauté'], tf: 67, dr: 84, rd: 14870, visites: 1589724 },
  { editeur: 'cosmopolitan.fr', lectorat: 'Femme', positionnement: 'Mode & beauté', thematiques: ['Culture & Art', 'Mode & Beauté', 'Lifestyle & Vie pratique'], tf: 32, dr: 77, rd: 6201, visites: 617239 },
  { editeur: 'challenges.fr', lectorat: 'Mixte', positionnement: 'Économie & actualité', thematiques: ['Economie & Société', 'Business & Entreprise', 'High-Tech & Geek', 'Auto & Moto'], tf: 43, dr: 83, rd: 15813, visites: 108172 },
  { editeur: 'solutions.lesechos.fr', lectorat: 'Mixte', positionnement: 'Business & marketing', thematiques: ['Economie & Société', 'Finance & Banque', 'Business & Entreprise', 'Marketing & Communication'], tf: 36, dr: 90, rd: 3386, visites: 23350 },
  { editeur: 'public.fr', lectorat: 'Femme', positionnement: 'People', thematiques: ['Loisirs & Divertissement', 'Mode & Beauté'], tf: 49, dr: 72, rd: 3802, visites: 491214 },
];
export const THEMATIQUES_MAGAZINES = [...new Set(MAGAZINES.flatMap(m => m.thematiques))].sort((a, b) => a.localeCompare(b, "fr"));
const normaliser = (texte: string) => texte.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
export interface FiltresMagazines { lectorats?: string[]; positionnements?: string[]; audiences?: number[] }
export const AUDIENCES = [{ min: 0, max: 100000, libelle: "Moins de 100 000 visites" }, { min: 100000, max: 500000, libelle: "100 000 à 500 000 visites" }, { min: 500000, max: 1000000, libelle: "500 000 à 1 million" }, { min: 1000000, max: Infinity, libelle: "Plus d'1 million" }];
export function filtrerMagazines(recherche: string, filtres: FiltresMagazines = {}) {
  const q = normaliser(recherche);
  const { lectorats = [], positionnements = [], audiences = [] } = filtres;
  return MAGAZINES.filter(m => (!lectorats.length || lectorats.includes(m.lectorat)) && (!positionnements.length || positionnements.includes(m.positionnement)) && (!audiences.length || audiences.some(i => m.visites >= AUDIENCES[i].min && m.visites < AUDIENCES[i].max)) && (!q || normaliser([m.editeur, m.positionnement, m.lectorat, ...m.thematiques].join(" ")).includes(q)));
}
