import { useCallback, useEffect, useState } from "react";
import { useAccount } from "@lystes/contexts/AccountContext";
import { supabase } from "@lystes/integrations/supabase/client";
import { typeDeCompte, type TypeDeCompte } from "@lystes/lib/compte/type-de-compte";

/* Une lecture par compte et par session d'onglet, partagée par tous les
   écrans : la latérale, le sélecteur et l'accueil posent la même question
   au même moment. */
const memoire = new Map<string, TypeDeCompte>();
const enVol = new Map<string, Promise<TypeDeCompte>>();
const EVENEMENT = "lystes:type-de-compte";

async function lire(accountId: string): Promise<TypeDeCompte> {
  const deja = enVol.get(accountId);
  if (deja) return deja;
  const p = (async () => {
    try {
      const { data, error } = await supabase
        .from("accounts")
        .select("kind")
        .eq("id", accountId)
        .maybeSingle();
      if (error) {
        console.warn("useTypeDeCompte : type illisible, compte traité en e-commerce", error.message);
        return "ecommerce" as const;
      }
      return typeDeCompte(data as { kind?: string | null } | null);
    } catch {
      return "ecommerce" as const;
    }
  })();
  enVol.set(accountId, p);
  const type = await p;
  enVol.delete(accountId);
  memoire.set(accountId, type);
  return type;
}

/** À appeler après avoir écrit `accounts.kind` : tous les écrans relisent. */
export function oublierTypeDeCompte(accountId: string | null | undefined) {
  if (accountId) memoire.delete(accountId);
  try {
    window.dispatchEvent(new CustomEvent(EVENEMENT, { detail: accountId ?? null }));
  } catch {
    /* hors navigateur */
  }
}

/**
 * Le type du compte sélectionné : « ecommerce » ou « business ».
 *
 * Lecture à part de `accounts.kind`, jamais mêlée aux autres colonnes du
 * compte : tant que la migration n'est pas appliquée, la colonne n'existe pas,
 * la requête échoue, et le compte reste « ecommerce » sans entraîner dans sa
 * chute la lecture du secteur ou des espaces.
 *
 * `isLoading` reste vrai jusqu'à la première réponse : un menu Business ne
 * doit pas s'afficher d'abord en e-commerce puis se vider sous les yeux.
 */
export function useTypeDeCompte(): { type: TypeDeCompte; isLoading: boolean } {
  const { selectedAccountId } = useAccount();
  const [lu, setLu] = useState<{ compte: string; type: TypeDeCompte } | null>(() =>
    selectedAccountId && memoire.has(selectedAccountId)
      ? { compte: selectedAccountId, type: memoire.get(selectedAccountId)! }
      : null,
  );
  const [tour, setTour] = useState(0);

  useEffect(() => {
    const relire = () => setTour((n) => n + 1);
    window.addEventListener(EVENEMENT, relire);
    return () => window.removeEventListener(EVENEMENT, relire);
  }, []);

  const charger = useCallback(async (compte: string, annule: () => boolean) => {
    const type = memoire.get(compte) ?? (await lire(compte));
    if (!annule()) setLu({ compte, type });
  }, []);

  useEffect(() => {
    if (!selectedAccountId) return;
    let fini = false;
    void charger(selectedAccountId, () => fini);
    return () => {
      fini = true;
    };
  }, [selectedAccountId, tour, charger]);

  const pret = !!lu && lu.compte === selectedAccountId;
  return {
    type: pret ? lu!.type : "ecommerce",
    isLoading: !!selectedAccountId && !pret,
  };
}
