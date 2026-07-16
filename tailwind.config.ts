import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand = deep navy (from the WinDrop logo wordmark).
        // `brand` and `navy` are aliases so existing brand-* classes pick up
        // the new navy without renaming.
        brand: {
          50: "#eef1f7",
          100: "#d6dded",
          200: "#b0bfda",
          300: "#8298c1",
          400: "#5570a3",
          500: "#365286",
          600: "#263e6b",
          700: "#1c2f54",
          800: "#0f1d3a",
          900: "#0a1430",
        },
        navy: {
          50: "#eef1f7",
          100: "#d6dded",
          200: "#b0bfda",
          300: "#8298c1",
          400: "#5570a3",
          500: "#365286",
          600: "#263e6b",
          700: "#1c2f54",
          800: "#0f1d3a",
          900: "#0a1430",
        },
        // Accent = warm gold (from the logo mark).
        gold: {
          50: "#fbf7ea",
          100: "#f5eac6",
          200: "#ecd58c",
          300: "#e3c15a",
          400: "#d9ac33",
          500: "#c69326",
          600: "#a5761f",
          700: "#82591c",
          800: "#6b481d",
          900: "#5b3d1c",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "pop-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "gradient-pan": "gradient-pan 6s ease infinite",
        "pop-in": "pop-in 0.25s ease-out",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
