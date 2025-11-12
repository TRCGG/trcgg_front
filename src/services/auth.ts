import { ApiResponse } from "@/services/apiService";
import { GuildsResponse } from "@/data/types/guild";
import api from "@/services/index";

export const getGuilds = async (): Promise<ApiResponse<GuildsResponse>> => {
  try {
    return await api.get("/api/auth/guilds");
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
};
