import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import NavBar from "@/components/layout/NavBar";
import Search from "@/components/form/Search";
import MainLogo from "@/assets/images/mainLogo.png";
import Image from "next/image";
import { useRouter } from "next/router";
import DiscordLoginButton from "@/components/ui/DiscordLoginButton";
import useModal from "@/hooks/useModal";
import DiscordLoginModal from "@/features/discordLogin/DiscordLoginModal";
import { useSearchSummoners } from "@/hooks/useSearchSummoners";
import UserSearchResultList from "@/features/search/UserSearchResultList";

const Home: NextPage = () => {
  const router = useRouter();
  const { isOpen, open, close } = useModal();
  const [searchTerm, setSearchTerm] = useState("");
  const [guildId, setGuildId] = useState<string>("");
  const [nameLengthAlert, toggleNameLengthAlert] = useState(false);

  const { data, isLoading, isError, debouncedTerm } = useSearchSummoners(searchTerm, guildId);

  const onGuildIdSaved = (newGuildId: string) => setGuildId(newGuildId);

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
        {/* 검색창 */}
        <Search
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={handleSearchButtonClick}
          placeholder="플레이어 이름#KR1"
        />
        {/* 검색 결과 */}
        <div className="text-white text-md">
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
