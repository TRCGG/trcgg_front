/**
 * 전체 전적 응답 타입 (Match Dashboard)
 *
 * @interface UserRecordResponse
 * @property {string} status - 응답 상태 (예: "success", "fail")
 * @property {string} message - 응답 메세지
 * @property {MatchDashboardData | PlayerInfo[]} data - 매치 대시보드 데이터 또는 여러 플레이어 정보 배열
 */
export interface UserRecordResponse {
  status: string;
  message: string;
  data: MatchDashboardData | PlayerInfo[];
}

/**
 * 플레이어 기본 정보
 *
 * @interface PlayerInfo
 * @property {string} playerCode - 플레이어 코드 (예: "PLR_000001")
 * @property {string} riotName - 라이엇 게임 이름
 * @property {string} riotNameTag - 라이엇 태그
 */
export interface PlayerInfo {
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
 * @property {MostPickStats[]} mostPicks - 가장 많이 플레이한 챔피언 (Top 5)
 */
export interface MatchDashboardData {
  summary: SummaryStats;
  lines: LineStats[];
  mostPicks: MostPickStats[];
}

/**
 * 전체 전적 요약 통계
 *
 * @interface SummaryStats
 * @property {number} totalCount - 총 게임 수
 * @property {number} winCount - 승리 수
 * @property {number} loseCount - 패배 수
 * @property {number} winRate - 승률 (예: 60.0)
 * @property {number} kda - KDA (예: 3.5)
 */
export interface SummaryStats {
  totalCount: number;
  winCount: number;
  loseCount: number;
  winRate: number;
  kda: number;
}

/**
 * 포지션별 전적 통계
 *
 * @interface LineStats
 * @property {"TOP" | "JUG" | "MID" | "ADC" | "SUP"} position - 포지션
 * @property {number} totalCount - 해당 포지션 총 게임 수
 * @property {number} winRate - 승률 (예: 55.5)
 * @property {number} kda - KDA (예: 4.1)
 */
export interface LineStats {
  position: "TOP" | "JUG" | "MID" | "ADC" | "SUP";
  totalCount: number;
  winRate: number;
  kda: number;
}

/**
 * 모스트 픽 챔피언 통계
 *
 * @interface MostPickStats
 * @property {string} champName - 챔피언 이름
 * @property {number} totalCount - 플레이 횟수
 * @property {number} winRate - 승률 (예: 66.6)
 * @property {number} kda - KDA (예: 4.5)
 */
export interface MostPickStats {
  champName: string;
  totalCount: number;
  winRate: number;
  kda: number;
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
