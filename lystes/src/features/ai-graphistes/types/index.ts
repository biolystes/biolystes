export interface AIGraphiste {
  id: string;
  name: string;
  specialty: string;
  type: string;
  title: string;
  avatar: string;
  sampleImages: string[];
  sectorKey: "ads" | "packaging" | "branding" | "social" | "print" | "editorial";
  edgeFunction?: string;
  /** Prompts réels par position, alignés sur `sampleImages` (même ordre). */
  promptsPortfolio?: string[];
}
