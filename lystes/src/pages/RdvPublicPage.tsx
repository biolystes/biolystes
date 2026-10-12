import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@lystes/integrations/supabase/client";
import { Button } from "@lystes/components/ui/button";
import { Input } from "@lystes/components/ui/input";
import { Textarea } from "@lystes/components/ui/textarea";
import { Loader2, CalendarDays, Check } from "lucide-react";

/**
 * La page publique de prise de rendez-vous : /rdv/:slug
 *
 * Tout vient de trois lectures serveur, jamais des tables : `cc_page_publique`
 * (organisation, prestations, conseillers), `cc_creneaux_libres` (l'agenda réel,
 * fuseau de la boutique compris) et `cc_reserver` (l'écriture, qui revérifie la
 * disponibilité et refuse un créneau déjà pris). Le navigateur ne décide de rien.
 *
 * `?embed=1` retire l'habillage : c'est ce que charge la bulle du widget.
 */

interface Prestation {
  id: string;
  nom: string;
  description: string | null;
  prix: number | null;
  duree: number;
  categorie: string | null;
}

interface Conseiller {
  id: string;
  nom: string;
  avatar: string | null;
}

interface Organisation {
  id: string;
  nom: string;
  slug: string;
  logo: string | null;
  couleur: string;
  fuseau: string;
  devise: string;
  adresse: string | null;
  telephone: string | null;
}

export interface PagePublique {
  organisation: Organisation;
  prestations: Prestation[];
  conseillers: Conseiller[];
}

const joursAVenir = (nombre: number) => {
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  return Array.from({ length: nombre }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return d;
  });
};

const cleDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export default function RdvPublicPage() {
  const { slug = "" } = useParams();
  const [params] = useSearchParams();
  const encastre = params.get("embed") === "1";

  const [page, setPage] = useState<PagePublique | null>(null);
  const [chargement, setChargement] = useState(true);
  const [introuvable, setIntrouvable] = useState(false);

  const [prestationId, setPrestationId] = useState<string | null>(null);
  const [conseillerId, setConseillerId] = useState<string | null>(null);
  const [jour, setJour] = useState<Date>(() => joursAVenir(1)[0]);

  const [creneaux, setCreneaux] = useState<string[]>([]);
  const [chargementCreneaux, setChargementCreneaux] = useState(false);
  const [creneau, setCreneau] = useState<string | null>(null);

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [notes, setNotes] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [confirme, setConfirme] = useState(false);

  const jours = useMemo(() => joursAVenir(21), []);

  useEffect(() => {
    let annule = false;
    (async () => {
      setChargement(true);
      const { data, error } = await supabase.rpc("cc_page_publique", { p_slug: slug });
      if (annule) return;
      if (error || !data) {
        setIntrouvable(true);
      } else {
        const p = data as unknown as PagePublique;
        setPage(p);
        setPrestationId(p.prestations[0]?.id ?? null);
      }
      setChargement(false);
    })();
    return () => {
      annule = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!prestationId) {
      setCreneaux([]);
      return;
    }
    let annule = false;
    (async () => {
      setChargementCreneaux(true);
      setCreneau(null);
      const { data, error } = await supabase.rpc("cc_creneaux_libres", {
        p_slug: slug,
        p_service_id: prestationId,
        p_date: cleDate(jour),
        p_agent_id: conseillerId,
      });
      if (annule) return;
      const lignes = (error ? [] : (data as { debut: string }[] | null) ?? []).map((l) => l.debut);
      setCreneaux(Array.from(new Set(lignes)));
      setChargementCreneaux(false);
    })();
    return () => {
      annule = true;
    };
  }, [slug, prestationId, conseillerId, jour]);

  const reserver = useCallback(async () => {
    if (!prestationId || !creneau) return;
    setEnvoi(true);
    setErreur(null);
    const { data, error } = await supabase.rpc("cc_reserver", {
      p_slug: slug,
      p_service_id: prestationId,
      p_debut: creneau,
      p_nom: nom,
      p_email: email,
      p_telephone: telephone || null,
      p_notes: notes || null,
      p_agent_id: conseillerId,
    });
    setEnvoi(false);

    const reponse = data as { ok?: boolean; erreur?: string } | null;
    if (error || !reponse?.ok) {
      const messages: Record<string, string> = {
        nom_invalide: "Merci d'indiquer votre nom.",
        email_invalide: "Cette adresse e-mail ne semble pas valide.",
        creneau_passe: "Ce créneau est déjà passé.",
        creneau_indisponible: "Ce créneau vient d'être pris. Choisissez-en un autre.",
        prestation_inconnue: "Cette prestation n'est plus proposée.",
        organisation_inconnue: "Cette page de réservation n'existe plus.",
      };
      setErreur(messages[reponse?.erreur ?? ""] ?? "La réservation n'a pas abouti. Réessayez.");
      if (reponse?.erreur === "creneau_indisponible") {
        setCreneaux((c) => c.filter((x) => x !== creneau));
        setCreneau(null);
      }
      return;
    }
    setConfirme(true);
  }, [slug, prestationId, creneau, nom, email, telephone, notes, conseillerId]);

  if (chargement) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (introuvable || !page) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-2xl font-light">Page de réservation introuvable</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Le lien utilisé ne correspond à aucune boutique.
        </p>
      </div>
    );
  }

  return (
    <VueRdv
      page={page}
      encastre={encastre}
      prestationId={prestationId}
      onPrestation={setPrestationId}
      conseillerId={conseillerId}
      onConseiller={setConseillerId}
      jours={jours}
      jour={jour}
      onJour={setJour}
      creneaux={creneaux}
      chargementCreneaux={chargementCreneaux}
      creneau={creneau}
      onCreneau={setCreneau}
      nom={nom}
      onNom={setNom}
      email={email}
      onEmail={setEmail}
      telephone={telephone}
      onTelephone={setTelephone}
      notes={notes}
      onNotes={setNotes}
      erreur={erreur}
      envoi={envoi}
      confirme={confirme}
      onReserver={reserver}
    />
  );
}

