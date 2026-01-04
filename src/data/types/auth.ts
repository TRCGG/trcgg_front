export interface UserInfo {
  id: string;
  username: string;
  global_name: string;
  avatar: string;
}

export interface MeResponse {
  status: string;
  message: string;
  data: {
    user: UserInfo;
  };
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
