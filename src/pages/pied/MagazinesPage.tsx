import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowUpRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MAGAZINES, LECTORATS, POSITIONNEMENTS, AUDIENCES, filtrerMagazines, type Magazine } from "@/data/magazines";
import BarreFiltresRP from "@/components/BarreFiltresRP";
import couvElunesse from "@/assets/magazines/couverture-elunesse.webp.asset.json";
import couvEcrin from "@/assets/magazines/couverture-ecrin.png.asset.json";
import couvBrume from "@/assets/magazines/couverture-brume.png.asset.json";

/* Nos magazines : cartes photo plein cadre, en tête de liste. */
const POSITIONS_NOS = [0, 6, 11, 16];
const NOS_MAGAZINES = [
  { nom: "Elunesse Magazine", url: "https://elunesse.com/", photo: couvElunesse.url },
  { nom: "Brume Magazine", url: "https://brumemagazine.com/", photo: couvBrume.url },
  { nom: "Écrin Magazine", url: "https://ecrinmagazine.com/", photo: couvEcrin.url },
];
import vogue from "@/assets/magazines/logo-vogue-france.png.asset.json";
import publicLogo from "@/assets/magazines/logo-public.png.asset.json";
import challenges from "@/assets/magazines/logo-challenges.png.asset.json";
import forbes from "@/assets/magazines/logo-forbes.png.asset.json";
import gq from "@/assets/magazines/logo-gq.jpeg.asset.json";
import echos from "@/assets/magazines/logo-les-echos-solutions.jpeg.asset.json";

const autresLogos = import.meta.glob<{ url: string }>("@/assets/magazines/logo-*-*.png.asset.json", { eager: true, import: "default" });
const LOGOS_SITES: Record<string, string> = Object.fromEntries(
  ["fr.euronews.com", "purepeople.com", "grazia.fr", "strategies.fr", "cbnews.fr", "madame.lefigaro.fr", "latribune.fr", "femmeactuelle.fr", "voici.fr", "marieclaire.fr", "cosmopolitan.fr"]
    .map(d => [d, Object.entries(autresLogos).find(([p]) => p.endsWith(`logo-${d.replace(/\./g, "-")}.png.asset.json`))?.[1].url])
    .filter(([, u]) => u) as [string, string][]
);
const LOGOS: Record<string, string> = { ...LOGOS_SITES, "vogue.fr": vogue.url, "public.fr": publicLogo.url, "challenges.fr": challenges.url, "forbes.fr": forbes.url, "gqmagazine.fr": gq.url, "solutions.lesechos.fr": echos.url };
const nombre = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

function Identite({ magazine }: { magazine: Magazine }) {
  const logo = LOGOS[magazine.editeur];
  const [imageIndisponible, setImageIndisponible] = useState(false);
  return <div className="flex flex-col gap-3 min-w-0">
    <div className="rp-logo bg-background border border-border">
      {logo && !imageIndisponible ? <img src={logo} alt={`Logo ${magazine.editeur}`} onError={() => setImageIndisponible(true)} /> : <span className="text-lg font-semibold text-foreground">{magazine.editeur.replace(/^(fr\.|madame\.|solutions\.)/, "").slice(0, 2).toUpperCase()}</span>}
    </div>
    <div className="min-w-0"><h2 className="text-base font-semibold break-words">{magazine.editeur}</h2><p className="text-xs text-muted-foreground mt-1 leading-relaxed">{`Lectorat ${magazine.lectorat.toLowerCase()} · ${magazine.positionnement}`}</p></div>
  </div>;
}

