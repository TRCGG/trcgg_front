import { ApiResponse } from "@/services/apiService";
import {
  GameRecordResponse,
  UserRecentRecordsResponse,
  UserRecordResponse,
} from "@/data/types/record";
import api from "@/services/index";

export const getAllRecords = async (
  riotName: string,
  riotNameTag: string | null,
  guildId?: string
): Promise<ApiResponse<UserRecordResponse>> => {
  const params: Record<string, string> = {};
  if (riotNameTag) params.riotNameTag = riotNameTag;

  try {
    return await api.get(`/api/matches/${guildId ?? ""}/${riotName}/dashboard`, params);
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
  const params: Record<string, string> = {};
  if (riotNameTag) params.riotNameTag = riotNameTag;

  try {
    return await api.get(`/api/matches/${guildId ?? ""}/${riotName}/games?limit=200`, params);
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
