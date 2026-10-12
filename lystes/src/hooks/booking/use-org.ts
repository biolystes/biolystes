import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@lystes/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { assurerOrganisation } from "@lystes/lib/booking/assurer-organisation";
import { useAccount } from "@lystes/contexts/AccountContext";

/** Wrapper minimal compatible Lystes (pas de AuthContext partagé côté booking). */
function useCurrentUser(): { user: User | null; loading: boolean } {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}

export function useOrg() {
  const { user } = useCurrentUser();
  const { selectedAccountId } = useAccount();

  return useQuery({
    queryKey: ["cc_organization", user?.id, selectedAccountId],
    enabled: !!user?.id,
    queryFn: async () => {
      // 1. Via cc_org_members
      const { data: membership, error: membershipError } = await supabase
        .from("cc_org_members")
        .select("org_id")
        .eq("user_id", user!.id)
        .limit(1)
        .maybeSingle();
      if (membershipError) throw membershipError;

      if (membership?.org_id) {
        const { data, error } = await supabase
          .from("cc_organizations")
          .select("*")
          .eq("id", membership.org_id)
          .single();
        if (error) throw error;
        return data;
      }

      // 2. Fallback : user owner d'une org
      const { data: ownedOrg, error: ownedOrgError } = await supabase
        .from("cc_organizations")
        .select("*")
        .eq("owner_id", user!.id)
        .limit(1)
        .maybeSingle();
      if (ownedOrgError) throw ownedOrgError;

      if (ownedOrg) return ownedOrg;

      /* Rien trouvé : on la crée plutôt que de rendre un module vide.
         Aucun code ne créait d'organisation, nulle part, ce qui faisait
         afficher zéro aux quinze écrans du module quel que soit le compte.
         La politique d'accès l'autorise depuis toujours, il ne manquait que
         quelqu'un pour appeler (JP, 12/08/2026). */
      const creee = await assurerOrganisation(selectedAccountId);
      if (!creee) return null;

      const { data: fraiche } = await supabase
        .from("cc_organizations")
        .select("*")
        .eq("id", creee.id)
        .maybeSingle();

      return fraiche ?? null;
    },
  });
}
