/* Deux thèmes sur le même site (12/10/2026).

   La page d’accueil reprend lystes.ai/bio avec le thème de lystes.ai (dossier
   lystes/), le reste du site garde le sien (src/). Sur l’accueil, la classe
   `.lystes-racine` est posée sur <body>.

   1. Les feuilles de lystes/ sont cantonnées à `.lystes-racine` : sans ce
      préfixe, elles repeindraient le catalogue après un passage par l’accueil.
   2. Les feuilles du site (src/) s’arrêtent à `.lystes-racine` : leurs règles
      écrites pour l’ancienne page d’accueil (section#section-qualite,
      section.py-12…) visent les mêmes classes que la page reprise et la
      repeignaient. Le préfixe est posé dans :where(), qui ne compte pas dans
      la priorité des règles : ailleurs, le site se comporte exactement comme
      avant. */
const PORTEE = ".lystes-racine";
const HORS_PORTEE = `:where(body:not(${PORTEE}))`;
/* Dans :where() aussi, pour que les règles de lystes.ai gardent leur priorité
   d’origine face aux <style> que ses composants posent eux-mêmes. */
const DANS_PORTEE = `:where(${PORTEE})`;

const dansKeyframes = (regle) => {
  const parent = regle.parent;
  return parent && parent.type === "atrule" && /keyframes$/i.test(parent.name);
};

const cantonnerLystes = () => ({
  postcssPlugin: "cantonner-lystes",
  Once(root) {
    const fichier = root.source?.input?.file || "";
    if (/node_modules/.test(fichier)) return;
    const deLystes = /[\\/]lystes[\\/]/.test(fichier);
    root.walkRules((regle) => {
      if (dansKeyframes(regle)) return;
      if (deLystes) {
        if (regle.selector.startsWith(DANS_PORTEE)) return;
        regle.selectors = regle.selectors.map((s) => {
          const sel = s.trim();
          if (/^(:root|html|body)$/.test(sel)) return DANS_PORTEE;
          /* html.dark, body:has(...), body .x : la condition porte sur la racine. */
          if (/^(:root|html|body)\b/.test(sel)) return `${DANS_PORTEE}${sel.replace(/^(:root|html|body)/, "")}`;
          if (/^\.dark\b/.test(sel)) return `${DANS_PORTEE}${sel}`;
          return `${DANS_PORTEE} ${sel}`;
        });
        return;
      }
      regle.selectors = regle.selectors.map((s) => {
        const sel = s.trim();
        /* Variables du thème, barres de défilement : inchangées. Chrome
           n'applique ni bordure ni background-clip aux pièces de la barre
           (::-webkit-scrollbar-track, -thumb) quand le sélecteur passe par un
           combinateur descendant : préfixée, la règle commune
           `:where(body *)::-webkit-scrollbar-*` rendait une barre pleine de
           8 px au lieu du rail de 2 px (constaté le 13/10/2026). La bande
           masquée `.scrollbar-hide` vaut aussi sur l'accueil (carrousel
           Wirtzkin de lystes/, qui s'en sert sans la définir). */
        if (/^(:root|\.dark)\b/.test(sel) || /^(:where\(body \*\))?::-webkit-scrollbar/.test(sel) || /^\.scrollbar-hide(::-webkit-scrollbar)?$/.test(sel)) return sel;
        /* html { overflow-x: hidden } empêchait les blocs collants de la page reprise. */
        if (/^html\b/.test(sel)) return `html:not(:has(> body${PORTEE}))${sel.slice(4)}`;
        if (/^body\b/.test(sel)) return `body:not(${PORTEE})${sel.slice(4)}`;
        if (sel.startsWith(HORS_PORTEE)) return sel;
        return `${HORS_PORTEE} ${sel}`;
      });
    });
  },
});
cantonnerLystes.postcss = true;

export default {
  plugins: [
    (await import("tailwindcss")).default(),
    cantonnerLystes(),
    (await import("autoprefixer")).default(),
  ],
};
