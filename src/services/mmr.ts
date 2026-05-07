import { ApiResponse } from "@/services/apiService";
import { PlayerMmr } from "@/data/types/mmr";
import api from "@/services/index";

export const getPlayerMmr = async (
  puuid: string,
  guildId: string
): Promise<ApiResponse<PlayerMmr | null>> => {
  try {
    const response = await api.get<PlayerMmr>(`/api/mmr/players/${encodeURIComponent(puuid)}`, {
      guildId,
    });

    if (response.status === 404) {
      return {
        data: null,
        error: null,
        status: 404,
        headers: response.headers,
      };
    }

    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
};
