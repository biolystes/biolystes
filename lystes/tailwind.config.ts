/* Thème de lystes.ai, recopié tel quel (petal-diagnostics, tailwind.config.ts)
   pour la page d’accueil reprise de lystes.ai/bio. Ne sert qu’aux fichiers de
   lystes/ et aux pages Actus (src/actus, affichées sous `.lystes-racine`) :
   voir @config en tête de lystes/src/index.css. Sans src/actus ici, leurs
   classes ne sortent que du thème du site, cantonné hors `.lystes-racine`
   (postcss.config.js), et ne s’appliquent pas (13/10/2026 : étiquette de
   catégorie sans fond noir sur /blog). */
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./lystes/src/**/*.{ts,tsx,html}", "./src/actus/**/*.{ts,tsx}", "./src/components/innovation/**/*.{ts,tsx}", "./src/components/avis/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1120px",
      },
    },
    extend: {
      fontSize: {
        xs: ["12px", { lineHeight: "1.4" }],
        sm: ["14px", { lineHeight: "1.5" }],
        base: ["16px", { lineHeight: "1.5" }],
        lg: ["18px", { lineHeight: "1.5" }],
        xl: ["20px", { lineHeight: "1.3" }],
        "2xl": ["24px", { lineHeight: "1.3" }],
        "3xl": ["28px", { lineHeight: "1.2" }],
        "4xl": ["32px", { lineHeight: "1.1" }],
      },
      fontFamily: {
        display: ["Satoshi", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        body: ["Satoshi", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        sans: ["Satoshi", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        /* 27/08/2026 (JP) : plus de serif d'affichage. Toute classe
           `font-serif` rend desormais la police du produit. */
        serif: ["Inter", "Satoshi", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      colors: {
        cream: "#f5f4df",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          success: "hsl(var(--accent-success))",
          warning: "hsl(var(--accent-warning))",
          info: "hsl(var(--accent-info))",
          danger: "hsl(var(--accent-danger))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Chart colors
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        // Apple Design System colors
        apple: {
          black: "hsl(var(--color-black))",
          "gray-dark": "hsl(var(--color-gray-dark))",
          "gray-medium": "hsl(var(--color-gray-medium))",
          "gray-light": "hsl(var(--color-gray-light))",
          white: "hsl(var(--color-white))",
        },
        // Design Minis (/design) — jetons repris verbatim de la feuille de
        // style du site source. Namespacés `dm-` pour ne rien croiser avec le
        // thème shadcn de lystes.ai. Valeurs littérales (pas de var CSS) pour
        // que les modificateurs d'opacité type `bg-dm-ink/85` fonctionnent.
        dm: {
          bg: "oklch(100% 0 0)",
          ink: "oklch(24% 0.008 250)",
          muted: "oklch(58% 0.008 250)",
          faint: "oklch(70% 0.008 250)",
          surface: "oklch(96.6% 0.0015 250)",
          "surface-hover": "oklch(95.2% 0.002 250)",
          raised: "oklch(100% 0 0)",
          line: "oklch(92% 0.003 250)",
        },
        // GloowUp aliases (mapped to Apple palette)
        gloowup: {
          bg: "hsl(var(--color-white))",
          "bg-alt": "hsl(var(--color-gray-light))",
          dark: "hsl(var(--color-black))",
          "dark-soft": "hsl(0 0% 18%)",
          text: "hsl(var(--color-black))",
          "text-muted": "hsl(var(--color-gray-dark))",
          white: "hsl(var(--color-white))",
          "gray-100": "hsl(var(--color-gray-light))",
          "gray-200": "hsl(var(--color-gray-medium))",
          "gray-300": "hsl(var(--color-gray-dark))",
          "gray-400": "hsl(var(--color-gray-dark))",
        },
      },
      borderRadius: {
        lg: "12px",
        md: "10px",
        sm: "8px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
        card: "20px",
        btn: "12px",
        tag: "20px",
      },
      spacing: {
        "30": "7.5rem",
      },
      maxWidth: {
        "3xl": "1022px",
      },
      boxShadow: {
        // NO SHADOWS - Apple design uses borders instead
        none: "none",
        sm: "none",
        DEFAULT: "none",
        md: "none",
        lg: "none",
        xl: "none",
        "2xl": "none",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-4px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(4px)" },
        },
        "highlight-error": {
          "0%, 100%": { boxShadow: "0 0 0 2px hsl(var(--destructive) / 0.3)" },
          "50%": { boxShadow: "0 0 0 4px hsl(var(--destructive) / 0.4)" },
        },
        "slide-out-left": {
          from: { opacity: "1", transform: "translateX(0)" },
          to: { opacity: "0", transform: "translateX(-30px)" },
        },
        "slide-in-from-right": {
          from: { opacity: "0", transform: "translateX(30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "fade-out-down": {
          from: { opacity: "1", transform: "translateY(0)" },
          to: { opacity: "0", transform: "translateY(20px)" },
        },
        "pulse-subtle": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
        },
        "scan": {
          "0%": { top: "0%" },
          "50%": { top: "100%" },
          "100%": { top: "0%" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "typing-dot": {
          "0%, 60%, 100%": { transform: "translateY(0)", opacity: "0.4" },
          "30%": { transform: "translateY(-3px)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "shake": "shake 0.5s ease-in-out",
        "highlight-error": "highlight-error 0.8s ease-in-out infinite",
        "slide-out-left": "slide-out-left 0.3s ease-out forwards",
        "slide-in-from-right": "slide-in-from-right 0.4s ease-out forwards",
        "fade-out-down": "fade-out-down 0.3s ease-out forwards",
        "pulse-subtle": "pulse-subtle 2.5s ease-in-out infinite",
        "scan": "scan 3s ease-in-out infinite",
        "float": "float 4s ease-in-out infinite",
        "spin-slow": "spin-slow 5s linear infinite",
        "marquee": "marquee 40s linear infinite",
        "typing-dot": "typing-dot 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
