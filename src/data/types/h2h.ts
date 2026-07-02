/**
 * 상대전적(H2H) 타입 정의
 * API: /api/h2h
 */

export type LanePosition = "TOP" | "JUG" | "MID" | "ADC" | "SUP";
export type H2HResult = "W" | "L";
export type H2HRelation = "against" | "with";

/** ① 자주 만난 상대 */
export interface FrequentOpponent {
  puuid: string;
  riotName: string;
  riotNameTag: string;
  mainLane: LanePosition | null;
  matchups: number;
  winRate: number;
  lastPlayedDate: string;
}

export interface FrequentOpponentsResponse {
  status: string;
  message: string;
  data: FrequentOpponent[];
}

/** 동명이인 후보 */
export interface H2HCandidate {
  playerCode: string;
  riotName: string;
  riotNameTag: string;
}

/** 프로필 (me / oppo) */
export interface H2HProfile {
  puuid: string;
  riotName: string;
  riotNameTag: string;
  mmr: number | null;
  mostLane: LanePosition | null;
  seasonWR: number | null;
}

/** 평균 지표 (맞붙은 게임 평균) — 게임이 없으면 각 필드가 null */
export interface H2HMetrics {
  kda: number | null;
  dpm: number | null;
  laneGoldDiff: number | null;
  tdBefore15: number | null;
  turretPlates: number | null;
  expPerMin: number | null;
  deadTimePct: number | null;
  jungleCsEnemy: number | null;
}

/** 라인 매트릭스 셀 */
export interface H2HMatrixCell {
  c: number; // count
  w: number; // wins
}

export type H2HLaneMatrix = Record<string, Record<string, H2HMatrixCell>>;

export interface H2HTopLane {
  lane: LanePosition;
  count: number;
  wins: number;
}

/** 챔피언 매치업 */
export interface H2HMatchup {
  myLane: LanePosition;
  oppoLane: LanePosition;
  myChamp: string;
  oppoChamp: string;
  count: number;
  wins: number;
  myKda: string;
  kdaDiff: string;
}

/** 인사이트 (against 전용) */
export type H2HInsightKind = "best" | "worst" | "lane" | "synergy" | "counter" | "info";
export type H2HInsightType = "counterPick" | "nemesis" | "laneVsResult" | "momentum" | "streak";

export interface H2HInsight {
  kind: H2HInsightKind;
  type: H2HInsightType;
  // counterPick / nemesis
  myChamp?: string;
  oppoChamp?: string;
  wins?: number;
  losses?: number;
  winRate?: number;
  kdaDiff?: number;
  // laneVsResult
  direction?: "laneWinButLose" | "laneLoseButWin" | "up" | "down";
  total?: number;
  laneCount?: number;
  // momentum
  recentN?: number;
  recentWins?: number;
  recentWinRate?: number;
  careerWinRate?: number;
  // streak
  streakKind?: "win" | "lose";
  length?: number;
  fromDate?: string;
  toDate?: string;
  currentLength?: number;
}

/** 단일 경기 상세 지표 (raw, 23키) */
export interface H2HRecentDetailMetrics {
  dmg: number;
  taken: number;
  selfMit: number;
  gold: number;
  cs: number;
  kda: number;
  laneGoldDiff: number;
  td15: number;
  underTurretTd: number;
  turretTd: number;
  plates: number;
  enemyJungleCs: number;
  objDmg: number;
  epicKills: number;
  objSteals: number;
  deadPct: number;
  vision: number;
  wardsP: number;
  wardsK: number;
  controlW: number;
  healShield: number;
  ccTime: number;
  missPings: number;
}

export interface H2HRecentDetail {
  mine: H2HRecentDetailMetrics;
  oppo: H2HRecentDetailMetrics;
}

/** 최근 맞대결 / 함께한 게임 */
export interface H2HRecent {
  matchId: string;
  playedDate: string;
  myResult: H2HResult;
  myLane: LanePosition;
  oppoLane: LanePosition;
  myChamp: string;
  oppoChamp: string;
  myKda: string;
  oppoKda: string;
  gameLen: number;
  detail?: H2HRecentDetail | null;
}

export interface H2HSeasonBreak {
  index: number;
  label: string;
}

/** 맞붙은 블록 */
export interface H2HAgainst {
  games: number;
  wins: number;
  losses: number;
  winRate: number;
  streak: H2HResult[];
  seasonBreaks: H2HSeasonBreak[];
  mine: H2HMetrics | null;
  oppos: H2HMetrics | null;
  laneMatrix: H2HLaneMatrix;
  topLane: H2HTopLane | null;
  matchups: H2HMatchup[];
  insights: H2HInsight[];
  recent: H2HRecent[];
  recentTotal: number;
}

/** 라인 조합 (함께한) */
export interface H2HLaneCombo {
  mine: LanePosition;
  oppo: LanePosition;
  count: number;
  wins: number;
}

/** 듀오 픽 (함께한) */
export interface H2HDuoChamp {
  mine: string;
  oppo: string;
  mineLane: LanePosition;
  oppoLane: LanePosition;
  count: number;
  wins: number;
  myKda: string; // 내 챔피언 기준 KDA (그룹 헤더용)
  mateKda: string; // 함께한 팀원 기준 KDA (펼친 자식 행용)
}

/** 함께한 블록 */
export interface H2HTogether {
  games: number;
  wins: number;
  losses: number;
  winRate: number;
  streak: H2HResult[];
  laneCombos: H2HLaneCombo[];
  topLaneCombo: H2HLaneCombo | null;
  duoChamps: H2HDuoChamp[];
  recent: H2HRecent[];
}

/** 상대전적 상세 */
export interface H2HDetail {
  me: H2HProfile;
  oppo: H2HProfile;
  totalMet: number;
  firstMet: string | null;
  lastMet: string | null;
  against: H2HAgainst;
  together: H2HTogether;
}

export interface H2HDetailResponse {
  status: string;
  message: string;
  data: H2HDetail | H2HCandidate[] | null;
}
