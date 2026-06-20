import { ApiResponse } from "@/services/apiService";
import { UserSearchResult } from "@/data/types/user";
import api from "@/services/index";
import buildQuery from "@/utils/buildQuery";

export const getUsers = async (
  riotName: string,
  riotNameTag: string | null,
  guildId?: string
): Promise<ApiResponse<UserSearchResult>> => {
  const query = buildQuery({ riotNameTag: riotNameTag ?? undefined });
  try {
    return await api.get(`/api/guildMember/${guildId ?? ""}/${riotName}${query}`);
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
};
