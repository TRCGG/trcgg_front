import { ApiResponse } from "@/services/apiService";
import { UserStatisticsResponse, ChampionStatisticsResponse } from "@/data/types/statistics";
import api from "@/services/index";

export type Position = "ALL" | "TOP" | "JUG" | "MID" | "ADC" | "SUP";

export const getUserStatistics = async (
  guildId: string,
  position: Position,
  year?: number,
  month?: number
): Promise<ApiResponse<UserStatisticsResponse>> => {
  try {
    const positionParam = position === "ALL" ? "" : `position=${position}&`;
    const yearMonthParam = year && month ? `&year=${year}&month=${month}` : "";

    return await api.get(
      `/api/statistics/${guildId}/users?${positionParam}sortBy=winRate&limit=100000${yearMonthParam}`
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
  position: Position,
  year?: number,
  month?: number
): Promise<ApiResponse<ChampionStatisticsResponse>> => {
  try {
    const yearMonthParam = year && month ? `&year=${year}&month=${month}` : "";

    return await api.get(
      `/api/statistics/${guildId}/champions?position=${position}&sortBy=winRate&limit=100000${yearMonthParam}`
    );
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
};
