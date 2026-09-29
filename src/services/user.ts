import { unwrap } from "@/services/apiService";
import { PlayerInfo, UserSearchResult } from "@/data/types/user";
import api from "@/services/index";
import buildQuery from "@/utils/buildQuery";

export const getUsers = async (
  riotName: string,
  riotNameTag: string | null,
  guildId?: string
): Promise<PlayerInfo[]> => {
  const query = buildQuery({ riotNameTag: riotNameTag ?? undefined });
  return unwrap(api.get<UserSearchResult>(`/api/guildMember/${guildId ?? ""}/${riotName}${query}`));
};
