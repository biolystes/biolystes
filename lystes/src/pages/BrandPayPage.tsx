import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { Link } from "@lystes/lib/lien-lystes";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, Loader2 } from "lucide-react";

import { supabase } from "@lystes/integrations/supabase/client";
import { useBrandLanding } from "@lystes/hooks/useBrandLanding";
import { brandLinkPageStyles } from "@lystes/pages/BrandLinkPage";
import { NomMultiLien } from "@lystes/components/brand/MultiLienCommun";

export interface PayAppearance {
  brand_name: string;
  logo_url: string | null;
  avatar_url: string | null;
  background_color: string | null;
  is_verified: boolean | null;
}

/**
 * /:brandSlug/pay — le lien de paiement de la marque : un montant libre,
 * en une fois (carte) ou en plusieurs fois (Klarna porte le paiement
 * fractionné en France ; on n'annonce pas un 3× carte qui n'existe pas).
 *
 * Le montant part en centimes vers `paiement-libre`, qui crée la session
 * Stripe sur le compte connecté de la marque quand elle en a un.
 *
 * Design : calqué sur la page de référence (carte blanche arrondie, logo
 * cerclé dégradé, titre Futura espacé, champ fin, bouton noir, progression
 * numérotée reliée). L'e-mail n'est pas demandé ici : il est collecté à
 * l'étape de commande.
 */

const payPageStyles = `
  .bpay {
    font-family: 'Jost', 'Futura', 'Century Gothic', 'Trebuchet MS', sans-serif;
    color: #231e1f;
  }
  .bpay-brand {
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.34em;
    text-transform: uppercase;
    color: #231e1f;
  }
  /* En casse normale (JP, 12/10/2026) : en capitales espacées, la consigne
     se lisait mal. */
  .bpay-title {
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.01em;
    line-height: 1.5;
    text-wrap: balance;
    text-align: center;
    color: #231e1f;
    margin: 0 8px;
  }
  .bpay-amount {
    display: block;
    width: 100%;
    margin-top: 18px;
    padding: 12px 10px;
    border: 1px solid #f1f1f1;
    background: #fff;
    font-size: 14px;
    text-align: center;
    letter-spacing: 0.08em;
    color: #231e1f;
    outline: none;
  }
  .bpay-amount:focus { border-color: #231e1f; }
  .bpay-cta {
    display: block;
    width: 100%;
    margin-top: 14px;
    padding: 18px 10px;
    background: #000;
    color: #fff;
    /* « Payer en plusieurs fois » sur une ligne (JP, 12/10/2026). */
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    white-space: nowrap;
    cursor: pointer;
  }
  .bpay-cta:disabled { opacity: 0.5; cursor: default; }
  .bpay-alt {
    display: block;
    margin: 10px auto 0;
    background: none;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #777b7f;
    cursor: pointer;
  }
  .bpay-alt:hover { color: #231e1f; }
  .bpay-progress {
    margin: 34px 0 0;
    padding: 0;
    list-style: none;
    counter-reset: step;
  }
  .bpay-progress li {
    position: relative;
    padding: 4px 4px 22px 46px;
  }
  .bpay-progress li:not(:last-child)::before {
    content: "";
    position: absolute;
    left: 15px;
    top: 34px;
    bottom: -2px;
    width: 1px;
    background: #231e1f;
    opacity: 0.75;
  }
  .bpay-step {
    position: absolute;
    left: 0;
    top: 0;
    width: 32px;
    height: 32px;
    border: 1px solid #231e1f;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    color: #231e1f;
    background: #fff;
  }
  .bpay-progress__title {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #231e1f;
    text-align: left;
  }
  .bpay-progress__info {
    margin-top: 3px;
    font-size: 11px;
    line-height: 1.55;
    color: #777b7f;
    text-align: left;
  }
  .bpay-info { font-size: 11px; color: #777b7f; }
  .bpay-back {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: #777b7f;
  }
  .bpay-back:hover { color: #231e1f; }
  .blp-body .blp-profile-img {
    border: 3px solid transparent;
    background:
      linear-gradient(#fff, #fff) padding-box,
      linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%) border-box;
  }
`;

