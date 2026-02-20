import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  Send,
  Loader2,
  Sparkles,
  Bot,
  User,
  CheckCircle,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { mockAgents } from "@/data/mockData";

type Step = "upload" | "lead" | "analyzing" | "result" | "chat";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const ANALYSIS_STEPS = [
  "Analyse de l'image en cours...",
  "Détection du type de peau...",
  "Évaluation de l'hydratation...",
  "Génération des recommandations...",
  "Finalisation du diagnostic...",
];

const MOCK_DIAGNOSIS = `## Diagnostic personnalisé

**Type de peau :** Mixte à tendance grasse

**État actuel :**
- Zone T légèrement grasse
- Joues bien hydratées
- Quelques imperfections visibles

**Recommandations :**
1. **Nettoyage** : Utilisez un gel nettoyant doux matin et soir
2. **Hydratation** : Sérum léger à l'acide hyaluronique
3. **Protection** : SPF 30 minimum chaque matin

**Produits conseillés pour vous :**
- Sérum Éclat Vitamine C — pour uniformiser le teint
- Gel Nettoyant Doux — pour purifier sans agresser`;

export default function PublicAgentPage() {
  const { agentId } = useParams<{ agentId: string }>();
  const [step, setStep] = useState<Step>("upload");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [lead, setLead] = useState({ firstName: "", email: "", consent: false });
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const agent = mockAgents.find((a) => a.id === agentId) || mockAgents[0];

  const handleFileSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFileSelect(file);
  };

  const startAnalysis = () => {
    setStep("analyzing");
    let progress = 0;
    let stepIndex = 0;

    const interval = setInterval(() => {
      progress += 2;
      setAnalysisProgress(progress);

      const newStepIndex = Math.floor((progress / 100) * ANALYSIS_STEPS.length);
      if (newStepIndex !== stepIndex && newStepIndex < ANALYSIS_STEPS.length) {
        stepIndex = newStepIndex;
        setCurrentAnalysisStep(newStepIndex);
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setStep("result");
          setMessages([
            {
              id: "1",
              role: "assistant",
              content: MOCK_DIAGNOSIS,
            },
          ]);
        }, 500);
      }
    }, 50);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Excellente question ! En fonction de votre diagnostic, je vous recommande d'utiliser le Sérum Éclat Vitamine C matin après le nettoyage. Il aidera à uniformiser votre teint et à réduire les imperfections. Avez-vous d'autres questions ?",
      };
      setMessages((prev) => [...prev, reply]);
      setIsThinking(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 max-w-md w-full"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <img
            src="https://biolystes.com/wp-content/uploads/2024/06/cropped-IMG_0262-1024x1024-1-1.png"
            alt="Biolystes"
            className="h-10 w-10 rounded-xl object-contain"
          />
          <span className="font-bold text-xl pacifico">Biolystes AI</span>
        </div>
        <h1 className="text-xl krona font-bold">{agent.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          par {agent.expertName}
        </p>
      </motion.div>

      <div className="w-full max-w-md space-y-4">
        {/* Step: Upload */}
        {step === "upload" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              {previewUrl ? (
                <div className="space-y-3">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-xl mx-auto"
                  />
                  <p className="text-sm text-muted-foreground">
                    Photo sélectionnée — cliquez pour changer
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                    <Camera className="h-8 w-8 text-primary/50" />
                  </div>
                  <div>
                    <p className="font-medium">Uploadez votre photo</p>
                    <p className="text-sm text-muted-foreground">
                      Glissez-déposez ou cliquez pour sélectionner
                    </p>
                  </div>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
            </div>

            <Button
              className="w-full h-12 rounded-xl"
              disabled={!previewUrl}
              onClick={() => setStep("lead")}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Analyser ma photo
            </Button>
          </motion.div>
        )}

        {/* Step: Lead capture */}
        {step === "lead" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground">
                Recevez votre analyse personnalisée par email (optionnel)
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  placeholder="Votre prénom"
                  value={lead.firstName}
                  onChange={(e) => setLead({ ...lead, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={lead.email}
                  onChange={(e) => setLead({ ...lead, email: e.target.value })}
                />
              </div>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="consent"
                  checked={lead.consent}
                  onCheckedChange={(v) => setLead({ ...lead, consent: !!v })}
                />
                <label htmlFor="consent" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                  J'accepte de recevoir des conseils personnalisés et des recommandations produits par email
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Button className="w-full h-12 rounded-xl" onClick={startAnalysis}>
                <Sparkles className="h-4 w-4 mr-2" />
                Lancer l'analyse IA
              </Button>
              <Button variant="ghost" className="w-full" onClick={startAnalysis}>
                Continuer sans laisser mes coordonnées
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step: Analyzing */}
        {step === "analyzing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6 py-8"
          >
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-border" />
              <div
                className="absolute inset-0 rounded-full border-4 border-primary transition-all duration-200"
                style={{
                  clipPath: `inset(0 ${100 - analysisProgress}% 0 0 round 50%)`,
                  borderColor: "hsl(178 78% 47%)",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-primary animate-pulse" />
              </div>
            </div>

            <div>
              <p className="font-semibold">{analysisProgress}%</p>
              <p className="text-sm text-muted-foreground mt-1">
                {ANALYSIS_STEPS[currentAnalysisStep]}
              </p>
            </div>

            <div className="space-y-2 text-left max-w-xs mx-auto">
              {ANALYSIS_STEPS.map((stepLabel, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  {i < currentAnalysisStep ? (
                    <CheckCircle className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#10B981" }} />
                  ) : i === currentAnalysisStep ? (
                    <Loader2 className="h-3.5 w-3.5 flex-shrink-0 animate-spin text-primary" />
                  ) : (
                    <div className="h-3.5 w-3.5 rounded-full border border-border flex-shrink-0" />
                  )}
                  <span className={i <= currentAnalysisStep ? "text-foreground" : "text-muted-foreground"}>
                    {stepLabel}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step: Result & Chat */}
        {(step === "result" || step === "chat") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Messages */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === "assistant" ? "bg-primary text-primary-foreground" : "bg-secondary"
                  }`}>
                    {msg.role === "assistant" ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`flex-1 px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === "assistant"
                        ? "bg-card border border-border"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-card border border-border px-4 py-3 rounded-2xl">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Posez votre question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                className="rounded-xl"
              />
              <Button size="icon" className="rounded-xl flex-shrink-0" onClick={handleSend}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
