import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@lystes/integrations/supabase/client";
import { useAccount } from "@lystes/contexts/AccountContext";

export interface UGCAvatar {
  id: string;
  account_id: string;
  name: string;
  image_url: string;
  gender: string;
  is_ai_generated: boolean;
  age_range: string | null;
  skin_tone: string | null;
  category: string | null;
  created_at: string;
  usage_count: number;
}

export function useUGCAvatars(accountId: string | null) {
  return useQuery({
    queryKey: ["ugc-avatars", accountId],
    queryFn: async () => {
      if (!accountId) return [];
      
      const { data, error } = await supabase
        .from("ugc_avatars")
        .select("*")
        .eq("account_id", accountId)
        .order("usage_count", { ascending: false });
      
      if (error) throw error;
      return (data || []) as UGCAvatar[];
    },
    enabled: !!accountId,
  });
}

export function useDeleteUGCAvatar() {
  const queryClient = useQueryClient();
  const { selectedAccountId } = useAccount();

  return useMutation({
    mutationFn: async (avatarId: string) => {
      const { data, error } = await supabase
        .from("ugc_avatars")
        .delete()
        .eq("id", avatarId)
        .eq("account_id", selectedAccountId)
        .select("id");

      if (error || !data || data.length === 0) {
        throw error || new Error("Aucune ligne supprimée (avatar UGC introuvable ou accès refusé)");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ugc-avatars"] });
    },
  });
}

export function useSaveUGCAvatar() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (avatar: {
      account_id: string;
      name: string;
      image_url: string;
      gender?: string;
      is_ai_generated?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("ugc_avatars")
        .upsert({
          account_id: avatar.account_id,
          name: avatar.name,
          image_url: avatar.image_url,
          gender: avatar.gender || "neutral",
          is_ai_generated: avatar.is_ai_generated || false,
        }, {
          onConflict: "account_id,image_url",
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as UGCAvatar;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ugc-avatars"] });
    },
  });
}
