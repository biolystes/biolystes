/**
 * LE GENRE DÉDUIT DES PRÉNOMS DE COMMANDE.
 *
 * 14/09/2026 (JP) : la boutique a des milliers de prénoms en commande. Les
 * classer ne demande aucun modèle payant — un dictionnaire suffit, complété
 * par deux règles de terminaison françaises. Ce qui n'est pas reconnu reste
 * « indéterminé » : on ne devine pas le genre d'une personne.
 *
 * Le dictionnaire est volontairement multiculturel (France, Afrique de
 * l'Ouest, Maghreb, Antilles, anglophone), parce que la clientèle l'est.
 */

const FEMININS = new Set<string>([
  "marie","sophie","julie","aurelie","celine","nathalie","isabelle","sandrine","stephanie","valerie",
  "camille","laura","emma","chloe","manon","sarah","lea","ines","lina","yasmine","amina","fatima",
  "fatou","aissatou","aminata","mariama","khadija","aicha","awa","oumou","bintou","kadiatou","mariam",
  "rokia","nafissatou","hawa","salimata","adama","coumba","ndeye","astou","sokhna","penda","dieynaba",
  "anna","laurence","christine","catherine","sylvie","martine","monique","patricia","florence","helene",
  "elodie","melanie","pauline","clara","louise","alice","juliette","margaux","charlotte","eva","nina",
  "jessica","cynthia","vanessa","priscilla","murielle","carine","corinne","veronique","virginie","delphine",
  "linda","samira","nadia","leila","sofia","meriem","hanane","imane","salma","dounia","rania","narimane",
  "grace","gloria","esther","ruth","rachel","rebecca","deborah","naomi","jennifer","michelle","stacy",
  "kimberly","ashley","tiffany","brenda","sandra","karine","lucie","adele","agnes","beatrice","claudine",
  "danielle","francoise","genevieve","jacqueline","josiane","liliane","madeleine","nicole","odile","raymonde",
  "simone","therese","yvette","solange","antoinette","henriette","georgette","bernadette","clemence","maeva",
  "shirley","cindy","laetitia","alexandra","caroline","emilie","marion","audrey","maud","noemie","oceane",
  "lisa","maya","zoe","jade","lou","romane","ambre","anais","angele","apolline","capucine","elise","eloise",
  "faustine","garance","iris","joy","lena","lilou","maëlys","maelys","mila","nora","olivia","rose","sasha",
]);

const MASCULINS = new Set<string>([
  "jean","pierre","michel","alain","philippe","patrick","nicolas","christophe","david","julien",
  "thomas","maxime","antoine","alexandre","guillaume","kevin","jeremy","florian","romain","quentin",
  "mohamed","mohammed","ahmed","ali","omar","youssef","karim","rachid","hassan","said","abdel","bilal",
  "mamadou","ibrahima","ousmane","moussa","cheikh","alioune","abdoulaye","babacar","modou","souleymane",
  "amadou","boubacar","lamine","seydou","sidy","malick","pape","assane","serigne","idrissa","demba",
  "john","james","robert","william","michael","richard","joseph","charles","daniel","paul","mark",
  "eric","olivier","laurent","frederic","sebastien","vincent","stephane","pascal","bruno","didier",
  "gerard","bernard","andre","rene","claude","henri","louis","marcel","raymond","roger","jacques",
  "yanis","rayan","nathan","lucas","hugo","enzo","theo","gabriel","raphael","adam","noah","ethan",
  "samuel","emmanuel","daniel","israel","kevin","brandon","tyrone","marcus","andre","darius","malik",
  "franck","fabrice","cedric","yoann","mickael","jonathan","anthony","dimitri","loic","mathieu","xavier",
]);

export type GenrePrenom = "femme" | "homme" | "indetermine";

function normaliser(prenom: string): string {
  return prenom
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z-]/g, "")
    .split(/[-\s]/)[0]
    .trim();
}

/** Le genre d'un prénom, ou « indéterminé ». Jamais de supposition hasardeuse. */
export function genreDuPrenom(prenomBrut: string | null | undefined): GenrePrenom {
  if (!prenomBrut) return "indetermine";
  const prenom = normaliser(prenomBrut);
  if (prenom.length < 2) return "indetermine";
  if (FEMININS.has(prenom)) return "femme";
  if (MASCULINS.has(prenom)) return "homme";
  /* Deux terminaisons françaises très régulières, et seulement celles-là. */
  if (/(ette|ine|elle|ienne)$/.test(prenom)) return "femme";
  return "indetermine";
}

export interface RepartitionPrenoms {
  femmes: number;
  hommes: number;
  indetermines: number;
  total: number;
  /** Part de femmes parmi les prénoms reconnus, ou null si rien n'est reconnu. */
  partFemmes: number | null;
  /** Les prénoms non reconnus les plus fréquents : ce qui manque au dictionnaire. */
  inconnusFrequents: { prenom: string; n: number }[];
}

export function repartirPrenoms(prenoms: (string | null | undefined)[]): RepartitionPrenoms {
  let femmes = 0;
  let hommes = 0;
  let indetermines = 0;
  const inconnus = new Map<string, number>();
  for (const brut of prenoms) {
    const genre = genreDuPrenom(brut);
    if (genre === "femme") femmes += 1;
    else if (genre === "homme") hommes += 1;
    else {
      indetermines += 1;
      const cle = normaliser(brut ?? "");
      if (cle.length >= 2) inconnus.set(cle, (inconnus.get(cle) ?? 0) + 1);
    }
  }
  const reconnus = femmes + hommes;
  return {
    femmes,
    hommes,
    indetermines,
    total: femmes + hommes + indetermines,
    partFemmes: reconnus ? femmes / reconnus : null,
    inconnusFrequents: [...inconnus.entries()]
      .map(([prenom, n]) => ({ prenom, n }))
      .sort((a, b) => b.n - a.n)
      .slice(0, 8),
  };
}
