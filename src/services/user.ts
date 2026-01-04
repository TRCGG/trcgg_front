import { ApiResponse } from "@/services/apiService";
import { UserSearchResult } from "@/data/types/user";
import api from "@/services/index";

export const getUsers = async (
  riotName: string,
  riotNameTag: string | null,
  guildId?: string
): Promise<ApiResponse<UserSearchResult>> => {
  const params: Record<string, string> = {};
  if (riotNameTag) params.riotNameTag = riotNameTag;

  try {
    return await api.get(`/api/guildMember/${guildId ?? ""}/${riotName}`, params);
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
};
