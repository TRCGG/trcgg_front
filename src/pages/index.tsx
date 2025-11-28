import React, { useEffect, useRef, useState, useMemo } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/services/apiService";
import { GuildsResponse, MeResponse } from "@/data/types/auth";
import { getGuilds, getMe } from "@/services/auth";

const encodeGuildId = (id: string): string => btoa(id);

const Home: NextPage = () => {
  const {
    isOpen: isNoGuildModalOpen,
    open: openNoGuildModal,
    close: closeNoGuildModal,
  } = useModal();
  const [searchTerm, setSearchTerm] = useState("");
  const [guildId, setGuildId] = useState<string>("");
  const [nameLengthAlert, toggleNameLengthAlert] = useState(false);

  const { data, isLoading, isError, handleSearchButtonClick } = useUserSearchController(
    searchTerm,
    guildId
  );

  const { data: guildsData } = useQuery<ApiResponse<GuildsResponse>>({
    queryKey: ["guilds"],
    queryFn: () => getGuilds(),
    staleTime: 3 * 60 * 1000,
  });

  const { data: meData } = useQuery<ApiResponse<MeResponse>>({
    queryKey: ["me"],
    queryFn: () => getMe(),
    staleTime: 5 * 60 * 1000,
  });

  const guilds = useMemo(() => {
    const rawGuilds = guildsData?.data?.data || [];
    return rawGuilds.map((guild) => ({
      ...guild,
      id: encodeGuildId(guild.id),
    }));
  }, [guildsData]);

  // 로그인 했지만 가입된 길드가 없을 때 모달 띄움
  useEffect(() => {
    const isLoggedIn = document.cookie.split(";").some((cookie) => {
      return cookie.trim().startsWith("session_uid=");
    });

    if (isLoggedIn && guildsData && guilds.length === 0) {
      openNoGuildModal();
    }
  }, [guildsData, guilds, openNoGuildModal]);

  useEffect(() => {
    if (typeof window !== "undefined" && guilds.length > 0) {
      const savedEncodedId = localStorage.getItem("guildId");
      if (savedEncodedId) {
        setGuildId(savedEncodedId);
      } else {
        localStorage.setItem("guildId", guilds[0].id);
        setGuildId(guilds[0].id);
      }
    }
  }, [guilds]);

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

  const handleGuildChange = (encodedGuildId: string) => {
    localStorage.setItem("guildId", encodedGuildId);
    setGuildId(encodedGuildId);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      {/* 헤더 영역 */}
      <header className="flex flex-col w-full gap-32 justify-end">
        <div className="self-end m-3 flex gap-3 items-center">
          <GuildDropdown
            guilds={guilds}
            selectedGuildId={guildId}
            onGuildChange={handleGuildChange}
          />
          <DiscordLoginButton
            onClick={handleDiscordLogin}
            username={meData?.data?.data?.username}
          />
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
