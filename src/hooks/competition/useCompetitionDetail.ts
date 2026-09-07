import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/services/apiService";
import { CompetitionDetailResponse } from "@/data/types/competition";
import { getCompetitionDetail } from "@/services/competition";

/**
 * 대회 상세(경기 목록 포함). 현황판·신청 승인·참가 신청 화면이 제목·상태·규모를 여기서 읽는다.
 * @param guildId Base64 인코딩된 길드 ID
 */
const useCompetitionDetail = (guildId: string, competitionId: number | null) => {
  const { data, isLoading, refetch } = useQuery<ApiResponse<CompetitionDetailResponse>>({
    queryKey: ["competitionDetail", guildId, competitionId],
    queryFn: () => getCompetitionDetail(guildId, competitionId as number),
    enabled: !!guildId && competitionId !== null,
    staleTime: 30 * 1000,
  });

  return {
    competition: data?.data?.data ?? null,
    error: data?.error ?? null,
    status: data?.status,
    isLoading,
    refetch,
  };
};

export default useCompetitionDetail;
