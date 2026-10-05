/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Navy-tinted neutral scale (replaces default slate). 900 = LIT Deep Navy #0D1B3E.
        slate: {
          50: "#f3f6fb",
          100: "#e4eaf4",
          200: "#cbd5e8",
          300: "#aab8d3",
          400: "#8d9dbf",
          500: "#6b7ca3",
          600: "#4b5a80",
          700: "#334066",
          800: "#1c2a4f",
          900: "#0d1b3e",
          950: "#070f26",
        },
        // LIT Bright Turquoise #45D9D2 — brand accent (not a severity colour).
        brand: {
          50: "#effefd",
          100: "#c8fbf7",
          200: "#94f5ee",
          300: "#6ae6df",
          400: "#45d9d2",
          500: "#25bfb9",
          600: "#169a98",
          700: "#167b7b",
          800: "#166060",
          900: "#164f4f",
          950: "#072f31",
        },
        // LIT Azure Blue #0894DE — processing / informational.
        azure: {
          300: "#6cc6f2",
          400: "#35aee9",
          500: "#0894de",
          600: "#0678b5",
          900: "#0a3a57",
        },
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        riseIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        scan: "scan 3s linear infinite",
        fadeIn: "fadeIn 0.5s ease-out forwards",
        riseIn: "riseIn 0.28s ease-out both",
      },
    },
  },
  plugins: [],
};
