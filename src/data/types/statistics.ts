export interface UserStatistics {
  playerCode: string;
  riotName: string;
  riotNameTag: string;
  totalCount: number;
  winCount: number;
  loseCount: number;
  winRate: number;
  kda: number;
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
  winCount: number;
  loseCount: number;
  winRate: number;
  kda: number;
}

export interface ChampionStatisticsResponse {
  status: string;
  message: string;
  data: ChampionStatistics[];
}
