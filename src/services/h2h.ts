import { ApiResponse } from "@/services/apiService";
import { FrequentOpponentsResponse, H2HDetailResponse } from "@/data/types/h2h";
import api from "@/services/index";
import buildQuery from "@/utils/buildQuery";

/**
 * ① 자주 만난 상대
 * GET /api/h2h/{guildId}/frequent
 */
export const getFrequentOpponents = async (
  guildId: string,
  riotName: string,
  params?: {
    riotNameTag?: string;
    q?: string;
    season?: string;
    limit?: number;
  }
): Promise<ApiResponse<FrequentOpponentsResponse>> => {
  const query = buildQuery({
    riotName,
    riotNameTag: params?.riotNameTag,
    q: params?.q,
    season: params?.season,
    limit: params?.limit,
  });
  try {
    return await api.get(`/api/h2h/${guildId}/frequent${query}`);
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
};

/**
 * ② 상대전적 상세
 * GET /api/h2h/{guildId}
 */
export const getH2HDetail = async (
  guildId: string,
  me: { riotName: string; riotNameTag?: string },
  oppo: { riotName: string; riotNameTag?: string },
  params?: {
    season?: string;
    recentLimit?: number;
    recentOffset?: number;
  }
): Promise<ApiResponse<H2HDetailResponse>> => {
  const query = buildQuery({
    riotName1: me.riotName,
    riotNameTag1: me.riotNameTag,
    riotName2: oppo.riotName,
    riotNameTag2: oppo.riotNameTag,
    season: params?.season,
    recentLimit: params?.recentLimit,
    recentOffset: params?.recentOffset,
  });
  try {
    return await api.get(`/api/h2h/${guildId}${query}`);
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
};
