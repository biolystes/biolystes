/* L'ÉLISION DEVANT UN NOM DE MARQUE (JP, 30/09/2026).
 *
 * Vu en ligne sur /ecloseparis/contact : « Le conseiller de Éclose Paris
 * vous répond ». Le français élide « de », « le », « que » devant une voyelle
 * ou un h muet : « d'Éclose Paris », « qu'Aesop », « l'Atelier ».
 *
 * Aucune IA, aucun dictionnaire : la première lettre du nom décide, avec
 * trois nuances.
 * - Le h est muet par défaut (« d'Hermès », « d'Horace »), sauf devant les
 *   débuts de mots au h aspiré, français ou anglais, fréquents dans les noms
 *   de marque (« de Haute Couture », « de Hair Studio »).
 * - Le y ne s'élide que devant une consonne (« d'Yves Rocher », mais
 *   « de Yamaha »).
 * - Quelques mots commencent par une voyelle sans jamais s'élider (« de
 *   Oui », « de Onze »). */

const VOYELLES = "aàâäeéèêëiîïoôöuùûüæœ";

/* Débuts de mots au h aspiré : on ne dit ni « d'Haut » ni « d'Hair ». Comparés
   sans accents ni majuscules. Un début trop court attraperait un h muet
   (« hot » prendrait « hôtel », « hall » « hallucination ») : ceux-là sont
   dans la liste des mots entiers. */
const H_ASPIRES_DEBUTS = [
  "hache", "haie", "haine", "halte", "hamac", "hameau", "hamster", "hanche",
  "handicap", "hangar", "hanter", "harcel", "hardi", "hareng", "haricot",
  "harpe", "hasard", "hate", "hausse", "haut", "havre", "hennir", "herisson",
  "hernie", "heron", "heros", "hetre", "hibou", "hideux", "hierarch", "hippie",
  "hisser", "hocher", "hockey", "hollande", "homard", "hongr", "honte", "hoquet",
  "hors", "hotte", "houblon", "houle", "housse", "hublot", "hululer",
  "hurler", "hutte",
  /* Mots anglais : le h s'y prononce. */
  "hair", "hand", "happ", "hard", "head", "heal", "heart", "heat", "heaven", "hello",
  "help", "high", "hill", "hive", "hold", "holy", "honey", "house", "hunt", "husk",
];
const H_ASPIRES_MOTS = ["hall", "home", "hope", "hot", "houx", "hug", "huit"];

/* Mots qui commencent par une voyelle sans s'élider. */
const SANS_ELISION = ["oui", "onze", "onzieme", "ouistiti", "ouate"];

function sansAccents(mot: string): string {
  return mot.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/** Vrai quand le nom commence par une voyelle ou un h muet : c'est là que
 *  « de », « le », « que » s'élident. */
export function commenceParVoyelle(nom: string | null | undefined): boolean {
  const texte = (nom ?? "").trim();
  if (!texte) return false;
  const premier = texte.split(/[\s'’-]/)[0] ?? "";
  const bas = premier.toLowerCase();
  const simple = sansAccents(premier);
  const initiale = bas.charAt(0);

  if (SANS_ELISION.includes(simple)) return false;
  if (VOYELLES.includes(initiale)) return true;
  if (initiale === "y") {
    /* « Yves » s'élide, « Yamaha » non : le y devant voyelle est une consonne. */
    const suivante = simple.charAt(1);
    return suivante !== "" && !VOYELLES.includes(suivante);
  }
  if (initiale === "h") {
    const suivante = simple.charAt(1);
    if (!suivante || !VOYELLES.includes(suivante)) return false;
    if (H_ASPIRES_MOTS.includes(simple)) return false;
    return !H_ASPIRES_DEBUTS.some((debut) => simple.startsWith(debut));
  }
  return false;
}

type Petit = "de" | "le" | "que";

const ELIDES: Record<Petit, string> = { de: "d", le: "l", que: "qu" };

/** Le petit mot suivi du nom, élidé quand il le faut :
 *  eliser("de", "Éclose Paris") → « d'Éclose Paris »,
 *  eliser("de", "Lystes") → « de Lystes ». Un nom vide rend le petit mot
 *  seul, sans espace pendante. Une majuscule initiale sur le petit mot est
 *  gardée (« D'Éclose », « Que Lystes »). */
export function eliser(petit: Petit | "De" | "Le" | "Que", nom: string | null | undefined, apostrophe = "'"): string {
  const texte = (nom ?? "").trim();
  const bas = petit.toLowerCase() as Petit;
  const majuscule = petit !== bas;
  if (!texte) return petit;
  if (!commenceParVoyelle(texte)) return `${petit} ${texte}`;
  const elide = ELIDES[bas];
  const debut = majuscule ? elide.charAt(0).toUpperCase() + elide.slice(1) : elide;
  return `${debut}${apostrophe}${texte}`;
}

/** Raccourci le plus courant : « de Lystes », « d'Éclose Paris ». */
export const deMarque = (nom: string | null | undefined, apostrophe = "'") => eliser("de", nom, apostrophe);
