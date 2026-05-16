import { ApiResponse } from "@/services/apiService";
import {
  GameRecordResponse,
  MostPicksResponse,
  UserRecentRecordsResponse,
  UserRecordResponse,
} from "@/data/types/record";
import api from "@/services/index";
import buildQuery from "@/utils/buildQuery";

export const getAllRecords = async (
  riotName: string,
  riotNameTag: string | null,
  guildId?: string
): Promise<ApiResponse<UserRecordResponse>> => {
  const query = buildQuery({ riotNameTag: riotNameTag ?? undefined });
  try {
    return await api.get(`/api/matches/${guildId ?? ""}/${riotName}/dashboard${query}`);
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
};

export const getRecentRecords = async (
  riotName: string,
  riotNameTag: string | null,
  guildId?: string
): Promise<ApiResponse<UserRecentRecordsResponse>> => {
  const query = buildQuery({ riotNameTag: riotNameTag ?? undefined, limit: 200 });
  try {
    return await api.get(`/api/matches/${guildId ?? ""}/${riotName}/games${query}`);
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
};

export interface MostPicksParams {
  season?: string;
  page?: number;
  limit?: number;
}

export const getMostPicks = async (
  riotName: string,
  guildId: string,
  params?: MostPicksParams
): Promise<ApiResponse<MostPicksResponse>> => {
  const query = buildQuery({
    season: params?.season,
    page: params?.page,
    limit: params?.limit ?? 100000,
  });
  try {
    return await api.get(`/api/matches/${guildId}/${riotName}/most-picks${query}`);
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
};

export const getGameRecords = async (
  gameId: string,
  guildId?: string
): Promise<ApiResponse<GameRecordResponse>> => {
  try {
    return await api.get(`/api/matches/${guildId ?? ""}/games/${gameId}`);
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
};
