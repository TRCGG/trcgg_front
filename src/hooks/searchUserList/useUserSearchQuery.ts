import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/services/user";
import { ApiResponse } from "@/services/apiService";
import { UserSearchResult } from "@/data/types/user";

interface DebouncedTerm {
  riotName: string;
  riotNameTag: string | null;
}

/**
 * 검색어와 길드 ID를 기반으로 유저 리스트를 조회하는 훅
 * @param debouncedTerm Name, Tag로 파싱된 검색어
 * @param guildId 현재 선택된 디스코드 길드 ID
 */
const useUserSearchQuery = (debouncedTerm: DebouncedTerm, guildId: string) => {
  const queryEnabled = debouncedTerm.riotName.length >= 2 && !!guildId;

  console.log(`debounced name: ${debouncedTerm.riotName}, tag : ${debouncedTerm.riotNameTag}`);
  const { data, isLoading, isError } = useQuery<ApiResponse<UserSearchResult>>({
    queryKey: ["userList", debouncedTerm.riotName, debouncedTerm.riotNameTag, guildId],
    queryFn: () => getUsers(debouncedTerm.riotName, debouncedTerm.riotNameTag, guildId),
    enabled: queryEnabled,
    staleTime: 3 * 60 * 1000,
  });

  return {
    data,
    isLoading,
    isError,
  };
};

export default useUserSearchQuery;
