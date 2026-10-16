/* /catalogue (JP, 14/10/2026) : exactement le catalogue de biolystes.pro.

   Repris de src/pages/CataloguePage.tsx de biolystes/commandcenterbiolystes
   (PR #14 et #15) : même recherche, mêmes catégories avec leurs compteurs,
   mêmes cartes gris pierre (#f3f4f5), sans aucun prix (prix uniquement sur /tarifs), même panneau de fiche
   avec la composition INCI. Les données ne sont pas réécrites : elles sont
   recopiées par scripts/sync-catalogue-pro.mjs dans src/data/catalogue-pro/,
   et src/test/catalogue-pro.test.ts échoue si les deux catalogues divergent.

   Ce qui diffère de biolystes.pro, et pourquoi :
   - pas d'onglet « Nos Offres » ni de prix de packs : les packs sont sur /tarifs ;
   - pas des boutons du back-office (« Nettoyer tout », « Générer et
     appliquer ») : ils écrivent dans la base de biolystes.pro ;
   - les photos approuvées sont celles de biolystes.pro, figées à la
     synchronisation (images-approuvees.json) au lieu d'être lues en direct ;
   - le cadre (en-tête, pied de page, titre Entete) et les couleurs sont ceux
     de biolystes.com : fond blanc, cartes #f3f4f5, noir ; le violet de
     « Bientôt disponible » passe au noir ;
   - le panneau prend toute la largeur sous 420 px, et passe au-dessus de
     l'en-tête du site (z-index 9999999) ;
   - noms de produits en text-wrap: balance, deux derniers mots liés
     (sansMotSeul, repris de biolystes.pro) : jamais un mot seul en fin de ligne ;
   - le lien « Voir sur Biolystes.com » (on y est déjà) devient
     « Prendre rendez-vous ».

   Repris aussi de la PR #40 de biolystes.pro : badge noir « Nouveau » pendant
   60 jours (estNouveau), nouveautés en tête dans toutes les catégories
   (nouveautesDabord), pastille « Nouveautés » avant les catégories, compteur
   NOMBRE_PRODUITS_CATALOGUE (fiches cosmétiques en ligne), photo refusée au
   contrôle (image_a_refaire) remplacée par « Image à venir ».

   Repris de la PR #41 de biolystes.pro : un seul chiffre. L'en-tête, la
   pastille « Tous les produits » et le compteur de liste donnent le même
   nombre, NOMBRE_PRODUITS_COMMANDABLES (compléments alimentaires compris) ;
   chaque catégorie suit la même règle (compterCommandables). Les produits
   retirés restent visibles, en fin de liste (ordreCatalogue), marqués
   « Non commandable », et ne sont comptés nulle part.

   Repris de la PR #42 de biolystes.pro (JP, 15/10/2026) : statut de chaque
   fiche chez le laboratoire (statut_labo, recopié de la moisson). Un produit
   pas encore sorti porte « Bientôt disponible », une rupture « Rupture »
   (pastille blanche, texte noir, en bas à gauche de la photo), jamais
   « Nouveau » ; ils passent après les produits disponibles et la fiche dit
   « non commandable pour le moment ». Le compteur de liste dit ce qui
   s'affiche sans être commandable (« 0 produit · 6 bientôt disponibles »).
   Sous 768 px, les pastilles de catégories tiennent sur une ligne qui défile,
   sans barre ni accroche, de 16 px du bord à 16 px du bord ; la pastille
   active est ramenée à l'écran.

   Le nom du laboratoire ne figure nulle part : les adresses d'images passent
   par citeLeFournisseur (src/lib/fournisseur-masque.ts). */
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Star, CalendarDays } from "lucide-react";
import { citeLeFournisseur } from "@/lib/fournisseur-masque";
import { sansMotSeul } from "@/lib/sans-mot-seul";
import {
  PRODUCTS, CATEGORIES, MENTION_IMAGE_A_VENIR, MENTION_RETIRE, MENTION_NOUVEAU,
  NOMBRE_PRODUITS_COMMANDABLES, estNouveau, ordreCatalogue, compterCommandables, mentionStatutLabo,
} from "@/data/catalogue-pro/products";
import cleanImageEntries from "@/data/catalogue-pro/clean-image-map.json";
import imagesApprouvees from "@/data/catalogue-pro/images-approuvees.json";
import { CTA_URL, Entete } from "./pied/elements";
import { badgeDisponibilite } from "@/data/disponibilite";
import NouveauSiteBanner from "@/components/NouveauSiteBanner";

