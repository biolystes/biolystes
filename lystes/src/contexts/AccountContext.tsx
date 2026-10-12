import { toast } from 'sonner';
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@lystes/integrations/supabase/client";
import { onIdentiteChange } from "@lystes/lib/auth-events";
import { TierName, planToTier } from "@lystes/config/tier-access";

type PrimaryMode = 'diagnostic' | 'tryon' | 'mixed';

interface Account {
  id: string;
  name: string;
  plan: string;
  role: string;
  primary_mode: PrimaryMode;
  tier: TierName;
  sector: string | null;
  plan_id: string | null;
  status: string | null;
  plan_status: string | null;
  grace_until: string | null;
  product_tier: string | null;
  trial_ends_at: string | null;
  trial_tier: string | null;
  stripe_subscription_id: string | null;
  cancel_at_period_end: boolean | null;
}

interface AccountContextType {
  accounts: Account[];
  selectedAccountId: string | null;
  selectedAccount: Account | null;
  setSelectedAccountId: (id: string) => void;
  loading: boolean;
  refreshAccounts: () => Promise<void>;
  overrideAccountId: string | null;
  setOverrideAccount: (account: { id: string; name: string; plan: string; sector?: string | null } | null) => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [overrideAccountId, setOverrideAccountId] = useState<string | null>(
    localStorage.getItem("superAdminOverrideAccountId")
  );
  const [overrideAccount, setOverrideAccountState] = useState<Account | null>(null);

  const setOverrideAccount = useCallback((account: { id: string; name: string; plan: string; sector?: string | null } | null) => {
    if (account) {
      const overrideAcc: Account = {
        id: account.id,
        name: account.name,
        plan: account.plan,
        role: 'SUPER_ADMIN',
        primary_mode: 'diagnostic',
        tier: planToTier(account.plan),
        sector: account.sector || null,
        plan_id: null,
        status: null,
        plan_status: null,
        grace_until: null,
        product_tier: null,
        trial_ends_at: null,
        trial_tier: null,
        stripe_subscription_id: null,
        cancel_at_period_end: null,
      };
      setOverrideAccountId(account.id);
      setOverrideAccountState(overrideAcc);
      setSelectedAccountIdState(account.id);
      localStorage.setItem("superAdminOverrideAccountId", account.id);
      localStorage.setItem("selectedAccountId", account.id);
    } else {
      setOverrideAccountId(null);
      setOverrideAccountState(null);
      localStorage.removeItem("superAdminOverrideAccountId");
      // Restaurer le compte d'origine
      const stored = accounts[0]?.id || null;
      if (stored) {
        setSelectedAccountIdState(stored);
        localStorage.setItem("selectedAccountId", stored);
      }
    }
  }, [accounts]);

