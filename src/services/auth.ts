import { ApiResponse, toErrorResponse } from "@/services/apiService";
import { GuildsResponse, MeResponse } from "@/data/types/auth";
import api from "@/services/index";

export const getGuilds = async (): Promise<ApiResponse<GuildsResponse>> => {
  try {
    return await api.get("/api/auth/gmokGuilds");
  } catch (error) {
    return toErrorResponse(error);
  }
};

export const getMe = async (): Promise<ApiResponse<MeResponse>> => {
  try {
    return await api.get("/api/auth/me");
  } catch (error) {
    return toErrorResponse(error);
  }
};

export const logout = async (): Promise<ApiResponse<null>> => {
  try {
    return await api.post("/api/auth/logout");
  } catch (error) {
    return toErrorResponse(error);
  }
};
