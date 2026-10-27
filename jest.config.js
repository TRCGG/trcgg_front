const nextJest = require("next/jest");

// 날짜 포맷 함수가 로컬 시간대를 써서, CI(UTC)에서도 로컬과 같은 결과가 나오도록 고정한다
process.env.TZ = "Asia/Seoul";

const createJestConfig = nextJest({ dir: "./" });

module.exports = createJestConfig({
  testEnvironment: "jsdom",
  clearMocks: true,
  // Next 12의 next/jest는 tsconfig paths를 읽지 않는다
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
});