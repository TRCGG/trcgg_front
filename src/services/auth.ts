import { ApiResponse, toErrorResponse, unwrap } from "@/services/apiService";
import { GuildInfo, GuildsResponse, MeResponse } from "@/data/types/auth";
import api from "@/services/index";

export const getGuilds = async (): Promise<GuildInfo[]> => {
  return unwrap(api.get<GuildsResponse>("/api/auth/gmokGuilds"));
};

export const getMe = async (): Promise<MeResponse["data"]> => {
  return unwrap(api.get<MeResponse>("/api/auth/me"));
};

export const logout = async (): Promise<ApiResponse<null>> => {
  try {
    return await api.post("/api/auth/logout");
  } catch (error) {
    return toErrorResponse(error);
  }
};
