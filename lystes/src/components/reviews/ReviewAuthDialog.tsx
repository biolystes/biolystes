import { useState } from "react";
import { supabase } from "@lystes/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@lystes/components/ui/dialog";
import { Input } from "@lystes/components/ui/input";
import { Label } from "@lystes/components/ui/label";
import { Button } from "@lystes/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@lystes/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthenticated?: () => void;
}

export function ReviewAuthDialog({ open, onOpenChange, onAuthenticated }: Props) {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name: firstName },
            emailRedirectTo: window.location.href,
          },
        });
        if (error) throw error;
        toast.success("Compte créé, vérifiez vos emails pour confirmer.");
        onAuthenticated?.();
        onOpenChange(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Connecté.");
        onAuthenticated?.();
        onOpenChange(false);
      }
    } catch (err: any) {
      toast.error(err.message ?? "Erreur d'authentification");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.href },
    });
    if (error) {
      toast.error(error.message ?? "Erreur d'authentification");
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="font-editorial text-2xl font-normal">
            {mode === "signup" ? "Créer un compte" : "Se connecter"}
          </DialogTitle>
          <p className="text-sm text-stone-500">
            Connectez-vous pour publier votre avis vérifié.
          </p>
        </DialogHeader>

        <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">Inscription</TabsTrigger>
            <TabsTrigger value="signin">Connexion</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <TabsContent value="signup" className="space-y-3 m-0">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  maxLength={60}
                />
              </div>
            </TabsContent>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-black text-white">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "signup" ? "Créer mon compte" : "Se connecter"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-stone-200" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-stone-500">ou</span></div>
            </div>

            <Button type="button" variant="outline" onClick={handleGoogle} disabled={loading} className="w-full">
              Continuer avec Google
            </Button>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
