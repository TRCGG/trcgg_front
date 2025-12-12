import React, { useEffect, useRef, useState } from "react";
import type { NextPage } from "next";
import NavBar from "@/components/layout/NavBar";
import SearchBar from "@/components/form/SearchBar";
import MainLogo from "@/assets/images/mainLogo.png";
import Image from "next/image";
import DiscordLoginButton from "@/components/ui/DiscordLoginButton";
import useModal from "@/hooks/common/useModal";
import NoGuildModal from "@/features/discordLogin/NoGuildModal";
import GuildDropdown from "@/features/discordLogin/GuildDropdown";
import SearchBarResultList from "@/features/search/SearchBarResultList";
import useClickOutside from "@/hooks/common/useClickOutside";
import useUserSearchController from "@/hooks/searchUserList/useUserSearchController";
import useGuildManagement from "@/hooks/auth/useGuildManagement";

const Home: NextPage = () => {
  const {
    isOpen: isNoGuildModalOpen,
    open: openNoGuildModal,
    close: closeNoGuildModal,
  } = useModal();
  const [searchTerm, setSearchTerm] = useState("");
  const [nameLengthAlert, toggleNameLengthAlert] = useState(false);

  const { guildId, guilds, isLoggedIn, username, handleGuildChange } = useGuildManagement();

  const { data, isLoading, isError, handleSearchButtonClick } = useUserSearchController(
    searchTerm,
    guildId
  );

  // 로그인 했지만 가입된 길드가 없을 때 모달 띄움
  useEffect(() => {
    if (isLoggedIn && guilds.length === 0) {
      openNoGuildModal();
    }
  }, [isLoggedIn, guilds, openNoGuildModal]);

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
      <header className="flex flex-col w-full gap-32 justify-end">
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
        <div className="flex w-64 h-64 mx-auto">
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
            onSearch={handleSearchButtonClick}
            placeholder="플레이어 이름#KR1"
            onFocus={() => setIsSearchFocused(true)}
          />
          {/* 검색 결과 */}
          <SearchBarResultList
            isLoading={isLoading}
            isError={isError}
            users={data?.data}
            enable={isSearchFocused}
            searchTerm={searchTerm}
          />
        </div>
        {/* 검색 경고메세지 */}
        {nameLengthAlert && (
          <div className="text-blueText text-md">최소 2글자 이상 작성해주세요.</div>
        )}
      </main>
      <NoGuildModal isOpen={isNoGuildModalOpen} onClose={closeNoGuildModal} />
    </div>
  );
};

export default Home;
