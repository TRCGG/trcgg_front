import React, { useEffect, useRef, useState } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import NavBar from "@/components/layout/NavBar";
import SearchBar from "@/components/form/SearchBar";
import DiscordLoginButton from "@/components/ui/DiscordLoginButton";
import NoGuildModal from "@/features/discordLogin/NoGuildModal";
import GuildDropdown from "@/features/discordLogin/GuildDropdown";
import SearchBarResultList from "@/features/search/SearchBarResultList";
import RecentSearchList from "@/features/search/RecentSearchList";
import useModal from "@/hooks/common/useModal";
import useClickOutside from "@/hooks/common/useClickOutside";
import useUserSearchController from "@/hooks/searchUserList/useUserSearchController";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import MainLogo from "@/assets/images/mainLogo.png";

const Home: NextPage = () => {
  const router = useRouter();
  const {
    isOpen: isNoGuildModalOpen,
    open: openNoGuildModal,
    close: closeNoGuildModal,
  } = useModal();
  const [searchTerm, setSearchTerm] = useState("");
  const [nameLengthAlert, toggleNameLengthAlert] = useState(false);

  const { guildId, guilds, isLoggedIn, username, handleGuildChange, isLoadingGuilds } =
    useGuildManagement();

  const { data, isLoading, isError, handleSearchButtonClick } = useUserSearchController(
    searchTerm,
    guildId
  );

  // 검색 실행 (페이지 이동 후 해당 페이지 useEffect에서 최근 검색어 저장)
  const handleSearch = () => {
    handleSearchButtonClick();
  };

  // 최근 검색어 클릭 핸들러
  const handleRecentSearchClick = (riotName: string, riotTag: string) => {
    router.push(`/summoners/${encodeURIComponent(riotName)}/${encodeURIComponent(riotTag)}`);
  };

  // 로그인 했지만 가입된 길드가 없을 때 모달 띄움
  useEffect(() => {
    if (isLoggedIn && !isLoadingGuilds && guilds.length === 0) {
      openNoGuildModal();
    }
  }, [isLoggedIn, isLoadingGuilds, guilds, openNoGuildModal]);

  useEffect(() => {
    if (searchTerm.length < 2 && searchTerm !== "") {
      toggleNameLengthAlert(true);
    } else {
      toggleNameLengthAlert(false);
    }
  }, [searchTerm]);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useClickOutside(searchContainerRef, () => setIsSearchFocused(false));

  const handleDiscordLogin = async () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`;
  };

  return (
    <div className="flex flex-col justify-center items-center">
      {/* 헤더 영역 */}
      <header className="flex flex-col w-full gap-10 md:gap-20 justify-end">
        <title>GMOK</title>
        <div className="self-end m-3 flex gap-3 items-center">
          {isLoggedIn && (
            <GuildDropdown
              guilds={guilds}
              selectedGuildId={guildId}
              onGuildChange={handleGuildChange}
            />
          )}
          <DiscordLoginButton onClick={handleDiscordLogin} username={username} />
        </div>
        <div className="flex w-[250px] h-[250px] md:w-[400px] md:h-[400px] mx-auto">
          <Image src={MainLogo} alt="메인 로고" />
        </div>
      </header>

      <main className="flex flex-col my-10 w-full md:w-[40rem] max-w-[40rem] mt-16 mx-auto px-5">
        {/* NavBar */}
        <div className="mb-2">
          <NavBar />
        </div>
        <div ref={searchContainerRef}>
          {/* 검색창 */}
          <SearchBar
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
              users={data?.data}
              enable={isSearchFocused}
              searchTerm={searchTerm}
            />
          ) : (
            <RecentSearchList enable={isSearchFocused} onSearchClick={handleRecentSearchClick} />
          )}
        </div>
        {/* 검색 경고메세지 */}
        {nameLengthAlert && (
          <div className="text-blueText text-md">최소 2글자 이상 작성해주세요.</div>
        )}

        {/* 서비스 소개 배너 */}
        <Link href="/about">
          <span className="group mt-6 inline-flex cursor-pointer items-center gap-2 self-center rounded-full border border-border2 bg-darkBg2 px-4 py-2 text-sm text-primary2 transition-colors hover:border-blueText2 hover:text-primary1">
            <span>GMOK이 처음이신가요?</span>
            <span className="font-bold text-blueText">서비스 소개 보기</span>
            <svg
              className="w-3.5 h-3.5 text-blueText transition-transform group-hover:translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </Link>
      </main>
      <NoGuildModal isOpen={isNoGuildModalOpen} onClose={closeNoGuildModal} />
    </div>
  );
};

export default Home;
