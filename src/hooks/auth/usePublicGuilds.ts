import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { GuildInfo, PublicGuild } from "@/data/types/auth";
import { getPublicGuilds } from "@/services/auth";

// TRC-299 임시: LoLEX 전체공개. 되돌릴 때는 이 파일과 useGuildManagement의 호출부를 지운다
const usePublicGuilds = () => {
  const { data, isLoading } = useQuery<PublicGuild[]>({
    queryKey: ["publicGuilds"],
    queryFn: () => getPublicGuilds(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const publicGuilds = useMemo<GuildInfo[]>(
    () => (data ?? []).map(({ id, name }) => ({ id, name, icon: "", banner: null })),
    [data]
  );

  return { publicGuilds, isLoadingPublicGuilds: isLoading };
};

export default usePublicGuilds;
