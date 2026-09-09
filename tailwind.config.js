/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          bg: "#fbfbfd",
          surface: "#ffffff",
          text: "#1d1d1f",
          secondary: "#86868b",
          blue: "#0071e3",
          cyan: "#0ea5e9",
          indigo: "#6366f1",
          purple: "#a855f7",
          rose: "#f43f5e",
          emerald: "#10b981",
        },
      },
      fontFamily: {
        display: [
          "Montserrat",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        sans: [
          "Montserrat",
          "-apple-system",
          "BlinkMacSystemFont",
          "Inter",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "SF Mono",
          "Menlo",
          "monospace",
        ],
        serif: [
          "Playfair Display",
          "Didot",
          "serif",
        ],
        handwriting: [
          "Caveat",
          "cursive",
        ],
      },
      boxShadow: {
        "apple-glass": "0 25px 50px -12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.9)",
        "apple-glow-blue": "0 0 35px -5px rgba(0, 113, 227, 0.45)",
        "apple-glow-cyan": "0 0 35px -5px rgba(14, 165, 233, 0.45)",
        "apple-glow-rose": "0 0 35px -5px rgba(244, 63, 94, 0.45)",
      },
    },
  },
  plugins: [],
};
