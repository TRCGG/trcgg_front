import { useQuery } from "@tanstack/react-query";

const DDRAGON_VERSION = process.env.NEXT_PUBLIC_DDRAGON_VERSION;

interface ChampionEntry {
  id: string;
  name: string;
}

const fetchChampionKoNames = async (): Promise<Record<string, string>> => {
  const res = await fetch(
    `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/data/ko_KR/champion.json`
  );
  if (!res.ok) return {};
  const json = await res.json();
  const map: Record<string, string> = {};
  Object.values(json.data as Record<string, ChampionEntry>).forEach((c) => {
    map[c.id] = c.name;
  });
  return map;
};

/**
 * 영문 챔피언 키(id) → 한글명 변환 함수를 반환한다.
 * ddragon ko_KR champion.json을 한 번만 받아 캐싱한다. 로드 전/실패 시엔 영문 키를 그대로 반환.
 */
const useChampionKoNames = () => {
  const { data } = useQuery<Record<string, string>>({
    queryKey: ["championKoNames", DDRAGON_VERSION],
    queryFn: fetchChampionKoNames,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const map = data ?? {};
  return (en?: string | null): string => (en ? (map[en] ?? en) : "");
};

export default useChampionKoNames;
