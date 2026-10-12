/* Parler au conseiller choisi dans reglages.ts, quel qu’il soit.

   - biolystes-chat répond en flux (SSE au format OpenAI) et reçoit tout
     l’historique dans `messages`.
   - conseiller-selection répond d’un bloc en JSON ({ response, suggestions,
     rdv }) et reçoit `message` et `conversation_history`. */
import { ADRESSES_CONSEILLER, CONSEILLER, type Conseiller } from "./reglages";

export type Message = { role: "user" | "assistant"; content: string };

export type Reponse = { suggestions?: string[] };

const ERREUR = "Je n’arrive pas à vous répondre pour l’instant. Prenez rendez-vous, on étudie votre projet ensemble.";

export async function demanderAuConseiller(
  historique: Message[],
  surMorceau: (texte: string) => void,
  conseiller: Conseiller = CONSEILLER,
): Promise<Reponse> {
  const adresse = ADRESSES_CONSEILLER[conseiller];

  if (conseiller === "conseiller-selection") {
    const dernier = historique[historique.length - 1];
    const resp = await fetch(adresse, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: dernier.content,
        conversation_history: historique.slice(0, -1).slice(-10),
        site_language: "fr",
        page_url: window.location.href,
      }),
    });
    const data = await resp.json().catch(() => null);
    const texte = (data && (data.response || data.message || data.reply)) || ERREUR;
    surMorceau(texte);
    return { suggestions: Array.isArray(data?.suggestions) ? data.suggestions.slice(0, 3) : [] };
  }

  const resp = await fetch(adresse, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages: historique }),
  });
  if (!resp.ok || !resp.body) {
    surMorceau(ERREUR);
    return {};
  }

  const lecteur = resp.body.getReader();
  const decodeur = new TextDecoder();
  let tampon = "";
  let recu = false;
  let fini = false;
  const lireLigne = (ligne: string) => {
    if (ligne.endsWith("\r")) ligne = ligne.slice(0, -1);
    if (!ligne.startsWith("data: ")) return;
    const json = ligne.slice(6).trim();
    if (json === "[DONE]") { fini = true; return; }
    try {
      const morceau = JSON.parse(json).choices?.[0]?.delta?.content;
      if (morceau) { recu = true; surMorceau(morceau); }
    } catch { /* ligne illisible : ignorée */ }
  };
  while (!fini) {
    const { done, value } = await lecteur.read();
    if (done) break;
    tampon += decodeur.decode(value, { stream: true });
    let i: number;
    while (!fini && (i = tampon.indexOf("\n")) !== -1) {
      lireLigne(tampon.slice(0, i));
      tampon = tampon.slice(i + 1);
    }
  }
  if (!recu) surMorceau(ERREUR);
  return {};
}
