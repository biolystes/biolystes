/* /blog/:slug : le gabarit unique des articles Actus. Mêmes largeurs, mêmes
   titres et mêmes cartes pour tous les articles ; un seul appel à l’action
   en fin d’article, « Prendre rendez-vous » (décision de JP). */
import { Fragment, type ReactNode } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import SEO from "@/components/SEO";
import CadreActus, { BoutonRdv } from "./CadreActus";
import { articleParSlug, articlesDuGabarit, dateLisible, typo, type Bloc } from "./articles";

/* **gras** seulement. */
function riche(texte: string): ReactNode {
  return typo(texte).split(/(\*\*[^*]+\*\*)/g).map((m, i) =>
    m.startsWith("**") && m.endsWith("**") ? <strong key={i} className="font-semibold text-[#1d1d1f]">{m.slice(2, -2)}</strong> : <Fragment key={i}>{m}</Fragment>,
  );
}

function Rendu({ bloc }: { bloc: Bloc }) {
  switch (bloc.t) {
    case "h2":
      return <h2 className="pt-6 text-2xl font-medium leading-snug tracking-tight text-[#1d1d1f] [text-wrap:balance] md:text-[28px]">{typo(bloc.texte)}</h2>;
    case "p":
      return <p className="text-[16px] leading-[1.7] text-[#424245] [text-wrap:pretty]">{riche(bloc.texte)}</p>;
    case "liste":
      return bloc.numerotee ? (
        <ol className="space-y-3">
          {bloc.items.map((it, i) => (
            <li key={i} className="flex items-start gap-3 text-[16px] leading-[1.6] text-[#424245] [text-wrap:pretty]">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1d1d1f] text-xs font-semibold text-white">{i + 1}</span>
              <span>{riche(it)}</span>
            </li>
          ))}
        </ol>
      ) : (
        <ul className="space-y-3">
          {bloc.items.map((it, i) => (
            <li key={i} className="flex items-start gap-3 text-[16px] leading-[1.6] text-[#424245] [text-wrap:pretty]">
              <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#1d1d1f]" />
              <span>{riche(it)}</span>
            </li>
          ))}
        </ul>
      );
    case "cartes":
      return (
        <div className={`grid gap-4 ${bloc.items.length > 1 ? "sm:grid-cols-2" : ""}`}>
          {bloc.items.map((c, i) => (
            <div key={i} className={`rounded-2xl bg-[#f3f4f5] p-6 ${bloc.items.length % 2 === 1 && i === bloc.items.length - 1 && bloc.items.length > 1 ? "sm:col-span-2" : ""}`}>
              {c.icone && <c.icone className="mb-3 h-5 w-5 text-[#1d1d1f]" strokeWidth={1.5} />}
              <h3 className="text-[16px] font-semibold leading-snug text-[#1d1d1f] [text-wrap:balance]">{typo(c.titre)}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#424245] [text-wrap:pretty]">{riche(c.texte)}</p>
            </div>
          ))}
        </div>
      );
    case "chiffre":
      return (
        <div className="rounded-2xl bg-[#1d1d1f] px-6 py-10 text-center text-white md:px-12">
          <p className="text-5xl font-semibold tracking-tight md:text-7xl">{typo(bloc.valeur)}</p>
          <p className="mx-auto mt-4 max-w-lg text-lg font-light leading-relaxed text-white/85 [text-wrap:balance]">{typo(bloc.texte)}</p>
          {bloc.note && <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/60 [text-wrap:pretty]">{typo(bloc.note)}</p>}
        </div>
      );
    case "note":
      return <p className="rounded-2xl border-l-4 border-[#1d1d1f] bg-[#f3f4f5] p-6 text-[15px] leading-relaxed text-[#424245] [text-wrap:pretty]">{riche(bloc.texte)}</p>;
    case "comparaison":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          {[bloc.gauche, bloc.droite].map((col, k) => (
            <div key={k} className={`rounded-2xl p-6 ${k === 0 ? "bg-[#f3f4f5] text-[#1d1d1f]" : "bg-[#1d1d1f] text-white"}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">{typo(col.titre)}</p>
              <ul className="mt-4 space-y-2.5">
                {col.items.map((it, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[15px] leading-snug">
                    {bloc.contre
                      ? <span aria-hidden="true" className="opacity-60">{k === 0 ? "✕" : "✓"}</span>
                      : <span aria-hidden="true" className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${k === 0 ? "bg-[#1d1d1f]" : "bg-white"}`} />}
                    <span>{typo(it)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
  }
}

export default function ArticlePage() {
  const { slug } = useParams();
  const a = articleParSlug(slug);
  if (!a) return <Navigate to="/blog" replace />;

  const autres = articlesDuGabarit.filter((x) => x.slug !== a.slug).slice(0, 3);
  const adresse = `https://biolystes.com/blog/${a.slug}`;

  return (
    <CadreActus>
      <SEO
        title={a.titreSeo}
        description={a.description}
        path={`/blog/${a.slug}`}
        type="article"
        image={a.image.startsWith("http") ? a.image : `https://biolystes.com${a.image}`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: a.titre,
          description: a.description,
          datePublished: a.date,
          mainEntityOfPage: adresse,
          image: `https://biolystes.com${a.image}`,
          author: { "@type": "Organization", name: "Biolystes" },
          publisher: { "@type": "Organization", name: "Biolystes", url: "https://biolystes.com" },
        }}
      />

      <article>
        <header className="mx-auto max-w-3xl px-6 pb-8 pt-10 text-center md:pb-12 md:pt-16">
          <Link to="/blog" className="text-xs uppercase tracking-[0.3em] text-[#1d1d1f] no-underline hover:underline">Actus</Link>
          <div className="mt-5 flex items-center justify-center gap-2 text-[12px]">
            <span className="rounded-full bg-[#1d1d1f] px-2.5 py-0.5 font-medium text-white">{a.categorie}</span>
            <span className="text-[#6e6e73]">{dateLisible(a.date)}</span>
          </div>
          <h1 className="mt-5 text-3xl font-light leading-[1.15] tracking-tight text-[#1d1d1f] [text-wrap:balance] md:text-5xl">{typo(a.titre)}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-[#424245] [text-wrap:pretty]">{typo(a.chapo)}</p>
        </header>

        <div className="mx-auto max-w-4xl px-6">
          <div className="aspect-[16/10] overflow-hidden rounded-3xl bg-[#f3f4f5] md:aspect-[16/9]">
            <img src={a.image} alt={a.alt} className={`h-full w-full ${a.imageEntiere ? "object-contain p-8" : "object-cover"}`} />
          </div>
        </div>

        <div className="mx-auto max-w-3xl space-y-6 px-6 pb-14 pt-10 md:pt-14">
          {a.corps.map((b, i) => <Rendu key={i} bloc={b} />)}
        </div>
      </article>

      <section className="bg-[#f3f4f5] py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#1d1d1f]">Passez à l’action</p>
          <h2 className="mt-4 text-2xl font-light leading-relaxed tracking-tight text-[#1d1d1f] [text-wrap:balance] md:text-4xl">{typo(a.appel)}</h2>
          <div className="mt-8 flex justify-center"><BoutonRdv /></div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <p className="text-xs uppercase tracking-[0.3em] text-[#1d1d1f]">À lire aussi</p>
        <div className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-3">
          {autres.map((x) => (
            <Link key={x.slug} to={`/blog/${x.slug}`} className="group flex flex-col gap-3 no-underline">
              <h3 className="text-[16px] font-medium leading-snug text-[#1d1d1f] [text-wrap:balance] group-hover:underline group-hover:underline-offset-4">{typo(x.titre)}</h3>
              <p className="line-clamp-2 text-sm leading-relaxed text-[#6e6e73]">{typo(x.description)}</p>
            </Link>
          ))}
        </div>
      </section>
    </CadreActus>
  );
}
