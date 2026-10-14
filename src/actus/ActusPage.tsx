/* /blog : la partie Actus de Biolystes, à la DA de la page d’accueil
   (noir, blanc, gris #f3f4f5, aucun beige). */
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import EnteteSection from "@lystes/components/bio/EnteteSection";
import CadreActus, { BoutonRdv } from "./CadreActus";
import { dateLisible, typo, type Article } from "./articles";
import { useActus } from "./magazine";

function lien(a: Article) {
  return a.url ?? `/blog/${a.slug}`;
}

function Etiquette({ a }: { a: Article }) {
  return (
    <div className="flex items-center gap-2 text-[12px]">
      <span className="rounded-full bg-[#1d1d1f] px-2.5 py-0.5 font-medium text-white">{a.categorie}</span>
      <span className="text-[#6e6e73]">{dateLisible(a.date)}</span>
    </div>
  );
}

function Vignette({ a, grande = false }: { a: Article; grande?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-2xl bg-[#f3f4f5] ${grande ? "aspect-[4/3] md:aspect-auto md:h-full" : "aspect-[4/3]"}`}>
      <img
        src={a.image}
        alt={a.alt}
        loading={grande ? "eager" : "lazy"}
        className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.03] ${a.imageEntiere ? "object-contain p-6" : "object-cover"}`}
      />
    </div>
  );
}

export default function ActusPage() {
  /* Articles en dur (articles.ts) et actus publiées dans le Magazine de
     lystes.ai (magazine.ts), déjà triés du plus récent au plus ancien. */
  const { actus } = useActus();
  const [une, ...suite] = actus;

  return (
    <CadreActus>
      <SEO
        title="Actus Biolystes : lancer sa marque cosmétique bio et végane"
        description="Modèle sans stock, marque blanche, réglementaire, certifications, livraison, équipes IA : les actualités et les guides de Biolystes."
        path="/blog"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Actus Biolystes",
          url: "https://biolystes.com/blog",
          blogPost: actus.map((a) => ({ "@type": "BlogPosting", headline: a.titre, url: `https://biolystes.com${lien(a)}`, datePublished: a.date })),
        }}
      />

      {/* En-tête de section de l’accueil (EnteteSection, JP 14/10/2026) : sur-titre,
          titre encre puis gris, description. Le h1 reste pour les moteurs. */}
      <section className="mx-auto max-w-5xl px-6 pb-10 pt-12 md:pb-14 md:pt-20">
        <h1 className="sr-only">Les actualités de Biolystes</h1>
        <EnteteSection
          surtitre="Actus"
          noir="Les actualités de Biolystes,"
          gris={typo("pour lancer sa marque cosmétique")}
          texte={typo("Notre modèle, nos produits bio et véganes, le réglementaire et tout ce qu’il faut savoir avant de se lancer.")}
        />
      </section>

      <section className="mx-auto max-w-5xl px-6">
        <Link to={lien(une)} className="group grid overflow-hidden rounded-3xl bg-[#f3f4f5] no-underline md:grid-cols-2">
          <Vignette a={une} grande />
          <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
            <Etiquette a={une} />
            <h2 className="text-2xl font-medium leading-snug tracking-tight text-[#1d1d1f] [text-wrap:balance] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4 md:text-3xl">
              {typo(une.titre)}
            </h2>
            <p className="leading-relaxed text-[#424245] [text-wrap:pretty]">{typo(une.chapo || une.description)}</p>
          </div>
        </Link>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pb-24 md:pt-14">
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {suite.map((a) => (
            <Link key={a.slug} to={lien(a)} className="group flex flex-col gap-4 no-underline">
              <Vignette a={a} />
              <Etiquette a={a} />
              <h3 className="text-lg font-medium leading-snug tracking-tight text-[#1d1d1f] [text-wrap:balance] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                {typo(a.titre)}
              </h3>
              <p className="-mt-1 line-clamp-3 text-sm leading-relaxed text-[#6e6e73] [text-wrap:pretty]">{typo(a.description)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#f3f4f5] py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-6">
          <EnteteSection
            surtitre="Passez à l’action"
            noir={typo("Prêt à lancer votre marque ?")}
            gris={typo("Un expert compose votre gamme.")}
          />
          <div className="mt-10 flex justify-center"><BoutonRdv /></div>
        </div>
      </section>
    </CadreActus>
  );
}
