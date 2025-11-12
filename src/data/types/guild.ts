export interface GuildInfo {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: string;
}

export type GuildsResponse = GuildInfo[];
