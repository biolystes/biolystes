import { motion } from "framer-motion";
import { FileText, Scan, Brain, MessageSquare, Users2, QrCode } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockAgents } from "@/data/mockData";

const mockDiagnostics = [
  {
    id: "diag-1",
    agentName: "Coach Skincare Pro",
    userFirstName: "Marie",
    skinType: "Mixte à tendance grasse",
    result: "Peau bien hydratée, légère brillance en zone T",
    productsRecommended: 3,
    createdAt: "2024-02-24",
    hasLead: true,
  },
  {
    id: "diag-2",
    agentName: "Diagnostiqueur Haircare",
    userFirstName: "Aïcha",
    skinType: "Cheveux texturés — Type 4C",
    result: "Cheveux secs en pointes, besoin de nourrissement intense",
    productsRecommended: 2,
    createdAt: "2024-02-23",
    hasLead: true,
  },
  {
    id: "diag-3",
    agentName: "Coach Skincare Pro",
    userFirstName: "Anonyme",
    skinType: "Peau sèche",
    result: "Manque d'hydratation, quelques rougeurs",
    productsRecommended: 4,
    createdAt: "2024-02-22",
    hasLead: false,
  },
];

export default function DiagnosticsPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl krona font-bold">Diagnostics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Historique des analyses IA effectuées par vos agents
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total diagnostics", value: "183", icon: Brain },
          { label: "Avec lead", value: "62", icon: Users2 },
          { label: "Recommandations", value: "412", icon: QrCode },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="clean-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-primary/5 rounded-lg border border-border">
                  <stat.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xl font-bold krona">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        {mockDiagnostics.map((diag, i) => (
          <motion.div
            key={diag.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Card className="clean-card hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold">{diag.userFirstName}</span>
                      <Badge variant="outline" className="text-xs">{diag.agentName}</Badge>
                      {diag.hasLead && (
                        <Badge className="text-xs bg-emerald-100 text-emerald-700 border-0">
                          Lead
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">{diag.skinType}</p>
                    <p className="text-sm">{diag.result}</p>
                  </div>
                  <div className="text-right flex-shrink-0 space-y-2">
                    <p className="text-xs text-muted-foreground">
                      {new Date(diag.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <QrCode className="h-3 w-3" />
                      {diag.productsRecommended} produits
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
