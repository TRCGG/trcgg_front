// 백엔드 src/types/competition.ts와 1:1 대응. 날짜는 JSON을 거치며 문자열이 된다.

export const COMPETITION_STATUS_VALUES = ["RECRUITING", "IN_PROGRESS", "CLOSED"] as const;
export type CompetitionStatus = (typeof COMPETITION_STATUS_VALUES)[number];

/** 통계·경기 조회의 포지션 코드와 동일 — 신청·로스터가 그 필터에 그대로 걸린다. */
export const COMPETITION_POSITIONS = ["TOP", "JUG", "MID", "ADC", "SUP"] as const;
export type CompetitionPosition = (typeof COMPETITION_POSITIONS)[number];

/** 부포지션만 '전체 가능'을 표현할 수 있다. 주포지션·로스터는 5개 그대로다. */
export const COMPETITION_SUB_POSITIONS = [...COMPETITION_POSITIONS, "ALL"] as const;
export type CompetitionSubPosition = (typeof COMPETITION_SUB_POSITIONS)[number];

export const PRACTICE_LEVELS = ["NONE", "RARE", "MODERATE", "OFTEN", "ACTIVE"] as const;
export type PracticeLevel = (typeof PRACTICE_LEVELS)[number];

export const MAX_APPLICATION_CHAMPIONS = 3;

/** 개설 시 고를 수 있는 상태 — 종료된 대회를 새로 만들 일은 없다. */
export type CompetitionInitialStatus = Extract<CompetitionStatus, "RECRUITING" | "IN_PROGRESS">;

/** 대회 경기 유형. 일반내전(1)은 대회에 속하지 않아 오갈 수 없다. */
export const COMPETITION_GAME_TYPES = ["2", "3"] as const;
export type CompetitionGameType = (typeof COMPETITION_GAME_TYPES)[number];

export type CompetitionApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

// ── 대회 ──

export interface Competition {
  id: number;
  guildId: string;
  name: string;
  season: string;
  status: CompetitionStatus;
  approvalRequired: boolean;
  createDate: string;
  closeDate: string | null;
}

/** 대회 + 유형별 활성 경기 수 + 신청·팀 규모 */
export interface CompetitionSummary extends Competition {
  scrimCount: number;
  mainCount: number;
  applicationCount: number;
  pendingCount: number;
  teamCount: number;
  participantCount: number;
}

export interface CompetitionMatchItem {
  gameId: string;
  gameType: string;
  createDate: string;
}

export interface CompetitionDetail extends CompetitionSummary {
  matches: CompetitionMatchItem[];
}

/** match가 있으면 확정, 없고 candidates가 여럿이면 사용자에게 고르게 한다. */
export interface CompetitionResolveResult {
  match: CompetitionSummary | null;
  /** 최대 10건 */
  candidates: CompetitionSummary[];
  /** 부분일치가 10건을 넘어 잘렸으면 true */
  truncated: boolean;
}

/** 삭제된 대회 + 함께 soft-delete된 경기 수 */
export interface CompetitionRemoveResult extends Competition {
  deletedMatchCount: number;
}

export interface CompetitionCreateInput {
  name: string;
  status?: CompetitionInitialStatus;
  approvalRequired?: boolean;
}

export interface CompetitionUpdateInput {
  name?: string;
  approvalRequired?: boolean;
}

// ── 신청 ──

export interface CompetitionApplicationChampion {
  id: string;
  champName: string;
  champNameEng: string;
  riotKey: number | null;
}

export interface CompetitionApplicationItem {
  id: number;
  competitionId: number;
  playerCode: string;
  appliedByMemberId: string;
  mainPosition: CompetitionPosition;
  subPositions: CompetitionSubPosition[];
  availableTime: string | null;
  captainAvailable: boolean;
  practiceLevel: PracticeLevel;
  comment: string | null;
  status: CompetitionApplicationStatus;
  decidedByMemberId: string | null;
  decidedDate: string | null;
  createDate: string;
  updateDate: string;
  riotName: string;
  riotNameTag: string;
  appliedByDisplayName: string;
  champions: CompetitionApplicationChampion[];
}

