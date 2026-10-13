import { useEffect } from "react";

/**
 * Jamais un mot seul sur la dernière ligne (règle de JP, 07/10/2026, redite
 * le 12/10/2026 pour l'accueil, /bio et /crea : « aucun mot seul, nulle
 * part »).
 *
 * `text-wrap: balance` et `pretty` ne suffisent pas partout : le navigateur
 * les ignore au-delà de quelques lignes, et un libellé de deux mots dans une
 * colonne étroite (« Analyste / Performance », « Programme / créateurs »)
 * casse quand même. Ce crochet colle les deux derniers mots de chaque texte
 * par une espace insécable : le dernier mot ne part jamais seul à la ligne.
 *
 * Il agit sur la page entière tant que la page qui l'appelle est montée, et
 * repasse quand le contenu change (gabarits HTML, textes traduits, cartes
 * chargées plus tard). Il ne touche ni l'en-tête, ni les champs, ni le titre
 * qui s'écrit (machine à écrire), ni un élément marqué `data-mot-seul-ok`.
 * Seule une espace ordinaire est remplacée : un second passage ne colle donc
 * jamais un mot de plus.
 */
const CIBLES = "h1,h2,h3,h4,h5,h6,p,li,figcaption,small,dd,dt,blockquote,a,label";
const BLOCS = "h1,h2,h3,h4,h5,h6,p,li,figcaption,dd,dt,blockquote";
const EXCLUS = "header, input, textarea, [contenteditable], .lyh-h1, [data-mot-seul-ok], script, style";
/* Ponctuation française déjà précédée d'une insécable (« ? », « : »…) : elle
   ne compte pas comme un mot. */
const FIN_PONCTUATION = /[\u00a0\u202f][?!:;»…]+\s*$/;

function coller(el: Element) {
  const noeuds: Text[] = [];
  const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let n: Node | null;
  while ((n = tw.nextNode())) noeuds.push(n as Text);
  const complet = noeuds.map((t) => t.data).join("");
  const sansPonct = complet.replace(FIN_PONCTUATION, "").replace(/\s+$/, "");
  /* Un seul mot : rien à coller. */
  const dernier = Math.max(sansPonct.lastIndexOf(" "), sansPonct.lastIndexOf("\u00a0"), sansPonct.lastIndexOf("\u202f"), sansPonct.lastIndexOf("\n"));
  if (dernier < 0 || sansPonct[dernier] !== " ") return;
  /* Retrouver le nœud de texte qui porte cette espace. */
  let pos = 0;
  for (const t of noeuds) {
    if (dernier < pos + t.data.length) {
      const i = dernier - pos;
      const avant = t.data;
      t.data = t.data.slice(0, i) + "\u00a0" + t.data.slice(i + 1);
      /* Un trait d'union dans le dernier mot (« e-commerce ») coupe aussi :
         il devient insécable. */
      const fin = noeuds.slice(noeuds.indexOf(t));
      for (const f of fin) f.data = f === t ? f.data.slice(0, i + 1) + f.data.slice(i + 1).replace(/-/g, "\u2011") : f.data.replace(/-/g, "\u2011");
      /* Deux mots collés plus larges que leur boîte (libellé court dans une
         colonne étroite) : on rend l'espace, mieux vaut deux lignes qu'un
         débordement. */
      const h = el as HTMLElement;
      if (h.clientWidth > 0 && h.scrollWidth > h.clientWidth + 1) t.data = avant;
      return;
    }
    pos += t.data.length;
  }
}

function passer(racine: ParentNode) {
  for (const el of Array.from(racine.querySelectorAll(CIBLES))) {
    if (el.closest(EXCLUS)) continue;
    /* Seulement le plus petit bloc de texte : son parent passerait sinon
       aussi, et collerait l'espace d'avant. */
    if (el.querySelector(BLOCS)) continue;
    const texte = el.textContent ?? "";
    if (texte.length > 600 || !/\s/.test(texte.trim())) continue;
    coller(el);
  }
}

export function useSansMotSeul() {
  useEffect(() => {
    let attente = 0;
    const planifier = () => {
      if (attente) return;
      /* Un passage au plus toutes les 250 ms : la machine à écrire du titre
         change le texte à chaque lettre. */
      attente = window.setTimeout(() => {
        attente = 0;
        obs.disconnect();
        passer(document.body);
        obs.observe(document.body, { childList: true, subtree: true, characterData: true });
      }, 250);
    };
    const obs = new MutationObserver(planifier);
    planifier();
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => {
      obs.disconnect();
      if (attente) window.clearTimeout(attente);
    };
  }, []);
}
