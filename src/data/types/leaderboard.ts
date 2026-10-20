interface Envelope<T> {
  status: string;
  message: string;
  data: T;
}

export interface LeaderboardPlayer {
  playerCode: string;
  riotName: string;
  riotNameTag: string;
}

export interface LeaderboardChampion {
  champName: string;
  champNameEng: string;
}

export interface LeaderboardUser extends LeaderboardPlayer {
  totalCount: number;
  win: number;
  lose: number;
  winRate: string;
  kda: string;
  wilsonScore?: number;
}

export interface LeaderboardChampionStat extends LeaderboardChampion {
  position?: string;
  totalCount: number;
  win: number;
  lose: number;
  winRate: string;
  kda: string;
  matchCount: number;
  totalMatches: number;
  pickRate: number;
  wilsonScore: number;
}

export type ChampionCombinationType = "ADCSUP" | "MIDJUG";

export interface ChampionCombination {
  champions: (LeaderboardChampion & { position: string })[];
  totalCount: number;
  win: number;
  lose: number;
  winRate: number;
  wilsonScore: number;
  playerPairCount: number;
}

export interface ClanDuo {
  players: LeaderboardPlayer[];
  totalCount: number;
  win: number;
  lose: number;
  winRate: number;
}

export interface ClanActivity {
  totalMatches: number;
  totalPlayers: number;
  /** date는 YYYY-MM-DD. 경기 없는 날짜는 빠져 있다 */
  dailyMatches: { date: string; matchCount: number }[];
  sideWinRates: Record<"blue" | "red", { win: number; winRate: number }>;
}

interface PeriodRecord {
  totalCount: number;
  win: number;
  winRate: number;
}

export interface RisingStar extends LeaderboardPlayer {
  previous: PeriodRecord;
  current: PeriodRecord;
  improvementPp: number;
}

export type HighlightCategory =
  | "kills"
  | "assists"
  | "championDamage"
  | "visionScore"
  | "damageTaken"
  | "buildingDamage";

export interface HighlightEntry extends LeaderboardPlayer {
  champion: LeaderboardChampion;
  registeredDate: string;
  value: number;
}

export interface PentakillEntry extends LeaderboardPlayer {
  champion: LeaderboardChampion;
  registeredDate: string;
  pentaKills: number;
}

export type Highlights = Record<
  HighlightCategory,
  { value: number | null; entries: HighlightEntry[] }
> & {
  pentakills: {
    totalPlayers: number;
    totalPentaKills: number;
    entries: PentakillEntry[];
  };
};

export interface WinStreak extends LeaderboardPlayer {
  streak: number;
  latestRegisteredDate: string;
}

export type LeaderboardUsersResponse = Envelope<LeaderboardUser[]>;
export type LeaderboardChampionsResponse = Envelope<LeaderboardChampionStat[]>;
export type ChampionCombinationsResponse = Envelope<ChampionCombination[]>;
export type ClanDuosResponse = Envelope<ClanDuo[]>;
export type ClanActivityResponse = Envelope<ClanActivity>;
export type RisingStarsResponse = Envelope<RisingStar[]>;
export type HighlightsResponse = Envelope<Highlights>;
export type WinStreaksResponse = Envelope<WinStreak[]>;
