import { useRouter } from "next/router";
import useDebouncedRiotNameTag from "@/hooks/searchUserList/useDebouncedRiotNameTag";
import useUserSearchQuery from "@/hooks/searchUserList/useUserSearchQuery";

/**
 * 검색어와 길드 ID를 기반으로 유저 리스트를 조회하는 로직을 전담하는 훅
 * @param searchTerm 입력한 검색어
 * @param guildId 현재 선택된 디스코드 길드 ID
 */
const useUserSearchController = (searchTerm: string, guildId: string) => {
  const router = useRouter();
  const { debouncedTerm, isTyping } = useDebouncedRiotNameTag(searchTerm);
  const { data, isLoading, isError } = useUserSearchQuery(
    isTyping ? { riotName: "", riotNameTag: "" } : debouncedTerm,
    guildId
  );
  // 검색 버튼 클릭 callback함수, 라우팅 처리 포함
  const handleSearchButtonClick = async () => {
    if (!debouncedTerm.riotName || !guildId) {
      return;
    }

    const users = data?.data?.data ?? [];
    if (users.length === 1) {
      router.push(
        `/summoners/${encodeURIComponent(users[0].riot_account.riotName)}/${encodeURIComponent(users[0].riot_account.riotNameTag)}`
      );
    } else {
      router.push(`/summoners/${encodeURIComponent(debouncedTerm.riotName)}`);
    }
  };

  return {
    data: data?.data,
    isLoading,
    isError,
    handleSearchButtonClick,
  };
};

export default useUserSearchController;
