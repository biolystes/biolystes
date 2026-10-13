/* biolystes.com/agents-ia (JP, 13/10/2026) : l’accueil de lystes.ai, repris
   de petal-diagnostics (HomeVisionPage, copiée dans lystes/src), avec
   l’en-tête de biolystes.com. On y arrive par la bascule « Agents IA » de
   l’en-tête, sans rechargement : coquille commune avec l’accueil
   (src/pages/CoquilleLystes.tsx). Les écarts voulus avec lystes.ai (un seul
   appel à l’action, « Prendre rendez-vous ») sont dans lystes/ECARTS-VOULUS.md. */
import HomeVisionPage from "@lystes/features/solutions/HomeVisionPage";

export default function AgentsIaPage() {
  return <HomeVisionPage />;
}
