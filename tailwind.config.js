/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#091228",
          900: "#0D1B3E",
          800: "#132757",
          700: "#1D3777",
        },
        turquoise: {
          DEFAULT: "#45D9D2",
          400: "#60E0DA",
          500: "#45D9D2",
          600: "#2BC5BD",
        },
        azure: {
          DEFAULT: "#0894DE",
          500: "#0894DE",
        },
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" }
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        }
      },
      animation: {
        scan: "scan 3s linear infinite",
        fadeIn: "fadeIn 0.5s ease-out forwards"
      }
    },
  },
  plugins: [],
};