export type ProprietesVueRdv = {
  page: PagePublique;
  encastre: boolean;
  prestationId: string | null;
  onPrestation: (id: string) => void;
  conseillerId: string | null;
  onConseiller: (id: string | null) => void;
  jours: Date[];
  jour: Date;
  onJour: (d: Date) => void;
  creneaux: string[];
  chargementCreneaux: boolean;
  creneau: string | null;
  onCreneau: (c: string) => void;
  nom: string;
  onNom: (v: string) => void;
  email: string;
  onEmail: (v: string) => void;
  telephone: string;
  onTelephone: (v: string) => void;
  notes: string;
  onNotes: (v: string) => void;
  erreur: string | null;
  envoi: boolean;
  confirme: boolean;
  onReserver: () => void;
};

/**
 * La page de réservation telle qu'elle s'affiche, sans lecture ni écriture :
 * RdvPublicPage lui passe ce qu'elle a lu sur le serveur, l'accueil (onglet
 * « Vos outils ») des données de démonstration. Un seul rendu pour les deux.
 */
export function VueRdv({
  page,
  encastre,
  prestationId,
  onPrestation: setPrestationId,
  conseillerId,
  onConseiller: setConseillerId,
  jours,
  jour,
  onJour: setJour,
  creneaux,
  chargementCreneaux,
  creneau,
  onCreneau: setCreneau,
  nom,
  onNom: setNom,
  email,
  onEmail: setEmail,
  telephone,
  onTelephone: setTelephone,
  notes,
  onNotes: setNotes,
  erreur,
  envoi,
  confirme,
  onReserver: reserver,
}: ProprietesVueRdv) {
  const { organisation, prestations, conseillers } = page;
  const prestation = prestations.find((p) => p.id === prestationId) ?? null;
  const heure = (iso: string) =>
    new Date(iso).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: organisation.fuseau,
    });

  if (confirme) {
    return (
      <div className="rdv-page mx-auto max-w-md px-6 py-24 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Check className="h-6 w-6 text-primary" />
        </div>
        <h1 className="mt-6 text-2xl font-light">Rendez-vous confirmé</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {prestation?.nom} — {jour.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          {creneau ? ` à ${heure(creneau)}` : ""}.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Une confirmation part sur {email}. Vous recevrez un rappel la veille puis une heure avant.
        </p>
      </div>
    );
  }

  return (
    <main className={"rdv-page " + (encastre ? "bg-background px-4 py-6" : "min-h-screen bg-background px-4 py-12")}>
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-8 flex items-center gap-3">
          {organisation.logo ? (
            <img src={organisation.logo} alt={organisation.nom} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <div>
            <h1 className="text-xl font-light">{organisation.nom}</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Prendre rendez-vous
            </p>
          </div>
        </header>

        {prestations.length === 0 ? (
          <p className="rounded-lg bg-muted/40 p-6 text-sm text-muted-foreground">
            Aucune prestation n'est proposée à la réservation pour le moment.
          </p>
        ) : (
          <div className="space-y-8">
            <section>
              <h2 className="mb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Prestation</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {prestations.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPrestationId(p.id)}
                    className={`rounded-lg p-4 text-left transition ${
                      p.id === prestationId ? "bg-primary text-primary-foreground" : "bg-muted/40 hover:bg-muted"
                    }`}
                  >
                    <span className="block text-sm">{p.nom}</span>
                    <span className="mt-1 block text-xs opacity-70">
                      {p.duree} min{p.prix ? ` · ${p.prix} ${organisation.devise}` : ""}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {conseillers.length > 1 && (
              <section>
                <h2 className="mb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Conseiller</h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setConseillerId(null)}
                    className={`rounded-full px-4 py-2 text-xs ${
                      conseillerId === null ? "bg-primary text-primary-foreground" : "bg-muted/40 hover:bg-muted"
                    }`}
                  >
                    Peu importe
                  </button>
                  {conseillers.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setConseillerId(c.id)}
                      className={`rounded-full px-4 py-2 text-xs ${
                        conseillerId === c.id ? "bg-primary text-primary-foreground" : "bg-muted/40 hover:bg-muted"
                      }`}
                    >
                      {c.nom}
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="mb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Date</h2>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {jours.map((d) => {
                  const actif = cleDate(d) === cleDate(jour);
                  return (
                    <button
                      key={cleDate(d)}
                      type="button"
                      onClick={() => setJour(d)}
                      className={`min-w-[64px] shrink-0 rounded-lg px-3 py-2 text-center transition ${
                        actif ? "bg-primary text-primary-foreground" : "bg-muted/40 hover:bg-muted"
                      }`}
                    >
                      <span className="block text-[10px] uppercase tracking-widest opacity-70">
                        {d.toLocaleDateString("fr-FR", { weekday: "short" })}
                      </span>
                      <span className="block text-sm">{d.getDate()}</span>
                      <span className="block text-[10px] opacity-70">
                        {d.toLocaleDateString("fr-FR", { month: "short" })}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Créneau</h2>
              {chargementCreneaux ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : creneaux.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun créneau libre ce jour-là.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {creneaux.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCreneau(c)}
                      className={`rounded-lg px-4 py-2 text-sm ${
                        creneau === c ? "bg-primary text-primary-foreground" : "bg-muted/40 hover:bg-muted"
                      }`}
                    >
                      {heure(c)}
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-3">
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Vos coordonnées</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="Nom et prénom" value={nom} onChange={(e) => setNom(e.target.value)} />
                <Input
                  type="email"
                  placeholder="Adresse e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Input
                placeholder="Téléphone (facultatif)"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
              />
              <Textarea
                placeholder="Une précision ? (facultatif)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />

              {erreur && <p className="text-sm text-destructive">{erreur}</p>}

              <Button
                className="w-full"
                disabled={!creneau || !nom.trim() || !email.trim() || envoi}
                onClick={reserver}
              >
                {envoi ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Confirmer le rendez-vous
              </Button>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
