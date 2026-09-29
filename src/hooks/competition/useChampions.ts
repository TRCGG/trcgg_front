import { useQuery } from "@tanstack/react-query";
import { ChampionItem } from "@/data/types/champion";
import { getChampions } from "@/services/champion";

/** 챔피언 목록은 패치 사이에 바뀌지 않으므로 세션 내내 캐시한다. */
const useChampions = (enabled = true) => {
  const { data, isLoading } = useQuery<ChampionItem[]>({
    queryKey: ["champions"],
    queryFn: () => getChampions(),
    enabled,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return { champions: data ?? [], isLoading };
};

export default useChampions;
