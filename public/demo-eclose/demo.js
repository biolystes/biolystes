/* La fiche Éclose, vivante, dans l'onglet « Vos produits » de /accueil-v2.

   La page vit à sa taille réelle (1286 px comme la fiche du deck) et se
   réduit à la largeur de l'iframe d'un seul transform, téléphone compris :
   JP veut la photo à gauche et le chat à droite partout, « pour que ça soit
   pas trop long » (10/10). La version téléphone reste dans le code (SEUIL). Elle écrit sa hauteur réduite dans
   data-hauteur : la page parente y règle son cadre, et lit les zones data-z
   pour éclairer chaque agent pendant la visite guidée.

   Ce qui bouge, comme sur la vraie fiche : la conversation dans le chat,
   l'espace qui tourne entre questions, avis et actualités (en pause sous la
   souris), les fenêtres « Voir tout » et « Pourquoi acheter ce soin ? », et
   le vrai diagnostic de /shot, ouvert par la page parente.

   La page parente pilote l'espace qui tourne par window.demoEclose.onglet(n) :
   la visite y ouvre la FAQ, les avis ou les actualités, puis le rend (null).

   Avec ?vue=chat, la page ne montre que le chat, où la conversation se joue :
   c'est l'encart de l'Expert produit IA (JP, 10/10 : « on voit le déroulé de
   la conversation dans la note », la fiche, elle, reste au repos). */
