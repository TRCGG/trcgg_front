/**
 * 전체 전적 응답 타입
 *
 * @interface UserRecordResponse
 * @property {string} status - 응답 상태 (예: "ok", "fail")
 * @property {string} message - 응답 메세지
 * @property {PlayerStatsData} data - 플레이어 및 게임 전적 데이터
 */
export interface UserRecordResponse {
  status: string;
  message: string;
  data: PlayerStatsData | MultiplePlayers;
}

export interface MultiplePlayers {
  player: Player[];
}

export interface PlayerStatsData {
  record_data: PositionRecord[];
  month_data: SummaryData[];
  recent_data: RecentGame[];
  with_team_data: TeamRecord[];
  other_team_data: TeamRecord[];
  most_pick_data: ChampionRecord[];
  player: Player[];
}

interface PositionRecord {
  position: "TOP" | "JUG" | "MID" | "ADC" | "SUP";
  total_count: number;
  win: number;
  lose: number;
  win_rate: string; // 예: "65.00"
  kda: string; // 예: "2.68"
}

export interface SummaryData {
  total_count: number;
  win: number;
  lose: number;
  win_rate: string;
  kda: string;
}

export interface RecentGame {
  game_id: string;
  riot_name: string;
  champ_name: string;
  champ_name_eng: string;
  position: string;
  kill: number;
  death: number;
  assist: number;
  game_result: "승" | "패";
  game_team: "red" | "blue";
  total_damage_champions: number;
  vision_bought: number;
  penta_kills: number;
}

interface TeamRecord {
  riot_name: string;
  total_count: number;
  win: number;
  lose: number;
  win_rate: string;
}

export interface ChampionRecord {
  champ_name: string;
  champ_name_eng: string;
  total_count: number;
  win: number;
  lose: number;
  win_rate: string;
  kda: string;
}

export interface Player {
  player_id: string;
  riot_name: string;
  riot_name_tag: string;
  guild_id: string;
  puuid: string;
}

/**
 * 최근 20게임 전적 응답 타입
 *
 * @interface UserRecentRecordsResponse
 * @property {string} status - 응답 상태 (예: "ok", "fail")
 * @property {string} message - 응답 메세지
 * @property {PlayerStatsData} data - 플레이어 및 게임 전적 데이터
 */
export interface UserRecentRecordsResponse {
  status: string;
  message: string;
  data: PlayerRecordData;
}

interface PlayerRecordData {
  player: Player;
  records: GameRecord[];
}

interface GameRecord {
  game_id: string;
  riot_name: string;
  champ_name: string;
  champ_name_eng: string;
  position: "TOP" | "JUG" | "MID" | "ADC" | "SUP";
  kill: number;
  death: number;
  assist: number;
  game_result: "승" | "패";
  game_team: "red" | "blue";
  total_damage_champions: number;
  vision_bought: number;
  penta_kills: number;
}

/**
 * 게임 결과 조회
 *
 * @interface GameRecordResponse
 * @property {string} status - 응답 상태 (예: "ok", "fail")
 * @property {string} message - 응답 메세지
 * @property {GameParticipant} data - 게임 참가자 데이터
 */
export interface GameRecordResponse {
  status: string;
  message: string;
  data: GameParticipant[];
}

export interface GameParticipant {
  game_id: string;
  riot_name: string;
  champ_name: string;
  champ_name_eng: string;
  position: "TOP" | "JUG" | "MID" | "ADC" | "SUP";
  kill: number;
  death: number;
  assist: number;
  game_result: "승" | "패";
  game_team: "red" | "blue";
  total_damage_champions: number;
  vision_bought: number;
  penta_kills: number;
}
