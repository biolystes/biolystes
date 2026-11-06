/* /meetup/:slug : fiche de présentation d'un lieu, sans prix. */
import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Check, MapPin, MessageCircle, Users } from "lucide-react";
import { LIEUX_MEETUP } from "@/data/lieux-meetup";
import { LIEN_WHATSAPP_EXPERTE } from "@/lib/whatsapp";

const NOIR = "rgb(29,29,31)";
const BANDE = "#f3f4f5";

export default function MeetupLieuPage() {
  const { slug } = useParams();
  const lieu = LIEUX_MEETUP.find((l) => l.slug === slug);
  const [photo, setPhoto] = useState(0);
  if (!lieu) return <Navigate to="/meetup" replace />;

  return (
    <section className="bg-background pb-16 md:pb-20 pt-6 md:pt-8">
      <Helmet>
        <title>{lieu.nom} — Meetup Biolystes</title>
        <meta name="description" content={lieu.description.slice(0, 155)} />
      </Helmet>
      <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-6">
        <Link to="/meetup" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" /> Tous les espaces</Link>
        <div className="meetup-fiche grid gap-6 md:gap-10">
          <style>{`@media (min-width: 768px){.meetup-fiche{grid-template-columns:1.4fr 1fr}}`}</style>
          <div className="space-y-3">
            <div className="rounded-[20px] overflow-hidden aspect-[4/3]" style={{ background: BANDE }}>
              <img src={lieu.photos[photo]} alt={lieu.nom} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {lieu.photos.map((p, i) => (
                <button key={p} type="button" onClick={() => setPhoto(i)} className="rounded-xl overflow-hidden aspect-[4/3]" style={{ outline: i === photo ? `2px solid ${NOIR}` : "none" }}>
                  <img src={p} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <h1 className="text-3xl md:text-4xl leading-tight text-foreground">{lieu.nom}</h1>
            <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="w-4 h-4" />{lieu.adresse}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-3" style={{ background: BANDE }}><p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Lieu</p><p className="text-sm font-medium">{lieu.lieu}</p></div>
              <div className="rounded-xl p-3" style={{ background: BANDE }}><p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Capacité</p><p className="text-sm font-medium inline-flex items-center gap-1"><Users className="w-4 h-4" />{lieu.capacite} pers.</p></div>
            </div>
            <p className="text-[15px] leading-relaxed text-foreground">{lieu.description}</p>
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-[1px] text-muted-foreground mb-2">Équipements inclus</h2>
              <ul className="grid grid-cols-2 gap-1.5">
                {lieu.equipements.map((e) => <li key={e} className="inline-flex items-center gap-2 text-sm"><Check className="w-4 h-4" />{e}</li>)}
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">En option : photographe professionnel, assistante de présentation et <Link to="/goodies" className="underline">goodies personnalisés</Link>.</p>
            <a href={LIEN_WHATSAPP_EXPERTE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full px-8 py-3 rounded-xl text-sm font-medium hover:opacity-80" style={{ background: NOIR, color: "#ffffff" }}>
              <MessageCircle className="w-4 h-4" /> Organiser mon événement ici
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
