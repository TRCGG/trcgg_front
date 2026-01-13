// components/layout/SummonerPageHeader.tsx
import Image from "next/image";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import TextLogo from "@/assets/images/textLogo.png";
import NavBar from "@/components/layout/NavBar";
import SearchBarSmall from "@/components/form/SearchBarSmall";
import SearchBarResultList from "@/features/search/SearchBarResultList";
import RecentSearchList from "@/features/search/RecentSearchList";
import DiscordLoginButton from "@/components/ui/DiscordLoginButton";
import GuildDropdown from "@/features/discordLogin/GuildDropdown";
import useClickOutside from "@/hooks/common/useClickOutside";
import { PlayerInfo } from "@/data/types/user";
import { GuildInfo } from "@/data/types/auth";
import { addRecentSearch } from "@/utils/recentSearches";
import { handleRiotNameSearch } from "@/utils/parseRiotSearch";

interface Props {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  isError: boolean;
  users: PlayerInfo[] | undefined;
  guilds: GuildInfo[];
  selectedGuildId: string;
  onGuildChange: (encodedGuildId: string) => void;
  username?: string;
  isLoggedIn: boolean;
}

const SummonerPageHeader = ({
  searchTerm,
  setSearchTerm,
  onSearch,
  isLoading,
  isError,
  users,
  guilds,
  selectedGuildId,
  onGuildChange,
  username,
  isLoggedIn,
}: Props) => {
  const router = useRouter();
  const searchContainerRef = useRef(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useClickOutside(searchContainerRef, () => setIsSearchFocused(false));

  const handleDiscordLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`;
  };

  // 검색 실행 및 최근 검색어 저장
  const handleSearch = () => {
    const [riotName, riotTag] = handleRiotNameSearch(searchTerm);

    // 최근 검색어 저장 (동기 처리)
    if (riotName && riotTag) {
      addRecentSearch({ riotName, riotTag });
    }

    // 페이지 이동
    onSearch();
  };

  // 최근 검색어 클릭 핸들러
  const handleRecentSearchClick = (riotName: string, riotTag: string) => {
    // 최근 검색어 저장 후 페이지 이동
    addRecentSearch({ riotName, riotTag });
    router.push(`/summoners/${encodeURIComponent(riotName)}/${encodeURIComponent(riotTag)}`);
  };

  return (
    <header className="flex flex-col md:flex-row justify-start md:justify-between mt-2 md:mt-10 md:items-center md:gap-10 md:min-w-[1080px]">
      <div className="flex flex-col md:flex-row items-center gap-4 md:min-w-[450px]">
        <div className="md:hidden self-end flex gap-3 items-center">
          {isLoggedIn && (
            <GuildDropdown
              guilds={guilds}
              selectedGuildId={selectedGuildId}
              onGuildChange={onGuildChange}
            />
          )}
          <DiscordLoginButton onClick={handleDiscordLogin} username={username} />
        </div>
        <div className="w-[115px] h-[64px] justify-start">
          <Image
            src={TextLogo}
            alt="logo"
            width={115}
            height={64}
            className="cursor-pointer"
            onClick={() => router.push("/")}
          />
        </div>
        <div ref={searchContainerRef} className="w-full md:w-[400px] z-10">
          <SearchBarSmall
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={handleSearch}
            placeholder="플레이어 이름#KR1"
            onFocus={() => setIsSearchFocused(true)}
          />
          {/* 검색 결과 또는 최근 검색어 */}
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
      </div>
      <div className="flex items-center justify-start md:justify-end gap-3 mt-3 md:mt-0">
        <NavBar />
        {isLoggedIn && (
          <div className="hidden md:block">
            <GuildDropdown
              guilds={guilds}
              selectedGuildId={selectedGuildId}
              onGuildChange={onGuildChange}
            />
          </div>
        )}
        <div className="hidden md:block">
          <DiscordLoginButton onClick={handleDiscordLogin} username={username} />
        </div>
      </div>
    </header>
  );
};

export default SummonerPageHeader;
