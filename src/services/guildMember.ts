import { ApiResponse, toErrorResponse, unwrap } from "@/services/apiService";
import {
  AssignableRole,
  DiscordMemberRoleItem,
  GuildMemberRow,
  GuildMembersResponse,
  GuildResponse,
  GuildRow,
  MemberListResponse,
  MemberStatus,
  SubAccountLink,
  SubAccountListResponse,
  UpdateMemberRoleResponse,
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
): Promise<DiscordMemberRoleItem[]> => {
  const params: Record<string, string> = {
    page: String(page),
    limit: String(limit),
  };
  if (search) params.search = search;
  return unwrap(
    api.get<GuildMembersResponse>(`/api/guildMember/${guildId}/discord-members`, params)
  );
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
    return toErrorResponse(error);
  }
};

// 주의: GET /api/guilds/{id}는 Base64가 아닌 원본 id를 받음(다른 엔드포인트와 달리 디코딩 미들웨어 없음)
export const getGuildById = async (guildId: string): Promise<GuildRow> => {
  return unwrap(api.get<GuildResponse>(`/api/guilds/${atob(guildId)}`));
};

export const setAllowAllUploads = async (
  guildId: string,
  allowAllUploads: boolean
): Promise<ApiResponse<GuildResponse>> => {
  try {
    return await api.patch(`/api/guilds/${guildId}/allow-all-uploads`, { allowAllUploads });
  } catch (error) {
    return toErrorResponse(error);
  }
};

// guildId는 Base64 인코딩된 값 — path 엔드포인트는 그대로(서버가 디코드), body 엔드포인트는 atob로 디코드해 전달
// 클랜원(본계정) 목록 조회. status=1(활성)/2(비활성)/all
export const getGuildMembers = async (
  guildId: string,
  {
    status = "all",
    page,
    limit,
  }: { status?: MemberStatus | "all"; page?: number; limit?: number } = {}
): Promise<GuildMemberRow[]> => {
  const params: Record<string, string> = { status };
  if (page) params.page = String(page);
  if (limit) params.limit = String(limit);
  return unwrap(api.get<MemberListResponse>(`/api/guildMember/${guildId}/members`, params));
};

// 연결된 부계정 목록 조회 (sub → main 링크)
export const getSubAccounts = async (guildId: string): Promise<SubAccountLink[]> => {
  return unwrap(api.get<SubAccountListResponse>(`/api/guildMember/${guildId}/sub-accounts`));
};

// 부계정 연결
export const linkSubAccount = async (
  guildId: string,
  payload: { subRiotName: string; subRiotTag: string; mainRiotName: string; mainRiotTag: string }
): Promise<ApiResponse<unknown>> => {
  try {
    return await api.post(`/api/guildMember/sub-account`, { guildId: atob(guildId), ...payload });
  } catch (error) {
    return toErrorResponse(error);
  }
};

// 부계정 연결 해제
export const removeSubAccount = async (
  guildId: string,
  payload: { riotName: string; riotNameTag: string }
): Promise<ApiResponse<unknown>> => {
  try {
    return await api.delete(`/api/guildMember/sub-account`, {
      body: { guildId: atob(guildId), ...payload },
    });
  } catch (error) {
    return toErrorResponse(error);
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
    return toErrorResponse(error);
  }
};
