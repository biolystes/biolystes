import { useEffect, useState } from "react";
import { supabase } from "@lystes/integrations/supabase/client";
import { slugAdresse } from "../../supabase/functions/_shared/adresses-marque";

/**
 * L'apparence du multi-lien d'une marque : ce qu'il faut pour poser une page
 * (contact, FAQ) dans le même cadre que lystes.ai/<marque>.
 *
 * Demande de JP du 01/10/2026 : « lystes.ai/<marque>/contact ou la FAQ doivent
 * s'inscrire dans le design du multi-lien, avec le logo, la délimitation et
 * tout ça ». Jusqu'ici chaque page relisait la marque à sa façon : le contact
 * par `brand_link_pages`, la FAQ par `account_landing_config` seulement. Une
 * marque dont les deux adresses diffèrent était renvoyée vers l'accueil depuis
 * /<adresse du multi-lien>/faq.
 *
 * Ordre de lecture, la même que `brand-contact-message` :
 *  1. le multi-lien actif sous cette adresse ;
 *  2. sinon la fiche de marque sous cette adresse (sans tirets), puis le
 *     multi-lien actif du même compte, pour son logo.
 * Dans les deux cas on rend aussi l'adresse de la fiche : c'est sous elle que
 * la base range les questions de la FAQ.
 *
 * Ne lève jamais : une lecture refusée rend « pas de marque », pas une page
 * cassée.
 */
export interface ApparenceMultiLien {
  accountId: string;
  /** L'adresse du multi-lien actif du compte, s'il en a un. */
  slugMultiLien: string | null;
  /** L'adresse de la fiche de marque (`account_landing_config`), si elle existe. */
  slugFiche: string | null;
  /** L'adresse publique de la marque : le multi-lien d'abord, la fiche ensuite. */
  slug: string;
  nom: string;
  logoUrl: string | null;
  verifie: boolean;
  /** Les liens du multi-lien, pour savoir si la marque a déclaré ses propres pages. */
  liens: unknown[];
}

type PageLue = {
  account_id?: string | null;
  slug?: string | null;
  brand_name?: string | null;
  logo_url?: string | null;
  avatar_url?: string | null;
  is_verified?: boolean | null;
  custom_links?: unknown;
};

type FicheLue = { account_id?: string | null; slug?: string | null; brand_name?: string | null };

const COLONNES_PAGE = "account_id, slug, brand_name, logo_url, avatar_url, is_verified, custom_links";

/** Une ligne lue par `maybeSingle`, ou rien. */
function ligne<T>(resultat: { data?: unknown } | null | undefined): T | null {
  const d = resultat?.data;
  return d && typeof d === "object" && !Array.isArray(d) ? (d as T) : null;
}

export async function lireApparenceMultiLien(slugBrut: string | undefined): Promise<ApparenceMultiLien | null> {
  const slug = slugAdresse(slugBrut);
  if (!slug) return null;
  try {
    let page = ligne<PageLue>(
      await supabase.from("brand_link_pages").select(COLONNES_PAGE).eq("slug", slug).eq("is_active", true).maybeSingle(),
    );
    let fiche: FicheLue | null = null;

    if (page?.account_id) {
      fiche = ligne<FicheLue>(
        await supabase
          .from("account_landing_config")
          .select("account_id, slug, brand_name")
          .eq("account_id", page.account_id)
          .eq("enabled", true)
          .maybeSingle(),
      );
    } else {
      fiche = ligne<FicheLue>(
        await supabase
          .from("account_landing_config")
          .select("account_id, slug, brand_name")
          .eq("slug", slug.replace(/-/g, ""))
          .eq("enabled", true)
          .maybeSingle(),
      );
      if (!fiche?.account_id) return null;
      page = ligne<PageLue>(
        await supabase
          .from("brand_link_pages")
          .select(COLONNES_PAGE)
          .eq("account_id", fiche.account_id)
          .eq("is_active", true)
          .maybeSingle(),
      );
    }

    const accountId = (page?.account_id ?? fiche?.account_id) as string | undefined;
    if (!accountId) return null;
    const slugMultiLien = page?.slug ? String(page.slug) : page ? slug : null;
    const slugFiche = fiche?.slug ? String(fiche.slug) : null;
    return {
      accountId,
      slugMultiLien,
      slugFiche,
      slug: slugMultiLien ?? slugFiche ?? slug,
      nom: String(page?.brand_name || fiche?.brand_name || slug),
      logoUrl: page?.logo_url || page?.avatar_url || null,
      verifie: Boolean(page?.is_verified),
      liens: Array.isArray(page?.custom_links) ? (page?.custom_links as unknown[]) : [],
    };
  } catch {
    return null;
  }
}

export function useApparenceMultiLien(slug: string | undefined): {
  apparence: ApparenceMultiLien | null;
  chargement: boolean;
} {
  const [etat, setEtat] = useState<{ cle: string | undefined; apparence: ApparenceMultiLien | null } | null>(null);

  useEffect(() => {
    let vivant = true;
    void lireApparenceMultiLien(slug).then((apparence) => {
      if (vivant) setEtat({ cle: slug, apparence });
    });
    return () => {
      vivant = false;
    };
  }, [slug]);

  const aJour = etat !== null && etat.cle === slug;
  return { apparence: aJour ? etat.apparence : null, chargement: !aJour };
}
