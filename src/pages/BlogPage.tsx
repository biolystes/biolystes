import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import articleFeaturedImg from "@/assets/article-featured.jpg";
import coffretsImg from "@/assets/coffrets-article.png";
import marieClaireLogo from "@/assets/marie-claire-logo.jpg";

const articles = [
  {
    id: 1,
    slug: "etude-92-pourcent",
    title: "92% des porteurs de projets cosmétiques sur mesure n'ont toujours pas lancé leur marque 7 mois après",
    description: "Étude interne Biolystes — Échantillon de 30 porteurs de projets — Suivi sur 7 mois. Découvrez pourquoi la formulation sur mesure bloque la majorité des projets.",
    image: articleFeaturedImg,
    date: "12 mars 2026",
    featured: true,
    url: "/pourquoi-biolystes",
    category: "Étude",
  },
  {
    id: 6,
    slug: "coffrets-cles-en-main",
    title: "Désormais Biolystes propose des coffrets",
    description: "Augmentez votre panier moyen avec des coffrets clés en main. Des collections prêtes à vendre, certifiées bio & végan, qui boostent la valeur perçue et fidélisent vos clients.",
    image: coffretsImg,
    date: "12 mars 2026",
    featured: false,
    url: "/blog/coffrets",
    category: "Nouveauté",
  },
  {
    id: 7,
    slug: "reseau-presse-marie-claire",
    title: "Accédez à notre réseau presse Marie Claire",
    description: "Nos clients peuvent désormais bénéficier d'articles sponsorisés dans Marie Claire pour faire connaître leur marque auprès d'une audience qualifiée de plusieurs millions de lectrices.",
    image: marieClaireLogo,
    date: "12 mars 2026",
    featured: false,
    url: "/blog/reseau-presse",
    category: "Presse",
  },
  {
    id: 2,
    slug: "pack-decouverte",
    title: "Pack Découverte : testez avant de vous engager",
    description: "4 produits cosmétiques bio & végan personnalisés à votre marque dès 49€/mois en 3x. Le montant est déduit si vous passez à une offre supérieure.",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=500&fit=crop",
    date: "8 mars 2026",
    featured: false,
    url: "/tarifs",
    category: "Offre",
  },
  {
    id: 3,
    slug: "lystes-ai",
    title: "Lystes.ai : votre marketing piloté par l'intelligence artificielle",
    description: "Agents IA dédiés, diagnostic de peau, recommandation produits, création de contenu — tout ce dont votre marque a besoin pour vendre.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop",
    date: "1 mars 2026",
    featured: false,
    url: "/ai",
    category: "Technologie",
  },
  {
    id: 4,
    slug: "lancer-marque-15-jours",
    title: "Comment lancer sa marque cosmétique bio en 15 jours",
    description: "Zéro stock, zéro logistique, certifié COSMOS & ECOCERT. Le guide complet pour les entrepreneurs qui veulent créer leur marque sans les contraintes habituelles.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=500&fit=crop",
    date: "22 février 2026",
    featured: false,
    url: "/blog/lancer-marque",
    category: "Guide",
  },
  {
    id: 5,
    slug: "biais-actif",
    title: "Le biais de l'actif : pourquoi l'ingrédient ne fait pas le produit",
    description: "Pour le client final, le plus important c'est que le produit fonctionne. Pas la liste des actifs sur l'étiquette. Une réflexion sur le marketing cosmétique.",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&h=500&fit=crop",
    date: "15 février 2026",
    featured: false,
    url: "/pourquoi-biolystes",
    category: "Réflexion",
  },
];

export { articles };

export default function BlogPage() {
  const navigate = useNavigate();
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-8">
        <p className="text-xs font-bold tracking-[2px] uppercase text-muted-foreground mb-3">
          Blog
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
          Ressources & actualités
        </h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl">
          Études, guides et réflexions pour les entrepreneurs qui veulent lancer leur marque cosmétique bio.
        </p>
      </div>

      {/* Featured article */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto px-6 mb-12"
      >
        <div
          onClick={() => navigate(featured.url)}
          className="cursor-pointer group rounded-2xl overflow-hidden"
          style={{ background: "hsl(57 52% 92%)" }}
        >
          <div className="grid md:grid-cols-2 gap-0">
            <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
              <img
                src={typeof featured.image === "string" ? featured.image : featured.image}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <span
                className="text-xs font-bold tracking-[1.5px] uppercase mb-4 inline-block px-3 py-1 rounded-full w-fit"
                style={{ background: "hsl(var(--foreground))", color: "hsl(var(--background))" }}
              >
                {featured.category}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight tracking-tight group-hover:underline decoration-2 underline-offset-4">
                {featured.title}
              </h2>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                {featured.description}
              </p>
              <p className="text-sm text-muted-foreground/60 mt-6">{featured.date}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Article grid */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              onClick={() => navigate(article.url)}
              className="cursor-pointer group rounded-2xl overflow-hidden border border-border/40 hover:shadow-lg transition-shadow duration-300"
              style={{ background: "hsl(var(--card))" }}
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={typeof article.image === "string" ? article.image : article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-[10px] font-bold tracking-[1px] uppercase px-2 py-0.5 rounded-full"
                    style={{ background: "hsl(57 52% 88%)", color: "hsl(var(--foreground))" }}
                  >
                    {article.category}
                  </span>
                  <span className="text-xs text-muted-foreground/60">{article.date}</span>
                </div>
                <h3 className="font-bold text-foreground leading-snug tracking-tight group-hover:underline decoration-1 underline-offset-2">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                  {article.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
