import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowUpRight, Search, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MAGAZINES, THEMATIQUES_MAGAZINES, filtrerMagazines, type Magazine } from "@/data/magazines";
import vogue from "@/assets/magazines/logo-vogue-france.png.asset.json";
import publicLogo from "@/assets/magazines/logo-public.png.asset.json";
import challenges from "@/assets/magazines/logo-challenges.png.asset.json";
import forbes from "@/assets/magazines/logo-forbes.png.asset.json";
import gq from "@/assets/magazines/logo-gq.jpeg.asset.json";
import echos from "@/assets/magazines/logo-les-echos-solutions.jpeg.asset.json";

const LOGOS: Record<string, string> = { "vogue.fr": vogue.url, "public.fr": publicLogo.url, "challenges.fr": challenges.url, "forbes.fr": forbes.url, "gqmagazine.fr": gq.url, "solutions.lesechos.fr": echos.url };
const nombre = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

function Identite({ magazine }: { magazine: Magazine }) {
  const logo = LOGOS[magazine.editeur];
  const [imageIndisponible, setImageIndisponible] = useState(false);
  return <div className="flex items-center gap-3 min-w-0">
    <div className="h-14 w-14 shrink-0 rounded-full bg-background border border-border flex items-center justify-center overflow-hidden">
      {logo && !imageIndisponible ? <img src={logo} alt="" onError={() => setImageIndisponible(true)} className="w-full h-full object-contain p-1" /> : <span className="text-lg font-semibold text-foreground">{magazine.editeur.replace(/^(fr\.|madame\.|solutions\.)/, "").slice(0, 2).toUpperCase()}</span>}
    </div>
    <div className="min-w-0"><h2 className="text-base font-semibold break-words">{magazine.editeur}</h2><p className="text-xs text-muted-foreground mt-1 leading-relaxed">{magazine.thematiques.join(" · ") || "Thématiques non renseignées"}</p></div>
  </div>;
}

