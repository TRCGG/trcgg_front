/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}", // 기존 페이지 라우팅 폴더
    "./components/**/*.{js,ts,jsx,tsx}", // 컴포넌트 폴더 추가
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};