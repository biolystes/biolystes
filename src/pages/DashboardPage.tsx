import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bot,
  Package,
  Clock,
  ArrowRight,
  Paperclip,
  ImageIcon,
  Send,
  QrCode,
  BarChart3,
  Scan,
  ExternalLink,
  Pencil,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { mockAgents, mockProducts } from "@/data/mockData";
import CreateAgentDialog from "./CreateAgentDialog";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

// Question cards exactly like the screenshot
const questionCards = [
  {
    question: "Comment créer un agent IA pour conseiller mes clients beauté ?",
    icon: Bot,
  },
  {
    question: "Comment générer et partager les QR codes de mes agents ?",
    icon: ImageIcon,
  },
  {
    question: "Peut-on voir les diagnostics et leads collectés par agent ?",
    icon: Clock,
  },
  {
    question: "Comment intégrer mes produits WooCommerce à mes agents IA ?",
    icon: ArrowRight,
  },
];

function AgentMiniCard({ agent }: { agent: (typeof mockAgents)[0] }) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const specialtyColors: Record<string, { bg: string; text: string }> = {
    SKINCARE: { bg: "#F9D4E6", text: "#D946EF" },
    HAIRCARE: { bg: "#D4ECF9", text: "#0EA5E9" },
    PERRUQUES: { bg: "#D4F9E4", text: "#10B981" },
  };
  const colors = specialtyColors[agent.specialty] || { bg: "#F9D4E6", text: "#D946EF" };

  return (
    <div className="clean-card p-4 flex flex-col gap-3">
      {/* QR placeholder */}
      <div className="bg-muted rounded-xl flex items-center justify-center w-full aspect-square max-h-28">
        <QrCode className="h-14 w-14 text-muted-foreground/25" />
      </div>

      {/* Badge */}
      <div className="flex justify-center">
        <span
          className="px-2.5 py-0.5 rounded-full text-xs font-bold"
          style={{ backgroundColor: colors.bg, color: colors.text }}
        >
          {agent.specialty}
        </span>
      </div>

      {/* Name */}
      <h3 className="text-sm font-bold krona text-foreground text-center leading-tight">{agent.name}</h3>

      {/* Status */}
      <div className="flex justify-center">
        {agent.isActive ? (
          <span className="flex items-center gap-1 text-xs font-medium" style={{ color: "#10B981" }}>
            <CheckCircle size={11} /> Actif
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <XCircle size={11} /> Inactif
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-1.5">
        <div className="stat-bg rounded-lg p-2 text-center">
          <p className="text-base font-bold">{agent.scanCount}</p>
          <p className="text-xs text-muted-foreground">Scans</p>
        </div>
        <div className="stat-bg rounded-lg p-2 text-center">
          <p className="text-base font-bold">{agent.analysesCount}</p>
          <p className="text-xs text-muted-foreground">Analyses</p>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-1.5">
        <button
          onClick={() => navigate(`/agent/${agent.id}`)}
          className="flex items-center justify-center gap-1 text-xs bg-card border border-border rounded-lg py-1.5 hover:bg-accent transition-colors"
        >
          <ExternalLink size={11} /> Tester
        </button>
        <button
          onClick={() => navigate(`/edit-agent/${agent.id}`)}
          className="flex items-center justify-center gap-1 text-xs bg-card border border-border rounded-lg py-1.5 hover:bg-accent transition-colors"
        >
          <Pencil size={11} /> Éditer
        </button>
        <button
          onClick={() => toast({ title: "QR téléchargé" })}
          className="flex items-center justify-center gap-1 text-xs bg-card border border-border rounded-lg py-1.5 hover:bg-accent transition-colors"
        >
          <Download size={11} /> QR Code
        </button>
        <button
          className="flex items-center justify-center gap-1 text-xs bg-card border border-border rounded-lg py-1.5 hover:bg-accent transition-colors text-destructive"
        >
          <Trash2 size={11} /> Effacer
        </button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [chatInput, setChatInput] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const { toast } = useToast();

  const handleSend = () => {
    if (chatInput.trim()) {
      toast({ title: "Message envoyé", description: chatInput });
      setChatInput("");
    }
  };

  const handleQuestionClick = (q: string) => {
    setChatInput(q);
  };

  return (
    <div className="space-y-8">
      {/* Greeting + title */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-2xl font-bold text-foreground mb-1">
          Bonjour 👋
        </p>
        <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
          <span className="text-foreground">Envie de gérer vos </span>
          <span className="title-gradient">agents IA beauté ?</span>
        </h1>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed max-w-xl">
          Créez vos agents IA spécialisés, générez des QR codes, analysez les photos de vos clients et collectez des leads qualifiés.
        </p>
      </motion.div>

      {/* Question cards — 4 columns like the screenshot */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {questionCards.map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="question-card flex flex-col justify-between gap-4"
            onClick={() => handleQuestionClick(card.question)}
          >
            <p className="text-sm font-medium text-foreground leading-snug">
              {card.question}
            </p>
            <div className="flex justify-end">
              <card.icon size={18} className="text-muted-foreground/60" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Chat input — exactly like the screenshot */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="chat-wrap flex items-center gap-3"
      >
        <input
          className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
          placeholder="Posez vos questions ou décrivez ce que vous souhaitez créer..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Paperclip size={14} />
          </button>
          <button
            className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <ImageIcon size={14} />
          </button>
          <button
            onClick={handleSend}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
            style={{ background: "hsl(var(--chat-send-bg))", color: "hsl(var(--primary-foreground))" }}
          >
            <Send size={14} />
          </button>
        </div>
      </motion.div>

      {/* Agents grid — like product grid in screenshot */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Vos agents IA
          </h2>
          <button
            onClick={() => setCreateOpen(true)}
            className="text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 hover:bg-accent transition-colors flex items-center gap-1.5"
          >
            <Bot size={12} />
            Créer un agent
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockAgents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
            >
              <AgentMiniCard agent={agent} />
            </motion.div>
          ))}

          {/* Add new agent card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + mockAgents.length * 0.08 }}
            className="clean-card p-4 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-accent/30 transition-colors min-h-[200px] border-dashed"
            onClick={() => setCreateOpen(true)}
          >
            <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center">
              <Bot size={18} className="text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Nouvel agent</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Cliquez pour créer</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <CreateAgentDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
