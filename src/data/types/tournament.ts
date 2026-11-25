export type TournamentCodeStatus = "PENDING" | "COMPLETED" | "INVALID";

export type TournamentSpectatorType = "ALL" | "LOBBYONLY" | "NONE";

export interface TournamentCode {
  code: string;
  /** 디코딩된 원본 길드 ID */
  guildId: string;
  channelId: string | null;
  source: "WEB" | "BOT";
  gameType: string;
  spectatorType: TournamentSpectatorType;
  status: TournamentCodeStatus;
  issuedDate: string;
  usedDate: string | null;
}

export interface IssueTournamentCodesInput {
  count: number;
  spectatorType: TournamentSpectatorType;
}

export interface TournamentCodesResponse {
  status: string;
  message: string;
  data: { codes: TournamentCode[] };
}
