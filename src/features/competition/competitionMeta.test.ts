import {
  CompetitionApplicationStatus,
  CompetitionPosition,
  CompetitionStatus,
  CompetitionSummary,
  PracticeLevel,
} from "@/data/types/competition";
import {
  applicationStatusHint,
  canTransition,
  competitionInitial,
  formatGameSummary,
  formatParticipants,
  getApplicationStatusMeta,
  getCompetitionStatusMeta,
  getGameTypeMeta,
  isCompetitionGameType,
  positionLabel,
  practiceLevelLabel,
  sortByPosition,
  subPositionLabel,
  transitionWarning,
} from "@/features/competition/competitionMeta";

const makeSummary = (overrides: Partial<CompetitionSummary> = {}): CompetitionSummary => ({
  id: 1,
  guildId: "guild",
  name: "대회",
  season: "2026",
  status: "IN_PROGRESS",
  approvalRequired: false,
  createDate: "2026-10-01T00:00:00.000Z",
  closeDate: null,
  scrimCount: 0,
  preliminaryCount: 0,
  mainCount: 0,
  applicationCount: 0,
  pendingCount: 0,
  teamCount: 0,
  participantCount: 0,
  ...overrides,
});

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

describe("getCompetitionStatusMeta", () => {
  it.each([
    { status: "RECRUITING", label: "모집중" },
    { status: "IN_PROGRESS", label: "진행중" },
    { status: "CLOSED", label: "종료" },
  ] as const)("$status는 '$label'로 표시한다", ({ status, label }) => {
    expect(getCompetitionStatusMeta(status).label).toBe(label);
  });

  it("모르는 상태는 종료로 표시한다", () => {
    expect(getCompetitionStatusMeta("UNKNOWN" as CompetitionStatus).label).toBe("종료");
  });
});

describe("formatParticipants", () => {
  it("모집중이면 신청 인원을 보여준다", () => {
    const competition = makeSummary({ status: "RECRUITING", applicationCount: 12 });
    expect(formatParticipants(competition)).toBe("12명 신청");
  });

  it.each(["IN_PROGRESS", "CLOSED"] as const)("%s이면 참가 인원과 팀 수를 보여준다", (status) => {
    const competition = makeSummary({ status, participantCount: 20, teamCount: 4 });
    expect(formatParticipants(competition)).toBe("20명 · 4팀");
  });
});

describe("isCompetitionGameType", () => {
  it.each([
    { gameType: "2", expected: true }, // 스크림
    { gameType: "3", expected: true }, // 예선
    { gameType: "4", expected: true }, // 본선
    { gameType: "1", expected: false }, // 대회가 아닌 일반 경기
    { gameType: "", expected: false },
    { gameType: "toString", expected: false }, // 모든 객체가 물려받는 속성 이름
    { gameType: "constructor", expected: false },
  ])("'$gameType' → $expected", ({ gameType, expected }) => {
    expect(isCompetitionGameType(gameType)).toBe(expected);
  });
});

describe("getGameTypeMeta", () => {
  it.each([
    { gameType: "2", label: "스크림" },
    { gameType: "3", label: "예선" },
    { gameType: "4", label: "본선" },
  ])("'$gameType'은 '$label'로 표시한다", ({ gameType, label }) => {
    expect(getGameTypeMeta(gameType).label).toBe(label);
  });

  it.each(["1", "toString"])("대회 유형이 아닌 '%s'는 스크림으로 표시한다", (gameType) => {
    expect(getGameTypeMeta(gameType).label).toBe("스크림");
  });
});

describe("formatGameSummary", () => {
  it("경기가 하나도 없으면 '경기 전'이다", () => {
    expect(formatGameSummary(makeSummary())).toBe("경기 전");
  });

  it("경기가 있으면 본선·예선·스크림 순으로 개수를 보여준다", () => {
    const competition = makeSummary({ mainCount: 1, preliminaryCount: 2, scrimCount: 3 });
    expect(formatGameSummary(competition)).toBe("본선 1 · 예선 2 · 스크림 3");
  });

  it("한 유형만 있어도 나머지를 0으로 보여준다", () => {
    const competition = makeSummary({ scrimCount: 1 });
    expect(formatGameSummary(competition)).toBe("본선 0 · 예선 0 · 스크림 1");
  });
});

