/* /meetup : lieux pour organiser ses événements (repris de events.lystes.ai), sans prix.
   Même bande de filtres et mêmes cartes que /catalogue. */
import { Fragment, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Users, MapPin } from "lucide-react";
import { LIEUX_MEETUP } from "@/data/lieux-meetup";
import CarteBackstage from "@/components/CarteBackstage";
import photoGoodies from "@/assets/goodies_evenement.png.asset.json";

const NOIR = "rgb(29,29,31)";
const BANDE = "#f3f4f5";
const VILLES = [...new Set(LIEUX_MEETUP.map((l) => l.lieu))].sort((a, b) => parseInt(a.replace(/\D/g, "")) - parseInt(b.replace(/\D/g, "")));
const style = (actif: boolean) => ({ background: actif ? NOIR : "#ffffff", color: actif ? "#ffffff" : NOIR, border: `1px solid ${actif ? NOIR : "rgba(29,29,31,0.08)"}` });
const pastille = "shrink-0 inline-flex items-center h-11 px-4 rounded-xl text-[15px] font-medium whitespace-nowrap transition-colors";

export default function MeetupPage() {
  const [ville, setVille] = useState<string | null>(null);
  const [insta, setInsta] = useState(false);
  const [grand, setGrand] = useState(false);
  const liste = useMemo(() => LIEUX_MEETUP.filter((l) => (!ville || l.lieu === ville) && (!insta || l.instagrammable) && (!grand || l.capacite >= 10)), [ville, insta, grand]);

  return (
    <section className="bg-background pb-16 md:pb-20 pt-6 md:pt-8">
      <Helmet>
        <title>Meetup — lieux pour vos événements | Biolystes</title>
        <meta name="description" content="Rencontrez vos clientes, faites créer du contenu à vos créatrices et rendez votre marque plus désirable. Des lieux à Paris, avec hôtesse, réservés pour 2 à 3 heures." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-5">
        <div className="space-y-2 pb-2">
          <h1 className="text-3xl md:text-5xl leading-tight text-foreground">Créez des micro-événements</h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl">Rencontrez vos clientes, faites créer du contenu à vos créatrices et rendez votre marque plus désirable. Des lieux à Paris, avec hôtesse, réservés pour 2 à 3 heures.</p>
        </div>
        <div data-barre-filtres className="rounded-2xl p-2.5 overflow-x-auto" style={{ background: BANDE }}>
          <div className="flex md:flex-wrap items-center gap-2">
            <button type="button" className={pastille} style={style(!ville)} onClick={() => setVille(null)}>Tout Paris</button>
            {VILLES.map((v) => <button key={v} type="button" className={pastille} style={style(ville === v)} onClick={() => setVille(v)}>{v}</button>)}
            <button type="button" className={pastille} style={style(insta)} onClick={() => setInsta(!insta)}>Instagrammable</button>
            <button type="button" className={pastille} style={style(grand)} onClick={() => setGrand(!grand)}>10 pers. et plus</button>
          </div>
        </div>
        <h2 className="text-2xl md:text-[28px] leading-tight text-foreground">{liste.length} espace{liste.length > 1 ? "s" : ""}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {liste.map((l, i) => (
            <Fragment key={l.slug}>
            {i === 2 && <CarteBackstage />}
            {i === 5 && (
              <Link to="/goodies" data-carte-goodies className="relative rounded-[20px] overflow-hidden min-h-[320px] block group">
                <img src={photoGoodies.url} alt="Goodies personnalisés pour vos événements" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0) 55%)" }} />
                <div className="absolute inset-x-6 bottom-6 flex flex-col items-center text-center gap-3">
                  <p className="text-[13px] font-bold uppercase tracking-[0.3px]" style={{ color: "#fff" }}>Goodies pour vos events</p>
                  <span className="inline-flex items-center h-10 px-5 rounded-xl text-sm font-semibold" style={{ background: "#fff", color: NOIR }}>Découvrir les goodies</span>
                </div>
              </Link>
            )}
            <Link to={`/meetup/${l.slug}`} data-lieu className="flex flex-col rounded-[20px] overflow-hidden hover:ring-1 hover:ring-black/20" style={{ background: BANDE }}>
              <div className="w-full aspect-[4/3] overflow-hidden"><img src={l.photos[0]} alt={l.nom} loading="lazy" className="w-full h-full object-cover" /></div>
              <div className="px-[18px] pt-4 pb-[18px] flex flex-col gap-2">
                <h3 className="text-[13px] font-bold uppercase tracking-[0.3px]" style={{ color: NOIR }}>{l.nom}</h3>
                <div className="flex items-center justify-between gap-2 pt-[6px] text-[12px] text-muted-foreground" style={{ borderTop: "1px solid #e5e7eb" }}>
                  <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{l.lieu}</span>
                  <span className="inline-flex items-center gap-1"><Users className="w-3.5 h-3.5" />{l.capacite} pers.</span>
                  {l.instagrammable && <span className="px-[9px] py-[3px] rounded-full text-[8px] font-bold uppercase" style={{ background: NOIR, color: "#ffffff" }}>Instagrammable</span>}
                </div>
              </div>
            </Link>
            </Fragment>
          ))}
          {liste.length <= 2 && <CarteBackstage />}
        </div>
      </div>
    </section>
  );
}
