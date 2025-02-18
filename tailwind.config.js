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
      colors: {
        black: "#000000",
        darkBg1: "#191B20",
        darkBg2: "#0C0D0F",
        border1: "#363B41",
        border2: "#343842",
        primary1: "#D1DBE8",
        primary2: "#797F87",
        red: "#351314",
        redLighten: "#664446",
        redDarken: "#1A1010",
        blue: "#0B2344",
        blueLighten: "#1B2635",
        blueDarken: "#0C141F",
        white: "#FFFFFF",
      },
      fontFamily: {
        sans: ["KoPubWorld Dotum", "sans-serif"],
      },
      fontWeight: {
        light: "300",
        normal: "400",
        bold: "700",
      },
    },
  },
  plugins: [],
};
