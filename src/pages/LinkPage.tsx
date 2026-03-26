import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

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
        title: "Trouver vos produits avec notre IA",
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
        title: "Pourquoi 92 % d'entre vous échouer ?",
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

export default function LinkPage() {
  return (
    <div className="min-h-screen bg-secondary py-16 px-6">
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
      </div>
    </div>
  );
}
