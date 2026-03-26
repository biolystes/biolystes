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
        href: "/rdv",
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
        title: "Comment maximiser vos résultats comme Glowly Paris dès les premiers mois ?",
        description: "Contenu UGC, e-réputation Trustpilot et publicité sociale.",
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
      },
      {
        href: "/etudes",
        title: "Pourquoi Biolystes ?",
        description: "Étude comparative sur les porteurs de projets cosmétiques.",
      },
      {
        href: "/pourquoi-cette-offre",
        title: "Pourquoi cette offre ?",
        description: "L'évolution de nos offres pour répondre aux vrais blocages post-lancement.",
      },
    ],
  },
];

export default function LinkPage() {
  return (
    <div className="min-h-screen bg-secondary py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-light tracking-tight text-foreground mb-2">
          Liens rapides
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
