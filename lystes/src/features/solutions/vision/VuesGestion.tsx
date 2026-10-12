import { Activity, ArrowLeft, ArrowRight, ArrowUp, Bookmark, CalendarDays, Camera, ChevronDown, ChevronsUpDown, Heart, Instagram, LayoutGrid, Lightbulb, MessageCircle, Mic, MoreHorizontal, Package, Play, RefreshCw, Send, Sparkles, Trash2, Trophy, Users } from "lucide-react";
import { Button } from "@lystes/components/ui/button";
import type { AIPhotographer } from "@lystes/features/ai-photographers/types";
import "./vues-gestion.css";

function Commandes() {
  return <div className="vg-commandes">{[ArrowLeft, ArrowRight, Play].map((Icon, i) => <Button key={i} variant="ghost" size="icon" tabIndex={-1} aria-label={["Précédent", "Suivant", "Lecture"][i]}><Icon /></Button>)}</div>;
}


/* Courbes de démonstration (forme seulement, aucune donnée marchand). */
function Courbe({ points, className }: { points: number[]; className?: string }) {
  const w = 300, h = 100, pas = w / (points.length - 1);
  const max = Math.max(...points), min = Math.min(...points);
  const xy = points.map((v, i) => [i * pas, h - 6 - ((v - min) / (max - min || 1)) * (h - 12)]);
  const ligne = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return <svg className={"vg-svg-courbe " + (className ?? "")} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
    <path d={`${ligne} L${w} ${h} L0 ${h} Z`} className="vg-aire" />
    <path d={ligne} className="vg-trace" vectorEffect="non-scaling-stroke" />
  </svg>;
}
const SERIES = [[4,6,5,8,7,10,9,13,12,15], [3,5,4,4,7,6,8,7,9,11], [2,4,7,6,9,12,11,14,16,18]];
const ANNEE = [40,62,55,80,74,96,120,108,140,165,150,190,176,210,198,230,224,250,238,262];

const indicateurs = [
  { titre: "Conversations", valeur: "1 626", note: "6 derniers mois" },
  { titre: "Agents IA sollicités", valeur: "176", note: "6 derniers mois" },
  { titre: "Essayages", valeur: "2 041", note: "depuis le début" },
];

export function VueCopilote() {
  return <section className="vg-surface vg-copilote" data-gestion-vue="copilote">
    <header className="vg-ligne"><nav className="vg-onglets"><span className="vg-actif">Agents IA</span><span>Ventes</span><span>Visites</span><span>Photos</span><span>Prompts</span></nav><Commandes /></header>
    <div className="vg-indicateurs">{indicateurs.map((k, i) => <article key={k.titre}><p>{k.titre}</p><strong>{k.valeur}</strong><Courbe points={SERIES[i]} className="vg-mini" /><p>{k.note}</p></article>)}</div>
    <p className="vg-reference">Démonstration · chiffres de la capture de référence</p>
    <nav className="vg-onglets vg-chat-onglets"><span className="vg-actif">Chat</span><span>Financement</span><span>Fiscal et comptable</span><span>Agence</span><span>Magazine</span><span>UGC</span><ChevronsUpDown /></nav>
    <div className="vg-saisie"><p>Posez une question sur votre business…</p><div className="vg-saisie-bas"><span><Sparkles />ChatGPT<ChevronDown /></span><span><Users />Copilote</span><span><Package />Produit</span><span><Camera />Créatifs IA</span><span><LayoutGrid />Prompts</span><div className="vg-envoi"><Mic /><Button variant="ghost" size="icon" tabIndex={-1} aria-label="Envoyer"><ArrowUp /></Button></div></div></div>
  </section>;
}

export function VueCommunity({ profil }: { profil?: AIPhotographer }) {
  const photos = profil?.sampleImages?.slice(0, 9) ?? [];
  return <section className="vg-surface vg-community" data-gestion-vue="community">
    <aside className="vg-profil">
      <div className="vg-ligne">{profil?.avatar && <img className="vg-avatar" src={profil.avatar} alt={profil.name} />}<div className="vg-actions"><RefreshCw /><Trash2 /></div></div>
      <p className="vg-role">AGENCE</p><h2>{profil?.name ?? "Community manager"}</h2><p>{profil?.type}</p><p className="vg-description">{profil?.title}</p>
      <div className="vg-miniatures">{photos.map((src, i) => <img src={src} key={i} alt={`Portfolio ${i + 1}`} />)}</div>
      {!photos.length && <p>Portfolio non disponible</p>}
    </aside>
    <div className="vg-feed"><header className="vg-ligne"><div className="vg-style"><Instagram /><div><strong>Style de contenus · Instagram Feed</strong><small>POSTS 4:5</small></div></div><div className="vg-actions"><ArrowLeft /><ArrowRight /></div></header>
      <div className="vg-publications">{photos.slice(0, 3).map((src, i) => <article key={i}><div className="vg-post-marque"><span className="vg-monogramme">L</span><div><strong>Votre marque</strong><small>Sponsorisé</small></div><MoreHorizontal /></div><img className="vg-photo" src={src} alt={`Exemple de publication ${i + 1}`} /><div className="vg-social"><Heart /><MessageCircle /><Send /><Bookmark /></div></article>)}</div>
    </div>
  </section>;
}

export function VueAnalystes() {
  return <section className="vg-surface vg-analystes" data-gestion-vue="analystes">
    <h2>Tableau de bord</h2><p className="vg-reference">Lystes & Partners · données non connectées</p>
    <header className="vg-ligne vg-filtres"><span><CalendarDays />6 derniers mois<ChevronDown /></span><nav className="vg-onglets"><span className="vg-actif"><LayoutGrid />Vue d’ensemble</span><span><Activity />Activité</span><span><Users />Équipe</span><span><Lightbulb />Insights</span></nav></header>
    <div className="vg-analyse-plaque"><div className="vg-courbe"><h3>Voici la courbe de vos conversations quotidiennes. <span>Sur les 12 derniers mois.</span></h3><nav className="vg-onglets"><span className="vg-actif">Conversations</span><span>Essayages</span></nav><p className="vg-reference">Évolution quotidienne</p><div className="vg-graphique"><div className="vg-graduations">{[280, 210, 140, 70, 0].map(n => <span key={n}>{n}</span>)}</div><div className="vg-graphique-vide"><Courbe points={ANNEE} className="vg-grande" /><span className="vg-badge-demo">Courbe de démonstration</span></div></div><div className="vg-dates"><span>avr.</span><span>mai</span><span>juin</span><span>juil.</span><span>août</span><span>sept.</span><span>oct.</span></div><p className="vg-sujets"><MessageCircle />Sujets fréquents</p><p className="vg-reference">Les sujets apparaîtront avec vos conversations.</p></div>
      <aside className="vg-classement"><h3><Trophy />Top produits du mois</h3><p className="vg-reference">Les plus sollicités par vos clients</p><div className="vg-rangs">{[1, 2, 3, 4, 5].map(n => <div key={n}><span>{n}</span><Package /><p>En attente de données</p></div>)}</div></aside></div>
  </section>;
}