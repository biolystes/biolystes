/** Fictional presentation roles only; never persisted as real qualifications. */
export const TEAM_ROLES = [
  "Community manager IA",
  "Photographe IA",
  "Expert produit IA",
  "Diagnosticien IA",
  "Créateur de contenu IA",
  "Data analyst IA",
  "Coach à domicile IA",
  "Journaliste IA",
] as const;

export function teamPresentation(model: { id: string; name: string; gender: string; age_range: string }) {
  const firstName = model.name.trim().split(/\s+/)[0] || "Équipe IA";
  const minimumAge = Number.parseInt(model.age_range, 10);
  const contentRole = model.gender === "female" ? "Créatrice de contenu IA" : "Créateur de contenu IA";
  if (!Number.isFinite(minimumAge) || minimumAge < 26) return { firstName, role: contentRole };
  const hash = Array.from(model.id).reduce((value, char) => (value * 31 + char.charCodeAt(0)) >>> 0, 0);
  let role: string = TEAM_ROLES[hash % TEAM_ROLES.length];
  if (model.gender === "female") {
    role = role.replace("Expert produit", "Experte produit").replace("Diagnosticien IA", "Diagnosticienne IA")
      .replace("Créateur de contenu", "Créatrice de contenu");
  }
  return { firstName, role };
}