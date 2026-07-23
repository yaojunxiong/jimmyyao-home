import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        // Portal color system — deep void with accent glows
        void: {
          DEFAULT: "#050508",
          50: "#f5f5f7",
          100: "#e8e8ec",
          200: "#d1d1d8",
          300: "#a8a8b2",
          400: "#787887",
          500: "#5a5a68",
          600: "#464652",
          700: "#3a3a44",
          800: "#1c1c24",
          900: "#0e0e14",
          950: "#050508"
        },
        accent: {
          cyan: "#38bdf8",
          blue: "#3b82f6",
          purple: "#8b5cf6",
          amber: "#f59e0b",
          rose: "#f43f5e"
        },
        // Preserve existing colors for ai-world compatibility
        ember: "#ff7a1a",
        goldfire: "#ffc35a",
        blood: "#7f1016",
        night: "#050306"
      },
      fontFamily: {
        display: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ]
      },
      boxShadow: {
        ember: "0 0 28px rgba(255, 116, 27, 0.32)",
        glow: "0 0 40px rgba(56, 189, 248, 0.12)",
        "glow-lg": "0 0 80px rgba(56, 189, 248, 0.08)",
        "glow-blue": "0 0 40px rgba(59, 130, 246, 0.12)",
        "glow-purple": "0 0 40px rgba(139, 92, 246, 0.12)",
        card: "0 1px 2px rgba(0, 0, 0, 0.4), 0 8px 32px rgba(0, 0, 0, 0.3)"
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in-scale": {
          "0%": { opacity: "0", transform: "scale(0.96) translateY(12px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" }
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" }
        },
        "line-grow": {
          "0%": { transform: "scaleY(0)" },
          "100%": { transform: "scaleY(1)" }
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        }
      },
      animation: {
        "fade-in": "fade-in 0.7s ease-out both",
        "fade-in-up": "fade-in-up 0.8s ease-out both",
        "fade-in-scale": "fade-in-scale 0.6s ease-out both",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "line-grow": "line-grow 1.2s ease-out both",
        shimmer: "shimmer 2s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
