export interface PlayerInfo {
  player_id: string;
  riot_name: string;
  riot_name_tag: string;
  guild_id: string;
  puuid: string;
}
export interface UserSearchResult {
  data: PlayerInfo[];
  message: string;
  status: string;
}
