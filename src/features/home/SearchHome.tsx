import React, { useEffect } from "react";
import Image from "next/image";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import DiscordLoginButton from "@/components/ui/DiscordLoginButton";
import NoGuildModal from "@/features/discordLogin/NoGuildModal";
import GuildDropdown from "@/features/discordLogin/GuildDropdown";
import SummonerSearchBox from "@/features/search/SummonerSearchBox";
import SiteLiveTag from "@/features/statistics/SiteLiveTag";
import useModal from "@/hooks/common/useModal";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import MainLogo from "@/assets/images/mainLogo.png";
import startDiscordLogin from "@/utils/discordLogin";

/** 로그인한 사용자의 `/`: 소환사 검색 화면. */
const SearchHome = () => {
  const {
    isOpen: isNoGuildModalOpen,
    open: openNoGuildModal,
    close: closeNoGuildModal,
  } = useModal();
  const { guildId, guilds, isLoggedIn, hasOwnGuild, username, handleGuildChange, isLoadingGuilds } =
    useGuildManagement();

  // 로그인 했지만 가입된 길드가 없을 때 모달 띄움
  useEffect(() => {
    if (isLoggedIn && !isLoadingGuilds && !hasOwnGuild) {
      openNoGuildModal();
    }
  }, [isLoggedIn, isLoadingGuilds, hasOwnGuild, openNoGuildModal]);

  return (
    <>
      {/* `/`는 비로그인 시 소개 화면이라 _app이 공용 여백·푸터를 주지 않는다. 여기서 직접 붙인다. */}
      <div className="flex flex-col justify-center items-center px-2 md:px-0">
        {/* 헤더 영역 */}
        <header className="flex flex-col w-full gap-10 md:gap-20 justify-end">
          <div className="self-end m-3 flex gap-3 items-center">
            <SiteLiveTag className="hidden sm:inline-flex" />
            {isLoggedIn && (
              <GuildDropdown
                guilds={guilds}
                selectedGuildId={guildId}
                onGuildChange={handleGuildChange}
              />
            )}
            <DiscordLoginButton onClick={startDiscordLogin} username={username} />
          </div>
          <div className="flex w-[250px] h-[250px] md:w-[400px] md:h-[400px] mx-auto">
            <Image src={MainLogo} alt="메인 로고" width={400} height={400} priority />
          </div>
        </header>

        <main className="flex flex-col my-10 w-full md:w-[40rem] max-w-[40rem] mt-16 mx-auto px-5">
          {/* NavBar */}
          <div className="mb-2">
            <NavBar />
          </div>
          <SummonerSearchBox guildId={guildId} />
        </main>

        <NoGuildModal isOpen={isNoGuildModalOpen} onClose={closeNoGuildModal} />
      </div>
      <Footer />
    </>
  );
};

export default SearchHome;
