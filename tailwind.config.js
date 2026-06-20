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
        sans: ["KoPubWorld Dotum", "sans-serif"],
      },
      fontWeight: {
        light: "300",
        normal: "400",
        bold: "700",
      },
      borderWidth: {
        3: "3px",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
