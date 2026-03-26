import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const links = [
  {
    href: "/comment-ca-marche",
    title: "Comment ça marche",
    description: "Les 7 étapes de mise en place de votre marque en 10-15 jours.",
  },
  {
    href: "/livraison",
    title: "La livraison",
    description: "Mode Standard (6-7 jours) et Mode Express (24-48h) — comment fonctionne l'expédition.",
  },
  {
    href: "/equipe-ia",
    title: "Votre équipe IA intégrée",
    description: "7 équipes IA dédiées pour booster vos performances après le lancement.",
  },
  {
    href: "/responsabilite",
    title: "Conformité & Responsabilité",
    description: "Le laboratoire assume le risque produit — vous distribuez en toute sérénité.",
  },
  {
    href: "/glowly",
    title: "Maximiser vos résultats",
    description: "Contenu UGC, e-réputation Trustpilot et publicité sociale.",
  },
  {
    href: "/portfolio",
    title: "Portfolio",
    description: "Plus de 100 marques accompagnées — Kaniwa, Fralène, Sevmylook…",
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