export interface CompetitionApplyInput {
  playerCode: string;
  mainPosition: CompetitionPosition;
  subPositions?: CompetitionSubPosition[];
  /** champion.id 최대 3개 */
  champions?: string[];
  availableTime?: string | null;
  captainAvailable: boolean;
  practiceLevel: PracticeLevel;
  comment?: string | null;
}

/** 본인 신청 수정 — 전부 선택이지만 최소 하나는 보내야 한다. */
export type CompetitionApplicationUpdateInput = Partial<CompetitionApplyInput>;

export interface ApplicationDecideInput {
  /** 1~200건, 중복 불가 */
  applicationIds: number[];
  /** PENDING은 승인·거절을 되돌릴 때 쓴다. */
  status: CompetitionApplicationStatus;
}

// ── 팀·로스터 ──

export interface CompetitionPlayerSummary {
  playerCode: string;
  riotName: string;
  riotNameTag: string;
}

export interface CompetitionRosterMember extends CompetitionPlayerSummary {
  position: CompetitionPosition;
}

export interface RecordCount {
  games: number;
  win: number;
  lose: number;
}

export interface TeamRecordSplit {
  scrim: RecordCount;
  main: RecordCount;
}

export interface CompetitionTeam {
  id: number;
  competitionId: number;
  name: string;
  captainPlayerCode: string | null;
  createDate: string;
}

export interface CompetitionTeamRoster extends CompetitionTeam {
  roster: CompetitionRosterMember[];
}

/** records는 상대를 가리지 않은 이 팀 전체 전적이다. */
export interface CompetitionTeamWithRoster extends CompetitionTeamRoster {
  records: TeamRecordSplit;
}

export interface CompetitionTeamUpdateInput {
  name?: string;
  captainPlayerCode?: string | null;
}

export interface RosterSaveTeamInput {
  id?: number;
  name: string;
  captainPlayerCode?: string | null;
  members: { playerCode: string; position: CompetitionPosition }[];
}

/** payload에 없는 팀은 삭제된다. */
export interface RosterSaveInput {
  teams: RosterSaveTeamInput[];
}

// ── 경기 ──

/** blueTeamId/redTeamId가 모두 null이면 아직 팀에 귀속되지 않은 경기다. */
export interface CompetitionMatchTeamItem {
  customMatchId: string;
  gameType: string;
  date: string;
  blueTeamId: number | null;
  redTeamId: number | null;
  blueTeamName: string | null;
  redTeamName: string | null;
  /** 이긴 진영이 팀에 귀속돼 있을 때만 값이 있다 (용병전·미배정·승자 미상은 null) */
  winnerTeamId: number | null;
  /** 초 */
  gameLength: number | null;
  blue: CompetitionPlayerSummary[];
  red: CompetitionPlayerSummary[];
}

/** 이미 목표 유형이던 경기는 skipped로 빠지고 요청은 성공한다. */
export interface MatchGameTypeChangeResult {
  changed: string[];
  skipped: string[];
}

export interface MatchTeamAssignInput {
  blue: number | null;
  red: number | null;
}

// ── 순위표·전적 ──

export interface StandingRow {
  rank: number;
  teamId: number;
  name: string;
  games: number;
  win: number;
  lose: number;
  winRate: number;
  avgKda: number;
}

export interface CompetitionStandings {
  scrim: StandingRow[];
  main: StandingRow[];
}

export interface CompetitionTeamRecordItem extends TeamRecordSplit {
  teamId: number;
  name: string;
}

export interface CompetitionHeadToHeadResult extends TeamRecordSplit {
  matches: {
    customMatchId: string;
    gameType: string;
    date: string;
    winnerTeamId: number | null;
  }[];
}

