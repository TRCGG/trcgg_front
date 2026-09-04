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
    // Next 12의 next/link는 자식 <a>에 href를 런타임에 주입한다. 소스의 <a>에는 href가 없어
    // 기본 noHref 검사에 걸리고, href를 직접 쓰면 no-html-link-for-pages에 걸린다. 그 결과
    // <Link><span> 패턴으로 우회하게 되는데, 이러면 href 없는 span만 렌더돼 크롤러가 내부
    // 링크를 따라갈 수 없다. noHref만 끄고 <Link><a> 패턴을 쓴다.
    "jsx-a11y/anchor-is-valid": ["error", { aspects: ["invalidHref", "preferButton"] }],
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
    },
  },
};