  const fetchAccounts = useCallback(async () => {
    try {
      /* getSession() lit le jeton local, getUser() partait sur le réseau à
         chaque appel : c'est ce qui faisait clignoter le back-office. */
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ?? null;
      if (!user) {
        setAccounts([]);
        setSelectedAccountIdState(null);
        setLoading(false);
        return;
      }

      // Charger toutes les adhésions de l'utilisateur
      const { data: memberships, error } = await supabase
        .from("memberships")
        .select(`
          role,
          account:accounts(id, name, plan, primary_mode, sector, plan_id, status, plan_status, grace_until, product_tier, trial_ends_at, trial_tier, stripe_subscription_id, cancel_at_period_end)
        `)
        .eq("user_id", user.id);

      if (error) throw error;

      const accountsList: Account[] = (memberships || [])
        .filter((m: any) => m.account)
        .map((m: any) => {
          const plan = m.account.plan;
          return {
            id: m.account.id,
            name: m.account.name,
            plan: plan,
            role: m.role,
            primary_mode: (m.account.primary_mode as PrimaryMode) || 'diagnostic',
            tier: planToTier(plan),
            sector: m.account.sector || null,
            plan_id: m.account.plan_id ?? null,
            status: m.account.status ?? null,
            plan_status: m.account.plan_status ?? null,
            grace_until: m.account.grace_until ?? null,
            product_tier: m.account.product_tier ?? null,
            trial_ends_at: m.account.trial_ends_at ?? null,
            trial_tier: m.account.trial_tier ?? null,
            stripe_subscription_id: m.account.stripe_subscription_id ?? null,
            cancel_at_period_end: m.account.cancel_at_period_end ?? null,
          };
        });

      setAccounts(accountsList);

      // S'il y a un override actif, le conserver
      const storedOverride = localStorage.getItem("superAdminOverrideAccountId");
      if (storedOverride) {
        // Charger les infos du compte override
        const { data: overrideData } = await supabase
          .from("accounts")
          .select("id, name, plan, primary_mode, sector, plan_id, status, plan_status, grace_until, product_tier, trial_ends_at, trial_tier, stripe_subscription_id, cancel_at_period_end")
          .eq("id", storedOverride)
          .single();

        if (overrideData) {
          const overrideAcc: Account = {
            id: overrideData.id,
            name: overrideData.name,
            plan: overrideData.plan,
            role: 'SUPER_ADMIN',
            primary_mode: (overrideData.primary_mode as PrimaryMode) || 'diagnostic',
            tier: planToTier(overrideData.plan),
            sector: overrideData.sector || null,
            plan_id: overrideData.plan_id ?? null,
            status: overrideData.status ?? null,
            plan_status: overrideData.plan_status ?? null,
            grace_until: overrideData.grace_until ?? null,
            product_tier: overrideData.product_tier ?? null,
            trial_ends_at: overrideData.trial_ends_at ?? null,
            trial_tier: overrideData.trial_tier ?? null,
            stripe_subscription_id: overrideData.stripe_subscription_id ?? null,
            cancel_at_period_end: overrideData.cancel_at_period_end ?? null,
          };
          setOverrideAccountId(storedOverride);
          setOverrideAccountState(overrideAcc);
          setSelectedAccountIdState(storedOverride);
          setLoading(false);
          return;
        } else {
          localStorage.removeItem("superAdminOverrideAccountId");
        }
      }

      // Déterminer le compte sélectionné
      const storedId = localStorage.getItem("selectedAccountId");
      const validStoredId = accountsList.find(a => a.id === storedId)?.id;
      
      if (storedId && !validStoredId) {
        console.warn("Invalid selectedAccountId in localStorage, clearing:", storedId);
        localStorage.removeItem("selectedAccountId");
      }
      
      const { data: defaultAccountId } = await supabase.rpc("get_user_account_id", { user_uuid: user.id });
      
      const finalId = validStoredId || defaultAccountId || accountsList[0]?.id || null;
      setSelectedAccountIdState(finalId);
      
      if (finalId) {
        localStorage.setItem("selectedAccountId", finalId);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    /* On ne recharge les comptes que si l'utilisateur change vraiment.
       Avant, chaque rafraîchissement de jeton émettait « SIGNED_IN » et
       relançait toute la requête : d'où les micro-chargements. */
    return onIdentiteChange(({ userId }) => {
      if (userId) {
        fetchAccounts();
      } else {
        setAccounts([]);
        setSelectedAccountIdState(null);
        setOverrideAccountId(null);
        setOverrideAccountState(null);
        setLoading(false);
        localStorage.removeItem("selectedAccountId");
        localStorage.removeItem("superAdminOverrideAccountId");
      }
    });
  }, [fetchAccounts]);

  const setSelectedAccountId = useCallback((id: string) => {
    setSelectedAccountIdState(id);
    localStorage.setItem("selectedAccountId", id);
  }, []);

  const selectedAccount = overrideAccountId 
    ? overrideAccount 
    : accounts.find(a => a.id === selectedAccountId) || null;

  const effectiveSelectedAccountId = overrideAccountId ?? selectedAccountId;

  return (
    <AccountContext.Provider
      value={{
        accounts,
        selectedAccountId: effectiveSelectedAccountId,
        selectedAccount,
        setSelectedAccountId,
        loading,
        refreshAccounts: fetchAccounts,
        overrideAccountId,
        setOverrideAccount,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
}
