import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Plus, Scan, BarChart3, ExternalLink, Pencil, Download, Trash2, QrCode, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAgents } from "@/data/mockData";
import CreateAgentDialog from "./CreateAgentDialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export function AgentCard({
  agent,
  onDelete,
}: {
  agent: (typeof mockAgents)[0];
  onDelete?: (id: string) => void;
}) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const specialtyColors: Record<string, { bg: string; text: string }> = {
    SKINCARE: { bg: "#F9D4E6", text: "#D946EF" },
    HAIRCARE: { bg: "#D4ECF9", text: "#0EA5E9" },
    PERRUQUES: { bg: "#D4F9E4", text: "#10B981" },
  };
  const colors = specialtyColors[agent.specialty] || { bg: "#F9D4E6", text: "#D946EF" };

  return (
    <Card className="bg-card rounded-2xl shadow-sm border w-full max-w-[260px]">
      <CardContent className="p-5 space-y-4">
        <div className="flex justify-center">
          <div className="bg-muted p-4 rounded-xl flex items-center justify-center w-32 h-32">
            <QrCode className="h-20 w-20 text-muted-foreground/30" />
          </div>
        </div>

        <div className="flex justify-center">
          <span
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ backgroundColor: colors.bg, color: colors.text }}
          >
            {agent.specialty} · {agent.productMode === "SOLO" ? "Solo" : "Multi"}
          </span>
        </div>

        <div className="text-center">
          <h3 className="text-base font-bold krona text-foreground leading-tight">
            {agent.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{agent.expertName}</p>
        </div>

        <div className="flex justify-center">
          {agent.isActive ? (
            <span className="flex items-center gap-1 text-xs font-medium" style={{ color: "#10B981" }}>
              <CheckCircle className="h-3 w-3" /> Actif
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
              <XCircle className="h-3 w-3" /> Inactif
            </span>
          )}
        </div>

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

        <div className="bg-muted/50 rounded-lg py-2 text-center">
          <p className="text-xs text-muted-foreground">
            {agent.productCount} produit{agent.productCount > 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="rounded-xl text-xs h-8" onClick={() => navigate(`/agent/${agent.id}`)}>
            <ExternalLink className="h-3 w-3 mr-1" /> Tester
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl text-xs h-8" onClick={() => navigate(`/edit-agent/${agent.id}`)}>
            <Pencil className="h-3 w-3 mr-1" /> Éditer
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl text-xs h-8" onClick={() => toast({ title: "QR Code téléchargé" })}>
            <Download className="h-3 w-3 mr-1" /> QR Code
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl text-xs h-8 text-destructive hover:text-destructive" onClick={() => onDelete?.(agent.id)}>
            <Trash2 className="h-3 w-3 mr-1" /> Effacer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AgentsPage() {
  const [agents, setAgents] = useState(mockAgents);
  const [createOpen, setCreateOpen] = useState(false);

  const handleDelete = (id: string) => {
    setAgents((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl krona font-bold">Agents IA</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gérez vos agents IA spécialisés en beauté
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Créer un agent
        </Button>
      </motion.div>

      {agents.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-5"
        >
          {agents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <AgentCard agent={agent} onDelete={handleDelete} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Card className="clean-card">
          <CardContent className="text-center py-16">
            <Bot className="h-14 w-14 mx-auto text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun agent créé</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
              Créez votre premier agent IA pour analyser les besoins beauté de vos clients
            </p>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Créer votre premier agent
            </Button>
          </CardContent>
        </Card>
      )}

      <CreateAgentDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
