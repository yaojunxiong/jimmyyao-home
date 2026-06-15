import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
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
        ember: "0 0 28px rgba(255, 116, 27, 0.32)"
      }
    }
  },
  plugins: []
};

export default config;
