import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot, QrCode, BarChart3, Users2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAgents, mockDashboardStats } from "@/data/mockData";
import { AgentCard } from "./AgentsPage";
import CreateAgentDialog from "./CreateAgentDialog";

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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <StatCard key={stat.label} {...stat} delay={i * 0.1} />
        ))}
      </div>

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
          <div className="flex flex-wrap gap-5">
            {mockAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </CardContent>
      </Card>

      <CreateAgentDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
