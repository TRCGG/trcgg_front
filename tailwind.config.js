const colors = require("./src/styles/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true, // SSR에서 스타일 충돌 방지
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ["Pretendard Variable", "Pretendard", "sans-serif"],
      },
      fontWeight: {
        light: "300",
        normal: "400",
        bold: "700",
      },
      borderWidth: {
        3: "3px",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "translateY(-6px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        popOut: {
          "0%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(-6px) scale(0.96)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.42s cubic-bezier(0.22, 1, 0.36, 1) both",
        popIn: "popIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both",
        popOut: "popOut 0.2s cubic-bezier(0.4, 0, 1, 1) forwards",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
