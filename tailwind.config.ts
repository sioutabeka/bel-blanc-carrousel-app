import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./templates/**/*.{html,js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#ffffff",
        "bg-soft": "#f4f8fc",
        "night-deep": "#0a1a28",
        night: "#0a2540",
        "night-mid": "#1a3555",
        ink: "#2a3a50",
        "ink-muted": "#6a7d8e",
        blue: {
          DEFAULT: "#1485d4",
          dark: "#0f6eb5",
          light: "#e8f3fb",
        },
        accent: "#f5c518",
        whatsapp: "#25d366",
      },
      fontFamily: {
        serif: ['"Cormorant"', "serif"],
        sans: ['"Public Sans"', "sans-serif"],
        display: ['"Playfair Display"', "serif"],
      },
      borderRadius: {
        xs: "8px",
        sm: "12px",
        md: "20px",
        lg: "24px",
        xl: "28px",
        "2xl": "32px",
      },
    },
  },
  plugins: [],
};

export default config;