(function () {
  "use strict";
  var site = document.getElementById("site");
  /* SEUIL : largeur d'iframe sous laquelle la fiche passerait en une colonne.
     0 : jamais, sur demande de JP (10/10). */
  var BUREAU = 1286, SEUIL = 0, DUREE = 6000;
  var VUE_CHAT = new URLSearchParams(window.location.search).get("vue") === "chat";
  var LARGEUR_CHAT = 464;
  var mode = "";
  var largeurTel = 390;
  var couche = null;      // la fenêtre ouverte, et son voile
  var declencheur = null; // l'élément qui l'a ouverte, pour lui rendre le focus
  var tour = null;        // la rotation en cours
  var dialogue = null;    // la conversation en cours

  /* ---------- Taille ---------- */
  function rendre() {
    if (VUE_CHAT) {
      if (!mode) {
        mode = "chat";
        site.className = "site vue-chat";
        site.innerHTML = '<div class="fiche">' + chat(true) + "</div>";
        dialogue = jouerConversation(site.querySelector(".chat"));
      }
      ajuster();
      return;
    }
    var tel = window.innerWidth < SEUIL;
    /* Sur téléphone, la fiche s'élargit avec l'écran (390 à 600 px) au lieu
       d'être agrandie : au-delà de 600, elle grossirait de moitié. */
    largeurTel = Math.max(390, Math.min(window.innerWidth, 600));
    var m = tel ? "telephone" : "bureau";
    if (m !== mode) {
      mode = m;
      fermer(false);
      if (tour) tour.arreter();
      if (dialogue) dialogue.arreter();
      site.className = "site" + (tel ? " mobile" : "");
      site.innerHTML = ficheEclose();
      brancher();
    }
    site.style.width = tel ? largeurTel + "px" : "";
    ajuster();
  }
  function ajuster() {
    var k = window.innerWidth / (mode === "chat" ? LARGEUR_CHAT : mode === "telephone" ? largeurTel : BUREAU);
    site.style.transform = "scale(" + k + ")";
    var h = Math.ceil(site.offsetHeight * k);
    /* Iframe masquée (autre onglet) : on garde la dernière vraie hauteur, la
       page parente la retrouve juste au retour. */
    if (!h) return;
    document.body.style.height = h + "px";
    document.documentElement.setAttribute("data-hauteur", String(h));
  }

  /* ---------- Accessibilité des zones cliquables ---------- */
  function cliquable(el, role) {
    el.setAttribute("role", role);
    el.setAttribute("tabindex", "0");
  }

  /* ---------- L'espace qui tourne ---------- */
  function faireTourner(el) {
    el.classList.add("vivant");
    var onglets = [].slice.call(el.querySelectorAll(".et-onglets span"));
    var panneaux = [].slice.call(el.querySelectorAll(".et-panneau"));
    var liens = [].slice.call(el.querySelectorAll(".mini-pied a"));
    var calme = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var etat = 0, ecoule = 0, avant = performance.now(), pause = false, fini = false, tenu = false;
    el.querySelector(".et-onglets").setAttribute("role", "tablist");
    function montrer(n) {
      etat = n; ecoule = 0;
      onglets.forEach(function (o, i) {
        o.classList.toggle("actif", i === n);
        o.setAttribute("aria-selected", i === n ? "true" : "false");
        o.setAttribute("tabindex", i === n ? "0" : "-1");
        o.querySelector("b").style.width = (i === n && (calme || tenu) ? 100 : 0) + "%";
      });
      panneaux.forEach(function (p, i) { p.hidden = i !== n; });
      liens.forEach(function (l, i) { l.hidden = i !== n; });
    }
    onglets.forEach(function (o, i) {
      o.setAttribute("role", "tab");
      o.addEventListener("click", function () { montrer(i); });
      o.addEventListener("keydown", function (e) {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        var n = (etat + (e.key === "ArrowRight" ? 1 : onglets.length - 1)) % onglets.length;
        montrer(n);
        onglets[n].focus();
      });
    });
    /* Sous la souris ou au clavier, on lit : la jauge s'arrête. */
    el.addEventListener("pointerenter", function () { pause = true; });
    el.addEventListener("pointerleave", function () { pause = false; });
    el.addEventListener("focusin", function () { pause = true; });
    el.addEventListener("focusout", function () { pause = false; });
    function pas(t) {
      if (fini) return;
      var dt = t - avant; avant = t;
      if (!pause && !couche && !calme && !tenu) {
        ecoule += Math.min(dt, 100);
        var f = Math.min(1, ecoule / DUREE);
        onglets[etat].querySelector("b").style.width = f * 100 + "%";
        if (f >= 1) montrer((etat + 1) % onglets.length);
      }
      requestAnimationFrame(pas);
    }
    montrer(0);
    requestAnimationFrame(pas);
    return {
      arreter: function () { fini = true; },
      /* La visite tient un onglet (0, 1 ou 2) le temps de son étape, puis le rend (null). */
      tenir: function (n) {
        if (n == null) {
          if (tenu) { tenu = false; montrer(etat); }
          return;
        }
        tenu = true;
        montrer(n);
      },
    };
  }
  window.demoEclose = {
    onglet: function (n) { if (tour) tour.tenir(n); },
  };

  /* ---------- La conversation jouée dans le chat ----------
     Même geste que la démonstration de l'accueil (fiche-produit-demo.html) :
     la question de la cliente s'écrit dans le champ, part, puis la réponse
     de l'agent arrive d'un bloc. Le fil a une hauteur fixe : la fiche ne
     grandit pas pendant la conversation, la page ne saute pas. Les anciens
     messages pâlissent puis sortent par le haut. */
  var RY = { CAR: 38, APRES_AGENT: 2600, APRES_CLIENT: 1800, DEBUT: 1200, BOUCLE: 4200 };
  function bulle(m) {
    var ligne = document.createElement("div");
    ligne.className = "ligne " + m.qui;
    var cadre = document.createElement("div");
    var b = document.createElement("div");
    b.className = "bulle";
    if (m.avis != null) {
      var a = ECLOSE.avis[m.avis];
      b.classList.add("riche");
      b.innerHTML = '<div class="qui"><img src="/iconeai1.png" alt=""><span>Agent Lystes</span></div>'
        + "<p></p>" + carres(10) + '<p class="citation"></p><p class="auteur"></p>';
      b.querySelectorAll("p")[0].textContent = m.intro;
      b.querySelector(".citation").textContent = "« " + a[4] + " »";
      b.querySelector(".auteur").textContent = a[0] + ", " + a[2];
    } else if (m.routine) {
      b.classList.add("riche");
      b.innerHTML = '<div class="qui"><img src="/iconeai1.png" alt=""><span>Agent Lystes</span></div><p></p>'
        + '<div class="routine">' + ECLOSE.routine.map(function (r) {
          return '<div><img src="' + r[0] + '" alt=""><b></b><span>' + etoile(9, "#111") + r[2] + "</span></div>";
        }).join("") + "</div>";
      b.querySelector("p").textContent = m.intro;
      [].forEach.call(b.querySelectorAll(".routine b"), function (el, i) { el.textContent = ECLOSE.routine[i][1]; });
    } else {
      b.textContent = m.texte;
    }
    cadre.appendChild(b);
    ligne.appendChild(cadre);
    return ligne;
  }
  function jouerConversation(chatEl) {
    var fil = chatEl.querySelector(".fil");
    var champ = chatEl.querySelector(".chat-champ");
    if (!fil || !champ) return { arreter: function () {} };
    var repos = champ.textContent;
    var T = ECLOSE.conversation;
    var pas = 0, minuteur = null, fini = false;
    function plus_tard(f, ms) { minuteur = setTimeout(function () { if (!fini) f(); }, ms); }
    function empiler() {
      var k = [].slice.call(fil.children);
      k.forEach(function (el, i) {
        var depuisLaFin = k.length - 1 - i;
        el.classList.toggle("pale", depuisLaFin === 2);
        el.classList.toggle("partie", depuisLaFin >= 3);
      });
      while (fil.children.length > 6) fil.removeChild(fil.firstElementChild);
    }
    function poser(m, instant) {
      var l = bulle(m);
      fil.appendChild(l);
      if (instant) { l.classList.add("vue", "sans-transition"); empiler(); return; }
      requestAnimationFrame(function () { requestAnimationFrame(function () { l.classList.add("vue"); empiler(); }); });
    }
    function taper(texte, apres) {
      champ.textContent = "";
      champ.classList.add("saisie");
      var i = 0;
      (function lettre() {
        if (fini) return;
        if (i >= texte.length) { apres(); return; }
        champ.textContent = texte.slice(0, ++i);
        minuteur = setTimeout(lettre, RY.CAR);
      })();
    }
    function suivant() {
      /* Une fenêtre ouverte par-dessus la fiche : la conversation attend. */
      if (couche) { plus_tard(suivant, 800); return; }
      if (pas >= T.length) {
        /* La routine reste lisible, puis tout s'efface et l'agent redit bonjour. */
        plus_tard(function () {
          [].forEach.call(fil.children, function (l) { l.classList.add("partie"); });
          plus_tard(function () {
            fil.replaceChildren();
            pas = 1;
            poser(T[0], false);
            plus_tard(suivant, RY.APRES_AGENT);
          }, 600);
        }, RY.BOUCLE - RY.APRES_AGENT);
        return;
      }
      var m = T[pas++];
      if (m.qui === "cliente") {
        taper(m.texte, function () {
          plus_tard(function () {
            champ.classList.remove("saisie");
            champ.textContent = repos;
            poser(m, false);
            plus_tard(suivant, RY.APRES_CLIENT);
          }, 420);
        });
        return;
      }
      poser(m, false);
      plus_tard(suivant, RY.APRES_AGENT);
    }
    /* Le fil ne s'ouvre jamais vide : le bonjour de l'agent est déjà là. */
    poser(T[0], true);
    pas = 1;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      /* Sans mouvement : les trois premiers messages, posés une fois pour toutes. */
      poser(T[1], true); poser(T[2], true);
    } else {
      plus_tard(suivant, VUE_CHAT ? 500 : RY.DEBUT);
    }
    return {
      arreter: function () {
        fini = true;
        clearTimeout(minuteur);
        champ.classList.remove("saisie");
        champ.textContent = repos;
      },
    };
  }

  /* ---------- Les fenêtres ----------
     Une vraie fenêtre : la fiche dessous devient inerte, la tabulation tourne
     dans la fenêtre, Échap ferme et rend le focus à ce qui l'a ouverte. */
  function focusables() {
    return couche ? [].slice.call(couche.querySelectorAll('[tabindex="0"], a[href], button')).filter(function (el) {
      return !el.hidden && el.offsetParent !== null;
    }) : [];
  }
  function ouvrir(html, depuis, ongletAFocaliser) {
    fermer(false);
    declencheur = depuis || null;
    couche = document.createElement("div");
    couche.className = "couche";
    couche.innerHTML = '<div class="assombri" data-action="fermer"></div>' + html;
    site.appendChild(couche);
    var fiche = site.querySelector(".fiche");
    if (fiche) fiche.inert = true;
    var fenetre = couche.lastElementChild;
    preparer(couche);
    /* Sur téléphone, la fiche est longue : la fenêtre s'ouvre à hauteur de
       ce qu'on vient de toucher, puis la page défile pour la montrer entière. */
    if (mode === "telephone" && depuis) {
      var haut = 0, el = depuis;
      while (el && el !== site) { haut += el.offsetTop; el = el.offsetParent; }
      var h = fenetre.offsetHeight;
      fenetre.style.top = Math.max(12, Math.min(haut - h / 2, site.offsetHeight - h - 12)) + "px";
      try { fenetre.scrollIntoView({ block: "nearest", behavior: "smooth" }); } catch (e) { /* vieux navigateur */ }
    }
    var cible = ongletAFocaliser != null
      ? couche.querySelectorAll(".vt-onglets [role='tab']")[ongletAFocaliser]
      : couche.querySelector(".fermer");
    if (cible) cible.focus({ preventScroll: true });
  }
  function fermer(rendreFocus) {
    if (!couche) return;
    couche.remove();
    couche = null;
    var fiche = site.querySelector(".fiche");
    if (fiche) fiche.inert = false;
    if (rendreFocus !== false && declencheur && document.contains(declencheur)) declencheur.focus({ preventScroll: true });
    declencheur = null;
  }

  /* ---------- Le vrai diagnostic, ouvert par la page parente ---------- */
  var packshot = null;
  function preparerPackshot() {
    if (packshot) return packshot;
    packshot = new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () {
        /* /shot attend un JPEG ou un PNG : on redessine le webp en JPEG. */
        var k = Math.min(1, 1024 / Math.max(img.naturalWidth, img.naturalHeight));
        var c = document.createElement("canvas");
        c.width = Math.round(img.naturalWidth * k);
        c.height = Math.round(img.naturalHeight * k);
        var g = c.getContext("2d");
        g.fillStyle = "#fff";
        g.fillRect(0, 0, c.width, c.height);
        g.drawImage(img, 0, 0, c.width, c.height);
        try { resolve(c.toDataURL("image/jpeg", 0.9)); } catch (e) { resolve(undefined); }
      };
      img.onerror = function () { resolve(undefined); };
      img.src = "img/produit.webp";
    });
    return packshot;
  }
  function lancerDiagnostic() {
    if (window.parent === window) return;
    fermer();
    preparerPackshot().then(function (image) {
      try {
        window.parent.postMessage({
          type: "lystes:experience",
          mode: "diagnostic",
          productName: ECLOSE.nom,
          productDescription: ECLOSE.description,
          productImage: image,
          agentName: "Agent Lystes",
          agentAvatar: "/iconeai2.png",
          teamLabel: "Équipe IA Diagnostic",
        }, window.location.origin);
      } catch (e) { /* la page parente n'écoute pas : la fiche reste en place */ }
    });
  }

  /* ---------- Clics et clavier ---------- */
  function agir(el) {
    var action = el.getAttribute("data-action");
    /* Depuis une fenêtre déjà ouverte, on garde l'élément d'origine. */
    var origine = couche && couche.contains(el) ? declencheur : el;
    if (action === "fermer") fermer();
    else if (action === "diagnostic") lancerDiagnostic();
    else if (action === "pourquoi") ouvrir(modaleDiagnostic(), el);
    else if (action === "avis") ouvrir(modaleVoirTout(0), origine);
    else if (action === "tout") {
      var n = +el.getAttribute("data-onglet") || 0;
      /* Un onglet de la fenêtre garde le focus sur l'onglet choisi. */
      ouvrir(modaleVoirTout(n), origine, el.closest(".vt-onglets") ? n : null);
    }
  }
  site.addEventListener("click", function (e) {
    var el = e.target.closest("[data-action]");
    if (el && site.contains(el)) agir(el);
  });
  site.addEventListener("keydown", function (e) {
    var el = e.target.closest("[data-action]");
    /* Les flèches parcourent les onglets de la fenêtre « Voir tout ». */
    if (el && el.closest(".vt-onglets") && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
      e.preventDefault();
      var n = (+el.getAttribute("data-onglet") + (e.key === "ArrowRight" ? 1 : 2)) % 3;
      ouvrir(modaleVoirTout(n), declencheur, n);
      return;
    }
    if (e.key !== "Enter" && e.key !== " ") return;
    if (!el || e.target !== el) return;
    e.preventDefault();
    agir(el);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { fermer(); return; }
    /* La tabulation tourne dans la fenêtre ouverte. */
    if (e.key !== "Tab" || !couche) return;
    var liste = focusables();
    if (!liste.length) return;
    var premier = liste[0], dernier = liste[liste.length - 1];
    if (e.shiftKey && (document.activeElement === premier || !couche.contains(document.activeElement))) {
      e.preventDefault(); dernier.focus();
    } else if (!e.shiftKey && (document.activeElement === dernier || !couche.contains(document.activeElement))) {
      e.preventDefault(); premier.focus();
    }
  });

  function preparer(racine) {
    racine.querySelectorAll("[data-action]").forEach(function (el) {
      /* Le voile et la flèche doublent une autre commande : pas d'arrêt de tabulation. */
      if (el.classList.contains("assombri") || el.getAttribute("aria-hidden") === "true") return;
      var onglet = !!el.closest(".vt-onglets");
      cliquable(el, onglet ? "tab" : "button");
      if (onglet) {
        var actif = el.classList.contains("actif");
        el.setAttribute("aria-selected", actif ? "true" : "false");
        el.setAttribute("tabindex", actif ? "0" : "-1");
      }
    });
  }

  function brancher() {
    preparer(site);
    var t = site.querySelector(".tournant");
    if (t) tour = faireTourner(t);
    var c = site.querySelector(".fiche .chat");
    if (c) dialogue = jouerConversation(c);
  }

  rendre();
  window.addEventListener("resize", rendre);
  /* La hauteur bouge quand les polices et les images arrivent. */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajuster);
  window.addEventListener("load", ajuster);
  if (window.ResizeObserver) new ResizeObserver(ajuster).observe(site);
})();
