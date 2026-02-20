import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bot,
  QrCode,
  BarChart3,
  Users2,
  Plus,
  Scan,
  ExternalLink,
  Pencil,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockAgents, mockDashboardStats } from "@/data/mockData";
import CreateAgentDialog from "./CreateAgentDialog";
import { useToast } from "@/components/ui/use-toast";

function StatCard({
  label,
  value,
  icon: Icon,
  delay,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card className="clean-card">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="p-3 bg-primary/5 rounded-xl border border-border">
            <Icon className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold krona">{value.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function AgentCard({
  agent,
  onDelete,
}: {
  agent: (typeof mockAgents)[0];
  onDelete?: (id: string) => void;
}) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const specialtyColors: Record<string, string> = {
    SKINCARE: "#F9D4E6",
    HAIRCARE: "#D4ECF9",
    PERRUQUES: "#D4F9E4",
  };
  const specialtyTextColors: Record<string, string> = {
    SKINCARE: "#D946EF",
    HAIRCARE: "#0EA5E9",
    PERRUQUES: "#10B981",
  };

  const bg = specialtyColors[agent.specialty] || "#F9D4E6";
  const textColor = specialtyTextColors[agent.specialty] || "#D946EF";

  return (
    <Card className="bg-card rounded-2xl shadow-sm border w-full max-w-[260px]">
      <CardContent className="p-5 space-y-4">
        {/* QR placeholder */}
        <div className="flex justify-center">
          <div className="bg-muted p-4 rounded-xl flex items-center justify-center w-32 h-32">
            <QrCode className="h-20 w-20 text-muted-foreground/40" />
          </div>
        </div>

        {/* Badge */}
        <div className="flex justify-center">
          <span
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ backgroundColor: bg, color: textColor }}
          >
            {agent.specialty} · {agent.productMode === "SOLO" ? "Solo" : "Multi"}
          </span>
        </div>

        {/* Name */}
        <div className="text-center">
          <h3 className="text-base font-bold krona text-foreground leading-tight">
            {agent.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{agent.expertName}</p>
        </div>

        {/* Status */}
        <div className="flex justify-center">
          {agent.isActive ? (
            <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <CheckCircle className="h-3 w-3" /> Actif
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
              <XCircle className="h-3 w-3" /> Inactif
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="stat-bg rounded-xl p-3 text-center">
            <Scan className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
            <p className="text-xl font-bold">{agent.scanCount}</p>
            <p className="text-xs text-muted-foreground">Scans</p>
          </div>
          <div className="stat-bg rounded-xl p-3 text-center">
            <BarChart3 className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
            <p className="text-xl font-bold">{agent.analysesCount}</p>
            <p className="text-xs text-muted-foreground">Analyses</p>
          </div>
        </div>

        {/* Products count */}
        <div className="bg-muted/50 rounded-lg py-2 text-center">
          <p className="text-xs text-muted-foreground">
            {agent.productCount} produit{agent.productCount > 1 ? "s" : ""}
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl text-xs h-8"
            onClick={() => navigate(`/agent/${agent.id}`)}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Tester
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl text-xs h-8"
            onClick={() => navigate(`/edit-agent/${agent.id}`)}
          >
            <Pencil className="h-3 w-3 mr-1" />
            Éditer
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl text-xs h-8"
            onClick={() => toast({ title: "QR Code téléchargé" })}
          >
            <Download className="h-3 w-3 mr-1" />
            QR Code
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl text-xs h-8 text-destructive hover:text-destructive"
            onClick={() => onDelete?.(agent.id)}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Effacer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [createOpen, setCreateOpen] = useState(false);

  const statCards = [
    { label: "Agents créés", value: mockDashboardStats.agentsCreated, icon: Bot },
    { label: "QR codes scannés", value: mockDashboardStats.qrCodesScanned, icon: QrCode },
    { label: "Analyses IA", value: mockDashboardStats.analysesCompleted, icon: BarChart3 },
    { label: "Leads collectés", value: mockDashboardStats.leadsCollected, icon: Users2 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl krona font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Vue d'ensemble de vos agents IA et performances
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Créer un agent
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <StatCard key={stat.label} {...stat} delay={i * 0.1} />
        ))}
      </div>

      {/* Recent Agents */}
      <Card className="clean-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base krona">Agents récents</CardTitle>
          <Link to="/agents">
            <Button variant="ghost" size="sm" className="text-xs">
              Voir tous →
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {mockAgents.length > 0 ? (
            <div className="flex flex-wrap gap-5">
              {mockAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Aucun agent créé</p>
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer votre premier agent
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateAgentDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
