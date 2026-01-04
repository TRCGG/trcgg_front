import { useRouter } from "next/router";
import useDebouncedRiotNameTag from "@/hooks/searchUserList/useDebouncedRiotNameTag";
import useUserSearchQuery from "@/hooks/searchUserList/useUserSearchQuery";
import { handleRiotNameSearch } from "@/utils/parseRiotSearch";

/**
 * 검색어와 길드 ID를 기반으로 유저 리스트를 조회하는 로직을 전담하는 훅
 * @param searchTerm 입력한 검색어
 * @param guildId 현재 선택된 디스코드 길드 ID
 */
const useUserSearchController = (searchTerm: string, guildId: string) => {
  const router = useRouter();
  const { debouncedTerm, isTyping, flushDebounce } = useDebouncedRiotNameTag(searchTerm);
  const { data, isLoading, isError } = useUserSearchQuery(
    isTyping ? { riotName: "", riotNameTag: "" } : debouncedTerm,
    guildId
  );

  // 검색 버튼 클릭 callback함수, 라우팅 처리 포함
  const handleSearchButtonClick = async () => {
    flushDebounce(searchTerm);

    const [riotName] = handleRiotNameSearch(searchTerm);

    if (!riotName || !guildId) {
      return;
    }

    // 엔터를 눌렀을 때는 항상 현재 입력값으로 라우팅
    // [riotName].tsx에서 결과가 1개면 자동으로 리다이렉트됨
    router.push(`/summoners/${encodeURIComponent(riotName)}`);
  };

  return {
    data: data?.data,
    isLoading,
    isError,
    handleSearchButtonClick,
  };
};

export default useUserSearchController;
