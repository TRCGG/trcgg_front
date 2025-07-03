import { ApiResponse } from "@/services/apiService";
import { GameResponse, UserRecentRecordsResponse, UserRecordResponse } from "@/data/types/record";
import api from "@/services/index";

export const getAllRecords = async (
  riotName: string,
  riotNameTag: string | null,
  guildId?: string
): Promise<ApiResponse<UserRecordResponse>> => {
  const params: Record<string, string> = {};
  if (riotNameTag) params.riot_name_tag = riotNameTag;

  try {
    return await api.get(`/record/all/${riotName}/${guildId ?? ""}`, params);
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
  if (riotNameTag) params.riot_name_tag = riotNameTag;

  try {
    return await api.get(`/record/recent/${riotName}/${guildId ?? ""}`, params);
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
): Promise<ApiResponse<GameResponse>> => {
  try {
    return await api.get(`/record/result/${gameId}/${guildId ?? ""}`);
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
};