export default function MagazinesPage() {
  const [recherche, setRecherche] = useState("");
  const [choix, setChoix] = useState<Record<string, string[]>>({ lectorat: [], positionnement: [], audience: [] });
  const [tri, setTri] = useState("catalogue");
  const [fiche, setFiche] = useState<Magazine | null>(null);
  const [article, setArticle] = useState("");
  const resultats = useMemo(() => {
    const liste = filtrerMagazines(recherche, { lectorats: choix.lectorat, positionnements: choix.positionnement, audiences: choix.audience.map(Number) });
    return tri === "audience" ? liste.sort((a, b) => b.visites - a.visites) : tri === "nom" ? liste.sort((a, b) => a.editeur.localeCompare(b.editeur)) : liste;
  }, [recherche, choix, tri]);
  const reinitialiser = () => { setRecherche(""); setChoix({ lectorat: [], positionnement: [], audience: [] }); setTri("catalogue"); };
  const demander = `https://biolystes.pro/rdv?magazine=${encodeURIComponent(fiche?.editeur ?? "")}&article=${encodeURIComponent(article.trim())}`;
  return <section className="bg-background text-foreground py-8 md:py-12">
    <Helmet><title>RP — Presse & notoriété | Biolystes</title><meta name="description" content="Découvrez les magazines et leurs audiences pour envisager un article sponsorisé sur votre marque avec Biolystes. Sur devis." /><meta property="og:title" content="RP — Biolystes" /><meta property="og:description" content="Votre marque dans la presse : magazines, thématiques et audiences. Sur devis." /><meta property="og:type" content="website" /><meta name="twitter:card" content="summary" /></Helmet>
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <header className="mb-8 space-y-3"><h1 className="text-4xl md:text-5xl font-light">RP</h1><p className="text-base text-muted-foreground max-w-3xl">Faites connaître votre marque avec un article sponsorisé. Découvrez les magazines, leurs thématiques et leurs audiences, puis échangeons sur votre projet.</p></header>
      {fiche ? <div className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={() => setFiche(null)} className="mb-6"><ArrowLeft />Retour aux magazines</Button>
        <Identite magazine={fiche} />
        <Button asChild variant="link" className="mt-3 px-0"><a href={`https://${fiche.editeur}`} target="_blank" rel="noopener noreferrer">Visiter le magazine<ArrowUpRight /></a></Button>
        <div className="border-y border-border py-6 mt-5"><h3 className="text-xl font-light mb-4">Audience & référencement</h3><dl className="space-y-3">{[{ label: "Trust Flow (TF)", valeur: fiche.tf }, { label: "Domain Rating (DR)", valeur: fiche.dr }, { label: "Domaines référents", valeur: fiche.rd }, { label: "Visites mensuelles", valeur: fiche.visites }].map(s => <div key={s.label} className="flex justify-between gap-4"><dt className="text-sm text-muted-foreground">{s.label}</dt><dd className="text-sm font-semibold">{nombre(s.valeur)}</dd></div>)}</dl><p className="text-xs text-muted-foreground mt-4">Source : catalogue éditeurs du 2 septembre 2026. Chiffres à confirmer avec la rédaction au moment du projet.</p></div>
        <div className="py-6 space-y-4"><h3 className="text-xl font-light">Votre article</h3><p className="text-sm text-muted-foreground">Un article sponsorisé de 300 mots avec un lien vers votre boutique. L’angle, le texte et les conditions de publication sont validés avant l’envoi à la rédaction.</p><label htmlFor="article-magazine" className="block text-sm font-medium">Quel sujet souhaitez-vous présenter ?</label><textarea id="article-magazine" value={article} onChange={e => setArticle(e.target.value)} maxLength={1000} rows={4} placeholder="Votre marque, un lancement, votre produit phare…" className="w-full border border-border rounded-lg bg-background text-foreground p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" /><div className="flex items-center justify-between gap-4"><span /><Button asChild><a href={demander} target="_blank" rel="noopener noreferrer">Parler de mon projet<ArrowUpRight /></a></Button></div></div>
      </div> : <div className="space-y-5">
        <label className="flex items-center gap-2 border border-border rounded-xl px-3 py-2 max-w-md"><Search className="w-4 h-4 shrink-0 text-muted-foreground" /><input aria-label="Rechercher un magazine" value={recherche} onChange={e => setRecherche(e.target.value)} placeholder="Rechercher…" className="w-full min-w-0 bg-transparent text-sm outline-none" /></label>
        <BarreFiltresRP
          rubriques={[
            { cle: "lectorat", titre: "Lectorat", tous: "Tous les lectorats", choisies: choix.lectorat, options: LECTORATS.map(l => ({ valeur: l, libelle: l === "Mixte" ? "Mixte" : `Plutôt ${l.toLowerCase()}s`, n: MAGAZINES.filter(m => m.lectorat === l).length })) },
            { cle: "positionnement", titre: "Positionnement", tous: "Tous les positionnements", choisies: choix.positionnement, options: POSITIONNEMENTS.map(p => ({ valeur: p, libelle: p, n: MAGAZINES.filter(m => m.positionnement === p).length })) },
            { cle: "audience", titre: "Audience", tous: "Toutes les audiences", choisies: choix.audience, options: AUDIENCES.map((a, i) => ({ valeur: String(i), libelle: a.libelle, n: MAGAZINES.filter(m => m.visites >= a.min && m.visites < a.max).length })) },
          ]}
          onBascule={(cle, v) => setChoix(c => ({ ...c, [cle]: c[cle].includes(v) ? c[cle].filter(x => x !== v) : [...c[cle], v] }))}
          onTous={cle => setChoix(c => ({ ...c, [cle]: [] }))}
          onVider={() => setChoix({ lectorat: [], positionnement: [], audience: [] })}
          tri={tri} onTri={setTri}
          tris={[{ valeur: "catalogue", libelle: "Ordre du catalogue" }, { valeur: "audience", libelle: "Audience décroissante" }, { valeur: "nom", libelle: "Nom du magazine" }]}
        />
        <div><p className="text-sm text-muted-foreground mb-4" role="status">{resultats.length} magazine{resultats.length > 1 ? "s" : ""}</p><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">{resultats.flatMap((m, idx) => { const carte = <article key={m.editeur} className="rounded-[28px] bg-background border border-border overflow-hidden flex flex-col"><div className="h-16 bg-muted" /><div className="px-6 pb-6 -mt-10 flex flex-col flex-1"><Identite magazine={m} /><dl className="grid grid-cols-3 my-6">{[{ label: "TF", valeur: m.tf }, { label: "DR", valeur: m.dr }, { label: "vis/mois", valeur: m.visites }].map((s, i) => <div key={s.label} className={`text-center ${i ? "border-l border-border" : ""}`}><dd className="text-sm font-semibold">{nombre(s.valeur)}</dd><dt className="text-[11px] uppercase tracking-[1.5px] text-muted-foreground mt-1">{s.label}</dt></div>)}</dl><Button variant="outline" className="w-full h-12 rounded-full mt-auto" aria-label={`En savoir plus sur ${m.editeur}`} onClick={() => { setFiche(m); setArticle(""); window.scrollTo(0, 0); }}>En savoir plus</Button><p className="text-base text-muted-foreground mt-5">{m.editeur}</p></div></article>; const n = recherche ? undefined : NOS_MAGAZINES[POSITIONS_NOS.indexOf(idx)]; return n ? [<a key={n.nom} href={n.url} target="_blank" rel="noopener noreferrer" data-nos-magazines className="group relative rounded-[28px] overflow-hidden min-h-[400px] bg-muted block"><img src={n.photo} alt={n.nom} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" /><div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-foreground/85 via-foreground/40 to-transparent" /><div className="absolute bottom-6 left-0 w-full px-5 flex flex-col items-center gap-3 text-center text-background"><p className="text-[11px] font-bold uppercase tracking-[1px]">Nouveau magazine édité par Biolystes</p><p className="text-2xl font-light">{n.nom}</p><span className="inline-flex items-center gap-1 h-10 px-5 rounded-xl bg-background text-foreground text-sm font-medium">Découvrir le magazine<ArrowUpRight className="w-4 h-4" /></span></div></a>, carte] : [carte]; })}</div>{resultats.length === 0 && <div className="py-12 text-center"><p className="text-muted-foreground">Aucun magazine ne correspond à votre recherche.</p><Button variant="link" onClick={reinitialiser}>Voir tous les magazines</Button></div>}</div>
      </div>}
    </div>
  </section>;
}