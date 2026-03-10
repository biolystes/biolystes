import { create } from "zustand";

export interface ProfileData {
  statut_juridique: "particulier" | "auto_entrepreneur" | "societe";
  civilite?: string;
  prenom: string;
  nom: string;
  date_naissance?: string;
  nationalite?: string;
  adresse: string;
  code_postal: string;
  ville: string;
  pays: string;
  email: string;
  telephone: string;
  // Société
  raison_sociale?: string;
  forme_juridique?: string;
  siege_social?: string;
  rcs_siret?: string;
  numero_tva?: string;
  representant_nom?: string;
  representant_qualite?: string;
}

export interface BrandData {
  brand_name: string;
  brand_description: string;
  inspiration_brands?: string;
}

export interface ProductItem {
  id: number;
  name: string;
  image?: string;
  price?: number;
}

export type PackType = "decouverte" | "agence" | "ia";

interface PackInfo {
  type: PackType;
  setup_price: number;
  monthly_price: number;
  monthly_name: string;
  label: string;
}

export const PACKS: Record<PackType, PackInfo> = {
  decouverte: { type: "decouverte", setup_price: 147, monthly_price: 0, monthly_name: "Aucun", label: "Découverte" },
  agence: { type: "agence", setup_price: 1499, monthly_price: 99, monthly_name: "PRO", label: "Agence" },
  ia: { type: "ia", setup_price: 2999, monthly_price: 149, monthly_name: "PRO IA", label: "IA" },
};

interface OnboardingState {
  currentStep: number;
  profile: ProfileData;
  brand: BrandData;
  products: ProductItem[];
  pack: PackType;
  contractId: string | null;
  contractSigned: boolean;

  setStep: (step: number) => void;
  setProfile: (data: Partial<ProfileData>) => void;
  setBrand: (data: Partial<BrandData>) => void;
  setProducts: (products: ProductItem[]) => void;
  setPack: (pack: PackType) => void;
  setContractId: (id: string) => void;
  setContractSigned: (signed: boolean) => void;
  canProceedTo: (step: number) => boolean;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  currentStep: 0,
  profile: {
    statut_juridique: "particulier",
    prenom: "",
    nom: "",
    adresse: "",
    code_postal: "",
    ville: "",
    pays: "France",
    email: "",
    telephone: "",
  },
  brand: { brand_name: "", brand_description: "" },
  products: [],
  pack: "decouverte",
  contractId: null,
  contractSigned: false,

  setStep: (step) => set({ currentStep: step }),
  setProfile: (data) => set((s) => ({ profile: { ...s.profile, ...data } })),
  setBrand: (data) => set((s) => ({ brand: { ...s.brand, ...data } })),
  setProducts: (products) => set({ products }),
  setPack: (pack) => set({ pack }),
  setContractId: (id) => set({ contractId: id }),
  setContractSigned: (signed) => set({ contractSigned: signed }),

  canProceedTo: (step) => {
    const s = get();
    if (step <= 0) return true;
    if (step >= 1) {
      const p = s.profile;
      if (!p.prenom || !p.nom || !p.email || !p.telephone) return false;
    }
    if (step >= 2) {
      if (!s.brand.brand_name) return false;
    }
    if (step >= 3) {
      if (s.products.length < 1) return false;
    }
    if (step >= 5) {
      if (!s.contractSigned) return false;
    }
    return true;
  },
}));