const LABEL_CATEGORIE: Record<string, string> = {
  "soins-du-visage": "Soins du visage",
  "soins-du-corps": "Soins du corps",
  "soins-du-cheveu": "Soins du cheveu",
  "collection-box": "Collection",
  maquillage: "Maquillage",
  supplements: "Compléments alimentaires",
};

/** Filtre « Nouveautés », proposé avant les catégories. */
const ID_NOUVEAUTES = "nouveautes";

/** Pastille « Nouveau » : même facture que les tags du catalogue (fond noir, texte blanc, capitales). */
const BadgeNouveau = ({ grand = false }: { grand?: boolean }) => (
  <span
    data-badge-nouveau
    className={`inline-flex items-center rounded-lg font-bold uppercase whitespace-nowrap ${grand ? "px-2 py-1 text-[10px] tracking-[0.5px]" : "px-2 py-0.5 text-[9px] tracking-[0.4px]"}`}
    style={{ background: "rgb(29,29,31)", color: "#ffffff" }}
  >
    {MENTION_NOUVEAU}
  </span>
);

/** Pastille « Bientôt disponible » ou « Rupture » : même facture que « Nouveau », en négatif (fond blanc, texte noir). */
const BadgeStatut = ({ texte, grand = false }: { texte: string; grand?: boolean }) => (
  <span
    data-badge-statut
    className={`inline-flex items-center rounded-lg font-bold uppercase whitespace-nowrap ${grand ? "px-2 py-1 text-[10px] tracking-[0.5px]" : "px-2 py-0.5 text-[9px] tracking-[0.4px]"}`}
    style={{ background: "#ffffff", color: "rgb(29,29,31)", boxShadow: "inset 0 0 0 1px rgba(29,29,31,0.18)" }}
  >
    {texte}
  </span>
);

// Slug-keyed clean image map from JSON
const CLEAN_IMAGE_BY_SLUG: Record<string, string> = cleanImageEntries as unknown as Record<string, string>;
/* Les photos « approved » de biolystes.pro (table clean_product_images). */
const APPROVED_CLEAN_IMAGES: Record<string, { url: string; version: string }> = imagesApprouvees;

const isGeneratedProductImageUrl = (url: string) =>
  url.includes("/storage/v1/object/public/product-images/clean") ||
  url.includes("/storage/v1/object/public/product-images/clean-products");