/** 선수 한 명이 참여한 대회 한 건. team이 null이면 로스터에 오르지 않았다. */
export interface PlayerCompetitionItem {
  competitionId: number;
  name: string;
  status: CompetitionStatus;
  season: string;
  createDate: string;
  closeDate: string | null;
  team: { id: number; name: string; position: CompetitionPosition; isCaptain: boolean } | null;
  applicationStatus: CompetitionApplicationStatus | null;
  /** 팀 귀속과 무관한 본인 전적 (스크림+본경기 합산) */
  record: { games: number; win: number; lose: number; winRate: number; kda: number };
  teamRank: { scrim: number | null; main: number | null };
  /** 최근 6경기 결과('승'/'패'), 최신순 */
  recent: string[];
}

// ── 응답 래퍼 (프로젝트 공통 형태) ──

export interface CompetitionListResponse {
  status: string;
  message: string;
  data: CompetitionSummary[];
}

export interface CompetitionDetailResponse {
  status: string;
  message: string;
  data: CompetitionDetail;
}

export interface CompetitionResponse {
  status: string;
  message: string;
  data: Competition;
}

export interface CompetitionResolveResponse {
  status: string;
  message: string;
  data: CompetitionResolveResult;
}

export interface CompetitionRemoveResponse {
  status: string;
  message: string;
  data: CompetitionRemoveResult;
}

export interface ApplicationListResponse {
  status: string;
  message: string;
  data: CompetitionApplicationItem[];
}

export interface ApplicationResponse {
  status: string;
  message: string;
  data: CompetitionApplicationItem | null;
}

export interface TeamListResponse {
  status: string;
  message: string;
  data: CompetitionTeamWithRoster[];
}

export interface TeamResponse {
  status: string;
  message: string;
  data: CompetitionTeamRoster;
}

export interface MatchTeamListResponse {
  status: string;
  message: string;
  data: CompetitionMatchTeamItem[];
}

export interface StandingsResponse {
  status: string;
  message: string;
  data: CompetitionStandings;
}

export interface TeamRecordListResponse {
  status: string;
  message: string;
  data: CompetitionTeamRecordItem[];
}

export interface PlayerCompetitionListResponse {
  status: string;
  message: string;
  data: PlayerCompetitionItem[];
}

export interface MatchGameTypeChangeResponse {
  status: string;
  message: string;
  data: MatchGameTypeChangeResult;
}

// ── 대회 범위 통계 ──
// 일반 통계(data/types/statistics.ts)와 형태가 다르다. 대회 범위에서만 지표가 더 실린다.

export interface CompetitionMultiKills {
  double: number;
  triple: number;
  quadra: number;
  penta: number;
}

/** 대회 유저 랭킹. 비율·평균은 numeric이라 드라이버가 문자열로 준다. */
export interface CompetitionUserStat {
  riotName: string;
  riotNameTag: string;
  position?: string;
  totalCount: number;
  win: number;
  lose: number;
  winRate: number;
  kda: number;
  kills: number;
  avgDpm: number;
  /** (킬+어시) / 팀 킬 × 100 */
  killParticipation: string;
  /** 챔피언 피해 / 팀 챔피언 피해 × 100 */
  damageShare: string;
  goldPerMin: string;
  avgVisionScore: string;
  damagePerDeath: string;
  /** 사망 시간 / 게임 시간 × 100 */
  deadTimePct: string;
  multiKills: CompetitionMultiKills;
}

export interface CompetitionChampionStat {
  champName: string;
  champNameEng: string;
  position?: string;
  totalCount: number;
  win: number;
  lose: number;
  winRate: number;
  kda: number;
  kills: number;
  avgDpm: number;
}

export interface CompetitionUserStatResponse {
  status: string;
  message: string;
  data: CompetitionUserStat[];
}

export interface CompetitionChampionStatResponse {
  status: string;
  message: string;
  data: CompetitionChampionStat[];
}
