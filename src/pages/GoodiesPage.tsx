/* /goodies : goodies personnalisés, même bande de filtres et mêmes cartes que /catalogue.
   Aucun prix (règle du site : prix seulement sur /tarifs). */
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { MessageCircle, Search } from "lucide-react";
import { CATEGORIES_GOODIES, GOODIES, type CategorieGoodie } from "@/data/goodies";
import { LIEN_WHATSAPP_EXPERTE } from "@/lib/whatsapp";

const NOIR = "rgb(29,29,31)";
const BANDE = "#f3f4f5";

export default function GoodiesPage() {
  const [categorie, setCategorie] = useState<CategorieGoodie | null>(null);
  const [recherche, setRecherche] = useState("");

  const liste = useMemo(
    () => GOODIES.filter((g) => (!categorie || g.categorie === categorie) && g.nom.toLowerCase().includes(recherche.toLowerCase())),
    [categorie, recherche],
  );
  const nomCat = (id: CategorieGoodie) => CATEGORIES_GOODIES.find((c) => c.id === id)!.nom;

  const bouton = (actif: boolean) => ({
    background: actif ? NOIR : "#ffffff",
    color: actif ? "#ffffff" : NOIR,
    border: `1px solid ${actif ? NOIR : "rgba(29,29,31,0.08)"}`,
  });

  return (
    <section className="bg-background pb-16 md:pb-20 pt-6 md:pt-8">
      <Helmet>
        <title>Goodies personnalisés — Biolystes</title>
        <meta name="description" content="Goodies personnalisés à votre marque : textile, gourdes, papeterie, bougies et emballages." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-5">
        <div className="flex flex-col gap-3">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un goodie..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none border-0 focus:ring-1 focus:ring-black/20"
              style={{ background: BANDE }}
            />
          </div>
          <div data-barre-filtres className="rounded-2xl p-2.5 overflow-x-auto" style={{ background: BANDE }}>
            <div className="flex md:flex-wrap items-center gap-2">
              {[{ id: null as CategorieGoodie | null, nom: "Tous les goodies" }, ...CATEGORIES_GOODIES].map((c) => (
                <button
                  key={c.nom}
                  type="button"
                  onClick={() => setCategorie(c.id)}
                  className="shrink-0 inline-flex items-center h-11 px-4 rounded-xl text-[15px] font-medium whitespace-nowrap transition-colors"
                  style={bouton(categorie === c.id)}
                >
                  {c.nom}
                </button>
              ))}
            </div>
          </div>
        </div>

        <h2 className="text-2xl md:text-[28px] leading-tight text-foreground">{categorie ? nomCat(categorie) : "Tous les goodies"}</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {liste.map((g) => (
            <div key={g.nom} data-goodie className="flex flex-col rounded-[20px] overflow-hidden" style={{ background: BANDE }}>
              <div className="w-full aspect-square overflow-hidden" style={{ background: BANDE }}>
                <img src={g.image} alt={g.nom} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="px-[18px] pt-4 pb-[18px] flex flex-col gap-2 flex-1">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.3px] leading-[1.4] line-clamp-2 min-h-[30px]" style={{ color: NOIR }}>{g.nom}</h3>
                <div className="flex items-center justify-between gap-1.5 mt-auto pt-[6px]" style={{ borderTop: "1px solid #e5e7eb" }}>
                  <span className="text-[10px] text-muted-foreground">Personnalisable</span>
                  <span className="px-[9px] py-[3px] rounded-full text-[8px] font-bold uppercase tracking-[0.4px] whitespace-nowrap" style={{ background: NOIR, color: "#ffffff" }}>
                    {nomCat(g.categorie)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {liste.length === 0 && <p className="text-sm text-muted-foreground">Aucun goodie ne correspond.</p>}

        <div className="flex justify-center pt-6">
          <a href={LIEN_WHATSAPP_EXPERTE} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-medium hover:opacity-80"
            style={{ background: NOIR, color: "#ffffff" }}>
            <MessageCircle className="w-4 h-4" /> Parler à une experte
          </a>
        </div>
      </div>
    </section>
  );
}
