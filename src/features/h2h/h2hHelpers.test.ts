import { H2HAgainst, H2HMatchup, LanePosition } from "@/data/types/h2h";
import {
  buildInsights,
  formatAgo,
  signColor,
  topLaneMatchup,
  v2MatrixCellBg,
  v2WinRateColor,
} from "@/features/h2h/h2hHelpers";
import colors from "@/styles/colors";
import { withAlpha } from "@/utils/color";

describe("v2WinRateColor", () => {
  it.each([
    { pct: 65, expected: colors.yellow },
    { pct: 64, expected: colors.blueText },
    { pct: 55, expected: colors.blueText },
    { pct: 54, expected: colors.primary1 },
    { pct: 45, expected: colors.primary1 },
    { pct: 44, expected: colors.primary2 },
    { pct: 35, expected: colors.primary2 },
    { pct: 34, expected: colors.redText },
  ])("$pct% → $expected", ({ pct, expected }) => {
    expect(v2WinRateColor(pct)).toBe(expected);
  });
});

describe("signColor", () => {
  it.each([
    { n: 1, expected: colors.blueText },
    { n: -1, expected: colors.redText },
    { n: 0, expected: colors.primary2 },
  ])("$n → $expected", ({ n, expected }) => {
    expect(signColor(n)).toBe(expected);
  });
});

describe("v2MatrixCellBg", () => {
  // 0.1 + 0.32 같은 덧셈은 부동소수점 오차가 생겨 알파값은 근삿값으로 비교한다.
  const alphaOf = (bg: string) => Number(bg.slice(bg.lastIndexOf(",") + 1, -1));

  it("표본이 없으면 빈 칸 배경이다", () => {
    expect(v2MatrixCellBg(0, 100)).toBe(colors.darkBg1);
  });

  it.each([
    { winRate: 60, color: colors.blueText, fullAlpha: 0.42 },
    { winRate: 50, color: colors.blueText, fullAlpha: 0.22 },
    { winRate: 40, color: colors.redText, fullAlpha: 0.22 },
    { winRate: 39, color: colors.redText, fullAlpha: 0.42 },
  ])(
    "승률 $winRate%는 $color 계열, 6판 이상이면 알파 $fullAlpha",
    ({ winRate, color, fullAlpha }) => {
      const bg = v2MatrixCellBg(6, winRate);
      expect(bg).toBe(withAlpha(color, alphaOf(bg)));
      expect(alphaOf(bg)).toBeCloseTo(fullAlpha);
    }
  );

  it("표본이 적을수록 옅고, 6판에서 최대가 된다", () => {
    const alphas = [1, 3, 6, 12].map((count) => alphaOf(v2MatrixCellBg(count, 70)));
    expect(alphas[0]).toBeLessThan(alphas[1]);
    expect(alphas[1]).toBeLessThan(alphas[2]);
    expect(alphas[3]).toBeCloseTo(alphas[2]);
  });
});

describe("topLaneMatchup", () => {
  it.each([null, undefined])("매트릭스가 %p이면 null이다", (matrix) => {
    expect(topLaneMatchup(matrix)).toBeNull();
  });

  it("같은 라인끼리 가장 많이 맞붙은 칸을 고른다", () => {
    const matrix = {
      TOP: { TOP: { c: 2, w: 1 } }, // 탑끼리 2전 1승
      MID: { MID: { c: 5, w: 3 } }, // 미드끼리 5전 3승
    };
    expect(topLaneMatchup(matrix)).toEqual({ myLane: "MID", oppoLane: "MID", count: 5, wins: 3 });
  });

  it("다른 라인끼리 만난 칸은 판수가 많아도 무시한다", () => {
    const matrix = {
      TOP: { TOP: { c: 1, w: 1 }, MID: { c: 9, w: 0 } },
    };
    expect(topLaneMatchup(matrix)).toEqual({ myLane: "TOP", oppoLane: "TOP", count: 1, wins: 1 });
  });

  it("판수가 같으면 탑→서폿 순서에서 앞선 라인을 고른다", () => {
    const matrix = {
      SUP: { SUP: { c: 3, w: 0 } },
      JUG: { JUG: { c: 3, w: 2 } },
    };
    expect(topLaneMatchup(matrix)?.myLane).toBe("JUG");
  });

  it("같은 라인 칸이 모두 0판이면 null이다", () => {
    expect(topLaneMatchup({ TOP: { TOP: { c: 0, w: 0 } } })).toBeNull();
  });
});

