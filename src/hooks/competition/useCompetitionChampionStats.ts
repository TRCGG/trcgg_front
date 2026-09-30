import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { CompetitionChampionStat } from "@/data/types/competition";
import { getCompetitionChampionStatistics } from "@/services/competition";
import { Position } from "@/services/statistics";

/**
 * 대회 챔피언 통계(라인별). useQueries는 키가 바뀌면 새 옵저버를 만들어 keepPreviousData가
 * 먹지 않으므로 따로 둔다 — 라인을 바꿔도 이전 결과를 들고 있어야 카드만 로딩된다.
 * @param guildId Base64 인코딩된 길드 ID
 */
const useCompetitionChampionStats = (
  guildId: string,
  competitionId: number | null,
  position: Position,
  enabled: boolean
) => {
  const { data, isPending, isFetching } = useQuery<CompetitionChampionStat[]>({
    queryKey: ["competitionChampionStats", guildId, competitionId, position],
    // 전체는 position을 빼야 라인 구분 없이 챔피언별로 합산된다(ALL은 챔피언×라인 행을 준다).
    queryFn: () =>
      getCompetitionChampionStatistics(guildId, competitionId as number, {
        limit: 500,
        position: position === "ALL" ? undefined : position,
      }),
    enabled: enabled && !!guildId && competitionId !== null,
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });

  return { champions: data ?? [], isPending, isFetching };
};

export default useCompetitionChampionStats;
