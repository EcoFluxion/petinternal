import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic tokens — switch with the .dark class (defined in globals.css)
        paper: "rgb(var(--color-paper) / <alpha-value>)",
        cream: "rgb(var(--color-cream) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        hairline: "rgb(var(--color-hairline) / <alpha-value>)",
        // Signature sage-forest green (derived from the logo). `brand` is themed;
        // the numeric scale is fixed for elements that must stay green in both modes.
        brand: {
          DEFAULT: "rgb(var(--color-brand) / <alpha-value>)",
          fg: "rgb(var(--color-brand-fg) / <alpha-value>)",
          50: "#f1f6f2",
          100: "#ddebe1",
          200: "#bdd8c6",
          300: "#92bda3",
          400: "#639d7d",
          500: "#437f60",
          600: "#2f6b4f",
          700: "#275640",
          800: "#214636",
          900: "#1c3a2d",
          950: "#0f2018",
        },
        // Warm secondary, lifted from the logo's butter tone — used sparingly.
        gold: "#c2843c",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "72rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(20,30,24,0.04), 0 10px 26px -14px rgba(20,45,32,0.18)",
        card: "0 1px 3px rgba(20,30,24,0.05), 0 14px 34px -18px rgba(20,45,32,0.22)",
        lift: "0 22px 52px -24px rgba(18,48,34,0.32)",
      },
      transitionTimingFunction: {
        gentle: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
