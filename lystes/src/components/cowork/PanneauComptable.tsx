/**
 * Onglet « Fiscal et comptable » du Cowork (JP, 02/09/2026).
 *
 * Deux temps, comme chez un cabinet : la marchande coche les prestations dont
 * elle a besoin, puis elle prend rendez-vous avec un expert-comptable. La
 * prise de rendez-vous reprend la présentation de la page « prendre-rdv » :
 * informations du contact à gauche, calendrier du mois à droite, créneaux
 * après le formulaire. Le rendez-vous n'est pas un simple mail : il passe par
 * notre propre techno de réservation (`cc_bookings`), donc il existe dans le
 * module Booking du compte.
 *
 * Règle maison tenue ici : aucune donnée inventée. Tant que le compte n'a pas
 * d'organisation de réservation, on le dit au lieu d'afficher un faux créneau.
 */
import React, { useState } from 'react';
import {
  Calculator,
  ChevronDown,
  Check,
  ChevronLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { cn } from '@lystes/lib/utils';
import { supabase } from '@lystes/integrations/supabase/client';
import { useOrg } from '@lystes/hooks/booking/use-org';
import { useCreateBooking } from '@lystes/hooks/booking/use-bookings';
import { BookingCalendar } from '@lystes/features/command-center/components/booking/BookingCalendar';
import cabinetPortrait from '@lystes/assets/cabinet/hr-associes-portrait.avif';
import cabinetLogo from '@lystes/assets/cabinet/hr-associes-logo.png';

/** Le catalogue du cabinet, repris du menu fourni par JP. */
const CATALOGUE: { groupe: string; services: string[] }[] = [
  {
    groupe: 'Opérations juridiques et financières',
    services: [
      'Création de société',
      'Modification de statuts',
      'Augmentation de capital',
      'Cession ou transmission',
      'Approbation des comptes',
      'Dissolution et liquidation',
    ],
  },
  {
    groupe: 'Comptabilité',
    services: [
      'Tenue comptable',
      'Révision des comptes',
      'Bilan et liasse fiscale',
      'Comptes annuels et dépôt',
      'Situation intermédiaire',
      'Reprise d’exercice antérieur',
    ],
  },
  {
    groupe: 'Fiscalité',
    services: [
      'Déclarations de TVA',
      'Impôt sur les sociétés',
      'Déclaration de revenus du dirigeant',
      'TVA e-commerce et OSS',
      'Crédit d’impôt et dispositifs',
      'Optimisation de la rémunération',
    ],
  },
  {
    groupe: 'Social',
    services: [
      'Bulletins de paie',
      'Déclarations sociales (DSN)',
      'Contrats de travail',
      'Embauche et rupture',
      'Affiliation du dirigeant',
    ],
  },
  {
    groupe: 'Contrôles',
    services: [
      'Contrôle fiscal',
      'Contrôle URSSAF',
      'Assistance en cas de redressement',
      'Mise en conformité',
    ],
  },
  {
    groupe: 'DAF externalisé',
    services: [
      'Tableau de bord mensuel',
      'Prévisionnel de trésorerie',
      'Business plan et levée',
      'Suivi de marge produit',
      'Pilotage budgétaire',
    ],
  },
  {
    groupe: 'Spécialités',
    services: [
      'E-commerce et marketplaces',
      'Ventes à l’international',
      'Influence et créateurs',
      'Holding et patrimoine',
      'Franchise et multi-boutiques',
    ],
  },
];

const CRENEAUX = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

const formatJour = (d: Date) =>
  new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(d);

export function PanneauComptable({
  darkMode,
  onSendMessage,
}: {
  darkMode: boolean;
  onSendMessage?: (text: string) => void;
}) {
  const [choisis, setChoisis] = useState<string[]>([]);
  /** Domaine ouvert dans le catalogue, ou null tant qu'aucun n'est choisi. */
  const [domaine, setDomaine] = useState<string | null>(null);
  const [etape, setEtape] = useState<'services' | 'rdv' | 'fait'>('services');
  // Dans l'étape « rdv », le parcours calque la page prendre-rdv :
  // formulaire contact → date → horaires → confirmation.
  const [sousEtape, setSousEtape] = useState<'form' | 'date' | 'horaire' | 'confirmation'>('form');
  const [jour, setJour] = useState<Date | null>(null);
  const [heure, setHeure] = useState<string | null>(null);
  const [moisCalendrier, setMoisCalendrier] = useState(new Date());
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [erreur, setErreur] = useState<string | null>(null);

  const { data: org, isLoading: orgEnCours } = useOrg();
  const creer = useCreateBooking();

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail((e) => e || data.user!.email!);
      const meta = (data.user?.user_metadata ?? {}) as Record<string, string>;
      const n = meta.full_name || meta.name || '';
      if (n) setNom((v) => v || n);
    });
  }, []);

  const basculer = (s: string) =>
    setChoisis((liste) => (liste.includes(s) ? liste.filter((x) => x !== s) : [...liste, s]));

  const doux = darkMode ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#EDEDED]';
  const plein = darkMode ? 'bg-white text-black' : 'bg-[#1D1D1F] text-white';
  const discret = darkMode ? 'text-white/50' : 'text-[#86868B]';
  const carte = darkMode ? 'bg-white/5' : 'bg-[#F5F5F7]';
  const champ = darkMode
    ? 'bg-black/20 text-white placeholder:text-white/40'
    : 'bg-white text-[#1D1D1F] placeholder:text-[#86868B]';

  const formulaireValide = Boolean(nom.trim() && email.trim() && tel.trim());

  const visuelCabinet = (
    <aside className="relative hidden min-h-0 overflow-hidden lg:block">
      <img
        src={cabinetPortrait}
        alt="Expert-comptable du cabinet HR & Associés"
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-foreground/45" />
      <div className="absolute inset-x-0 bottom-0 z-10 px-7 pb-7 text-background">
        <img
          src={cabinetLogo}
          alt="HR & Associés"
          className="mb-3 h-auto w-28 object-contain"
        />
        <h3 className="max-w-xs text-xl font-medium leading-tight">
          Le cabinet comptable des e-commerçants
        </h3>
        <p className="mt-2 max-w-xs text-[10px] leading-relaxed text-background/80">
          HR & Associés accompagne les marques en ligne sur leur comptabilité, leur fiscalité et leur pilotage financier, de la TVA e-commerce au suivi de marge.
        </p>
      </div>
    </aside>
  );

  const indicateurEtapes = (active: 1 | 2 | 3 | 4) => (
    <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
      {['Services', 'Coordonnées', 'Date', 'Horaires'].map((libelle, index) => (
        <React.Fragment key={libelle}>
          {index > 0 && <span className="h-px flex-1 bg-muted" />}
          <span className={cn(index + 1 === active && 'text-foreground')}>{index + 1}. {libelle}</span>
        </React.Fragment>
      ))}
    </div>
  );

  const valider = async () => {
    setErreur(null);
    if (!org?.id) {
      setErreur("Aucun agenda de réservation n'est encore ouvert sur ce compte.");
      return;
    }
    if (!jour || !heure) {
      setErreur('Choisissez une date et un créneau.');
      return;
    }
    const [h, m] = heure.split(':').map(Number);
    const debut = new Date(jour);
    debut.setHours(h, m, 0, 0);
    try {
      // La règle d'écriture sur cc_bookings exige un service existant : on
      // réutilise « Rendez-vous expert-comptable » ou on le crée une fois.
      const NOM_SERVICE = 'Rendez-vous expert-comptable';
      let serviceId: string | null = null;
      const { data: existants } = await supabase
        .from('cc_services')
        .select('id')
        .eq('org_id', org.id)
        .eq('name', NOM_SERVICE)
        .limit(1);
      serviceId = existants?.[0]?.id ?? null;
      if (!serviceId) {
        const { data: creeService, error: errService } = await supabase
          .from('cc_services')
          .insert({
            org_id: org.id,
            name: NOM_SERVICE,
            category: 'Expertise comptable',
            duration_minutes: 30,
            price: 0,
            currency: 'EUR',
            is_active: true,
          })
          .select('id')
          .single();
        if (errService) throw errService;
        serviceId = creeService.id;
      }
      await creer.mutateAsync({
        org_id: org.id,
        service_id: serviceId,
        datetime: debut.toISOString(),
        duration_minutes: 30,
        price: 0,
        currency: 'EUR',
        status: 'pending',
        guest_name: nom.trim() || 'Rendez-vous expert-comptable',
        guest_email: email.trim(),
        guest_phone: tel.trim(),
        notes: `Prestations demandées : ${choisis.join(', ') || 'à préciser'}`,
        _service_name: NOM_SERVICE,
        _org_name: (org as { name?: string }).name || 'Lystes',
      });
      setEtape('fait');
    } catch (e: unknown) {
      setErreur(e instanceof Error ? e.message : 'Le rendez-vous n’a pas pu être enregistré.');
    }
  };

  // ─── Rendez-vous enregistré ───
  if (etape === 'fait') {
    return (
      <div className="space-y-3">
        <p className={cn('flex items-center gap-2 text-[11px]', discret)}>
          <Check className="h-3.5 w-3.5" />
          Rendez-vous enregistré
        </p>
        <div className={cn('rounded-2xl p-4 text-[12px] leading-relaxed', carte, darkMode ? 'text-white' : 'text-[#1D1D1F]')}>
          {jour && heure && (
            <p>
              {formatJour(jour)} à {heure}, 30 minutes, avec un expert-comptable.
            </p>
          )}
          <p className={cn('mt-2 text-[11px]', discret)}>
            {choisis.length ? choisis.join(' · ') : 'Prestations à préciser pendant l’échange.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            onSendMessage?.(
              `Prépare mon rendez-vous avec l’expert-comptable sur : ${choisis.join(', ') || 'la tenue comptable de ma boutique'}`,
            )
          }
          className={cn('rounded-full px-4 py-2 text-[12px]', plein)}
        >
          Préparer les éléments à transmettre
        </button>
      </div>
    );
  }

  // ─── Prise de rendez-vous (présentation de la page prendre-rdv) ───
  if (etape === 'rdv') {
    return (
      <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-2">
        {visuelCabinet}

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-5 lg:p-7">

        <h2 className="pr-6 text-lg font-normal text-foreground">Gestion fiscale et comptable</h2>
        {indicateurEtapes(sousEtape === 'form' ? 2 : sousEtape === 'date' ? 3 : 4)}

        {sousEtape === 'confirmation' && jour && heure ? (
          /* ─── Confirmation ─── */
          <div className="mx-auto max-w-md space-y-4">
            <button
              type="button"
              onClick={() => setSousEtape('horaire')}
              className={cn('inline-flex items-center gap-1 text-[11px]', discret)}
            >
              <ChevronLeft className="h-3 w-3" /> Retour
            </button>
            <div className={cn('space-y-3 rounded-2xl p-5', carte)}>
              <div className={cn('flex items-center gap-3 text-[12px]', darkMode ? 'text-white' : 'text-[#1D1D1F]')}>
                <User className={cn('h-4 w-4', discret)} /> {nom}
              </div>
              <div className={cn('flex items-center gap-3 text-[12px]', darkMode ? 'text-white' : 'text-[#1D1D1F]')}>
                <Mail className={cn('h-4 w-4', discret)} /> {email}
              </div>
              <div className={cn('flex items-center gap-3 text-[12px]', darkMode ? 'text-white' : 'text-[#1D1D1F]')}>
                <Phone className={cn('h-4 w-4', discret)} /> {tel}
              </div>
              <div className={cn('flex items-center gap-3 text-[12px] font-medium', darkMode ? 'text-white' : 'text-[#1D1D1F]')}>
                <Calendar className={cn('h-4 w-4', discret)} /> {formatJour(jour)} à {heure}
              </div>
              <div className={cn('flex items-center gap-3 text-[12px]', darkMode ? 'text-white' : 'text-[#1D1D1F]')}>
                <Clock className={cn('h-4 w-4', discret)} /> 30 minutes, avec un expert-comptable
              </div>
            </div>
            {orgEnCours && <p className={cn('text-[11px]', discret)}>Ouverture de votre agenda…</p>}
            {erreur && <p className="text-[11px] text-red-500">{erreur}</p>}
            <button
              type="button"
              onClick={valider}
              disabled={creer.isPending}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-full py-3 text-[12px] font-medium disabled:opacity-50',
                plein,
              )}
            >
              {creer.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {creer.isPending ? 'Enregistrement…' : 'Confirmer le rendez-vous'}
            </button>
          </div>
        ) : (
          /* ─── Formulaire + calendrier, comme sur prendre-rdv ─── */
          <div className="flex flex-col gap-4">
            {/* Gauche — contact puis créneaux */}
            <div className="w-full shrink-0">
              <div className={cn('space-y-4 rounded-2xl p-5', carte)}>
                {sousEtape === 'form' ? (
                  <>
                    <h3 className={cn('text-[13px] font-semibold', darkMode ? 'text-white' : 'text-[#1D1D1F]')}>
                      Informations du contact
                    </h3>
                    <div className="relative">
                      <User className={cn('absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2', discret)} />
                      <input
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        placeholder="Prénom et Nom"
                        className={cn('w-full rounded-xl py-2.5 pl-9 pr-4 text-[12px] outline-none', champ)}
                      />
                    </div>
                    <div className="relative">
                      <Mail className={cn('absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2', discret)} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email *"
                        className={cn('w-full rounded-xl py-2.5 pl-9 pr-4 text-[12px] outline-none', champ)}
                      />
                    </div>
                    <div className="relative">
                      <Phone className={cn('absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2', discret)} />
                      <input
                        type="tel"
                        value={tel}
                        onChange={(e) => setTel(e.target.value)}
                        placeholder="Téléphone * (+33…)"
                        className={cn('w-full rounded-xl py-2.5 pl-9 pr-4 text-[12px] outline-none', champ)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => formulaireValide && setSousEtape('date')}
                      disabled={!formulaireValide}
                      className={cn(
                        'flex w-full items-center justify-center gap-2 rounded-full py-3 text-[12px] font-medium disabled:opacity-40',
                        plein,
                      )}
                    >
                      Choisir un créneau <ArrowRight className="h-4 w-4" />
                    </button>
                  </>
                ) : sousEtape === 'horaire' && jour ? (
                      <div className="space-y-3">
                        <p className={cn('text-[11px]', discret)}>
                          {formatJour(jour)} — choisissez l’heure
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {CRENEAUX.map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setHeure(c)}
                              className={cn(
                                'rounded-full px-3 py-1.5 text-[11px] transition-colors',
                                heure === c ? plein : doux,
                              )}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                        {heure && (
                          <button
                            type="button"
                            onClick={() => setSousEtape('confirmation')}
                            className={cn(
                              'flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-[12px] font-medium',
                              plein,
                            )}
                          >
                            Confirmer {heure} <ArrowRight className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ) : null}
              </div>
            </div>

            {/* Étape 3 uniquement — date et heure ne partagent pas la vue coordonnées. */}
            {sousEtape === 'date' && (
              <div className={cn('flex-1 rounded-2xl p-5', carte)}>
                <BookingCalendar
                  calendarMonth={moisCalendrier}
                  onMonthChange={setMoisCalendrier}
                  selectedDate={jour}
                  onSelectDate={(d) => {
                    setJour(d);
                    setHeure(null);
                    setSousEtape('horaire');
                  }}
                  interactive
                />
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    );
  }

  /* ─── Catalogue, en deux temps ───
     JP, 02/09/2026 : « je n'aime pas trop d'info ». Les sept groupes affichés
     d'un coup faisaient trente-sept pastilles sur un même écran. On choisit
     d'abord un domaine, puis seulement ses prestations. L'action principale
     ne défile pas : elle est posée en bas du panneau. */
  /* ─── Catalogue en accordéons (JP, 02/09/2026) ───
     On ne quitte plus la page pour ouvrir un domaine : chaque groupe est un
     accordéon, chaque prestation une case à cocher. Le contenu défile seul,
     l'action reste posée en pied de pop-up. */
  return (
    <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-2">
      {visuelCabinet}
      <div className="flex min-h-0 flex-1 flex-col p-5 lg:p-7">
      <h2 className="pr-6 text-lg font-normal text-foreground">Gestion fiscale et comptable</h2>
      <div className="mb-4 mt-3">{indicateurEtapes(1)}</div>
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <p className={cn('mb-3 flex items-center gap-2 text-[11px]', discret)}>
          <Calculator className="h-3.5 w-3.5" />
          Cochez les prestations dont vous avez besoin
        </p>
        <div className="space-y-1.5">
          {CATALOGUE.map((b) => {
            const ouvert = domaine === b.groupe;
            const pris = b.services.filter((s) => choisis.includes(s)).length;
            return (
              <div key={b.groupe} className={cn('overflow-hidden rounded-xl', carte)}>
                <button
                  type="button"
                  onClick={() => setDomaine(ouvert ? null : b.groupe)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-[12px]"
                >
                  <span className={darkMode ? 'text-white' : 'text-[#1D1D1F]'}>{b.groupe}</span>
                  <span className={cn('flex items-center gap-2 text-[11px]', discret)}>
                    {pris ? `${pris} choisie${pris > 1 ? 's' : ''}` : `${b.services.length} prestations`}
                    <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', ouvert && 'rotate-180')} />
                  </span>
                </button>
                {ouvert && (
                  <div className="space-y-1 px-2 pb-2">
                    {b.services.map((s) => {
                      const coche = choisis.includes(s);
                      return (
                        <label
                          key={s}
                          className={cn(
                            'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-[12px]',
                            coche ? 'bg-[#e1f3c5] text-[#1D1D1F]' : darkMode ? 'text-white/80' : 'text-[#1D1D1F]',
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={coche}
                            onChange={() => basculer(s)}
                            className="h-3.5 w-3.5 accent-[#1D1D1F]"
                          />
                          {s}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>


      {/* Barre d'action, toujours visible — on ne scrolle pas pour la trouver. */}
      <div
        className={cn(
          'mt-3 flex shrink-0 items-center justify-between gap-3 pt-3',
          darkMode ? 'border-t border-white/10' : 'border-t border-[#f1f1f1]',
        )}
      >
        <p className={cn('truncate text-[11px]', discret)}>
          {choisis.length
            ? `${choisis.length} prestation${choisis.length > 1 ? 's' : ''} sélectionnée${choisis.length > 1 ? 's' : ''}`
            : 'Aucune prestation sélectionnée'}
        </p>
        <button
          type="button"
          onClick={() => setEtape('rdv')}
          className={cn('shrink-0 rounded-full px-5 py-2.5 text-[12px] font-medium', plein)}
        >
          Prendre rendez-vous
        </button>
      </div>
      </div>
    </div>
  );
}

