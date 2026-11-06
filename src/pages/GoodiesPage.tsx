/* /goodies : goodies personnalisés, même bande de filtres et mêmes cartes que /catalogue.
   Chaque goodie : tous ses coloris (pastilles qui changent la photo), quantité, ajout à la commande.
   La commande est enregistrée (table commandes_goodies) puis l'équipe revient vers la cliente.
   Aucun prix (règle du site : prix seulement sur /tarifs). */
import { Fragment, useMemo, useState } from "react";
import CarteEvenements from "@/components/goodies/GoodiesEvenements";
import CarteBackstage from "@/components/CarteBackstage";
import { createPortal } from "react-dom";
import { Helmet } from "react-helmet-async";
import { MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES_GOODIES, GOODIES, PRODUITS_GOODIES, type CategorieGoodie, type Goodie, type ProduitGoodie } from "@/data/goodies";
import { LIEN_WHATSAPP_EXPERTE } from "@/lib/whatsapp";

const NOIR = "rgb(29,29,31)";
const BANDE = "#f3f4f5";
const QTE_MIN = 1;

interface Ligne { goodie: string; coloris: string; quantite: number }

function FicheGoodie({ p, onFermer }: { p: ProduitGoodie; onFermer: () => void }) {
  const [photo, setPhoto] = useState(p.galerie[0]);
  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/30 z-[10000000]" style={{ position: "fixed", zIndex: 10000000, background: "rgba(0,0,0,0.3)" }} onClick={onFermer} />
      <div role="dialog" aria-label={p.nom} className="fixed inset-x-0 top-10 mx-auto z-[10000001] overflow-y-auto rounded-[20px] bg-background p-5 md:p-7" style={{ position: "fixed", zIndex: 10000001, background: "#ffffff", width: "min(900px, 94vw)", maxHeight: "calc(100dvh - 80px)" }}>
        <button onClick={onFermer} aria-label="Fermer" className="absolute right-4 top-4 w-[30px] h-[30px] rounded-lg flex items-center justify-center" style={{ background: BANDE }}><X className="w-4 h-4" /></button>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="aspect-square rounded-2xl overflow-hidden" style={{ background: BANDE }}><img src={photo} alt={p.nom} className="w-full h-full object-cover" /></div>
            <div className="flex flex-wrap gap-1.5">
              {p.galerie.map((u) => (
                <button key={u} type="button" onClick={() => setPhoto(u)} className="w-14 h-14 rounded-lg overflow-hidden" style={{ background: BANDE, outline: u === photo ? `2px solid ${NOIR}` : "none" }}>
                  <img src={u} alt="" loading="lazy" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.3px] pr-8" style={{ color: NOIR }}>{p.nom}</h3>
            {p.accroche && <p className="text-foreground">{p.accroche}</p>}
            {p.variantes.some((v) => v.coloris) && <p className="text-muted-foreground">Coloris : {p.variantes.map((v) => v.coloris).filter(Boolean).join(", ")}</p>}
            {p.dimensions.length > 0 && <p className="text-muted-foreground">Dimensions / tailles : {p.dimensions.join(" · ")}</p>}
            {Object.entries(p.caracteristiques).map(([k, v]) => <p key={k} className="text-muted-foreground">{k} : {v}</p>)}
          </div>
        </div>
        {p.description && (
          <div className="mt-6 space-y-2 text-sm leading-relaxed text-muted-foreground">
            {p.description.split("\n").map((l, i) => <p key={i}>{l}</p>)}
          </div>
        )}
      </div>
    </>,
    document.body,
  );
}

function CarteGoodie({ g, onAjout, onFiche }: { g: Goodie; onAjout: (coloris: string, q: number) => void; onFiche: () => void }) {
  const [q, setQ] = useState(50);
  const [ajoute, setAjoute] = useState(false);
  const [sel, setSel] = useState(0);
  if (g.choix) g = { ...g, coloris: g.choix[sel].coloris, image: g.choix[sel].image };
  return (
    <div data-goodie className="flex flex-col rounded-[20px] overflow-hidden" style={{ background: BANDE }}>
      <button type="button" onClick={onFiche} aria-label={`Voir la fiche ${g.nom}`} className="w-full aspect-square overflow-hidden" style={{ background: BANDE }}>
        <img src={g.image} alt={`${g.nom}${g.coloris ? ` — ${g.coloris}` : ""}`} loading="lazy" className="w-full h-full object-cover" />
      </button>
      <div className="px-[14px] md:px-[18px] pt-4 pb-[18px] flex flex-col gap-1.5 flex-1">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.3px] leading-[1.4] line-clamp-2 min-h-[30px]" style={{ color: NOIR }}>{g.nom}</h3>
        {g.choix ? (
          <select aria-label="Coloris" value={sel} onChange={(e) => setSel(Number(e.target.value))} className="self-start text-[11px] rounded-md bg-background px-2 py-1 outline-none">
            {g.choix.map((c, i) => <option key={i} value={i}>{c.coloris ?? "Standard"}</option>)}
          </select>
        ) : g.coloris && <p className="text-[11px] text-muted-foreground">{g.coloris}</p>}
        <button type="button" onClick={onFiche} className="self-start text-[11px] underline text-muted-foreground">Voir la fiche</button>
        <div className="mt-auto pt-2 flex items-center gap-2" style={{ borderTop: "1px solid #e5e7eb" }}>
          <div className="flex items-center rounded-lg bg-background">
            <button type="button" aria-label="Moins" className="w-7 h-8 flex items-center justify-center" onClick={() => setQ(Math.max(QTE_MIN, q - 10))}><Minus className="w-3 h-3" /></button>
            <input aria-label="Quantité" inputMode="numeric" value={q} onChange={(e) => setQ(Math.max(QTE_MIN, parseInt(e.target.value.replace(/\D/g, "")) || QTE_MIN))} className="w-10 text-center text-xs bg-transparent outline-none" />
            <button type="button" aria-label="Plus" className="w-7 h-8 flex items-center justify-center" onClick={() => setQ(q + 10)}><Plus className="w-3 h-3" /></button>
          </div>
          <button type="button" data-ajouter onClick={() => { onAjout(g.coloris ?? "Standard", q); setAjoute(true); setTimeout(() => setAjoute(false), 1500); }}
            className="flex-1 h-8 rounded-lg text-[11px] font-semibold" style={{ background: NOIR, color: "#fff" }}>
            {ajoute ? "Ajouté ✓" : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GoodiesPage() {
  const [categorie, setCategorie] = useState<CategorieGoodie | null>(null);
  const [panier, setPanier] = useState<Ligne[]>([]);
  const [ouvert, setOuvert] = useState(false);
  const [form, setForm] = useState({ nom: "", email: "", telephone: "", entreprise: "", message: "" });
  const [etat, setEtat] = useState<"" | "envoi" | "ok" | "erreur">("");
  const [fiche, setFiche] = useState<ProduitGoodie | null>(null);

  const liste = useMemo(
    () => GOODIES.filter((g) => (!categorie || g.categorie === categorie)),
    [categorie],
  );
  const nomCat = (id: CategorieGoodie) => CATEGORIES_GOODIES.find((c) => c.id === id)!.nom;
  const total = panier.reduce((s, l) => s + l.quantite, 0);

  const ajouter = (goodie: string, coloris: string, quantite: number) =>
    setPanier((p) => {
      const i = p.findIndex((l) => l.goodie === goodie && l.coloris === coloris);
      if (i < 0) return [...p, { goodie, coloris, quantite }];
      const n = [...p]; n[i] = { ...n[i], quantite: n[i].quantite + quantite }; return n;
    });

  const envoyer = async (e: React.FormEvent) => {
    e.preventDefault();
    setEtat("envoi");
    const { error } = await supabase.from("commandes_goodies").insert({
      nom: form.nom.trim(), email: form.email.trim(), telephone: form.telephone.trim() || null,
      entreprise: form.entreprise.trim() || null, message: form.message.trim() || null, articles: panier as never,
    });
    if (error) { console.error("commande goodies", error); setEtat("erreur"); return; }
    setEtat("ok"); setPanier([]);
  };

  const bouton = (actif: boolean) => ({ background: actif ? NOIR : "#ffffff", color: actif ? "#ffffff" : NOIR, border: `1px solid ${actif ? NOIR : "rgba(29,29,31,0.08)"}` });
  const champ = "w-full px-3 py-2.5 rounded-xl text-sm outline-none border-0 focus:ring-1 focus:ring-black/20";

  return (
    <section className="bg-background pb-16 md:pb-20 pt-6 md:pt-8">
      <Helmet>
        <title>Goodies personnalisés — Biolystes</title>
        <meta name="description" content="Commandez vos goodies personnalisés à votre marque : textile, gourdes, papeterie, bougies et emballages, dans tous leurs coloris." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-5">
        <div className="flex flex-col gap-3">
          <div data-barre-filtres className="overflow-x-auto -mx-1 px-1 pb-1">
            <div className="flex items-start gap-3">
              {[{ id: null as CategorieGoodie | null, nom: "Tous les goodies" }, ...CATEGORIES_GOODIES.filter((k) => GOODIES.some((g) => g.categorie === k.id))].map((c) => {
                const actif = categorie === c.id;
                const img = (c.id ? GOODIES.find((g) => g.categorie === c.id) : GOODIES[0])?.image;
                return (
                  <button key={c.nom} type="button" onClick={() => setCategorie(c.id)} aria-pressed={actif}
                    className="shrink-0 flex flex-col items-center gap-2 text-center" style={{ width: 120, minWidth: 120, maxWidth: 120, flex: "0 0 120px" }}>
                    <span className="rounded-[20px] overflow-hidden flex items-center justify-center transition-shadow"
                      style={{ width: 120, height: 120, background: BANDE, boxShadow: actif ? `inset 0 0 0 2px ${NOIR}` : "none" }}>
                      {img && <img src={img} alt="" loading="lazy" style={{ width: 96, height: 96, objectFit: "contain" }} />}
                    </span>
                    <span className={`text-[13px] leading-tight ${actif ? "font-semibold" : ""}`} style={{ color: NOIR }}>{c.nom}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl md:text-[28px] leading-tight text-foreground">{categorie ? nomCat(categorie) : "Tous les goodies"}</h2>
            <button type="button" data-ouvrir-commande onClick={() => { setOuvert(true); if (etat === "ok") setEtat(""); }}
              className="shrink-0 inline-flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-medium" style={{ background: NOIR, color: "#fff" }}>
              <ShoppingBag className="w-4 h-4" /> Ma commande{panier.length > 0 && ` (${panier.length})`}
            </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {!categorie && <CarteBackstage titre="Meetup pour vos events" lien="/meetup" className="col-start-1 row-start-4" />}
          {liste.map((g, i) => <Fragment key={g.slug + g.coloris}>{i === 3 && !categorie && <CarteEvenements />}<CarteGoodie key={g.slug + g.coloris} g={g} onAjout={(c, q) => ajouter(g.nom, c, q)} onFiche={() => setFiche(PRODUITS_GOODIES.find((p) => p.slug === g.slug) ?? null)} /></Fragment>)}
        </div>
        {liste.length === 0 && <p className="text-sm text-muted-foreground">Aucun goodie ne correspond.</p>}

        <div className="flex justify-center pt-6">
          <a href={LIEN_WHATSAPP_EXPERTE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-medium hover:opacity-80" style={{ background: NOIR, color: "#ffffff" }}>
            <MessageCircle className="w-4 h-4" /> Parler à une experte
          </a>
        </div>
      </div>

      {fiche && <FicheGoodie key={fiche.slug} p={fiche} onFermer={() => setFiche(null)} />}
      {ouvert && (
        <>
          <div className="fixed inset-0 bg-black/30 z-[10000000]" onClick={() => setOuvert(false)} />
          <div role="dialog" aria-label="Ma commande" className="fixed top-0 right-0 bottom-0 z-[10000001] overflow-y-auto flex flex-col bg-background" style={{ width: "min(440px, 100vw)" }}>
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${BANDE}` }}>
              <span className="text-[11px] font-bold tracking-[1px] uppercase text-muted-foreground">Ma commande de goodies</span>
              <button onClick={() => setOuvert(false)} aria-label="Fermer" className="w-[30px] h-[30px] rounded-lg flex items-center justify-center" style={{ background: BANDE }}><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-5">
              {etat === "ok" ? (
                <div data-commande-envoyee className="space-y-2">
                  <p className="text-lg font-medium">Merci, votre commande est bien reçue.</p>
                  <p className="text-sm text-muted-foreground">Notre équipe vous recontacte pour valider le logo, les quantités et le devis.</p>
                </div>
              ) : panier.length === 0 ? (
                <p className="text-sm text-muted-foreground">Votre commande est vide. Choisissez un coloris et une quantité, puis « Ajouter ».</p>
              ) : (
                <>
                  <ul className="space-y-2">
                    {panier.map((l, i) => (
                      <li key={l.goodie + l.coloris} className="flex items-center gap-3 rounded-xl p-3" style={{ background: BANDE }}>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold leading-snug">{l.goodie}</p>
                          <p className="text-[11px] text-muted-foreground">{l.coloris}</p>
                        </div>
                        <input aria-label="Quantité" inputMode="numeric" value={l.quantite}
                          onChange={(e) => setPanier((p) => p.map((x, j) => j === i ? { ...x, quantite: Math.max(QTE_MIN, parseInt(e.target.value.replace(/\D/g, "")) || QTE_MIN) } : x))}
                          className="w-14 text-center text-xs rounded-lg py-1.5 bg-background outline-none" />
                        <button aria-label="Retirer" onClick={() => setPanier((p) => p.filter((_, j) => j !== i))}><Trash2 className="w-4 h-4 text-muted-foreground" /></button>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground">{total} pièce{total > 1 ? "s" : ""} au total · devis envoyé après validation du logo.</p>
                  <form onSubmit={envoyer} className="space-y-2.5">
                    <input required maxLength={120} placeholder="Nom et prénom *" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} className={champ} style={{ background: BANDE }} />
                    <input required type="email" maxLength={200} placeholder="E-mail *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={champ} style={{ background: BANDE }} />
                    <input maxLength={40} placeholder="Téléphone" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} className={champ} style={{ background: BANDE }} />
                    <input maxLength={160} placeholder="Marque / entreprise" value={form.entreprise} onChange={(e) => setForm({ ...form, entreprise: e.target.value })} className={champ} style={{ background: BANDE }} />
                    <textarea maxLength={2000} rows={3} placeholder="Message (date de l'événement, logo…)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={champ} style={{ background: BANDE }} />
                    {etat === "erreur" && <p className="text-xs text-destructive">L'envoi n'a pas fonctionné. Réessayez ou écrivez-nous sur WhatsApp.</p>}
                    <button type="submit" disabled={etat === "envoi"} data-envoyer-commande className="w-full h-11 rounded-xl text-sm font-medium disabled:opacity-60" style={{ background: NOIR, color: "#fff" }}>
                      {etat === "envoi" ? "Envoi…" : "Envoyer ma commande"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
