import { lastLeaderboardRefresh, timeUntilLeaderboardRefresh } from "@/utils/leaderboardSchedule";

const at = (iso: string) => Date.parse(iso);
const HOUR_MS = 60 * 60 * 1000;

describe("lastLeaderboardRefresh", () => {
  it.each([
    {
      desc: "갱신 시각(03:05 UTC, 한국 시간 12:05) 정각이면 그날 갱신 시각을 반환한다",
      input: "2026-10-28T03:05:00.000Z",
      expected: "2026-10-28T03:05:00.000Z",
    },
    {
      desc: "갱신 시각 1ms 전이면 전날 갱신 시각을 반환한다",
      input: "2026-10-28T03:04:59.999Z",
      expected: "2026-10-27T03:05:00.000Z",
    },
    {
      desc: "UTC 자정(KST 09:00)은 아직 갱신 전이라 전날 갱신 시각을 반환한다",
      input: "2026-10-28T00:00:00.000Z",
      expected: "2026-10-27T03:05:00.000Z",
    },
    {
      desc: "UTC 하루의 끝이면 그날 갱신 시각을 반환한다",
      input: "2026-10-28T23:59:59.999Z",
      expected: "2026-10-28T03:05:00.000Z",
    },
    {
      desc: "갱신 전인 월초는 전월 말일 갱신 시각을 반환한다",
      input: "2026-03-01T01:00:00.000Z",
      expected: "2026-02-28T03:05:00.000Z",
    },
  ])("$desc", ({ input, expected }) => {
    expect(lastLeaderboardRefresh(at(input))).toBe(at(expected));
  });
});

describe("timeUntilLeaderboardRefresh", () => {
  it.each([
    {
      desc: "갱신 직후에 받은 데이터는 24시간 동안 fresh다",
      input: "2026-10-28T03:05:00.000Z",
      expected: 24 * HOUR_MS,
    },
    {
      desc: "갱신 1ms 전에 받은 데이터는 1ms 뒤 만료된다",
      input: "2026-10-28T03:04:59.999Z",
      expected: 1,
    },
    {
      desc: "KST 21:05에 받은 데이터는 다음 날 KST 12:05까지 15시간 남는다",
      input: "2026-10-28T12:05:00.000Z",
      expected: 15 * HOUR_MS,
    },
  ])("$desc", ({ input, expected }) => {
    expect(timeUntilLeaderboardRefresh(at(input))).toBe(expected);
  });
});
