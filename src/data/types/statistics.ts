export interface UserStatisticsResponse {
  status: string;
  message: string;
  data: UserStatistics[];
}

export interface UserStatistics {
  playerCode: string;
  riotName: string;
  riotNameTag: string;
  position: "TOP" | "JUG" | "MID" | "ADC" | "SUP";
  totalCount: number;
  win: number;
  lose: number;
  winRate: string;
  kda: string;
}

export interface ChampionStatisticsResponse {
  status: string;
  message: string;
  data: ChampionStatistics[];
}

export interface ChampionStatistics {
  champName: string;
  champNameEng: string;
  position: "TOP" | "JUG" | "MID" | "ADC" | "SUP";
  totalCount: number;
  win: number;
  lose: number;
  winRate: string;
  kda: string;
}
