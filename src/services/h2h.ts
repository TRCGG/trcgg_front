import { unwrap } from "@/services/apiService";
import {
  FrequentOpponent,
  FrequentOpponentsResponse,
  H2HCandidate,
  H2HDetail,
  H2HDetailResponse,
} from "@/data/types/h2h";
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
): Promise<FrequentOpponent[]> => {
  const query = buildQuery({
    riotName,
    riotNameTag: params?.riotNameTag,
    q: params?.q,
    season: params?.season,
    limit: params?.limit,
  });
  return unwrap(api.get<FrequentOpponentsResponse>(`/api/h2h/${guildId}/frequent${query}`));
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
): Promise<H2HDetail | H2HCandidate[] | null> => {
  const query = buildQuery({
    riotName1: me.riotName,
    riotNameTag1: me.riotNameTag,
    riotName2: oppo.riotName,
    riotNameTag2: oppo.riotNameTag,
    season: params?.season,
    recentLimit: params?.recentLimit,
    recentOffset: params?.recentOffset,
  });
  return unwrap(api.get<H2HDetailResponse>(`/api/h2h/${guildId}${query}`));
};