describe("competitionInitial", () => {
  it.each([
    { desc: "대회명의 첫 글자를 반환한다", name: "가을 리그", expected: "가" },
    { desc: "앞 공백은 무시한다", name: "  가을 리그", expected: "가" },
    { desc: "빈 이름이면 ?를 반환한다", name: "", expected: "?" },
    { desc: "공백만 있으면 ?를 반환한다", name: "   ", expected: "?" },
  ])("$desc", ({ name, expected }) => {
    expect(competitionInitial(name)).toBe(expected);
  });
});

describe("positionLabel", () => {
  it.each([
    { position: "TOP", expected: "탑" },
    { position: "JUG", expected: "정글" },
    { position: "MID", expected: "미드" },
    { position: "ADC", expected: "원딜" },
    { position: "SUP", expected: "서폿" },
    { position: null, expected: "-" },
  ] as const)("$position → $expected", ({ position, expected }) => {
    expect(positionLabel(position)).toBe(expected);
  });

  it("모르는 포지션은 코드를 그대로 보여준다", () => {
    expect(positionLabel("ALL" as CompetitionPosition)).toBe("ALL");
  });
});

describe("sortByPosition", () => {
  it("탑→정글→미드→원딜→서폿 순으로 정렬한다", () => {
    const members = (["SUP", "MID", "TOP", "ADC", "JUG"] as const).map((position) => ({
      position,
    }));
    expect(sortByPosition(members).map((m) => m.position)).toEqual([
      "TOP",
      "JUG",
      "MID",
      "ADC",
      "SUP",
    ]);
  });

  it("포지션이 없으면 맨 뒤로 보낸다", () => {
    const members = [{ position: null }, { position: "SUP" as const }];
    expect(sortByPosition(members).map((m) => m.position)).toEqual(["SUP", null]);
  });

  it("같은 포지션끼리는 원래 순서를 지킨다", () => {
    const members = [
      { name: "A", position: "MID" as const },
      { name: "B", position: "TOP" as const },
      { name: "C", position: "MID" as const },
    ];
    expect(sortByPosition(members).map((m) => m.name)).toEqual(["B", "A", "C"]);
  });

  it("원본 배열을 바꾸지 않는다", () => {
    const members = [{ position: "SUP" as const }, { position: "TOP" as const }];
    sortByPosition(members);
    expect(members.map((m) => m.position)).toEqual(["SUP", "TOP"]);
  });
});

describe("subPositionLabel", () => {
  it.each([
    { desc: "없으면 -", input: [], expected: "-" },
    { desc: "하나면 그 포지션", input: ["TOP"], expected: "부 탑" },
    {
      desc: "여러 개면 · 로 잇는다",
      input: ["TOP", "MID", "SUP"],
      expected: "부 탑 · 미드 · 서폿",
    },
    { desc: "ALL이 섞이면 전체로 접는다", input: ["TOP", "ALL"], expected: "부 전체" },
    {
      desc: "4개 이상이면 전체로 접는다",
      input: ["TOP", "JUG", "MID", "ADC"],
      expected: "부 전체",
    },
  ] as const)("$desc", ({ input, expected }) => {
    expect(subPositionLabel([...input])).toBe(expected);
  });
});

describe("getApplicationStatusMeta", () => {
  it.each([
    { status: "PENDING", label: "대기" },
    { status: "APPROVED", label: "승인" },
    { status: "REJECTED", label: "거절" },
  ] as const)("$status는 '$label'로 표시한다", ({ status, label }) => {
    expect(getApplicationStatusMeta(status).label).toBe(label);
  });

  it("모르는 상태는 대기로 표시한다", () => {
    const status = "UNKNOWN" as CompetitionApplicationStatus;
    expect(getApplicationStatusMeta(status).label).toBe("대기");
  });
});

describe("practiceLevelLabel", () => {
  it.each([
    { level: "NONE", expected: "거의 없음" },
    { level: "RARE", expected: "가끔" },
    { level: "MODERATE", expected: "적당히" },
    { level: "OFTEN", expected: "자주" },
    { level: "ACTIVE", expected: "적극적" },
  ] as const)("$level → $expected", ({ level, expected }) => {
    expect(practiceLevelLabel(level)).toBe(expected);
  });

  it("모르는 값은 코드를 그대로 보여준다", () => {
    expect(practiceLevelLabel("DAILY" as PracticeLevel)).toBe("DAILY");
  });
});

describe("applicationStatusHint", () => {
  it.each([
    { status: "APPROVED", keyword: "팀이 배정" },
    { status: "REJECTED", keyword: "재승인" },
    { status: "PENDING", keyword: "수정·취소" },
  ] as const)("$status이면 '$keyword' 안내를 보여준다", ({ status, keyword }) => {
    expect(applicationStatusHint(status)).toContain(keyword);
  });
});
