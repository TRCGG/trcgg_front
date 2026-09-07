import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/services/apiService";
import { PlayerCompetitionListResponse } from "@/data/types/competition";
import { getPlayerCompetitions } from "@/services/competition";

/**
 * 한 선수가 참여한 대회 목록. 전적 페이지의 대회 탭에서 쓴다.
 * @param guildId Base64 인코딩된 길드 ID
 * @param playerCode 대시보드 응답의 member.playerCode
 */
const usePlayerCompetitions = (guildId: string, playerCode: string | null, enabled = true) => {
  const { data, isLoading } = useQuery<ApiResponse<PlayerCompetitionListResponse>>({
    queryKey: ["playerCompetitions", guildId, playerCode],
    queryFn: () => getPlayerCompetitions(guildId, playerCode as string),
    enabled: enabled && !!guildId && !!playerCode,
    staleTime: 60 * 1000,
  });

  return {
    competitions: data?.data?.data ?? [],
    error: data?.error ?? null,
    isLoading,
  };
};

export default usePlayerCompetitions;
