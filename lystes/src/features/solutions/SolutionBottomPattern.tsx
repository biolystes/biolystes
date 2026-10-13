/**
 * Pattern de bas de page canonique — rendu UNIQUEMENT via ce composant.
 *
 * Contenu = exactement le HTML fourni par le user (solution-bottom-pattern.html),
 * dans l'ordre :
 *   1. pilotez        — cartes6 « Pilotez en toute liberté »
 *   2. pain           — bento 54 / 53 / 34 / 24-7
 *   3. faq            — « Vos questions, en clair »
 *   4. installation   — « Installation sur mesure »
 *   5. temoignages    — « Ce qu'ils en pensent »
 *   6. cta            — « Essayez. Si ça ne convertit pas… »
 *
 * Un layout effect supprime les anciennes copies statiques éventuellement
 * restées dans le HTML de la page (filet de sécurité).
 */
import { useLayoutEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import bottomTemplate from "./solution-bottom-pattern.tmpl.html?raw";
import { getHomeLocale } from "@lystes/i18n/home-locale";
import { BOOKING_URL } from "@lystes/config/urls";
import { useEssaiJours } from "@lystes/features/pricing/useEssaiJours";

/* « Parler au fondateur » menait à cal.com/lystes/fondateur, une page 404
   (vérifié le 26/09/2026). Le gabarit porte désormais un marqueur, remplacé
   ici par BOOKING_URL, le seul lien de réservation tenu à jour
   (src/config/urls.ts, « Ne pas dupliquer ce lien »). */
const MARQUEUR_RESERVATION = "__BOOKING_URL__";

/* La petite ligne sous les boutons annonce l'offre réelle : essai, carte,
   premier prélèvement. La durée vient de la caisse (`useEssaiJours`) ; sans
   essai, la ligne d'origine reprend sa place. */
const CLE_MENTION = "t008_sans-engagement-configuration-";
const CLE_ESSAI = "t009_essai-carte-demandee";

const TOKEN_RE = /\{\{(t\d{3}_[a-z0-9-]+)\}\}/g;

function interpolate(template: string, dict: Record<string, string>, fallback: Record<string, string>) {
  return template.replace(TOKEN_RE, (_, key: string) => {
    const v = dict[key] ?? fallback[key] ?? "";
    return v
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  });
}

// Markers testés sur le textContent (donc sans balises ni entités HTML)
const MARKERS: RegExp[] = [
  /Pilotez\s+en toute liberté/i,
  /Vous vous posez ces questions/i,
  /Vos questions,\s*en clair/i,
  /Installation\s+sur mesure/i,
  /Ce qu'ils en\s+pensent/i,
  /Essayez\.\s*Si ça ne convertit pas/i,
  /Try for free/i,
];

export function SolutionBottomPattern() {
  const { i18n } = useTranslation();
  const lang = (i18n.language || "fr").substring(0, 2).toLowerCase();
  /* biolystes.com : pas de ligne d’essai de lystes.ai sous le rendez-vous. */
  const essaiJours = 0;
  const bottomHtml = useMemo(() => {
    const { fr, current } = getHomeLocale("bottom-pattern", lang);
    const essai = current[CLE_ESSAI] ?? fr[CLE_ESSAI];
    const dict =
      essaiJours > 0 && essai
        ? { ...current, [CLE_MENTION]: essai.split("{{jours}}").join(String(essaiJours)) }
        : current;
    return interpolate(bottomTemplate, dict, fr).split(MARQUEUR_RESERVATION).join(BOOKING_URL);
  }, [lang, essaiJours]);
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const shell = root.closest<HTMLElement>("[data-solution-shell]") ?? document.body;

    const kill = (el: Element | null | undefined) => {
      if (!el) return;
      if (el === root || root.contains(el) || el.contains(root)) return;
      el.remove();
    };

    // Anciennes copies portant data-bottom
    shell.querySelectorAll("[data-bottom]").forEach(kill);

    // Copies statiques repérables par leur texte
    const candidates = Array.from(
      shell.querySelectorAll<HTMLElement>("section, .l-section, .bande, .ep-final")
    );
    for (const s of candidates) {
      if (s === root || root.contains(s) || s.contains(root)) continue;
      const text = (s.textContent ?? "").replace(/\s+/g, " ");
      if (MARKERS.some((re) => re.test(text))) kill(s);
    }
  }, []);

  return (
    <div
      ref={rootRef}
      data-solution-bottom-pattern
      className="solution-bottom-pattern"
      dangerouslySetInnerHTML={{ __html: bottomHtml }}
    />
  );
}