const withImageVersion = (url: string, version: string) => {
  if (!isGeneratedProductImageUrl(url)) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${encodeURIComponent(version)}`;
};

/* Même ordre que biolystes.pro : photo refusée = rien, photo approuvée, photo de products.ts,
   carte JSON, sinon rien (« Image à venir »). */
export function getProductImage(product: typeof PRODUCTS[0]): string {
  // Photo refusée au contrôle visuel : « Image à venir », quelle que soit l'image approuvée.
  if (product.image_a_refaire) return "/placeholder.svg";
  const approved = APPROVED_CLEAN_IMAGES[product.slug];
  if (approved && !citeLeFournisseur(approved.url)) return withImageVersion(approved.url, approved.version);
  if (product.image && !citeLeFournisseur(product.image)) return product.image;
  const jsonClean = CLEAN_IMAGE_BY_SLUG[product.slug];
  if (jsonClean && !citeLeFournisseur(jsonClean)) return jsonClean;
  return "/placeholder.svg";
}

export default function CatalogPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const nombreNouveautes = useMemo(() => PRODUCTS.filter((p) => estNouveau(p)).length, []);

  // Nouveautés en tête par défaut, produits retirés en fin de liste, dans « Tous les produits » comme dans chaque catégorie.
  const filtered = useMemo(() => {
    return ordreCatalogue(PRODUCTS.filter((p) => {
      const matchCat =
        activeCategory === "all" ||
        (activeCategory === ID_NOUVEAUTES ? estNouveau(p) : p.categorie === activeCategory);
      const matchSearch =
        !search ||
        p.nom.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    }));
  }, [search, activeCategory]);

  // Un seul nombre de produits sur la page : les commandables (compléments compris, retirés exclus).
  const nombreAffiche = compterCommandables(filtered);
  // Ce qui s'affiche sans être commandable, dit à côté du compteur : « 0 produit » sous six cartes se lisait comme une recherche vide.
  const horsCommande = [
    { n: filtered.filter((p) => p.statut_labo === "COMING_SOON").length, un: "bientôt disponible", plusieurs: "bientôt disponibles" },
    { n: filtered.filter((p) => p.statut_labo === "OUT_OF_STOCK").length, un: "en rupture", plusieurs: "en rupture" },
    { n: filtered.filter((p) => p.status === "retired").length, un: "retiré", plusieurs: "retirés" },
  ].filter((x) => x.n > 0);

  // Sous 768 px, les pastilles tiennent sur une ligne qui défile : la pastille active est ramenée à l'écran.
  const rangeePastilles = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const rangee = rangeePastilles.current;
    const active = rangee?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!rangee || !active || rangee.scrollWidth <= rangee.clientWidth) return;
    const marge = parseFloat(getComputedStyle(rangee).paddingLeft) || 0;
    if (active.offsetLeft - marge < rangee.scrollLeft) rangee.scrollLeft = active.offsetLeft - marge;
    else if (active.offsetLeft + active.offsetWidth > rangee.scrollLeft + rangee.clientWidth) {
      rangee.scrollLeft = active.offsetLeft + active.offsetWidth + marge - rangee.clientWidth;
    }
  }, [activeCategory, nombreNouveautes]);

  const toggleFav = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  return (
    <section className="bg-background pt-10 pb-16 md:pt-14 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-5">
        <Entete
          niveau={1}
          surtitre="Catalogue"
          noir="Vos produits"
          gris="en marque blanche."
          texte={<><span className="whitespace-nowrap" data-testid="nombre-catalogue">{NOMBRE_PRODUITS_COMMANDABLES} produits</span>, dont <span className="whitespace-nowrap">{nombreNouveautes} nouveautés</span>, avec leur composition INCI.</>}
          className="pb-4 md:pb-6"
        />

        <NouveauSiteBanner />

        <div className="flex flex-col gap-3">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none border-0 focus:ring-1 focus:ring-black/20"
              style={{ background: "#f3f4f5" }}
            />
          </div>
          {/* Ordinateur : pastilles sur plusieurs lignes. Sous 768 px : une seule ligne qui défile, sans barre ni accroche, jusqu'aux bords de l'écran. */}
          <div
            ref={rangeePastilles}
            className="catalogue-pastilles relative flex flex-nowrap items-center gap-2 overflow-x-auto -mx-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:px-0 md:flex-wrap md:overflow-visible"
          >
            {nombreNouveautes > 0 && (
              <button
                onClick={() => setActiveCategory(ID_NOUVEAUTES)}
                aria-pressed={activeCategory === ID_NOUVEAUTES}
                className={`shrink-0 whitespace-nowrap px-3 md:px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === ID_NOUVEAUTES ? "bg-foreground text-background" : "text-foreground hover:bg-black/10"
                }`}
                style={activeCategory === ID_NOUVEAUTES ? undefined : { background: "#f3f4f5" }}
              >
                Nouveautés
                <span className="ml-1.5 opacity-60 text-xs" data-compteur={`pastille-${ID_NOUVEAUTES}`}>({nombreNouveautes})</span>
              </button>
            )}
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                aria-pressed={activeCategory === cat.id}
                className={`shrink-0 whitespace-nowrap px-3 md:px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.id ? "bg-foreground text-background" : "text-foreground hover:bg-black/10"
                }`}
                style={activeCategory === cat.id ? undefined : { background: "#f3f4f5" }}
              >
                {cat.label}
                <span className="ml-1.5 opacity-60 text-xs" data-compteur={`pastille-${cat.id}`}>
                  ({cat.id === "all" ? NOMBRE_PRODUITS_COMMANDABLES : compterCommandables(PRODUCTS.filter((p) => p.categorie === cat.id))})
                </span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground [text-wrap:balance]">
          <span data-testid="nombre-produits">{nombreAffiche} produit{nombreAffiche > 1 ? "s" : ""}</span>
          {horsCommande.map((x) => (
            <span key={x.un}>{` · ${x.n} ${x.n > 1 ? x.plusieurs : x.un}`}</span>
          ))}
        </p>

        <div className="catalogue-products-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((product) => (
            <div
              key={product.slug}
              data-produit={product.slug}
              data-statut-labo={product.statut_labo ?? undefined}
              onClick={() => setSelectedProduct(product)}
              className="flex flex-col cursor-pointer rounded-[20px] overflow-hidden transition-shadow hover:ring-1 hover:ring-black/20"
              style={{ background: "#f3f4f5" }}
            >
              <div className="relative w-full aspect-square overflow-hidden flex items-center justify-center" style={{ background: "#f3f4f5" }}>
                {/* Statut en bas à gauche de la photo : en haut, il passerait sous le bouton favori à 375 px. */}
                {badgeDisponibilite(product) && (
                  <div className="absolute bottom-3 left-3 z-20">
                    <BadgeStatut texte={badgeDisponibilite(product)!} />
                  </div>
                )}
                {product.status === "retired" && (
                  <div className="absolute top-3 left-3 z-20 px-2 py-0.5 rounded-lg text-[9px] font-bold tracking-wide bg-foreground text-background">
                    Retiré
                  </div>
                )}
                {!product.status && (estNouveau(product) || product.volume) && (
                  <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-1">
                    {estNouveau(product) && <BadgeNouveau />}
                    {product.volume && (
                      <div
                        className="px-2 py-0.5 rounded-lg text-[9px] font-bold tracking-wide"
                        style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)", color: "#666666" }}
                      >
                        {product.volume}
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={(e) => toggleFav(product.slug, e)}
                  aria-label="Favori"
                  className="absolute top-2.5 right-2.5 z-10 w-[26px] h-[26px] rounded-lg flex items-center justify-center transition-colors"
                  style={{ border: "2px solid rgba(0,0,0,0.15)", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(6px)" }}
                >
                  <Star
                    className="w-3 h-3"
                    style={{ color: favorites.has(product.slug) ? "#4b5357" : "#666666" }}
                    fill={favorites.has(product.slug) ? "#4b5357" : "none"}
                  />
                </button>

                {product.image_a_venir && getProductImage(product) === "/placeholder.svg" ? (
                  <span className="text-[11px] font-semibold uppercase tracking-[0.4px] text-muted-foreground">{MENTION_IMAGE_A_VENIR}</span>
                ) : (
                  <img
                    src={getProductImage(product)}
                    alt={product.nom}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                )}
              </div>

              <div className="px-[18px] pt-4 pb-[18px] flex flex-col gap-2 flex-1">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.3px] leading-[1.4] line-clamp-2 min-h-[30px]" style={{ color: "rgb(29,29,31)", textWrap: "balance" }}>
                  {sansMotSeul(product.nom)}
                </h3>

                {product.description && (
                  <p className="text-[10px] leading-[1.5] line-clamp-2" style={{ color: "#666666" }}>
                    {product.description}
                  </p>
                )}

                <div className="flex gap-1 flex-wrap">
                  {product.certifications.slice(0, 3).map((cert) => (
                    <span key={cert} className="px-[7px] py-[2px] rounded-[6px] text-[8px] font-semibold tracking-[0.3px] whitespace-nowrap" style={{ background: "rgba(13,31,36,0.06)", color: "#4b5357" }}>
                      {cert}
                    </span>
                  ))}
                  {product.certifications.length > 3 && (
                    <span className="text-[8px] font-semibold self-center" style={{ color: "#9ca3af" }}>
                      +{product.certifications.length - 3}
                    </span>
                  )}
                </div>


                <div className="flex flex-wrap items-center justify-between gap-x-1.5 gap-y-1 mt-auto pt-[6px]" style={{ borderTop: "1px solid #e5e7eb" }}>
                  <span className="text-[10px] leading-tight text-muted-foreground">{product.status === "retired" ? "Non commandable" : badgeDisponibilite(product) ? "Pas encore commandable" : "Prix sur devis"}</span>
                  <span className="px-[9px] py-[3px] rounded-full text-[8px] font-bold uppercase tracking-[0.4px] whitespace-nowrap" style={{ background: "rgb(29,29,31)", color: "#ffffff" }}>
                    {LABEL_CATEGORIE[product.categorie] || product.categorie}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <>
          <div className="fixed inset-0 bg-black/30 z-[10000000]" onClick={() => setSelectedProduct(null)} />
          <div
            role="dialog"
            aria-label={selectedProduct.nom}
            className="fixed top-0 right-0 bottom-0 z-[10000001] overflow-y-auto flex flex-col"
            style={{ width: "min(420px, 100vw)", background: "#ffffff" }}
          >
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid #f3f4f5" }}>
              <span className="text-[11px] font-bold tracking-[1px] uppercase" style={{ color: "#666666" }}>Fiche produit</span>
              <button onClick={() => setSelectedProduct(null)} aria-label="Fermer" className="w-[30px] h-[30px] rounded-lg flex items-center justify-center cursor-pointer" style={{ border: "none", background: "#f3f4f5", color: "#666666" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div className="aspect-square overflow-hidden flex-shrink-0" style={{ background: "#f3f4f5" }}>
              {selectedProduct.image_a_venir && getProductImage(selectedProduct) === "/placeholder.svg" ? (
                <div className="w-full h-full flex items-center justify-center text-[12px] font-semibold uppercase tracking-[0.4px] text-muted-foreground">{MENTION_IMAGE_A_VENIR}</div>
              ) : (
                <img src={getProductImage(selectedProduct)} alt={selectedProduct.nom} className="w-full h-full object-cover" />
              )}
            </div>

            <div className="p-6 flex flex-col gap-4">
              {estNouveau(selectedProduct) && (
                <div className="-mb-2"><BadgeNouveau grand /></div>
              )}
              {badgeDisponibilite(selectedProduct) && (
                <div className="-mb-2"><BadgeStatut texte={badgeDisponibilite(selectedProduct)!} grand /></div>
              )}
              <h2 className="text-[15px] font-bold" style={{ color: "rgb(29,29,31)", textWrap: "balance" }}>{sansMotSeul(selectedProduct.nom)}</h2>

              {selectedProduct.volume && (
                <span className="text-[11px] font-semibold px-2 py-1 rounded-lg self-start" style={{ background: "#f3f4f5", color: "#666666" }}>
                  {selectedProduct.certifications.some(c => c.toLowerCase().includes("bio") || c.toLowerCase().includes("biologique")) ? "Bio · " : ""}{selectedProduct.volume}
                </span>
              )}

              {selectedProduct.star_features.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedProduct.star_features.map((f) => (
                    <span key={f} className="px-2 py-1 rounded-lg text-[10px] font-semibold" style={{ background: "rgba(13,31,36,0.06)", color: "#4b5357" }}>
                      {f}
                    </span>
                  ))}
                </div>
              )}

              {selectedProduct.description && (
                <p className="text-[12px] leading-[1.65] whitespace-pre-line" style={{ color: "#666666" }}>{selectedProduct.description}</p>
              )}

              {selectedProduct.certifications.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold tracking-[0.5px] uppercase mb-2" style={{ color: "rgb(29,29,31)" }}>Certifications</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProduct.certifications.map((cert) => (
                      <span key={cert} className="px-2 py-1 rounded-lg text-[10px] font-semibold" style={{ background: "rgba(13,31,36,0.06)", color: "#4b5357" }}>
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedProduct.ingredients && (
                <div>
                  <p className="text-[10px] font-bold tracking-[0.5px] uppercase mb-1" style={{ color: "rgb(29,29,31)" }}>Ingrédients clés</p>
                  <p className="text-[12px]" style={{ color: "#666666" }}>{selectedProduct.ingredients}</p>
                </div>
              )}

              {selectedProduct.arome && (
                <div>
                  <p className="text-[10px] font-bold tracking-[0.5px] uppercase mb-1" style={{ color: "rgb(29,29,31)" }}>🌸 Arôme</p>
                  <p className="text-[12px]" style={{ color: "#666666" }}>{selectedProduct.arome}</p>
                </div>
              )}

              {selectedProduct.inci && (
                <div>
                  <p className="text-[10px] font-bold tracking-[0.5px] uppercase mb-1" style={{ color: "rgb(29,29,31)" }}>Composition INCI</p>
                  <p className="text-[11px] leading-[1.5]" style={{ color: "#666666" }}>{selectedProduct.inci}</p>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2" style={{ borderTop: "1px solid #e5e7eb" }} data-testid="prix-sur-devis">
                <a href="/rdv" className="text-[13px] font-semibold underline" style={{ color: "rgb(17,17,17)" }}>Prix sur devis</a>
              </div>
              {selectedProduct.status === "retired" && (
                <p className="text-[12px] font-semibold pt-2" style={{ color: "rgb(17,17,17)" }}>{MENTION_RETIRE} · non commandable</p>
              )}
              {badgeDisponibilite(selectedProduct) && (
                <p className="text-[12px] font-semibold pt-2" style={{ color: "rgb(17,17,17)" }} data-mention-statut>
                  {badgeDisponibilite(selectedProduct)} · non commandable pour le moment
                </p>
              )}

              <a href={CTA_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium transition-colors" style={{ background: "rgb(29,29,31)", color: "#ffffff" }}>
                <CalendarDays className="w-4 h-4" /> Prendre rendez-vous
              </a>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
