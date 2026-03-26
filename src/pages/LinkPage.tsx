import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const links = [
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
    title: "Tarifs",
    description: "Packs cosmétique, agence, IA et abonnements.",
  },
  {
    href: "/rdv",
    title: "Prendre rendez-vous",
    description: "Réservez un créneau pour échanger avec notre équipe.",
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

        <div className="space-y-4">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="group flex items-center justify-between p-6 rounded-2xl border border-border bg-background hover:border-foreground/30 transition-all"
            >
              <div>
                <h2 className="text-base font-semibold text-foreground group-hover:underline">
                  {link.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">{link.description}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 ml-4" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
