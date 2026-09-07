import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/services/apiService";
import { ApplicationListResponse } from "@/data/types/competition";
import { getApplications } from "@/services/competition";

/**
 * 대회 신청 목록. 상태 필터가 서버에 있지만 탭 전환마다 재조회하지 않도록 전체를 받아
 * 화면에서 상태별로 나눈다(신청은 최대 수백 건이라 전량이 부담되지 않는다).
 */
const useCompetitionApplications = (guildId: string, competitionId: number | null) => {
  const { data, isLoading, isFetching, refetch } = useQuery<ApiResponse<ApplicationListResponse>>({
    queryKey: ["competitionApplications", guildId, competitionId],
    queryFn: () => getApplications(guildId, competitionId as number),
    enabled: !!guildId && competitionId !== null,
    staleTime: 15 * 1000,
  });

  return {
    applications: data?.data?.data ?? [],
    error: data?.error ?? null,
    isLoading,
    isFetching,
    refetch,
  };
};

export default useCompetitionApplications;
