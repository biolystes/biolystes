/* La fiche Éclose Paris du deck « Suites d'agents Lystes » (09/10/2026, JP),
   recopiée pour l'onglet « Vos produits » de /accueil-v2. Mêmes textes, mêmes
   zones : chaque zone travaillée par un agent porte data-z, la page parente
   s'en sert pour poser les pastilles numérotées. Seuls écarts avec le deck :
   les images en webp, et les fenêtres « Voir tout » et « Pourquoi acheter ce
   soin ? » séparées de la fiche, pour s'ouvrir par-dessus la fiche vivante. */

const ICONES = {
  arrowUp: '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
  arrowUpRight: '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  badgeCheck: '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M13 8H7"/><path d="M17 12H7"/>',
  mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/>',
  minus: '<path d="M5 12h14"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  share: '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="m16 6-4-4-4 4"/><path d="M12 2v13"/>',
  sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>',
  thumbsUp: '<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
};
const ic = (nom, taille = 14, couleur = "currentColor", epaisseur = 1.6) =>
  `<svg width="${taille}" height="${taille}" viewBox="0 0 24 24" fill="none" stroke="${couleur}" stroke-width="${epaisseur}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONES[nom]}</svg>`;
const etoile = (t, c) => `<svg width="${t}" height="${t}" viewBox="0 0 24 24" fill="${c}" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>`;
const carres = (t = 15) => `<span class="carres" aria-hidden="true">${Array(5).fill(`<i style="width:${t}px;height:${t}px">${etoile(Math.round(t * .72), "#fff")}</i>`).join("")}</span>`;

const ECLOSE = {
  titre: "Huile corporelle<br>pour une peau éclatante",
  nom: "Huile corporelle pour une peau éclatante",
  description: "Les peaux sujettes à la kératose pilaire manquent souvent de lipides, et la sécheresse accentue leur aspect granuleux. Cette huile riche en oméga 6 et 9 (tournesol, amande douce, jojoba, argan, rose musquée, framboise, pépins de courge) renforce la barrière cutanée, retient l’hydratation et rend la peau plus souple.",
  /* Six créatrices différentes qui tiennent l'huile (JP, 10/10 : « il faut
     varier ») : la chaîne UGC de JP, un visage et une scène par carte. Détail
     et prompts : ~/Documents/lystes_ai/photos-clients/eclose-paris/
     2026-10-10-ugc-communaute-serie2/. La première carte, à moitié coupée
     comme chez Éclose, est le gros plan de la main. */
  ugc: [1, 2, 3, 4, 5, 6].map(i => `/demo-eclose/img/createur-${i}.webp`),
  /* La FAQ produit de Lystes (preoccupations-produit-public), lue le 09/10. */
  faq: [
    ["Qu’est-ce que l’Huile corporelle pour une peau éclatante&#8239;?", "L’huile qui protège la douceur retrouvée."],
    ["Comment utiliser l’Huile corporelle pour une peau éclatante&#8239;?", "Quelques gouttes sur peau encore humide après la douche, en massage doux sur les bras, les cuisses ou toute zone sèche. En hiver, l’appliquer par-dessus la crème à l’urée sur les zones les plus sèches."],
    ["L’Huile corporelle pour une peau éclatante est-elle vegan et naturelle&#8239;?"],
  ],
  /* Les avis du produit (avis-produit-public), lus le 09/10. */
  avis: [
    ["Inès", "I", "1 oct. 2026", "Kératose pilaire apaisée", "Mes bras étaient rugueux depuis des années. Avec l’exfoliant puis cette huile, le grain de peau s’est vraiment adouci."],
    ["Julie", "J", "27 sept. 2026", "Peau nourrie sans effet gras", "Elle pénètre étonnamment vite pour une huile. Ma peau reste souple toute la journée."],
    ["Louise", "L", "23 sept. 2026", "Souplesse retrouvée", "Ma peau ne tiraille plus après l’épilation. Elle reste confortable des jours entiers."],
  ],
  /* Exemples : l'actualité d'Éclose n'est pas encore publiée. Photos de la marque, une par sujet. */
  articles: [
    ["/demo-eclose/img/actu-1.webp", "Kératose pilaire&#8239;: pourquoi la peau granuleuse manque de lipides", 5],
    ["/demo-eclose/img/actu-2.webp", "Oméga 6 et 9&#8239;: ce que les huiles végétales changent à la barrière cutanée", 4],
    ["/demo-eclose/img/actu-3.webp", "Après la douche, sur peau humide&#8239;: le geste qui retient l’hydratation", 3],
  ],
  /* La page de la marque sur lystes.ai, pour aller plus loin, onglet par onglet.
     Pas de lien pour les actualités tant que le magazine d'Éclose est vide. */
  pages: ["https://lystes.ai/ecloseparis/avis", "https://lystes.ai/ecloseparis/faq", null],
  /* La conversation jouée dans le chat (JP, 09/10 : « côté site on garde
     l'animation de conversation »). Chaque réponse reprend la fiche, la FAQ
     ou un avis ci-dessus : l'agent n'affirme rien que la marque n'ait écrit. */
  conversation: [
    { qui: "agent", texte: "Bonjour, comment puis-je vous aider ?" },
    { qui: "cliente", texte: "Elle aide contre la kératose pilaire ?" },
    { qui: "agent", texte: "Oui. Ces peaux manquent souvent de lipides : riche en oméga 6 et 9, elle renforce la barrière cutanée et retient l’hydratation." },
    { qui: "cliente", texte: "Vous avez des avis de clientes ?" },
    { qui: "agent", avis: 0, intro: "Bien sûr, voici le retour d’une cliente" },
    { qui: "cliente", texte: "Je l’applique quand ?" },
    { qui: "agent", texte: "Quelques gouttes sur peau encore humide, après la douche, en massage doux sur les zones sèches." },
    { qui: "cliente", texte: "Que me conseillez-vous avec ?" },
    { qui: "agent", routine: true, intro: "Voici la routine que je vous conseille" },
  ],
  /* Exfoliant, huile, puis crème à l'urée : l'ordre que donnent la FAQ et l'avis d'Inès. */
  routine: [
    ["/demo-eclose/img/autre-3.webp", "Exfoliant volcan islandais", "4,7"],
    ["/demo-eclose/img/produit.webp", "Huile corporelle", "4,7"],
    ["/demo-eclose/img/autre-4.webp", "Crème 5 % urée", "4,7"],
  ],
};

