import { useEffect, useMemo, useState } from "react";
import { Link } from "@lystes/lib/lien-lystes";
import { useTranslation } from "react-i18next";
import { LayoutDashboard, LogOut } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@lystes/integrations/supabase/client";
import { PACKS, PACKS_OUVERTS } from "@lystes/config/workspace-packs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@lystes/components/ui/dropdown-menu";

/**
 * Menu profil de l'en-tête public.
 *
 * Demande de JP (02/09/2026) : quand la marchande est connectée, « Connexion »
 * et « S'inscrire en 5 min » n'ont plus de sens — c'est un avatar qui ouvre un
 * raccourci vers chaque espace du back-office, plus la déconnexion.
 *
 * La liste des espaces descend de PACKS_OUVERTS : un espace masqué dans le
 * sélecteur du back-office ne réapparaît pas ici par une deuxième liste
 * écrite en dur (règle « corriger la cause »).
 */
export function HeaderProfileMenu({ light = false }: { light?: boolean }) {
  const { t } = useTranslation();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) =>
      setSession(next),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  const email = session?.user?.email ?? "";
  const initiales = useMemo(() => {
    if (!email) return "?";
    return email.slice(0, 2).toUpperCase();
  }, [email]);

  const espaces = useMemo(
    () =>
      PACKS_OUVERTS
        .map((id) => PACKS[id])
        .filter((p) => p && !p.comingSoon),
    [],
  );

  if (!session) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("header.monCompte", "Mon compte")}
        className={`flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-semibold uppercase tracking-wide transition ${
          light
            ? "bg-white/20 text-white hover:bg-white/30"
            : "bg-foreground text-background hover:opacity-90"
        }`}
      >
        {initiales}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-2xl p-1.5">
        <DropdownMenuLabel className="truncate px-2.5 py-2 text-xs font-normal text-muted-foreground">
          {email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/dashboard" className="flex items-center gap-2.5 px-2.5 py-2 cursor-pointer">
            <LayoutDashboard className="h-3.5 w-3.5" strokeWidth={1.6} />
            CoWork
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {espaces.map((pack) => (
          <DropdownMenuItem key={pack.id} asChild>
            <Link
              to={pack.dashboardRoute}
              className="flex items-center gap-2.5 px-2.5 py-2 cursor-pointer"
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-muted-foreground/40"
                aria-hidden
              />
              {pack.switcherLabel ?? pack.label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center gap-2.5 px-2.5 py-2 cursor-pointer"
          onSelect={() => {
            void supabase.auth.signOut();
          }}
        >
          <LogOut className="h-3.5 w-3.5" strokeWidth={1.6} />
          {t("header.seDeconnecter", "Se déconnecter")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
