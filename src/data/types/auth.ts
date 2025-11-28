export interface UserInfo {
  id: string;
  username: string;
  avatar: string;
}

export interface MeResponse {
  status: string;
  message: string;
  data: UserInfo;
}

export interface GuildInfo {
  id: string;
  name: string;
  icon: string;
  banner: string | null;
}

export interface GuildsResponse {
  status: string;
  message: string;
  data: GuildInfo[];
}
