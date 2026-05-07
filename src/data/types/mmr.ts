export interface PlayerMmr {
  puuid: string;
  guildId: string;
  mmr: number;
  lastMatchDelta: number | null;
  lastMatchId: string | null;
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  lastUpdated: string;
}
