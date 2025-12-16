export interface GuildMember {
  id: number;
  status: string;
  account: string;
  mainAccount: string | null;
  isMain: boolean;
  guildId: string;
  createDate: string;
  updateDate: string;
  isDeleted: boolean;
}

export interface RiotAccount {
  id: number;
  puuid: string;
  playerCode: string;
  riotName: string;
  riotNameTag: string;
  createDate: string;
  updateDate: string;
  isDeleted: boolean;
}

export interface PlayerInfo {
  guild_member: GuildMember;
  riot_account: RiotAccount;
}

export interface UserSearchResult {
  data: PlayerInfo[];
  message: string;
  status: string;
}
