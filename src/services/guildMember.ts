import { ApiResponse } from "@/services/apiService";
import {
  GuildMembersResponse,
  UpdateMemberRoleResponse,
  GuildResponse,
  AssignableRole,
} from "@/data/types/guildMember";
import api from "@/services/index";

interface GetMembersParams {
  search?: string;
  page?: number;
  limit?: number;
}

// guildId는 useGuildManagement가 보관하는 이미 Base64 인코딩된 값 — 그대로 path에 사용(재인코딩 금지)
export const getGuildDiscordMembers = async (
  guildId: string,
  { search, page = 1, limit = 50 }: GetMembersParams = {}
): Promise<ApiResponse<GuildMembersResponse>> => {
  try {
    const params: Record<string, string> = {
      page: String(page),
      limit: String(limit),
    };
    if (search) params.search = search;
    return await api.get(`/api/guildMember/${guildId}/discord-members`, params);
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
};

export const updateMemberRole = async (
  guildId: string,
  memberId: string,
  role: AssignableRole
): Promise<ApiResponse<UpdateMemberRoleResponse>> => {
  try {
    return await api.patch(`/api/guildMember/${guildId}/discord-members/${memberId}/role`, {
      role,
    });
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
};

// 주의: GET /api/guilds/{id}는 Base64가 아닌 원본 id를 받음(다른 엔드포인트와 달리 디코딩 미들웨어 없음)
export const getGuildById = async (guildId: string): Promise<ApiResponse<GuildResponse>> => {
  try {
    return await api.get(`/api/guilds/${atob(guildId)}`);
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
};

export const setAllowAllUploads = async (
  guildId: string,
  allowAllUploads: boolean
): Promise<ApiResponse<GuildResponse>> => {
  try {
    return await api.patch(`/api/guilds/${guildId}/allow-all-uploads`, { allowAllUploads });
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
};