describe("formatAgo", () => {
  const NOW = new Date("2026-10-28T12:00:00+09:00");
  const MIN = 60 * 1000;
  const HOUR = 60 * MIN;
  const DAY = 24 * HOUR;
  const ago = (ms: number) => new Date(NOW.getTime() - ms).toISOString();

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(NOW);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it.each([
    { desc: "1분이 안 되면 0분 전", ms: 59 * 1000, expected: "0분 전" },
    { desc: "59분", ms: 59 * MIN, expected: "59분 전" },
    { desc: "60분부터 시간 단위", ms: 60 * MIN, expected: "1시간 전" },
    { desc: "23시간", ms: 23 * HOUR + 59 * MIN, expected: "23시간 전" },
    { desc: "24시간부터 일 단위", ms: DAY, expected: "1일 전" },
    { desc: "6일", ms: 6 * DAY, expected: "6일 전" },
    { desc: "7일부터 주 단위", ms: 7 * DAY, expected: "1주 전" },
    { desc: "34일은 아직 4주", ms: 34 * DAY, expected: "4주 전" },
    { desc: "35일부터 월 단위", ms: 35 * DAY, expected: "1개월 전" },
    { desc: "90일", ms: 90 * DAY, expected: "3개월 전" },
    { desc: "미래 시각은 0분 전", ms: -HOUR, expected: "0분 전" },
  ])("$desc → $expected", ({ ms, expected }) => {
    expect(formatAgo(ago(ms))).toBe(expected);
  });
});

