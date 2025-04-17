import Image from "next/image";
import { useRouter } from "next/router";
import TextLogo from "@/assets/images/textLogo.png";
import NavBar from "@/components/layout/NavBar";
import SearchSmall from "@/components/form/SearchSmall";
import UserStatsOverview from "@/features/matchHistory/UserStatsOverview";
import Card from "@/components/ui/Card";
import MostPickRank from "@/features/matchHistory/MostPickRank";
import MatchItem from "@/features/matchHistory/MatchItem";
import DiscordLoginButton from "@/components/ui/DiscordLoginButton";
import useModal from "@/hooks/common/useModal";
import React, { useEffect, useState, useRef } from "react";
import DiscordLoginModal from "@/features/discordLogin/DiscordLoginModal";
import UserSearchResultList from "@/features/search/UserSearchResultList";
import useClickOutside from "@/hooks/common/useClickOutside";
import useUserSearchController from "@/hooks/searchUserList/useUserSearchController";

const RiotProfilePage = () => {
  const router = useRouter();
  const { riotName } = router.query;
  const riotNameString = Array.isArray(riotName) ? riotName[0] : riotName || "";
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, open, close } = useModal();
  const [guildId, setGuildId] = useState<string>("");
  const onGuildIdSaved = (newGuildId: string) => setGuildId(newGuildId);
  const { data, isLoading, isError, handleSearchButtonClick } = useUserSearchController(
    searchTerm,
    guildId
  );
  const searchContainerRef = useRef(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useClickOutside(searchContainerRef, () => setIsSearchFocused(false));

  useEffect(() => {
    if (typeof window !== "undefined") {
      setGuildId(localStorage.getItem("guildId") || "");
    }
  }, []);

  return (
    <div className="w-full md:max-w-[1080px] mx-auto">
      <header className="flex flex-col md:flex-row justify-start md:justify-between mt-2 md:mt-10 mx-[10px] md:mx-0 md:items-center md:gap-10 md:min-w-[1080px]">
        <div className="flex flex-col md:flex-row items-center gap-4 md:min-w-[450px]">
          {/* 디스코드 로그인 버튼 (모바일 용) */}
          <div className="block md:hidden self-end">
            {/* TODO : 추후 디코 로그인 기능 추가 필요 */}
            <DiscordLoginButton onClick={open} />
          </div>

          {/* 로고 이미지 */}
          <div className="w-[113px] h-[30px] justify-start">
            <Image
              src={TextLogo}
              alt="logo"
              width={113}
              height={30}
              className="cursor-pointer"
              onClick={() => router.push("/")}
            />
          </div>
          {/* 검색창 */}
          <div ref={searchContainerRef} className="w-full md:w-[400px] z-10">
            <SearchSmall
              value={searchTerm}
              onChange={setSearchTerm}
              onSearch={handleSearchButtonClick}
              placeholder="플레이어 이름#KR1"
              onFocus={() => setIsSearchFocused(true)}
            />
            <UserSearchResultList
              isLoading={isLoading}
              isError={isError}
              data={data}
              enable={isSearchFocused}
              searchTerm={searchTerm}
            />
          </div>
        </div>
        {/* Navigation */}
        <div className="flex items-center justify-start md:justify-end gap-4 mt-3 md:mt-0">
          <NavBar />
          <div className="hidden md:block">
            {/* TODO : 추후 디코 로그인 기능 추가 필요 */}
            <DiscordLoginButton onClick={open} />
          </div>
        </div>
      </header>

      <main className="mt-14 flex flex-col gap-3 md:min-w-[1080px]">
        <UserStatsOverview riotName={riotNameString} />
        <div className="flex gap-3 flex-col md:flex-row">
          <Card title="Most Pick" className="md:w-[35%] w-full self-start">
            <MostPickRank />
          </Card>
          <Card title="Recent Matches" className="w-full md:w-[65%]">
            <div className="flex flex-1 flex-col gap-4">
              <MatchItem />
              <MatchItem />
            </div>
          </Card>
        </div>
      </main>
      <DiscordLoginModal isOpen={isOpen} close={close} onSave={onGuildIdSaved} />
    </div>
  );
};

export default RiotProfilePage;
