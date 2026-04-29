import { ApiResponse } from "@/services/apiService";
import { UserStatisticsResponse, ChampionStatisticsResponse } from "@/data/types/statistics";
import api from "@/services/index";

export type Position = "ALL" | "TOP" | "JUG" | "MID" | "ADC" | "SUP";
export type DatePreset = "recent" | "season" | "range";

const buildQuery = (params: Record<string, string | number | undefined>): string => {
  const parts = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}=${v}`);
  return parts.length ? `?${parts.join("&")}` : "";
};

export const getUserStatistics = async (
  guildId: string,
  position: Position,
  datePreset?: DatePreset,
  season?: string,
  fromMonth?: number,
  toMonth?: number
): Promise<ApiResponse<UserStatisticsResponse>> => {
  try {
    const query = buildQuery({
      position: position !== "ALL" ? position : undefined,
      sortBy: "winRate",
      limit: 100000,
      datePreset,
      season,
      fromMonth,
      toMonth,
    });

    return await api.get(`/api/statistics/${guildId}/users${query}`);
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
  datePreset?: DatePreset,
  season?: string,
  fromMonth?: number,
  toMonth?: number
): Promise<ApiResponse<ChampionStatisticsResponse>> => {
  try {
    const query = buildQuery({
      position,
      sortBy: "winRate",
      limit: 100000,
      datePreset,
      season,
      fromMonth,
      toMonth,
    });

    return await api.get(`/api/statistics/${guildId}/champions${query}`);
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
};
