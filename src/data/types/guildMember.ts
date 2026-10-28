export const ROLES = [
  "userNormal",
  "userUploader",
  "guildManager",
  "adminNormal",
  "adminSuper",
] as const;

export type Role = (typeof ROLES)[number];

// 매니저가 부여/회수할 수 있는 역할 (그 외 역할은 고정)
export type AssignableRole = "userNormal" | "userUploader";

export interface DiscordMemberRoleItem {
  memberId: string;
  displayName: string;
  avatarUrl: string;
  role: string;
}

export interface GuildMembersResponse {
  status: string;
  message: string;
  data: DiscordMemberRoleItem[];
}

export interface UpdateMemberRoleData {
  memberId: string;
  guildId: string;
  role: string;
  changed: boolean;
}

export interface UpdateMemberRoleResponse {
  status: string;
  message: string;
  data: UpdateMemberRoleData;
}

export interface GuildDetail {
  id: string;
  name: string;
  languageCode: string;
  allowAllUploads: boolean;
  createDate: string;
  updateDate: string;
  isDeleted: boolean;
}

export interface GuildResponse {
  status: string;
  message: string;
  data: GuildDetail;
}

// 클랜원 상태 (1: 활성, 2: 비활성/탈퇴)
export type MemberStatus = "1" | "2";

export interface GuildMemberRow {
  playerCode: string;
  riotName: string;
  riotNameTag: string;
  status: MemberStatus;
  createDate: string;
  updateDate: string;
}

export interface MemberListResponse {
  status: string;
  message: string;
  data: GuildMemberRow[];
}

export interface SubAccountLink {
  guildId: string;
  subRiotName: string;
  subRiotNameTag: string;
  mainRiotName: string | null;
  mainRiotNameTag: string | null;
}

export interface SubAccountListResponse {
  status: string;
  message: string;
  data: SubAccountLink[];
}
