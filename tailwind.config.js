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
        rankBg1: "#2C2F38",
        rankBg2: "#22252B",
        rankBg3: "#141619",
        border1: "#363B41",
        border2: "#343842",
        primary1: "#D1DBE8",
        primary2: "#797F87",
        red: "#351314",
        redPopular: "#FF4E4E",
        redLighten: "#664446",
        redDarken: "#1A1010",
        redHover: "#2e0606",
        redText: "#FF6B8B",
        redButton: "#723335",
        blue: "#0B2344",
        blueLighten: "#1B2635",
        blueDarken: "#0C141F",
        blueText: "#6BB8FF",
        blueText2: "#6A89AF",
        blueHover: "#081A33",
        blueButton: "#355A8D",
        white: "#FFFFFF",
        gray: "#9A9A9A",
        yellow: "#FFC364",
        neonGreen: "#71FF97",
        tierBlue: "#2457FF",
        tierBrown: "#AC6C70",
      },
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
