import { unwrap } from "@/services/apiService";
import {
  ChampionStatistics,
  ChampionStatisticsResponse,
  UserStatistics,
  UserStatisticsResponse,
} from "@/data/types/statistics";
import api from "@/services/index";
import buildQuery from "@/utils/buildQuery";

export type Position = "ALL" | "TOP" | "JUG" | "MID" | "ADC" | "SUP";
export type DatePreset = "recent" | "season" | "range";

export const getUserStatistics = async (
  guildId: string,
  position: Position,
  datePreset?: DatePreset,
  season?: string,
  fromMonth?: number,
  toMonth?: number
): Promise<UserStatistics[]> => {
  const query = buildQuery({
    position: position !== "ALL" ? position : undefined,
    sortBy: "winRate",
    limit: 100000,
    datePreset,
    season,
    fromMonth,
    toMonth,
  });

  return unwrap(api.get<UserStatisticsResponse>(`/api/statistics/${guildId}/users${query}`));
};

export const getChampionStatistics = async (
  guildId: string,
  position: Position,
  datePreset?: DatePreset,
  season?: string,
  fromMonth?: number,
  toMonth?: number
): Promise<ChampionStatistics[]> => {
  const query = buildQuery({
    position,
    sortBy: "winRate",
    limit: 100000,
    datePreset,
    season,
    fromMonth,
    toMonth,
  });

  return unwrap(
    api.get<ChampionStatisticsResponse>(`/api/statistics/${guildId}/champions${query}`)
  );
};
