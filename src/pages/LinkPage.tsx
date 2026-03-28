import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import SafeVideo from "@/components/SafeVideo";

interface LinkItem {
  href: string;
  title: string;
  description: string;
  highlight?: boolean;
  external?: boolean;
}

interface LinkGroup {
  label: string;
  items: LinkItem[];
}

const groups: LinkGroup[] = [
  {
    label: "",
    items: [
      {
        href: "/",
        title: "Découvrir notre site",
        description: "Explorez l'ensemble de nos offres cosmétiques, agence et IA.",
      },
      {
        href: "/catalogue",
        title: "Découvrir notre catalogue produits",
        description: "Plus de 100 cosmétiques certifiés bio prêts à personnaliser.",
      },
      {
        href: "/chat",
        title: "Trouvez le produit le plus adapté à votre projet",
        description: "Notre assistant IA vous guide vers les cosmétiques idéaux pour votre marque.",
      },
      {
        href: "https://biolystes.pro/rdv",
        external: true,
        title: "Prendre rendez-vous",
        description: "Réservez un créneau pour échanger avec notre équipe.",
        highlight: true,
      },
    ],
  },
  {
    label: "Comment ça marche",
    items: [
      {
        href: "/comment-ca-marche",
        title: "Comment fonctionne la mise en place de votre marque en 10-15 jours ?",
        description: "Les 7 étapes de la sélection produits à l'automatisation.",
      },
      {
        href: "/livraison",
        title: "Comment fonctionne l'expédition de vos commandes ?",
        description: "Mode Standard (6-7 jours) et Mode Express (24-48h).",
      },
      {
        href: "/equipe-ia",
        title: "Comment se passe la suite une fois votre e-commerce mis en place ?",
        description: "7 équipes IA dédiées, disponibles 24h/24.",
      },
      {
        href: "/responsabilite",
        title: "Comment se passe le partage des responsabilités en cas de litige ?",
        description: "Conformité, DIP, CPNP — le laboratoire assume le risque produit.",
      },
      {
        href: "/glowly",
        title: "Comment bien débuter une fois mis en place ? Exemple avec Glowly Paris",
        description: "Contenu UGC, e-réputation Trustpilot et publicité sociale.",
      },
    ],
  },
  {
    label: "À lire",
    items: [
      {
        href: "/etudes",
        title: "Pourquoi 92 % d'entre vous échouent ?",
        description: "Étude comparative sur les porteurs de projets cosmétiques.",
        highlight: true,
      },
    ],
  },
  {
    label: "Nos engagements",
    items: [
      {
        href: "/qualite",
        title: "Cosmétiques certifiés bio, végans et responsables",
        description: "Certifications, garanties et témoignage Wirtzkin.",
      },
    ],
  },
  {
    label: "Nos clients",
    items: [
      {
        href: "/portfolio",
        title: "Plus de 100 marques accompagnées",
        description: "Kaniwa Botanique, Fralène, Sevmylook…",
      },
      {
        href: "https://kaniwabotanique.com",
        title: "Kaniwa Botanique",
        description: "Marque bio & vegan · Soins visage, corps & rasage.",
        external: true,
      },
      {
        href: "https://fraleneparis.com",
        title: "Fralène Paris",
        description: "Gamme soins visage premium · Huile nettoyante & démaquillant.",
        external: true,
      },
    ],
  },
  {
    label: "Tarifs & offre",
    items: [
      {
        href: "/tarifs",
        title: "Découvrez nos tarifs",
        description: "Packs cosmétique, agence, IA et abonnements.",
        highlight: true,
      },
      {
        href: "/pourquoi-cette-offre",
        title: "Pourquoi cette offre ?",
        description: "L'évolution de nos offres pour répondre aux vrais blocages post-lancement.",
      },
      {
        href: "/echantillons",
        title: "À quoi ressemblent nos échantillons pour tester ?",
        description: "4 produits certifiés bio chez vous en 7 jours pour 147€.",
      },
    ],
  },
  {
    label: "Nos offres",
    items: [
      {
        href: "/",
        title: "Offre Cosmétique — Créez votre marque",
        description: "Cosmétiques certifiés bio personnalisables à votre image.",
      },
      {
        href: "/ai",
        title: "Offre IA — Vos équipes créatives automatisées",
        description: "7 équipes IA dédiées pour booster vos performances.",
      },
      {
        href: "/agence",
        title: "Offre Agence — Communication & croissance",
        description: "Stratégie réseaux sociaux, contenu et publicité.",
      },
    ],
  },
];

const aiImages = [
  "/images/kaniwa-10.jpg",
  "/images/kaniwa-1.jpg",
  "/images/kaniwa-11.jpg",
  "/images/kaniwa-2.jpg",
  "/images/kaniwa-3.jpg",
  "/images/kaniwa-4.jpg",
  "/images/kaniwa-5.jpg",
  "/images/kaniwa-6.jpg",
  "/images/kaniwa-7.jpg",
  "/images/kaniwa-8.jpg",
  "/images/kaniwa-9.jpg",
];

function AIImagesCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollTo = (index: number) => {
    const clamped = Math.max(0, Math.min(index, aiImages.length - 1));
    setCurrentIndex(clamped);
    if (scrollRef.current) {
      const child = scrollRef.current.children[clamped] as HTMLElement;
      if (child) {
        scrollRef.current.scrollTo({ left: child.offsetLeft - scrollRef.current.offsetLeft, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="mt-10">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-3">
        À quoi ressemblent nos images IA
      </p>
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-6 px-6"
        >
          {aiImages.map((src, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[180px] md:w-[182px] aspect-square rounded-xl overflow-hidden snap-start"
            >
              <img src={src} alt={`Image IA ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
        <button
          onClick={() => scrollTo(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-lg disabled:opacity-30 transition-opacity z-10"
        >
          <ChevronLeft className="h-4 w-4 text-foreground" />
        </button>
        <button
          onClick={() => scrollTo(currentIndex + 1)}
          disabled={currentIndex === aiImages.length - 1}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-lg disabled:opacity-30 transition-opacity z-10"
        >
          <ChevronRight className="h-4 w-4 text-foreground" />
        </button>
      </div>
    </div>
  );
}

export default function LinkPage() {
  useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute("content", "width=device-width, initial-scale=1");
    }
    return () => {
      if (viewport) {
        viewport.setAttribute("content", "width=1200");
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-secondary py-8 sm:py-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-light tracking-tight text-foreground mb-2">
          Faisons connaissance
        </h1>
        <p className="text-muted-foreground mb-12">
          Accédez directement à chaque section clé de notre offre.
        </p>

        <div className="space-y-10">
          {groups.map((group) => (
            <div key={group.label || "top"}>
              {group.label && (
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-3">
                  {group.label}
                </p>
              )}
              <div className="space-y-3">
                {group.items.map((link) => {
                  const cls = `group flex items-center justify-between p-5 border transition-all ${
                    link.highlight
                      ? "bg-foreground text-primary-foreground border-foreground"
                      : "bg-transparent border-foreground/20 hover:border-foreground"
                  }`;

                  const inner = (
                    <>
                      <div>
                        <h2 className={`text-base font-semibold group-hover:underline ${
                          link.highlight ? "text-primary-foreground" : "text-foreground"
                        }`}>
                          {link.title}
                        </h2>
                        <p className={`text-sm mt-1 ${
                          link.highlight ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}>{link.description}</p>
                      </div>
                      <ArrowRight className={`h-5 w-5 shrink-0 ml-4 transition-colors ${
                        link.highlight ? "text-primary-foreground/70" : "text-muted-foreground group-hover:text-foreground"
                      }`} />
                    </>
                  );

                  return link.external ? (
                    <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
                      {inner}
                    </a>
                  ) : (
                    <Link key={link.href} to={link.href} className={cls}>
                      {inner}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Images IA Carousel */}
        <AIImagesCarousel />

        {/* Avis clients Trustpilot */}
        <div className="mt-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-3">
            Ce que disent les clients de nos clients
          </p>
          <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-6 px-6">
            {[
              { stars: 5, text: "Les produits sont excellents, je recommande à fond !", date: "24 août 2025" },
              { stars: 5, text: "Super marque de produits pour la peau, je suis satisfaite de mon achat. Je n'hésiterai pas à repasser commande !", date: "24 août 2025" },
              { stars: 5, text: "Excellents produits avec une bonne composition, je vous recommande vivement !", date: "24 août 2025" },
              { stars: 5, text: "Des produits exceptionnels pour la peau, excellent rapport qualité-prix.", date: "9 août 2025" },
              { stars: 5, text: "Franchement, produit au top ! Ma peau revit.", date: "8 août 2025" },
              { stars: 5, text: "Produits sains et agréables. La différence s'est vite fait ressentir sur ma peau.", date: "8 août 2025" },
              { stars: 4, text: "Ma sœur a pris les produits pour elle et moi, franchement 10/10, j'aime beaucoup.", date: "25 août 2025" },
              { stars: 4, text: "Produit de qualité, un service au top.", date: "8 août 2025" },
            ].map((review, i) => (
              <div key={i} className="flex-shrink-0 w-[260px] snap-start border border-foreground/20 p-5 space-y-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: review.stars }).map((_, s) => (
                    <svg key={s} className="w-4 h-4 text-foreground fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed">« {review.text} »</p>
                <p className="text-xs text-muted-foreground">{review.date}</p>
              </div>
            ))}
          </div>
          <div className="space-y-3 mt-4">
            <a
              href="https://fr.trustpilot.com/review/glowlyparis.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-5 border bg-transparent border-foreground/20 hover:border-foreground transition-all"
            >
              <div>
                <h2 className="text-base font-semibold group-hover:underline text-foreground">
                  Voir tous les avis sur Trustpilot — Glowly Paris · 4,3/5
                </h2>
                <p className="text-sm mt-1 text-muted-foreground">Avis vérifiés des clients Glowly Paris.</p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 ml-4 transition-colors text-muted-foreground group-hover:text-foreground" />
            </a>
            <a
              href="https://fr.trustpilot.com/review/anaveraparis.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-5 border bg-transparent border-foreground/20 hover:border-foreground transition-all"
            >
              <div>
                <h2 className="text-base font-semibold group-hover:underline text-foreground">
                  Voir tous les avis sur Trustpilot — Anavera Paris · 4,4/5
                </h2>
                <p className="text-sm mt-1 text-muted-foreground">Avis vérifiés des clients Anavera Paris.</p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 ml-4 transition-colors text-muted-foreground group-hover:text-foreground" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
