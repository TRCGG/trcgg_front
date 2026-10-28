import { canTransition, transitionWarning } from "@/features/competition/competitionMeta";

describe("canTransition", () => {
  it.each([
    { from: "RECRUITING", to: "RECRUITING", expected: true },
    { from: "RECRUITING", to: "IN_PROGRESS", expected: true },
    { from: "RECRUITING", to: "CLOSED", expected: false },
    { from: "IN_PROGRESS", to: "RECRUITING", expected: true },
    { from: "IN_PROGRESS", to: "IN_PROGRESS", expected: true },
    { from: "IN_PROGRESS", to: "CLOSED", expected: true },
    { from: "CLOSED", to: "RECRUITING", expected: false },
    { from: "CLOSED", to: "IN_PROGRESS", expected: true },
    { from: "CLOSED", to: "CLOSED", expected: true },
  ] as const)("$from -> $to: $expected", ({ from, to, expected }) => {
    expect(canTransition(from, to)).toBe(expected);
  });
});

describe("transitionWarning", () => {
  it.each(["RECRUITING", "IN_PROGRESS", "CLOSED"] as const)(
    "%s -> 같은 상태: 경고 없음",
    (status) => {
      expect(transitionWarning(status, status)).toBeNull();
    }
  );

  it.each([
    { from: "IN_PROGRESS", to: "RECRUITING", keyword: "신청이 다시 열립니다" },
    { from: "IN_PROGRESS", to: "CLOSED", keyword: "최종 순위가 확정" },
    { from: "CLOSED", to: "IN_PROGRESS", keyword: "순위가 해제" },
    { from: "RECRUITING", to: "IN_PROGRESS", keyword: "신청이 마감" },
  ] as const)("$from -> $to: '$keyword'", ({ from, to, keyword }) => {
    expect(transitionWarning(from, to)).toContain(keyword);
  });
});
