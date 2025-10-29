import type { NextPage } from "next";
import SummonerPageHeader from "@/components/layout/SummonerPageHeader";
import DiscordLoginModal from "@/features/discordLogin/DiscordLoginModal";
import React, { useState } from "react";
import useModal from "@/hooks/common/useModal";
import useUserSearchController from "@/hooks/searchUserList/useUserSearchController";
import TitleBox from "@/components/ui/TitleBox";
import ChampionRankHeader from "@/features/statistics/ChampionRankHeader";
import ChampionRankItem from "@/features/statistics/ChampionRankItem";
import { getCurrentYearMonth } from "@/utils/parseTime";

const Champion: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, open, close } = useModal();
  const [guildId, setGuildId] = useState<string>("");
  const onGuildIdSaved = (newGuildId: string) => setGuildId(newGuildId);
  const {
    data: userSearchData,
    isLoading,
    isError,
    handleSearchButtonClick,
  } = useUserSearchController(searchTerm, guildId);

  return (
    <div className="w-full md:max-w-[1080px] mx-auto">
      <SummonerPageHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearchButtonClick}
        isLoading={isLoading}
        isError={isError}
        users={userSearchData?.data}
        openDiscordModal={open}
      />

      <DiscordLoginModal isOpen={isOpen} close={close} onSave={onGuildIdSaved} />
      <TitleBox
        className="mt-10"
        clanName="TRC 난민캠프"
        title="대상 분석"
        date={getCurrentYearMonth()}
        description="챔피언 판 수 N회 이상 기록 시 등장"
      />

      <div className="mt-6">
        <ChampionRankHeader />
        <div className="space-y-3 mt-2">
          <ChampionRankItem
            rank={1}
            championName="아리"
            championNameEng="Ahri"
            position="MID"
            winRate="65.5"
            gameCount={42}
            tier={1}
            isPopular
          />
          <ChampionRankItem
            rank={2}
            championName="야스오"
            championNameEng="Yasuo"
            position="MID"
            winRate="58.3"
            gameCount={38}
            tier={5}
          />
          <ChampionRankItem
            rank={3}
            championName="징크스"
            championNameEng="Jinx"
            position="ADC"
            winRate="62.1"
            gameCount={35}
            tier={5}
            isPopular
          />
        </div>
      </div>
    </div>
  );
};

export default Champion;
