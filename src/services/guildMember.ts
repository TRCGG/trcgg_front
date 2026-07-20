import { ApiResponse } from "@/services/apiService";
import {
  GuildMembersResponse,
  UpdateMemberRoleResponse,
  GuildResponse,
  AssignableRole,
  MemberListResponse,
  SubAccountListResponse,
  MemberStatus,
} from "@/data/types/guildMember";
import api from "@/services/index";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

// guildId는 Base64 인코딩된 값 — path 엔드포인트는 그대로(서버가 디코드), body 엔드포인트는 atob로 디코드해 전달
const errResponse = (error: unknown) => ({
  data: null,
  error: error instanceof Error ? error.message : "Unknown error",
  status: 500,
});

// 클랜원(본계정) 목록 조회. status=1(활성)/2(비활성)/all
export const getGuildMembers = async (
  guildId: string,
  {
    status = "all",
    page,
    limit,
  }: { status?: MemberStatus | "all"; page?: number; limit?: number } = {}
): Promise<ApiResponse<MemberListResponse>> => {
  try {
    const params: Record<string, string> = { status };
    if (page) params.page = String(page);
    if (limit) params.limit = String(limit);
    return await api.get(`/api/guildMember/${guildId}/members`, params);
  } catch (error) {
    return errResponse(error);
  }
};

// 연결된 부계정 목록 조회 (sub → main 링크)
export const getSubAccounts = async (
  guildId: string
): Promise<ApiResponse<SubAccountListResponse>> => {
  try {
    return await api.get(`/api/guildMember/${guildId}/sub-accounts`);
  } catch (error) {
    return errResponse(error);
  }
};

// 부계정 연결
export const linkSubAccount = async (
  guildId: string,
  payload: { subRiotName: string; subRiotTag: string; mainRiotName: string; mainRiotTag: string }
): Promise<ApiResponse<unknown>> => {
  try {
    return await api.post(`/api/guildMember/sub-account`, { guildId: atob(guildId), ...payload });
  } catch (error) {
    return errResponse(error);
  }
};

// 부계정 연결 해제 (DELETE + body — ApiService가 body를 지원하지 않아 raw fetch 사용)
export const removeSubAccount = async (
  guildId: string,
  payload: { riotName: string; riotNameTag: string }
): Promise<ApiResponse<unknown>> => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(`${BASE_URL}/api/guildMember/sub-account`, {
      method: "DELETE",
      headers,
      credentials: "include",
      body: JSON.stringify({ guildId: atob(guildId), ...payload }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return {
        data: null,
        error: data?.message || `Error: ${response.status}`,
        status: response.status,
      };
    }
    return { data, error: null, status: response.status };
  } catch (error) {
    return errResponse(error);
  }
};

// 클랜원 상태 변경 (1: 활성 / 2: 비활성) — 부계정 포함 일괄 처리
export const updateMemberStatus = async (
  guildId: string,
  payload: { riotName: string; riotNameTag: string; status: MemberStatus }
): Promise<ApiResponse<unknown>> => {
  try {
    return await api.put(`/api/guildMember/status`, { guildId: atob(guildId), ...payload });
  } catch (error) {
    return errResponse(error);
  }
};
