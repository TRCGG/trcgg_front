export interface ChampionItem {
  id: string;
  champName: string;
  champNameEng: string;
  /** Data Dragon 조회용 라이엇 key. 아직 채워지지 않은 신규 챔피언은 null. */
  riotKey: number | null;
}

export interface ChampionListResponse {
  status: string;
  message: string;
  data: ChampionItem[];
}
