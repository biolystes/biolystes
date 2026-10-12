/* Les fiches importées (WooCommerce, Shopify) arrivent souvent en MAJUSCULES.
   Les titres publics se rendent en casse française : seule la première lettre
   reste en majuscule. La fiche n'est jamais modifiée, on ne transforme que
   l'affichage. — JP 04/10/2026. */

const SIGLES = new Set([
  "SPF",
  "HA",
  "BHA",
  "AHA",
  "PHA",
  "UV",
  "LED",
  "CBD",
  "PABA",
  "NMF",
  "DHT",
  "INCI",
  "EGF",
  "PDRN",
  "SKIN",
]);

/** « CRÈME DE JOUR ÉCLAT » → « Crème de jour éclat ».
 *  Une fiche déjà rédigée normalement est laissée telle quelle. */
export function titreEnFrancais(texte?: string | null): string {
  const net = (texte ?? "").trim();
  if (!net) return "";
  // On ne corrige que les titres entièrement en capitales.
  if (net !== net.toUpperCase()) return net;

  const rendu = net
    .split(/(\s+|-|\/|·|&)/) // les séparateurs sont conservés tels quels
    .map((mot) => {
      if (!mot || /^[^\p{L}\p{N}]+$/u.test(mot)) return mot; // espace, ponctuation
      if (mot.length === 1 && /\p{L}/u.test(mot)) return mot; // « vitamine C »
      if (SIGLES.has(mot)) return mot; // « SPF 50 »
      return mot.toLowerCase();
    })
    .join("");

  return rendu.charAt(0).toLocaleUpperCase("fr-FR") + rendu.slice(1);
}
