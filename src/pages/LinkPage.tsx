import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const links = [
  {
    href: "/rdv",
    title: "Prendre rendez-vous",
    description: "Réservez un créneau pour échanger avec notre équipe.",
    highlight: true,
  },
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
  {
    href: "/portfolio",
    title: "Plus de 100 marques accompagnées",
    description: "Kaniwa Botanique, Fralène, Sevmylook…",
  },
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

        <div className="space-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`group flex items-center justify-between p-5 border transition-all ${
                link.highlight
                  ? "bg-foreground text-primary-foreground border-foreground"
                  : "bg-transparent border-foreground/20 hover:border-foreground"
              }`}
            >
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
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
