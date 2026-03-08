import { useOnboardingStore, ProfileData } from "@/stores/onboardingStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight } from "lucide-react";

export default function StepProfile() {
  const { profile, setProfile, setStep } = useOnboardingStore();

  const handleNext = () => {
    if (!profile.prenom || !profile.nom || !profile.email || !profile.telephone) return;
    setStep(1);
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-foreground">Votre profil</h1>
      <p className="text-muted-foreground mb-8">Commencez par nous indiquer votre statut et vos coordonnées.</p>

      {/* Statut juridique */}
      <div className="mb-6">
        <Label className="text-sm font-medium">Statut juridique</Label>
        <div className="flex gap-2 mt-2">
          {([
            { value: "particulier", label: "Particulier" },
            { value: "auto_entrepreneur", label: "Auto-entrepreneur" },
            { value: "societe", label: "Société" },
          ] as const).map((opt) => (
            <button
              key={opt.value}
              onClick={() => setProfile({ statut_juridique: opt.value })}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                profile.statut_juridique === opt.value
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-foreground border-border hover:border-foreground/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Common fields */}
      {(profile.statut_juridique === "particulier" || profile.statut_juridique === "auto_entrepreneur") && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label>Civilité</Label>
            <Select value={profile.civilite || ""} onValueChange={(v) => setProfile({ civilite: v })}>
              <SelectTrigger><SelectValue placeholder="Civilité" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="M.">M.</SelectItem>
                <SelectItem value="Mme">Mme</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Nationalité</Label>
            <Input value={profile.nationalite || ""} onChange={(e) => setProfile({ nationalite: e.target.value })} placeholder="Française" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label>Prénom *</Label>
          <Input value={profile.prenom} onChange={(e) => setProfile({ prenom: e.target.value })} placeholder="Jean" />
        </div>
        <div>
          <Label>Nom *</Label>
          <Input value={profile.nom} onChange={(e) => setProfile({ nom: e.target.value })} placeholder="Dupont" />
        </div>
      </div>

      {(profile.statut_juridique === "particulier" || profile.statut_juridique === "auto_entrepreneur") && (
        <div className="mb-4">
          <Label>Date de naissance</Label>
          <Input type="date" value={profile.date_naissance || ""} onChange={(e) => setProfile({ date_naissance: e.target.value })} />
        </div>
      )}

      {/* Société-specific */}
      {profile.statut_juridique === "societe" && (
        <div className="space-y-4 mb-4 p-4 rounded-xl border border-border bg-secondary/30">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Raison sociale *</Label>
              <Input value={profile.raison_sociale || ""} onChange={(e) => setProfile({ raison_sociale: e.target.value })} />
            </div>
            <div>
              <Label>Forme juridique *</Label>
              <Select value={profile.forme_juridique || ""} onValueChange={(v) => setProfile({ forme_juridique: v })}>
                <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                <SelectContent>
                  {["SAS", "SARL", "EURL", "SA", "SCI", "Autre"].map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Siège social</Label>
            <Input value={profile.siege_social || ""} onChange={(e) => setProfile({ siege_social: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>SIRET *</Label>
              <Input value={profile.rcs_siret || ""} onChange={(e) => setProfile({ rcs_siret: e.target.value })} placeholder="14 chiffres" maxLength={14} />
            </div>
            <div>
              <Label>N° TVA</Label>
              <Input value={profile.numero_tva || ""} onChange={(e) => setProfile({ numero_tva: e.target.value })} placeholder="FR..." />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nom du représentant *</Label>
              <Input value={profile.representant_nom || ""} onChange={(e) => setProfile({ representant_nom: e.target.value })} />
            </div>
            <div>
              <Label>Qualité *</Label>
              <Input value={profile.representant_qualite || ""} onChange={(e) => setProfile({ representant_qualite: e.target.value })} placeholder="Gérant, Président..." />
            </div>
          </div>
        </div>
      )}

      {/* Auto-entrepreneur SIRET */}
      {profile.statut_juridique === "auto_entrepreneur" && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label>SIRET *</Label>
            <Input value={profile.rcs_siret || ""} onChange={(e) => setProfile({ rcs_siret: e.target.value })} placeholder="14 chiffres" maxLength={14} />
          </div>
          <div>
            <Label>N° TVA</Label>
            <Input value={profile.numero_tva || ""} onChange={(e) => setProfile({ numero_tva: e.target.value })} placeholder="FR..." />
          </div>
        </div>
      )}

      {/* Address */}
      <div className="mb-4">
        <Label>Adresse *</Label>
        <Input value={profile.adresse} onChange={(e) => setProfile({ adresse: e.target.value })} placeholder="24 rue de la Paix" />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label>Code postal *</Label>
          <Input value={profile.code_postal} onChange={(e) => setProfile({ code_postal: e.target.value })} placeholder="75002" />
        </div>
        <div>
          <Label>Ville *</Label>
          <Input value={profile.ville} onChange={(e) => setProfile({ ville: e.target.value })} placeholder="Paris" />
        </div>
        <div>
          <Label>Pays *</Label>
          <Input value={profile.pays} onChange={(e) => setProfile({ pays: e.target.value })} placeholder="France" />
        </div>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <Label>Email *</Label>
          <Input type="email" value={profile.email} onChange={(e) => setProfile({ email: e.target.value })} placeholder="jean@email.com" />
        </div>
        <div>
          <Label>Téléphone *</Label>
          <Input type="tel" value={profile.telephone} onChange={(e) => setProfile({ telephone: e.target.value })} placeholder="+33 6 12 34 56 78" />
        </div>
      </div>

      <Button onClick={handleNext} className="w-full" size="lg" disabled={!profile.prenom || !profile.nom || !profile.email || !profile.telephone}>
        Continuer <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}