describe("buildInsights", () => {
  const makeAgainst = (overrides: Partial<H2HAgainst> = {}): H2HAgainst => ({
    games: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    streak: [],
    seasonBreaks: [],
    mine: null,
    oppos: null,
    laneMatrix: {},
    topLane: null,
    matchups: [],
    insights: [],
    recent: [],
    recentTotal: 0,
    ...overrides,
  });

  const matchup = (
    myChamp: string,
    myLane: LanePosition,
    oppoChamp: string,
    count: number,
    wins: number
  ): H2HMatchup => ({
    myLane,
    oppoLane: myLane,
    myChamp,
    oppoChamp,
    count,
    wins,
    myKda: "",
    kdaDiff: "",
  });

  const KO: Record<string, string> = { Ahri: "아리", Yasuo: "야스오", Zed: "제드" };
  const koName = (en?: string | null) => KO[en ?? ""] ?? en ?? "";

  const titles = (against: H2HAgainst) => buildInsights(against, koName).map((i) => i.title);
  const find = (against: H2HAgainst, title: string) =>
    buildInsights(against, koName).find((i) => i.title === title);

  it("맞대결 기록이 없으면 빈 배열이다", () => {
    expect(buildInsights(makeAgainst())).toEqual([]);
  });

  it("대표 시나리오: 카드를 코드 순서대로 만든다", () => {
    const against = makeAgainst({
      matchups: [matchup("Ahri", "MID", "Zed", 4, 3), matchup("Yasuo", "MID", "Zed", 3, 1)],
    });
    expect(buildInsights(against, koName)).toEqual([
      { kind: "best", title: "최고의 픽", body: "내 아리 · 미드", stat: "4판 75% · 3승 1패" },
      { kind: "worst", title: "피해야 할 픽", body: "내 야스오 · 미드", stat: "3판 33% · 1승 2패" },
      {
        kind: "lane",
        title: "강한 상대",
        body: "상대 제드 픽이면 해볼 만함",
        stat: "7판 57% · 4승 3패",
      },
    ]);
  });

  it("3판 미만인 묶음은 카드에서 뺀다", () => {
    const against = makeAgainst({ matchups: [matchup("Ahri", "MID", "Zed", 2, 2)] });
    expect(buildInsights(against)).toEqual([]);
  });

  it("같은 챔피언·라인은 상대가 달라도 합쳐서 판수를 센다", () => {
    const against = makeAgainst({
      matchups: [matchup("Ahri", "MID", "Zed", 2, 2), matchup("Ahri", "MID", "Yasuo", 1, 0)],
    });
    expect(find(against, "최고의 픽")?.stat).toBe("3판 67% · 2승 1패");
  });

  it("koName을 넘기지 않으면 영문 챔피언 키를 그대로 쓴다", () => {
    const against = makeAgainst({ matchups: [matchup("Ahri", "MID", "Zed", 3, 3)] });
    expect(buildInsights(against)[0].body).toBe("내 Ahri · 미드");
  });

  describe("피해야 할 픽 / 천적 챔피언", () => {
    it("최저 승률이 50% 미만일 때만 보여준다", () => {
      const against = makeAgainst({ matchups: [matchup("Ahri", "MID", "Zed", 4, 1)] });
      expect(titles(against)).toEqual(expect.arrayContaining(["피해야 할 픽", "천적 챔피언"]));
    });

    it("최저 승률이 정확히 50%면 보여주지 않는다", () => {
      const against = makeAgainst({ matchups: [matchup("Ahri", "MID", "Zed", 4, 2)] });
      expect(titles(against)).not.toContain("피해야 할 픽");
      expect(titles(against)).not.toContain("천적 챔피언");
    });
  });

  describe("강한 상대", () => {
    it("상대 챔피언별 최고 승률이 55% 이상이면 보여준다", () => {
      // 11판 6승 = 54.5% → 반올림 55%
      const against = makeAgainst({ matchups: [matchup("Ahri", "MID", "Zed", 11, 6)] });
      expect(titles(against)).toContain("강한 상대");
    });

    it("55% 미만이면 보여주지 않는다", () => {
      // 13판 7승 = 53.8% → 반올림 54%
      const against = makeAgainst({ matchups: [matchup("Ahri", "MID", "Zed", 13, 7)] });
      expect(titles(against)).not.toContain("강한 상대");
    });
  });

  describe("라인 우위", () => {
    it("최고의 픽과 다른 라인이 가장 강하면 보여준다", () => {
      const against = makeAgainst({
        matchups: [
          matchup("Ahri", "MID", "Zed", 3, 3),
          matchup("Yasuo", "MID", "Zed", 3, 0),
          matchup("Garen", "TOP", "Darius", 3, 2),
        ],
      });
      expect(find(against, "라인 우위")).toEqual({
        kind: "lane",
        title: "라인 우위",
        body: "탑 라인에서 우위",
        stat: "3판 67% · 2승 1패",
      });
    });

    it("최고의 픽과 같은 라인이면 겹쳐서 생략한다", () => {
      const against = makeAgainst({ matchups: [matchup("Ahri", "MID", "Zed", 3, 3)] });
      expect(titles(against)).not.toContain("라인 우위");
    });
  });

  describe("요즘 기세", () => {
    it("최근 5판이 통산보다 20%p 이상 좋으면 흐름 좋음", () => {
      const against = makeAgainst({
        games: 10,
        winRate: 30,
        streak: ["L", "L", "W", "W", "W", "W", "W"],
      });
      expect(find(against, "요즘 기세")).toEqual({
        kind: "best",
        title: "요즘 기세",
        body: "최근 5판 5승 — 흐름 좋음",
        stat: "통산 30% → 최근 5판 100%",
      });
    });

    it("최근 5판이 통산보다 20%p 이상 나쁘면 주춤", () => {
      const against = makeAgainst({ games: 10, winRate: 80, streak: ["W", "L", "L", "L", "L"] });
      expect(find(against, "요즘 기세")).toEqual({
        kind: "worst",
        title: "요즘 기세",
        body: "최근 흐름은 주춤",
        stat: "통산 80% → 최근 5판 20%",
      });
    });

    it.each([
      { desc: "차이가 정확히 20%p면 보여준다", winRate: 60, expected: true },
      { desc: "차이가 19%p면 보여주지 않는다", winRate: 61, expected: false },
    ])("$desc", ({ winRate, expected }) => {
      // 최근 5판 4승 = 80%
      const against = makeAgainst({ games: 10, winRate, streak: ["W", "W", "W", "W", "L"] });
      expect(titles(against).includes("요즘 기세")).toBe(expected);
    });

    it("총 맞대결이 5판 미만이면 보여주지 않는다", () => {
      const against = makeAgainst({ games: 4, winRate: 0, streak: ["W", "W", "W", "W"] });
      expect(titles(against)).not.toContain("요즘 기세");
    });
  });
});