export default function BrandPayPage() {
  const { brandSlug } = useParams<{ brandSlug: string }>();
  const { data, loading, notFound } = useBrandLanding(brandSlug);
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const annule = params.get("annule") === "1";

  const [montant, setMontant] = useState("");
  const [intitule, setIntitule] = useState("");
  const [email, setEmail] = useState("");
  const [echeances, setEcheances] = useState<1 | 3>(1);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [confirme, setConfirme] = useState<{ montant_cents: number; echeances: number } | null>(null);
  const [verification, setVerification] = useState(Boolean(sessionId));
  const [appearance, setAppearance] = useState<PayAppearance | null>(null);

  useEffect(() => {
    if (!brandSlug) return;
    let vivant = true;
    void supabase
      .from("brand_link_pages")
      .select("brand_name, logo_url, avatar_url, background_color, is_verified")
      .eq("slug", brandSlug)
      .eq("is_active", true)
      .maybeSingle()
      .then(({ data: page }) => {
        if (vivant && page) setAppearance(page);
      });
    return () => {
      vivant = false;
    };
  }, [brandSlug]);

  const montantCents = useMemo(() => {
    const n = Number(montant.replace(",", "."));
    return Number.isFinite(n) ? Math.round(n * 100) : 0;
  }, [montant]);

  useEffect(() => {
    if (!sessionId) return;
    let vivant = true;
    (async () => {
      const { data: reponse, error } = await supabase.functions.invoke(
        `paiement-libre/verifier?session_id=${encodeURIComponent(sessionId)}`,
        { method: "GET" },
      );
      if (!vivant) return;
      setVerification(false);
      if (error) {
        setErreur("Impossible de vérifier ce paiement pour le moment.");
        return;
      }
      if (reponse?.statut === "payee") {
        setConfirme({ montant_cents: reponse.montant_cents, echeances: reponse.echeances ?? 1 });
      } else {
        setErreur("Ce paiement n'est pas encore confirmé. Actualisez dans un instant.");
      }
    })();
    return () => {
      vivant = false;
    };
  }, [sessionId]);

  const payer = async (nb: 1 | 3 = echeances) => {
    setErreur(null);
    if (montantCents < 100) {
      setErreur("Saisissez un montant d'au moins 1 €.");
      return;
    }
    if (montantCents > 1_000_000) {
      setErreur("Le montant maximum est de 10 000 €.");
      return;
    }
    setEnvoi(true);
    const { data: reponse, error } = await supabase.functions.invoke("paiement-libre", {
      body: {
        slug: brandSlug,
        montant_cents: montantCents,
        echeances: nb,
        intitule: intitule || `Paiement ${data?.brandName ?? ""}`.trim(),
        client_email: email || null,
      },
    });
    setEnvoi(false);
    if (error || !reponse?.url) {
      setErreur(
        (reponse as { erreur?: string } | null)?.erreur ??
          "Le paiement n'a pas pu être ouvert. Réessayez dans un instant.",
      );
      return;
    }
    window.location.href = reponse.url as string;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
      </div>
    );
  }
  if (notFound || !data) return <Navigate to="/" replace />;

  const titre = `Payer ${data.brandName} en ligne`;

  return (
    <VuePaiement
      marque={data.brandName}
      slug={data.slug}
      appearance={appearance}
      verification={verification}
      confirme={confirme}
      annule={annule}
      montant={montant}
      onMontant={setMontant}
      envoi={envoi}
      erreur={erreur}
      payer={(nb) => { void payer(nb); }}
      tete={
          <Helmet>
            <title>{titre.slice(0, 59)}</title>
            <meta
              name="description"
              content={`Réglez ${data.brandName} en ligne : montant libre, paiement en une fois ou en trois fois, encaissement sécurisé.`.slice(0, 155)}
            />
            <link rel="canonical" href={`https://lystes.ai/${data.slug}/pay`} />
            <meta property="og:title" content={titre} />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary" />
          </Helmet>
      }
    />
  );
}

/**
 * Le lien de paiement tel qu'il s'affiche, sans rien lire ni envoyer : la page
 * le nourrit de son état, la visite « Vos outils » de l'accueil (12/10/2026)
 * d'un montant tapé sous les yeux. Un seul dessin pour les deux.
 */
