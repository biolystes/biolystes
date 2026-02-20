import { motion } from "framer-motion";
import { Settings, Store, Key, Bell, User, ChevronRight, Globe, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl krona font-bold">Réglages</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configurez votre compte et intégrations
        </p>
      </motion.div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="clean-card">
          <CardHeader>
            <CardTitle className="text-sm krona flex items-center gap-2">
              <User className="h-4 w-4" /> Profil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Nom de la marque</Label>
                <Input placeholder="Biolystes" defaultValue="Biolystes" />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input placeholder="admin@biolystes.com" defaultValue="admin@biolystes.com" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Site web</Label>
              <Input placeholder="https://biolystes.com" defaultValue="https://biolystes.com" />
            </div>
            <Button onClick={() => toast({ title: "Profil sauvegardé" })}>
              Sauvegarder
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* WooCommerce */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="clean-card">
          <CardHeader>
            <CardTitle className="text-sm krona flex items-center gap-2">
              <Store className="h-4 w-4" /> Intégration WooCommerce
            </CardTitle>
            <CardDescription>Synchronisez votre catalogue produits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>URL du store</Label>
              <Input placeholder="https://votre-boutique.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Consumer Key</Label>
                <Input placeholder="ck_..." type="password" />
              </div>
              <div className="space-y-1.5">
                <Label>Consumer Secret</Label>
                <Input placeholder="cs_..." type="password" />
              </div>
            </div>
            <Button onClick={() => toast({ title: "Connexion testée avec succès" })}>
              Tester la connexion
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="clean-card">
          <CardHeader>
            <CardTitle className="text-sm krona flex items-center gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Nouveau lead collecté", desc: "Recevez un email à chaque nouveau lead" },
              { label: "Rapport hebdomadaire", desc: "Résumé des performances de vos agents" },
              { label: "Mises à jour produit", desc: "Nouvelles fonctionnalités et améliorations" },
            ].map((notif) => (
              <div key={notif.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{notif.label}</p>
                  <p className="text-xs text-muted-foreground">{notif.desc}</p>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
