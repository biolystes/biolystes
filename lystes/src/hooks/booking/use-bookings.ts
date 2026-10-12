import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@lystes/integrations/supabase/client";
import { toast } from "sonner";

const PAGE_SIZE = 50;

export function useBookings(orgId?: string, page = 0) {
  return useQuery({
    queryKey: ["cc_bookings", orgId, page],
    enabled: !!orgId,
    queryFn: async () => {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, error, count } = await supabase
        .from("cc_bookings")
        .select("*, cc_services(name), cc_agents(name), cc_customers(name)", { count: "exact" })
        .eq("org_id", orgId!)
        .order("datetime", { ascending: false })
        .range(from, to);
      if (error) throw error;
      return { rows: data, total: count ?? 0, page, pageSize: PAGE_SIZE };
    },
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (booking: {
      org_id: string;
      service_id?: string;
      agent_id?: string | null;
      customer_id?: string;
      datetime: string;
      duration_minutes: number;
      price: number;
      guest_name?: string;
      guest_email?: string;
      guest_phone?: string;
      notes?: string;
      _service_name?: string;
      _agent_name?: string;
      _org_name?: string;
      [key: string]: any;
    }) => {
      const { _service_name, _agent_name, _org_name, ...bookingData } = booking;
      const { data, error } = await supabase
        .from("cc_bookings")
        .insert(bookingData as any)
        .select()
        .single();
      if (error) throw error;

      // Notification (Lot 8 — edge function pas encore déployée, fail-safe)
      try {
        await supabase.functions.invoke("send-booking-notification", {
          body: {
            org_id: booking.org_id,
            template_key: "booking_confirmation",
            guest_name: booking.guest_name,
            guest_email: booking.guest_email,
            guest_phone: booking.guest_phone,
            service_name: _service_name || "",
            agent_name: _agent_name || "",
            datetime: booking.datetime,
            price: booking.price,
            org_name: _org_name || "Lystes",
            booking_id: data?.id,
          },
        });
      } catch (e) {
        console.error("[booking] Notification skipped:", e);
      }

      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cc_bookings"] });
      toast.success("Réservation créée");
    },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useUpdateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string;[key: string]: any }) => {
      const { data, error } = await supabase
        .from("cc_bookings")
        .update(updates as any)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cc_bookings"] });
      toast.success("Réservation mise à jour");
    },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useDeleteBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error, data } = await supabase.from("cc_bookings").delete().eq("id", id).select("id");
      if (error || !data?.length) throw error || new Error("Aucune ligne supprimée");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cc_bookings"] });
      toast.success("Réservation supprimée");
    },
    onError: (e: any) => toast.error(e.message),
  });
}
