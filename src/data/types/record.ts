/**
 * 전체 전적 응답 타입 (Match Dashboard)
 *
 * @interface UserRecordResponse
 * @property {string} status - 응답 상태 (예: "success", "fail")
 * @property {string} message - 응답 메세지
 * @property {MatchDashboardData | MultiplePlayerInfo[]} data - 매치 대시보드 데이터 또는 여러 플레이어 정보 배열
 */
export interface UserRecordResponse {
  status: string;
  message: string;
  data: MatchDashboardData | MultiplePlayerInfo[];
}

/**
 * 여러 플레이어 검색 결과 정보
 *
 * @interface MultiplePlayerInfo
 * @property {string} playerCode - 플레이어 코드 (예: "PLR_000001")
 * @property {string} riotName - 라이엇 게임 이름
 * @property {string} riotNameTag - 라이엇 태그
 */
export interface MultiplePlayerInfo {
  playerCode: string;
  riotName: string;
  riotNameTag: string;
}

/**
 * 매치 대시보드 데이터
 *
 * @interface MatchDashboardData
 * @property {SummaryStats} summary - 전체 전적 요약
 * @property {LineStats[]} lines - 포지션별 전적
 * @property {MostPickStats[]} mostPicks - 가장 많이 플레이한 챔피언
 * @property {SynergyStats[]} synergy - 함께 플레이한 유저 통계
 */
export interface MatchDashboardData {
  summary: SummaryStats;
  lines: LineStats[];
  mostPicks: MostPickStats[];
  synergy: SynergyStats[];
}

/**
 * 전체 전적 요약 통계
 *
 * @interface SummaryStats
 * @property {number} totalCount - 총 게임 수
 * @property {number} win - 승리 수
 * @property {number} lose - 패배 수
 * @property {string} winRate - 승률
 * @property {string} kda - KDA
 */
export interface SummaryStats {
  totalCount: number;
  win: number;
  lose: number;
  winRate: string;
  kda: string;
}

/**
 * 포지션별 전적 통계
 *
 * @interface LineStats
 * @property {"TOP" | "JUG" | "MID" | "ADC" | "SUP"} position - 포지션
 * @property {number} totalCount - 해당 포지션 총 게임 수
 * @property {number} win - 승리 수
 * @property {number} lose - 패배 수
 * @property {string} winRate - 승률
 * @property {string} kda - KDA
 */
export interface LineStats {
  position: "TOP" | "JUG" | "MID" | "ADC" | "SUP";
  totalCount: number;
  win: number;
  lose: number;
  winRate: string;
  kda: string;
}

/**
 * 모스트 픽 챔피언 통계
 *
 * @interface MostPickStats
 * @property {string} champName - 챔피언 이름 (한글)
 * @property {string} champNameEng - 챔피언 이름 (영문)
 * @property {number} totalCount - 플레이 횟수
 * @property {number} win - 승리 수
 * @property {number} lose - 패배 수
 * @property {string} winRate - 승률
 * @property {string} kda - KDA
 */
export interface MostPickStats {
  champName: string;
  champNameEng: string;
  totalCount: number;
  win: number;
  lose: number;
  winRate: string;
  kda: string;
}

/**
 * 함께 플레이한 유저 통계
 *
 * @interface SynergyStats
 * @property {string} riotName - 라이엇 게임 이름
 * @property {string} riotNameTag - 라이엇 태그
 * @property {number} totalCount - 함께 플레이한 게임 수
 * @property {number} win - 승리 수
 * @property {number} lose - 패배 수
 * @property {string} winRate
 * @property {string} kda
 */
export interface SynergyStats {
  riotName: string;
  riotNameTag: string;
  totalCount: number;
  win: number;
  lose: number;
  winRate: string;
  kda: string;
}

/**
 * 최근 게임 전적 응답 타입
 *
 * @interface UserRecentRecordsResponse
 * @property {string} status - 응답 상태 (예: "success", "fail")
 * @property {string} message - 응답 메세지
 * @property {RecentGameRecord[]} data - 최근 게임 레코드 배열
 */
export interface UserRecentRecordsResponse {
  status: string;
  message: string;
  data: RecentGameRecord[];
}

/**
 * 최근 게임 레코드
 *
 * @interface RecentGameRecord
 * @description 최근 게임 목록에서 사용하는 타입 (API 응답 명세 미완성 - 추후 업데이트 필요)
 */
export interface RecentGameRecord {
  gameId: string;
  season: string;
  createDate: string; // ISO format e.g. "2025-12-05T12:00:00.000Z"
  gameResult: "승" | "패";
  gameTeam: "red" | "blue";
  championName: string;
  championNameEng?: string; // TODO: API 응답 명세 확인 필요
  position: "TOP" | "JUG" | "MID" | "ADC" | "SUP";
  kill: number;
  death: number;
  assist: number;
  kda: number;
  totalDamageChampions: number;
  visionScore: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  summonerSpell1Key?: string; // TODO: API 응답 명세 확인 필요
  summonerSpell1Name: string;
  summonerSpell2Key?: string; // TODO: API 응답 명세 확인 필요
  summonerSpell2Name?: string;
  keystoneIcon?: string; // TODO: API 응답 명세 확인 필요
  keystoneName: string;
  substyleIcon?: string; // TODO: API 응답 명세 확인 필요
  substyleName?: string;
  level?: number;
  totalDamageTaken?: number;
  visionBought?: number;
  timePlayed?: number;
  pentaKills?: number;
}

/**
 * 게임 결과 조회 응답 타입
 *
 * @interface GameRecordResponse
 * @property {string} status - 응답 상태 (예: "success", "fail")
 * @property {string} message - 응답 메세지
 * @property {GameParticipant[]} data - 게임 참가자 데이터 배열 (10명)
 */
export interface GameRecordResponse {
  status: string;
  message: string;
  data: GameParticipant[];
}

/**
 * 게임 참가자 정보
 *
 * @interface GameParticipant
 */
export interface GameParticipant {
  gameId: string;
  season: string;
  createDate: string; // ISO format e.g. "2025-01-15T10:30:00.000Z"
  gameResult: "승" | "패";
  gameTeam: "red" | "blue";
  timePlayed: number;

  riotName: string;
  riotNameTag: string;

  champName: string;
  champNameEng: string;
  position: "TOP" | "JUG" | "MID" | "ADC" | "SUP";
  level: number;

  kill: number;
  death: number;
  assist: number;
  pentaKills: number;
  totalDamageChampions: number;
  totalDamageTaken: number;
  visionScore: number;
  visionBought: number;

  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;

  summonerSpell1Key: string;
  summonerSpell1Name: string;
  summonerSpell2Key: string;
  summonerSpell2Name: string;

  keystoneIcon: string;
  keystoneName: string;
  substyleIcon: string;
  substyleName: string;
}
