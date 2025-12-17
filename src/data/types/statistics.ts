export interface UserStatistics {
  playerCode: string;
  riotName: string;
  riotNameTag: string;
  totalCount: number;
  win: number;
  lose: number;
  winRate: string;
  kda: string;
}

export interface UserStatisticsResponse {
  status: string;
  message: string;
  data: UserStatistics[];
}

export interface ChampionStatistics {
  champName: string;
  champNameEng: string;
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
