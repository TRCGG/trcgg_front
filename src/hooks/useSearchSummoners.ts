import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { getUsers } from "@/services/user";
import { ApiResponse } from "@/services/apiService";
import { UserSearchResult } from "@/data/types/user";
import { handleRiotNameSearch } from "@/utils/parseRiotSearch";
import { useRouter } from "next/router";

interface DebouncedTerm {
  riotName: string;
  riotNameTag: string | null;
}

/**
 * 검색어와 길드 ID를 기반으로 유저 리스트를 조회하는 훅
 * @param searchTerm 입력한 검색어
 * @param guildId 현재 선택된 디스코드 길드 ID
 */
export const useSearchSummoners = (searchTerm: string, guildId: string) => {
  const router = useRouter();

  const [debouncedTerm, setDebouncedTerm] = useState<DebouncedTerm>({
    riotName: "",
    riotNameTag: null,
  });

  // 디바운싱 로직
  const debouncedSearch = useMemo(
    () =>
      debounce((term: string) => {
        const [riotName, riotNameTag] = handleRiotNameSearch(term);
        setDebouncedTerm({
          riotName: riotName || "",
          riotNameTag: riotNameTag || null,
        });
      }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  const queryEnabled = debouncedTerm.riotName.length >= 2 && !!guildId;

  const { data, isLoading, isError } = useQuery<ApiResponse<UserSearchResult[]>>({
    queryKey: ["userList", debouncedTerm.riotName, debouncedTerm.riotNameTag, guildId],
    queryFn: () => getUsers(debouncedTerm.riotName, debouncedTerm.riotNameTag, guildId),
    enabled: queryEnabled,
  });

  // 검색 버튼 클릭 callback
  const handleSearchButtonClick = async () => {
    if (!debouncedTerm.riotName) {
      return;
    }
    if (!guildId) {
      console.error("Empty guildId");
      return;
    }
    if (!data || isError) {
      // TODO : 추후 유저를 찾을 수 없습니다 페이지로 이동하게되면 수정 필요
      window.alert("No user found.");
      return;
    }

    const users = data.data ?? [];
    if (users.length === 1) {
      router.push(`/summoners/${encodeURIComponent(users[0].riot_name)}`);
    } else if (users.length > 1) {
      window.alert("Many user found.");
    }
  };

  return {
    data,
    isLoading,
    isError,
    handleSearchButtonClick,
  };
};
