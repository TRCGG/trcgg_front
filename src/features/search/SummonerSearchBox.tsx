import { useRef, useState } from "react";
import { useRouter } from "next/router";
import SearchBar from "@/components/form/SearchBar";
import SearchBarResultList from "@/features/search/SearchBarResultList";
import RecentSearchList from "@/features/search/RecentSearchList";
import useClickOutside from "@/hooks/common/useClickOutside";
import useUserSearchController from "@/hooks/searchUserList/useUserSearchController";

interface SummonerSearchBoxProps {
  guildId: string;
}

/** 검색창 + 자동완성 결과 + 최근 검색어. 검색 화면과 소개 화면이 함께 쓴다. */
const SummonerSearchBox = ({ guildId }: SummonerSearchBoxProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { users, isLoading, isError, handleSearchButtonClick } = useUserSearchController(
    searchTerm,
    guildId
  );

  useClickOutside(containerRef, () => setIsSearchFocused(false));

  const handleRecentSearchClick = (riotName: string, riotTag: string) => {
    router.push(`/summoners/${encodeURIComponent(riotName)}/${encodeURIComponent(riotTag)}`);
  };

  const isTooShort = searchTerm !== "" && searchTerm.length < 2;

  return (
    <>
      <div ref={containerRef}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={handleSearchButtonClick}
          placeholder="플레이어 이름#KR1"
          onFocus={() => setIsSearchFocused(true)}
        />
        {searchTerm.length >= 2 ? (
          <SearchBarResultList
            isLoading={isLoading}
            isError={isError}
            users={users}
            enable={isSearchFocused}
            searchTerm={searchTerm}
          />
        ) : (
          <RecentSearchList enable={isSearchFocused} onSearchClick={handleRecentSearchClick} />
        )}
      </div>
      {isTooShort && <div className="text-blueText text-md">최소 2글자 이상 작성해주세요.</div>}
    </>
  );
};

export default SummonerSearchBox;
