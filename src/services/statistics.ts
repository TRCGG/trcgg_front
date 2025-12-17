import { ApiResponse } from "@/services/apiService";
import { UserStatisticsResponse, ChampionStatisticsResponse } from "@/data/types/statistics";
import api from "@/services/index";

export const getUserStatistics = async (
  guildId: string
): Promise<ApiResponse<UserStatisticsResponse>> => {
  try {
    return await api.get(`/api/statistics/${guildId}/users?position=ALL`);
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
};

export const getChampionStatistics = async (
  guildId: string
): Promise<ApiResponse<ChampionStatisticsResponse>> => {
  try {
    return await api.get(`/api/statistics/${guildId}/champions?position=ALL`);
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
};
