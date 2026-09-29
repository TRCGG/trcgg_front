import { unwrap } from "@/services/apiService";
import {
  GuildInfo,
  GuildsResponse,
  MeResponse,
  PublicGuild,
  PublicGuildsResponse,
} from "@/data/types/auth";
import api from "@/services/index";

export const getGuilds = async (): Promise<GuildInfo[]> => {
  return unwrap(api.get<GuildsResponse>("/api/auth/gmokGuilds"));
};

// 백엔드가 공개·비공개 길드를 함께 주고 isPublic으로 거르게 한다(limit 최대 100)
export const getPublicGuilds = async (): Promise<PublicGuild[]> => {
  const guilds = await unwrap(api.get<PublicGuildsResponse>("/api/guilds", { limit: "100" }));
  return (guilds ?? []).filter((guild) => guild.isPublic);
};

export const getMe = async (): Promise<MeResponse["data"]> => {
  return unwrap(api.get<MeResponse>("/api/auth/me"));
};

// 백엔드가 302로 프론트 URL에 보내 XHR은 CORS로 실패하지만, 쿠키는 그 응답에서 이미 지워진다
export const logout = async (): Promise<void> => {
  await api.post("/api/auth/logout").catch(() => undefined);
};
