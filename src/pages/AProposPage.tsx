/* /a-propos : la page Entreprise de lystes.ai (https://lystes.ai/entreprise,
   petal-diagnostics src/pages/EntreprisePage.tsx) reprise pour Biolystes
   (JP, 14/10/2026 : « reproduis cette page à propos chez Biolystes »).

   Même structure, même rendu (src/pages/pied/editorial.css) : hero vidéo,
   bandeau de trois chiffres, « Notre vision », galerie horizontale, appel à
   l'action. Cadre, en-tête (posé sur la vidéo) et pied de page Biolystes :
   src/pages/pied/CadrePied.tsx.

   Adapté : chaque chiffre et chaque phrase viennent de l'accueil de
   biolystes.com (mise en place en 10 jours, plus de 100 produits certifiés,
   18 ans d'expérience, aucun stock, un seul interlocuteur). La galerie montre
   les produits de marques clientes, chacun une seule fois. Boutons : ceux de
   l'accueil (catalogue, rendez-vous).

   Retiré : la section « Carrières » (aucun recrutement Biolystes à annoncer)
   et ses liens /carrieres et contact@lystes.ai. */
import "./pied/editorial.css";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import VideoAuto from "@lystes/components/VideoAuto";
import { CATALOGUE_URL, CTA_URL } from "./pied/elements";

import kaniwaPackaging from "@/assets/design-packaging-step.jpg";

const stats = [
  { n: "10", label: "jours pour mettre votre gamme en ligne, sans stock à acheter" },
  { n: "100+", label: "produits certifiés bio et végan, sans minimum de commande" },
  { n: "18", label: "ans d’expérience dans la beauté et le e‑commerce" },
];

const gallery = [
  { src: "/images/showcase-235.jpg", alt: "Les soins de la marque 235 dans leur colis" },
  { src: "/images/showcase-amarsi.jpg", alt: "Les shampoings de la marque Amarsi" },
  { src: "/images/showcase-peau.jpg", alt: "Mousse nettoyante et soin anti‑acné de Jolie Peau & Co" },
  { src: "/bio-colis/eclose-colis-45.webp", alt: "Les soins Éclose Paris dans leur colis" },
  { src: kaniwaPackaging, alt: "L’huile à barbe Kaniwa Botanique et son étui" },
];

const TITRE = "À propos | Biolystes";

export default function AProposPage() {
  useEffect(() => {
    const avant = document.title;
    document.title = TITRE;
    return () => { document.title = avant; };
  }, []);

  return (
    <div className="editorial w-full max-w-full overflow-x-hidden bg-background">
      <section className="ed-hero">
        <VideoAuto src="/entreprise/hero.mp4" poster="/entreprise/hero-poster.webp" aria-hidden />
        <div className="ed-hero-scrim" />
        <div className="ed-wrap ed-hero-in">
          <h1 className="ed-serif ed-neon-text">Construire le futur</h1>
          <p className="ed-serif">
            de la <em>cosmétique bio</em> en marque blanche.
          </p>
        </div>
      </section>

      <section className="ed-stats">
        {stats.map((s) => (
          <div className="ed-stat" key={s.n}>
            <p className="ed-stat-n">{s.n}</p>
            <p className="ed-stat-l">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="ed-section">
        <div className="ed-wrap">
          <div className="ed-two">
            <div>
              <h2 className="ed-serif">Notre vision</h2>
            </div>
            <div>
              <h3 className="ed-serif">
                Chaque projet <em>lancé</em>.
              </h3>
              <p className="ed-lead">
                Biolystes imagine un monde où aucun projet cosmétique ne reste bloqué par le stock, les
                laboratoires ou les certifications. La sélection des produits, le packaging, la boutique en
                ligne, l’expédition : un seul interlocuteur derrière chaque marque.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="ed-gallery-sticky">
        <div className="ed-gallery-pin">
          <div className="ed-gallery-track">
            {gallery.map((img) => (
              <img key={img.src} src={img.src} alt={img.alt} loading="lazy" />
            ))}
          </div>
        </div>
      </div>

      <section className="ed-section">
        <div className="ed-wrap" style={{ textAlign: "center" }}>
          <h2 className="ed-serif" style={{ maxWidth: "40rem", marginInline: "auto" }}>
            Voyez ce que votre <em>gamme</em> peut devenir.
          </h2>
          <p className="ed-lead" style={{ marginInline: "auto" }}>
            Choisissez vos produits dans notre catalogue et testez‑les avant de vous engager. Votre gamme en
            ligne en 10 jours, sans stock à acheter.
          </p>
          <div className="ed-actions">
            <a href={CATALOGUE_URL} className="ed-btn">
              Découvrez notre catalogue
              <ArrowRight style={{ width: 16, height: 16 }} />
            </a>
            <a href={CTA_URL} target="_blank" rel="noopener noreferrer" className="ed-btn">
              Prendre rendez‑vous
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
