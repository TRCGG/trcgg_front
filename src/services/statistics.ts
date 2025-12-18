import { ApiResponse } from "@/services/apiService";
import { UserStatisticsResponse, ChampionStatisticsResponse } from "@/data/types/statistics";
import api from "@/services/index";

export type Position = "ALL" | "TOP" | "JUG" | "MID" | "ADC" | "SUP";

export const getUserStatistics = async (
  guildId: string,
  position: Position
): Promise<ApiResponse<UserStatisticsResponse>> => {
  try {
    return await api.get(`/api/statistics/${guildId}/users?position=${position}&sortBy=winRate`);
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
    return await api.get(`/api/statistics/${guildId}/champions?position=ALL&sortBy=winRate`);
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
};
