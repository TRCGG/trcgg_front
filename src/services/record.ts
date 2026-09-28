import { unwrap } from "@/services/apiService";
import {
  GameParticipant,
  GameRecordResponse,
  MatchDashboardData,
  MostPicksData,
  MostPicksResponse,
  MultiplePlayerInfo,
  RecentGameRecord,
  UserRecentRecordsResponse,
  UserRecordResponse,
} from "@/data/types/record";
import api from "@/services/index";
import buildQuery from "@/utils/buildQuery";

export const getAllRecords = async (
  riotName: string,
  riotNameTag: string | null,
  guildId?: string
): Promise<MatchDashboardData | MultiplePlayerInfo[]> => {
  const query = buildQuery({ riotNameTag: riotNameTag ?? undefined });
  return unwrap(
    api.get<UserRecordResponse>(`/api/matches/${guildId ?? ""}/${riotName}/dashboard${query}`)
  );
};

export const getRecentRecords = async (
  riotName: string,
  riotNameTag: string | null,
  guildId?: string,
  /** 대회 범위로 좁힐 때 사용. competitionId를 주면 각 항목에 teamName·opponentTeamName이 채워진다. */
  scope?: { competitionId?: number; gameType?: string }
): Promise<RecentGameRecord[]> => {
  const query = buildQuery({
    riotNameTag: riotNameTag ?? undefined,
    limit: 200,
    competitionId: scope?.competitionId,
    gameType: scope?.gameType,
  });
  return unwrap(
    api.get<UserRecentRecordsResponse>(`/api/matches/${guildId ?? ""}/${riotName}/games${query}`)
  );
};

export interface MostPicksParams {
  datePreset?: "recent" | "season" | "range";
  season?: string;
  fromMonth?: number;
  toMonth?: number;
  position?: "ALL" | "TOP" | "JUG" | "MID" | "ADC" | "SUP";
  championName?: string;
  sortBy?: "totalCount" | "winRate";
  page?: number;
  limit?: number;
}

export const getMostPicks = async (
  riotName: string,
  guildId: string,
  params?: MostPicksParams
): Promise<MostPicksData> => {
  const query = buildQuery({
    datePreset: params?.datePreset,
    season: params?.season,
    fromMonth: params?.fromMonth,
    toMonth: params?.toMonth,
    position: params?.position,
    championName: params?.championName,
    sortBy: params?.sortBy,
    page: params?.page,
    limit: params?.limit ?? 100000,
  });
  return unwrap(
    api.get<MostPicksResponse>(`/api/matches/${guildId}/${riotName}/most-picks${query}`)
  );
};

export const getGameRecords = async (
  gameId: string,
  guildId?: string
): Promise<GameParticipant[]> => {
  return unwrap(api.get<GameRecordResponse>(`/api/matches/${guildId ?? ""}/games/${gameId}`));
};
