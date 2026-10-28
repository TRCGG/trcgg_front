import { formatDuration, formatFullDate, formatShortDateTime } from "@/utils/parseTime";

describe("formatDuration", () => {
  it.each([
    { sec: 0, expected: "0:00" },
    { sec: 65, expected: "1:05" },
    { sec: 600, expected: "10:00" },
    { sec: 3725, expected: "62:05" },
  ])("$sec초 → $expected", ({ sec, expected }) => {
    expect(formatDuration(sec)).toBe(expected);
  });
});

// jest.config.js가 TZ를 Asia/Seoul로 고정해서, 시각은 +09:00으로 적어 기대값과 같은 시간대로 맞춘다.
describe("formatShortDateTime", () => {
  it.each([
    { iso: "2026-10-28T21:05:00+09:00", expected: "10/28 21:05" },
    { iso: "2026-01-03T09:07:00+09:00", expected: "1/3 09:07" },
  ])("$iso → $expected", ({ iso, expected }) => {
    expect(formatShortDateTime(iso)).toBe(expected);
  });
});

describe("formatFullDate", () => {
  it("연·월·일을 앞자리 0 없이 보여준다", () => {
    expect(formatFullDate("2026-03-05T12:00:00+09:00")).toBe("2026년 3월 5일");
  });

  it("값이 없으면 -이다", () => {
    expect(formatFullDate(null)).toBe("-");
  });
});