export default function MagazinesPage() {
  const [recherche, setRecherche] = useState("");
  const [themes, setThemes] = useState<string[]>([]);
  const [tri, setTri] = useState("catalogue");
  const [fiche, setFiche] = useState<Magazine | null>(null);
  const [article, setArticle] = useState("");
  const resultats = useMemo(() => {
    const liste = filtrerMagazines(recherche, themes);
    return tri === "audience" ? liste.sort((a, b) => b.visites - a.visites) : tri === "nom" ? liste.sort((a, b) => a.editeur.localeCompare(b.editeur)) : liste;
  }, [recherche, themes, tri]);
  const reinitialiser = () => { setRecherche(""); setThemes([]); setTri("catalogue"); };
  const demander = `https://biolystes.pro/rdv?magazine=${encodeURIComponent(fiche?.editeur ?? "")}&article=${encodeURIComponent(article.trim())}`;
  return <section className="bg-background text-foreground py-8 md:py-12">
    <Helmet><title>Magazines — Presse & notoriété | Biolystes</title><meta name="description" content="Découvrez les magazines et leurs audiences pour envisager un article sponsorisé sur votre marque avec Biolystes. Sur devis." /><meta property="og:title" content="Magazines — Biolystes" /><meta property="og:description" content="Votre marque dans la presse : magazines, thématiques et audiences. Sur devis." /><meta property="og:type" content="website" /><meta name="twitter:card" content="summary" /></Helmet>
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <header className="mb-8 space-y-3"><h1 className="text-4xl md:text-5xl font-light">Magazines</h1><p className="text-base text-muted-foreground max-w-3xl">Faites connaître votre marque avec un article sponsorisé. Découvrez les magazines, leurs thématiques et leurs audiences, puis échangeons sur votre projet.</p></header>
      {fiche ? <div className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={() => setFiche(null)} className="mb-6"><ArrowLeft />Retour aux magazines</Button>
        <Identite magazine={fiche} />
        <Button asChild variant="link" className="mt-3 px-0"><a href={`https://${fiche.editeur}`} target="_blank" rel="noopener noreferrer">Visiter le magazine<ArrowUpRight /></a></Button>
        <div className="border-y border-border py-6 mt-5"><h3 className="text-xl font-light mb-4">Audience & référencement</h3><dl className="space-y-3">{[{ label: "Trust Flow (TF)", valeur: fiche.tf }, { label: "Domain Rating (DR)", valeur: fiche.dr }, { label: "Domaines référents", valeur: fiche.rd }, { label: "Visites mensuelles", valeur: fiche.visites }].map(s => <div key={s.label} className="flex justify-between gap-4"><dt className="text-sm text-muted-foreground">{s.label}</dt><dd className="text-sm font-semibold">{nombre(s.valeur)}</dd></div>)}</dl><p className="text-xs text-muted-foreground mt-4">Source : catalogue éditeurs du 2 septembre 2026. Chiffres à confirmer avec la rédaction au moment du projet.</p></div>
        <div className="py-6 space-y-4"><h3 className="text-xl font-light">Votre article</h3><p className="text-sm text-muted-foreground">Un article sponsorisé de 300 mots avec un lien vers votre boutique. L’angle, le texte et les conditions de publication sont validés avant l’envoi à la rédaction.</p><label htmlFor="article-magazine" className="block text-sm font-medium">Quel sujet souhaitez-vous présenter ?</label><textarea id="article-magazine" value={article} onChange={e => setArticle(e.target.value)} maxLength={1000} rows={4} placeholder="Votre marque, un lancement, votre produit phare…" className="w-full border border-border rounded-lg bg-background text-foreground p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" /><div className="flex items-center justify-between gap-4"><span className="text-sm text-muted-foreground">Sur devis</span><Button asChild><a href={demander} target="_blank" rel="noopener noreferrer">Parler de mon projet<ArrowUpRight /></a></Button></div></div>
      </div> : <div className="magazines-disposition grid grid-cols-1 gap-8">
        <aside className="space-y-5">
          <label className="flex items-center gap-2 border border-border rounded-lg px-3 py-2"><Search className="w-4 h-4 shrink-0 text-muted-foreground" /><input aria-label="Rechercher un magazine" value={recherche} onChange={e => setRecherche(e.target.value)} placeholder="Rechercher…" className="w-full min-w-0 bg-transparent text-sm outline-none" /></label>
          <div><label htmlFor="tri-magazines" className="block text-sm font-medium mb-2">Trier par</label><select id="tri-magazines" value={tri} onChange={e => setTri(e.target.value)} className="w-full bg-background border border-border rounded-lg p-2 text-sm"><option value="catalogue">Ordre du catalogue</option><option value="audience">Audience décroissante</option><option value="nom">Nom du magazine</option></select></div>
          <fieldset className="space-y-3"><legend className="text-sm font-medium mb-3">Thématiques</legend>{THEMATIQUES_MAGAZINES.map(t => <label key={t} className="flex gap-2 items-start text-xs text-muted-foreground cursor-pointer"><input type="checkbox" checked={themes.includes(t)} onChange={e => setThemes(current => e.target.checked ? [...current, t] : current.filter(x => x !== t))} className="mt-0.5 shrink-0 accent-primary" /><span>{t} ({MAGAZINES.filter(m => m.thematiques.includes(t)).length})</span></label>)}</fieldset>
          <Button variant="ghost" size="sm" onClick={reinitialiser}><RotateCcw />Réinitialiser</Button>
        </aside>
        <div><p className="text-sm text-muted-foreground mb-4" role="status">{resultats.length} magazine{resultats.length > 1 ? "s" : ""}</p><div className="grid grid-cols-1 lg:grid-cols-2 gap-4">{resultats.map(m => <article key={m.editeur} className="rounded-lg bg-muted/40 border border-border p-5 flex flex-col gap-5"><Identite magazine={m} /><dl className="grid grid-cols-3 gap-2 border-t border-border pt-4">{[{ label: "TF", valeur: m.tf }, { label: "DR", valeur: m.dr }, { label: "visites / mois", valeur: m.visites }].map(s => <div key={s.label}><dd className="text-sm font-semibold">{nombre(s.valeur)}</dd><dt className="text-xs text-muted-foreground mt-1">{s.label}</dt></div>)}</dl><div className="flex justify-between items-center gap-3 mt-auto"><span className="text-xs text-muted-foreground">Sur devis</span><Button size="sm" variant="outline" aria-label={`En savoir plus sur ${m.editeur}`} onClick={() => { setFiche(m); setArticle(""); window.scrollTo(0, 0); }}>En savoir plus</Button></div></article>)}</div>{resultats.length === 0 && <div className="py-12 text-center"><p className="text-muted-foreground">Aucun magazine ne correspond à votre recherche.</p><Button variant="link" onClick={reinitialiser}>Voir tous les magazines</Button></div>}</div>
      </div>}
    </div>
  </section>;
}