import { ApiResponse } from "@/services/apiService";
import { UserStatisticsResponse, ChampionStatisticsResponse } from "@/data/types/statistics";
import api from "@/services/index";

export type Position = "ALL" | "TOP" | "JUG" | "MID" | "ADC" | "SUP";

export const getUserStatistics = async (
  guildId: string,
  position: Position
): Promise<ApiResponse<UserStatisticsResponse>> => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const positionParam = position === "ALL" ? "" : `position=${position}&`;

    return await api.get(
      `/api/statistics/${guildId}/users?${positionParam}sortBy=winRate&limit=100000&year=${year}&month=${month}`
    );
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
};

export const getChampionStatistics = async (
  guildId: string,
  position: Position
): Promise<ApiResponse<ChampionStatisticsResponse>> => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    return await api.get(
      `/api/statistics/${guildId}/champions?position=${position}&sortBy=winRate&limit=100000&year=${year}&month=${month}`
    );
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
};