/* Le chat Lystes. Dans la fiche, il reste au repos, comme sur la diapo
   (JP, 10/10 : la fiche moins haute) ; avec `avecFil`, il porte le fil où se
   joue la conversation : c'est la vue « chat » (index.html?vue=chat) que
   montre l'encart de l'Expert produit IA sur /accueil-v2. */
const chat = (avecFil = false) => `
  <div class="chat" data-z="chat">
    <div class="pile"><span class="vignette" style="background-image:url(/demo-eclose/img/produit.webp)"></span><span class="ia"><img src="/iconeai1.png" alt=""><b>AI</b></span></div>
    ${avecFil ? '<div class="fil" aria-hidden="true"></div>' : ""}
    <div class="chat-carte">
      <div class="chat-champ">Posez votre question sur ce produit ...</div>
      <div class="chat-bas">
        <span class="chat-avis" data-action="avis">${ic("message", 12, "#444", 1.6)}Voir les avis</span>
        <span class="chat-outils">
          <span class="modele"><img src="/iconeai1.png" alt="">${ic("chevronDown", 12, "#222", 2.2)}</span>
          <span class="micro">${ic("mic", 15, "#333", 1.6)}</span>
          <span class="appel" data-z="appel">${ic("phone", 15, "#333", 1.6)}</span>
          <span class="envoyer">${ic("arrowUp", 13, "#fff", 2)}</span>
        </span>
      </div>
    </div>
  </div>`;

const bouton = () => `
  <div class="bdf" data-z="bouton">
    <span class="bdf-pastille" data-z="diag" data-action="diagnostic">Faire un diagnostic <span class="ai">AI</span></span>
    <span class="bdf-libelle" data-z="pourquoi" data-action="pourquoi">Pourquoi acheter ce soin&#8239;?</span>
    <span class="bdf-fleche" data-action="pourquoi" aria-hidden="true">${ic("arrowUpRight", 15, "#111", 1.6)}</span>
  </div>`;

/* Sous le bouton, l'espace qui tourne : Avis produit, Questions produit, Actualités produit.
   Sous l'onglet actif, une jauge grise se remplit de noir ; pleine, elle passe
   la main à l'onglet suivant. Les avis et les articles défilent d'eux-mêmes. */
