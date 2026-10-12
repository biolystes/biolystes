import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@lystes/components/ui/tooltip";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Indicator {
  indicator: string;
  score: number;
  interpretation: string;
}

interface IndicatorsRadarChartProps {
  indicators: Indicator[];
  diagnosticType?: "skin" | "hair";
  /**
   * Libellés imposés, pour les contextes qui ne passent pas par i18n (la modale
   * de démonstration /shot est rédigée en français en dur : sans ça, l'en-tête
   * du radar repassait en anglais selon la langue détectée du navigateur).
   */
  title?: string;
  badge?: string;
}

// Mapping des noms d'indicateurs pour des labels plus courts
const shortLabels: Record<string, string> = {
  // Peau
  "Hydratation": "Hydrat.",
  "Sébum": "Sébum",
  "Élasticité": "Élastic.",
  "Pores": "Pores",
  "Pigmentation": "Pigment.",
  "Rougeurs": "Rougeurs",
  "Brillance": "Brillance",
  "Densité": "Densité",
  "Cuir chevelu": "Cuir ch.",
  // Cheveux
  "Définition des boucles": "Définit.",
  "Frisottis": "Frisottis",
  "Porosité": "Porosité",
  "Sécheresse": "Sécher.",
  "Éclat": "Éclat",
  "Volume": "Volume",
  "Santé du cuir chevelu": "Cuir ch.",
  "Texture": "Texture",
  "Hydration": "Hydrat.",
  "Curl definition": "Définit.",
  "Frizz": "Frisottis",
  "Porosity": "Porosité",
  "Dryness": "Sécher.",
  "Shine": "Éclat",
  "Scalp health": "Cuir ch.",
};

function getShortLabel(name: string): string {
  return shortLabels[name] || (name.length > 10 ? name.substring(0, 8) + "..." : name);
}

// Repli si le modèle IA renvoie malgré tout un indicateur en anglais
// (voir prompt système : indicator.indicator doit rester en français).
const fullLabels: Record<string, string> = {
  "Hydration": "Hydratation",
  "Curl definition": "Définition des boucles",
  "Frizz": "Frisottis",
  "Porosity": "Porosité",
  "Dryness": "Sécheresse",
  "Shine": "Éclat",
  "Scalp health": "Santé du cuir chevelu",
};

export function normalizeIndicatorLabel(name: string): string {
  return fullLabels[name] || name;
}

export function IndicatorsRadarChart({
  indicators,
  diagnosticType = "skin",
  title,
  badge,
}: IndicatorsRadarChartProps) {
  const { t } = useTranslation();
  
  if (!indicators || indicators.length === 0) return null;

  // Préparer les données pour le radar
  const radarData = indicators.map((ind) => ({
    name: getShortLabel(ind.indicator),
    fullName: normalizeIndicatorLabel(ind.indicator),
    score: Math.round(ind.score),
    interpretation: ind.interpretation,
  }));

  // Titre adaptatif selon le type de diagnostic
  const profileTitle =
    title ??
    (diagnosticType === "hair"
      ? t("agent.results.hairProfile", "Profil capillaire")
      : t("agent.results.skinProfile", "Profil cutané"));

  return (
    <div className="apple-card bg-card rounded-[20px] border border-border overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border flex justify-between items-center">
        <h3 className="apple-card-title font-semibold text-[17px] text-foreground tracking-tight">
          {profileTitle}
        </h3>
        <span className="bg-muted text-muted-foreground text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
          {badge ?? t("agent.results.aiAnalysis", "Analyse IA")}
        </span>
      </div>

      {/* Radar Chart */}
      <div className="p-5">
        <div className="h-[220px] w-full animate-scale-in">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid 
                stroke="hsl(var(--border))" 
                strokeOpacity={0.5}
              />
              <PolarAngleAxis 
                dataKey="name" 
                tick={{ 
                  fill: "hsl(var(--foreground))", 
                  fontSize: 11,
                  fontWeight: 500
                }}
                tickLine={false}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]}
                tick={{ 
                  fill: "hsl(var(--muted-foreground))", 
                  fontSize: 10 
                }}
                tickCount={5}
                axisLine={false}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="hsl(var(--foreground))"
                fill="hsl(var(--foreground))"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Légende en grille 2 colonnes avec tooltips */}
        <TooltipProvider delayDuration={200}>
          <div className="grid grid-cols-2 gap-2.5 mt-5">
            {radarData.map((item, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-xl cursor-pointer hover:bg-muted transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'backwards' }}
                  >
                    <div className="flex items-center gap-1.5 truncate mr-2">
                      <span className="text-[13px] font-medium text-foreground truncate">
                        {item.fullName}
                      </span>
                      <Info className="h-3 w-3 text-muted-foreground shrink-0" />
                    </div>
                    <span className="text-[13px] font-semibold text-foreground shrink-0">
                      {item.score}%
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px]">
                  <p className="text-sm font-medium">{item.fullName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.interpretation}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}

// Export avec l'ancien nom pour rétro-compatibilité
export { IndicatorsRadarChart as ConcernsRadarChart };
