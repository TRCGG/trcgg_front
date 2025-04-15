import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import NavBar from "@/components/layout/NavBar";
import Search from "@/components/form/Search";
import MainLogo from "@/assets/images/mainLogo.png";
import Image from "next/image";
import DiscordLoginButton from "@/components/ui/DiscordLoginButton";
import useModal from "@/hooks/useModal";
import DiscordLoginModal from "@/features/discordLogin/DiscordLoginModal";
import { useSearchSummoners } from "@/hooks/useSearchSummoners";
import UserSearchResultList from "@/features/search/UserSearchResultList";

const Home: NextPage = () => {
  const { isOpen, open, close } = useModal();
  const [searchTerm, setSearchTerm] = useState("");
  const [guildId, setGuildId] = useState<string>("");
  const onGuildIdSaved = (newGuildId: string) => setGuildId(newGuildId);
  const [nameLengthAlert, toggleNameLengthAlert] = useState(false);

  const { data, isLoading, isError, handleSearchButtonClick } = useSearchSummoners(
    searchTerm,
    guildId
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setGuildId(localStorage.getItem("guildId") || "");
    }
  }, []);

  useEffect(() => {
    if (searchTerm.length < 2 && searchTerm !== "") {
      toggleNameLengthAlert(true);
    } else {
      toggleNameLengthAlert(false);
    }
  }, [searchTerm]);

  return (
    <div className="flex flex-col justify-center items-center">
      {/* 헤더 영역 */}
      <header className="flex flex-col w-full gap-32 justify-end">
        <div className="self-end m-3">
          <DiscordLoginButton onClick={open} />
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
        <div>
          {/* 검색창 */}
          <Search
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={handleSearchButtonClick}
            placeholder="플레이어 이름#KR1"
          />
          {/* 검색 결과 */}
          <UserSearchResultList isLoading={isLoading} isError={isError} data={data} />
        </div>
        {/* 검색 경고메세지 */}
        {nameLengthAlert ? (
          <div className="text-blueText text-md">최소 2글자 이상 작성해주세요.</div>
        ) : null}
      </main>
      <DiscordLoginModal isOpen={isOpen} close={close} onSave={onGuildIdSaved} />
    </div>
  );
};

export default Home;
