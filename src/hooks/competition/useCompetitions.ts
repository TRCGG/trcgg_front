import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/services/apiService";
import { CompetitionListResponse, CompetitionStatus } from "@/data/types/competition";
import { getCompetitions } from "@/services/competition";

/**
 * 길드의 대회 목록을 조회한다.
 * @param guildId Base64 인코딩된 길드 ID
 * @param status 생략하면 전체
 */
const useCompetitions = (guildId: string, status?: CompetitionStatus) => {
  const { data, isLoading, isFetching, refetch } = useQuery<ApiResponse<CompetitionListResponse>>({
    queryKey: ["competitions", guildId, status ?? "ALL"],
    queryFn: () => getCompetitions(guildId, { status }),
    enabled: !!guildId,
    staleTime: 60 * 1000,
  });

  return {
    competitions: data?.data?.data ?? [],
    error: data?.error ?? null,
    isLoading,
    isFetching,
    refetch,
  };
};

export default useCompetitions;
