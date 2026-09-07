import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/services/apiService";
import { ChampionListResponse } from "@/data/types/champion";
import { getChampions } from "@/services/champion";

/** 챔피언 목록은 패치 사이에 바뀌지 않으므로 세션 내내 캐시한다. */
const useChampions = (enabled = true) => {
  const { data, isLoading } = useQuery<ApiResponse<ChampionListResponse>>({
    queryKey: ["champions"],
    queryFn: () => getChampions(),
    enabled,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return { champions: data?.data?.data ?? [], isLoading };
};

export default useChampions;
