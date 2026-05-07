import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/services/apiService";
import { PlayerMmr } from "@/data/types/mmr";
import { getPlayerMmr } from "@/services/mmr";

const POLL_INTERVAL_MS = 5000;

const usePlayerMmr = (puuid?: string, guildId?: string) => {
  return useQuery<ApiResponse<PlayerMmr | null>>({
    queryKey: ["playerMmr", puuid, guildId],
    queryFn: () => getPlayerMmr(puuid!, guildId!),
    enabled: !!puuid && !!guildId,
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: false,
    staleTime: 0,
  });
};

export default usePlayerMmr;
