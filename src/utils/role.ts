import { Role } from "@/data/types/guildMember";

export const ROLE_HIERARCHY: Record<Role, number> = {
  userNormal: 0,
  userUploader: 1,
  guildManager: 2,
  adminNormal: 3,
  adminSuper: 4,
};

export const hasMinRole = (role: string | undefined, minRole: Role): boolean => {
  if (!role || !(role in ROLE_HIERARCHY)) return false;
  return ROLE_HIERARCHY[role as Role] >= ROLE_HIERARCHY[minRole];
};

// 매니저 페이지 진입 가능 역할
export const canManageGuild = (role: string | undefined): boolean =>
  hasMinRole(role, "guildManager");

interface RoleMeta {
  label: string;
  textClass: string;
  bgClass: string;
}

export const ROLE_META: Record<string, RoleMeta> = {
  adminSuper: { label: "관리자", textClass: "text-yellow", bgClass: "bg-yellow/10" },
  adminNormal: { label: "관리자", textClass: "text-yellow", bgClass: "bg-yellow/10" },
  guildManager: { label: "매니저", textClass: "text-blueText", bgClass: "bg-blueText/10" },
  userUploader: { label: "업로더", textClass: "text-neonGreen", bgClass: "bg-neonGreen/10" },
  userNormal: { label: "일반", textClass: "text-primary2", bgClass: "bg-primary2/10" },
};

export const getRoleMeta = (role: string): RoleMeta => ROLE_META[role] ?? ROLE_META.userNormal;
