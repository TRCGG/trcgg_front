import { unwrap } from "@/services/apiService";
import api from "@/services/index";
import buildQuery from "@/utils/buildQuery";
import { Position } from "@/services/statistics";
import {
  ChampionCombination,
  ChampionCombinationType,
  ChampionCombinationsResponse,
  ClanActivity,
  ClanActivityResponse,
  ClanDuo,
  ClanDuosResponse,
  Highlights,
  HighlightsResponse,
  LeaderboardChampionStat,
  LeaderboardChampionsResponse,
  LeaderboardUser,
  LeaderboardUsersResponse,
  RisingStar,
  RisingStarsResponse,
  WinStreak,
  WinStreaksResponse,
} from "@/data/types/leaderboard";

// 기간은 백엔드 기본값(recent = 최근 30일)을 쓴다.

export const getLeaderboardUsers = async (
  guildId: string,
  position: Position,
  sortBy: "totalCount" | "wilsonScore"
): Promise<LeaderboardUser[]> => {
  const query = buildQuery({ position, sortBy });
  return unwrap(
    api.get<LeaderboardUsersResponse>(`/api/statistics/${guildId}/leaderboard/users${query}`)
  );
};

export const getLeaderboardChampions = async (
  guildId: string,
  position: Position,
  sortBy: "pickRate" | "wilsonScore"
): Promise<LeaderboardChampionStat[]> => {
  const query = buildQuery({ position, sortBy });
  return unwrap(
    api.get<LeaderboardChampionsResponse>(
      `/api/statistics/${guildId}/leaderboard/champions${query}`
    )
  );
};

export const getChampionCombinations = async (
  guildId: string,
  combination: ChampionCombinationType
): Promise<ChampionCombination[]> => {
  const query = buildQuery({ combination });
  return unwrap(
    api.get<ChampionCombinationsResponse>(
      `/api/statistics/${guildId}/champion-combinations${query}`
    )
  );
};

export const getClanDuos = async (guildId: string): Promise<ClanDuo[]> => {
  return unwrap(api.get<ClanDuosResponse>(`/api/statistics/${guildId}/duos`));
};

export const getClanActivity = async (guildId: string): Promise<ClanActivity> => {
  return unwrap(api.get<ClanActivityResponse>(`/api/statistics/${guildId}/activity`));
};

export const getRisingStars = async (guildId: string): Promise<RisingStar[]> => {
  return unwrap(api.get<RisingStarsResponse>(`/api/statistics/${guildId}/rising-stars`));
};

export const getHighlights = async (guildId: string): Promise<Highlights> => {
  return unwrap(api.get<HighlightsResponse>(`/api/statistics/${guildId}/highlights`));
};

export const getWinStreaks = async (guildId: string): Promise<WinStreak[]> => {
  return unwrap(api.get<WinStreaksResponse>(`/api/statistics/${guildId}/win-streaks`));
};
