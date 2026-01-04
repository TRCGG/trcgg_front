/**
 * 플레이어 정보 (User Search API 응답)
 *
 * @interface PlayerInfo
 */
export interface PlayerInfo {
  playerCode: string;
  riotName: string;
  riotNameTag: string;
  isMain: boolean;
  guildId: string;
  createDate: string;
  updateDate: string;
  isDeleted: boolean;
}

/**
 * 유저 검색 결과
 *
 * @interface UserSearchResult
 */
export interface UserSearchResult {
  status: string;
  message: string;
  data: PlayerInfo[];
}