/* Les avis d'abord (JP, 10/10 : « par défaut, je voudrais voir les avis en premier »). */
const ONGLETS = [
  ["Avis produit", "Voir tous les avis"],
  ["Questions produit", "Voir toutes les questions"],
  ["Actualités produit", "Voir toutes les actualités"],
];
function espaceTournant(etat = 0, plein = 0) {
  const panneaux = [
    `<div class="et-defile"><div class="et-piste">${[...ECLOSE.avis, ...ECLOSE.avis].map(([nom, , , titre, texte]) => `<div class="et-avis">${carres(10)}<b>${titre}</b><p>${texte}</p><em>${nom}</em></div>`).join("")}</div></div>`,
    `<div class="et-questions">${ECLOSE.faq.slice(0, 2).map(([q]) => `<div class="q"><span>${q}</span>${ic("plus", 12, "#111", 1.6)}</div>`).join("")}</div>`,
    `<div class="et-defile"><div class="et-piste">${[...ECLOSE.articles, ...ECLOSE.articles].map(([img, t, m]) => `<div class="et-article"><img src="${img}" alt=""><div><b>${t}</b><em>${m} min de lecture</em></div></div>`).join("")}</div></div>`,
  ];
  return `<div class="tournant" data-z="faq" data-etat="${etat}">
    <div class="et-onglets">${ONGLETS.map(([o], i) => `<span class="${i === etat ? "actif" : ""}"${i === 2 ? ' data-z="mag"' : ""}>${o}<i><b style="width:${i === etat ? Math.round(plein * 100) : 0}%"></b></i></span>`).join("")}</div>
    <div class="et-corps">${panneaux.map((p, i) => `<div class="et-panneau"${i === etat ? "" : " hidden"}>${p}</div>`).join("")}</div>
    <div class="mini-pied">${ONGLETS.map(([, l], i) => `<a data-action="tout" data-onglet="${i}"${i === etat ? "" : " hidden"}>${l} ${ic("arrowUpRight", 11, "#111", 1.8)}</a>`).join("")}<span class="propulse">propulsé par <u>lystes.ai</u></span></div>
  </div>`;
}

const communaute = (n = 6) => `
  <div class="commu" data-z="ugc">
    <div class="commu-tete">${ic("badgeCheck", 20, "#222", 1.3)}<h3>Rejoignez notre communauté</h3>
      <span class="fl">${ic("chevronLeft", 14, "#222", 1.8)}${ic("chevronRight", 14, "#222", 1.8)}</span></div>
    <div class="commu-cartes">${ECLOSE.ugc.slice(0, n).map(s => `<img src="${s}" alt="">`).join("")}</div>
  </div>`;

/* La fiche telle que JP l'a simplifiée (09/10) : sans points clés, et sous
   le bouton l'espace qui tourne entre questions, avis et actualités. */
function ficheEclose({ etat = 0, plein = 0 } = {}) {
  return `<div class="fiche">
    <div class="galerie" data-z="photo">
      <!-- 12/10/2026 : la vidéo montrait le pot d'une marque réelle (Seed) ; place
           à l'huile Lystes & Partners de la fiche, image fixe en lévitation douce. -->
      <img class="packshot packflotte" src="/demo-lystes/produits/huile-corporelle-fiche.webp" alt="${ECLOSE.nom}">
      <div class="qr" data-z="qr"><img src="/demo-eclose/qr-lystes.svg" alt=""><span>Coach à domicile</span></div>
    </div>
    <div class="resume">
      <div class="etoiles" data-z="avis">${carres(15)}<b>Excellent</b><span>· 4,7 sur 5</span><u>(10 avis)</u></div>
      <div class="seo" data-z="seo">
        <h1 class="titre" data-z="seoTitre">${ECLOSE.titre}</h1>
        <div class="prix">45 €</div>
        <div class="desc-boite"><p class="desc">${ECLOSE.description}</p></div>
      </div>
      ${chat()}
      ${bouton()}
      ${espaceTournant(etat, plein)}
      <div class="panier">
        <div class="quantite"><span style="color:#8a7088">${ic("minus", 13, "#8a7088", 1.6)}</span><span>1</span><span>${ic("plus", 13, "#8a7088", 1.6)}</span></div>
        <div class="ajouter">Ajouter au panier</div>
      </div>
      ${communaute()}
    </div>
  </div>`;
}

/* Un avis, tel que l'affiche le bloc d'avis Lystes. */
const avisUn = ([nom, ini, date, titre, texte]) => `<div class="avis-un">
  <div class="avis-tete"><span class="initiale">${ini}</span><div><div class="avis-nom">${nom}</div><div class="avis-date">${date}</div></div>${carres(15)}</div>
  <div class="avis-titre">${titre}</div>
  <p class="avis-texte">${texte}</p>
  <div class="avis-actions"><span>${ic("thumbsUp", 13, "#6d6d72", 1.5)}Utile</span><span>${ic("share", 13, "#6d6d72", 1.5)}Partager</span><span class="drapeau">${ic("flag", 13, "#6d6d72", 1.5)}</span></div>
</div>`;

/* « Voir tout » : la fenêtre ouverte par chaque lien de l'espace qui tourne.
   Le chat en grand en haut, les trois onglets, puis toutes les questions,
   tous les avis ou toutes les actualités du produit, et un lien vers lystes.ai
   pour aller plus loin. onglet : 0 (avis), 1 (questions) ou 2 (actualités). */
