module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "airbnb",
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "next/core-web-vitals",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  ignorePatterns: [".eslintrc.js"],
  plugins: ["@typescript-eslint", "react", "jsx-a11y", "prettier"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "import/prefer-default-export": "off", // Named export
    "react/jsx-props-no-spreading": "off", // Prop spreading 허용
    "react/require-default-props": "off", // Default props 강제 안 함
    "react/function-component-definition": ["error", { namedComponents: "arrow-function" }], // 함수형 컴포넌트는 화살표 함수 사용
    "@typescript-eslint/no-unused-vars": ["error"], // 사용하지 않는 변수 경고
    "prettier/prettier": ["error", { endOfLine: "auto" }], // Prettier 규칙 적용
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
    },
  },
};