export function VuePaiement({
  marque,
  slug,
  appearance,
  verification,
  confirme,
  annule,
  montant,
  onMontant,
  envoi,
  erreur,
  payer,
  tete,
}: {
  marque: string;
  slug: string;
  appearance: PayAppearance | null;
  verification: boolean;
  confirme: { montant_cents: number; echeances: number } | null;
  annule: boolean;
  montant: string;
  onMontant: (v: string) => void;
  envoi: boolean;
  erreur: string | null;
  payer: (nb: 1 | 3) => void;
  tete?: ReactNode;
}) {
  const data = { brandName: marque, slug };
  return (
    <>
      <style>{brandLinkPageStyles}</style>
      <style>{payPageStyles}</style>
      {tete}
      <div
        className="blp-body p-4 text-stone-900"
        style={{
          background: appearance?.background_color
            ? appearance.background_color.includes("gradient") || appearance.background_color.includes("radial")
              ? appearance.background_color
              : `radial-gradient(ellipse at 10% 40%, ${appearance.background_color} 0%, ${appearance.background_color}dd 60%, ${appearance.background_color}bb 100%)`
            : "radial-gradient(ellipse at 10% 40%, #4f7971 0%, #002D1B 60%, #002D1B 100%)",
          backgroundAttachment: "fixed",
        }}
      >
        <main className="blp-main-card">
          <div className="blp-profile-wrapper">
            {appearance?.logo_url || appearance?.avatar_url ? (
              <img
                src={appearance.logo_url || appearance.avatar_url || ""}
                alt={appearance.brand_name || data.brandName}
                className="blp-profile-img"
              />
            ) : (
              <div className="blp-profile-img flex items-center justify-center text-xl font-semibold text-gray-700">
                {data.brandName.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          {/* Le nom de la marque comme sur le multi-lien (JP, 12/10/2026) : sur
              une ligne, au centre, le badge noir à coche blanche collé à la
              fin du nom. En capitales espacées, « Lystes & Partners » passait
              sur deux lignes et le badge flottait loin à droite. */}
          <header className="pt-20 pb-2 text-center [&>div]:mb-0">
            <NomMultiLien nom={appearance?.brand_name || data.brandName} verifie={!!appearance?.is_verified} titre />
          </header>
        {verification ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
          </div>
        ) : confirme ? (
          <div className="bpay px-6 py-12 text-center">
            <CheckCircle2 className="mx-auto h-7 w-7 text-stone-900" />
            <p className="bpay-title mt-4">Paiement reçu</p>
            <p className="bpay-info mt-2">
              {(confirme.montant_cents / 100).toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
              })}
              {confirme.echeances === 3 ? " en plusieurs fois" : ""} — un reçu vous a été envoyé.
            </p>
            <Link to={`/${data.slug}`} className="bpay-back mt-6 inline-block">
              Retour à la marque
            </Link>
          </div>
        ) : (
          <div className="bpay px-1 pt-10">
            {annule && <p className="bpay-info mb-6 text-center">Paiement interrompu — rien n'a été débité.</p>}

            <h2 className="bpay-title">Indiquez le montant à payer en euros</h2>

            <input
              inputMode="decimal"
              value={montant}
              onChange={(e) => onMontant(e.target.value.replace(/[^0-9.,]/g, ""))}
              aria-label="Montant en euros"
              className="bpay-amount"
            />

            <button type="button" onClick={() => payer(3)} disabled={envoi} className="bpay-cta">
              {envoi ? "Ouverture du paiement…" : "Payer en plusieurs fois"}
            </button>
            <button type="button" onClick={() => payer(1)} disabled={envoi} className="bpay-alt">
              Payer en une fois
            </button>

            {erreur && <p className="bpay-info mt-4 text-center">{erreur}</p>}

            <ol className="bpay-progress">
              {[
                { titre: "Définissez le montant", texte: "Indiquez le montant que vous souhaitez payer en plusieurs fois." },
                { titre: "Choisissez la banque", texte: "Complétez vos coordonnées et sélectionnez votre banque pour le paiement." },
                { titre: "Finalisez votre achat", texte: "Effectuez la transaction via la plateforme pour profiter du service ou acheter le produit en plusieurs mois." },
              ].map((bloc, index) => (
                <li key={bloc.titre}>
                  <span className="bpay-step">{index + 1}</span>
                  <p className="bpay-progress__title">{bloc.titre}</p>
                  <p className="bpay-progress__info">{bloc.texte}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
          <nav className="bpay pb-8 pt-6 text-center">
            <Link to={`/${data.slug}`} className="bpay-back">Retour aux liens</Link>
          </nav>
        </main>
      </div>
    </>
  );
}