function modaleVoirTout(onglet = 1) {
  const rep = [[5, 70], [4, 30], [3, 0], [2, 0], [1, 0]];
  const contenus = [
    `<div class="vt-avis">
      <div class="vt-note"><b>4,7</b>${carres(15)}<span>10 avis</span>
        <div class="barres">${rep.map(([n, p]) => `<div class="barre"><span>${n} étoile${n > 1 ? "s" : ""}</span><i><b style="width:${p}%"></b></i><em>${p}&#8239;%</em></div>`).join("")}</div></div>
      <div>${ECLOSE.avis.map(avisUn).join("")}</div>
    </div>`,
    `<div class="acc vt-questions">${ECLOSE.faq.map(([q, r], i) => `<div><div class="qq"><span>${q}</span>${ic(i < 2 ? "minus" : "plus", 14, "#111", 1.8)}</div>${i < 2 ? `<p class="rep">${r}</p>` : ""}</div>`).join("")}</div>`,
    `<div class="articles vt-articles">${ECLOSE.articles.map(([img, t, m]) => `<div class="article"><img src="${img}" alt=""><h4>${t}</h4><p>${m} min de lecture</p></div>`).join("")}</div>`,
  ];
  return `<div class="modale-tout" role="dialog" aria-modal="true" aria-label="${ONGLETS[onglet][1]}">
    <div class="vt-tete"><img src="/demo-eclose/img/produit.webp" alt=""><div><b>${ECLOSE.nom}</b><span>${carres(11)}4,7 · 10 avis</span></div><span class="fermer" data-action="fermer" aria-label="Fermer">${ic("x", 15, "#111", 1.8)}</span></div>
    <div class="vt-chat">${chat()}</div>
    <div class="et-onglets vt-onglets" role="tablist" aria-label="Questions, avis et actualités du produit">${ONGLETS.map(([o], i) => `<span class="${i === onglet ? "actif" : ""}" data-action="tout" data-onglet="${i}">${o}<i><b style="width:${i === onglet ? 100 : 0}%"></b></i></span>`).join("")}</div>
    <div class="vt-corps" tabindex="0" aria-label="${ONGLETS[onglet][0]}">${contenus[onglet]}</div>
    <div class="vt-pied"><span class="propulse">propulsé par <u>lystes.ai</u></span>${ECLOSE.pages[onglet] ? `<a class="vt-plus" href="${ECLOSE.pages[onglet]}" target="_blank" rel="noopener">Plus de détails sur lystes.ai ${ic("arrowUpRight", 13, "#111", 1.8)}</a>` : ""}</div>
  </div>`;
}

/* La fenêtre ouverte par « Pourquoi acheter ce soin ? » : à gauche l'invitation
   au diagnostic, à droite les réponses de la FAQ et les avis. */
function modaleDiagnostic() {
  return `<div class="modale" role="dialog" aria-modal="true" aria-label="Pourquoi acheter ce soin ?">
    <div class="m-gauche" data-z="diagPane">
      <span class="langue">FR ${ic("globe", 14, "#555", 1.5)}</span>
      <div class="vignettes"><img src="/demo-eclose/img/autre-1.webp" alt=""><img src="/demo-eclose/img/produit.webp" alt=""><b>IA</b></div>
      <div class="courriel"><span>Votre email</span><span class="essayer" data-action="diagnostic">${ic("sparkles", 13, "#444", 1.5)}Essayer</span></div>
      <div class="confidentiel">Données confidentielles · Pas de spam</div>
      <span class="rond-appel">${ic("phone", 16, "#fff", 1.6)}</span>
    </div>
    <div class="m-droite" data-z="faqPane">
      <span class="fermer" data-action="fermer" aria-label="Fermer">${ic("x", 15, "#111", 1.8)}</span>
      <div class="m-titre">Pourquoi<br>acheter ce soin&#8239;?</div>
      <div class="m-sous">${ECLOSE.nom}</div>
      <div class="acc">${ECLOSE.faq.map(([q, r], i) => `<div><div class="qq"><span>${q}</span>${ic(i ? "plus" : "minus", 14, "#111", 1.8)}</div>${i === 0 ? `<p class="rep">${r}</p>` : ""}</div>`).join("")}</div>
      <a class="toutes" data-action="tout" data-onglet="1">Toutes les questions</a>
      <div class="avis-cli"><h5>Avis clientes</h5><span class="fl"><span>${ic("chevronLeft", 13, "#111", 1.8)}</span><span>${ic("chevronRight", 13, "#111", 1.8)}</span></span></div>
      <div class="cartes-avis">${ECLOSE.avis.slice(0, 2).map(a => `<div class="carte-avis">${carres(11)}<p>${a[4]}</p></div>`).join("")}</div>
    </div>
  </div>`;
}
