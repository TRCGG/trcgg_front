export interface GuildInfo {
  id: string;
  name: string;
  icon: string;
  banner: string | null;
}

export type GuildsResponse = {
  status: string;
  message: string;
  data: GuildInfo[];
};
