import type { NextPage } from "next";
import SummonerPageHeader from "@/components/layout/SummonerPageHeader";
import DiscordLoginModal from "@/features/discordLogin/DiscordLoginModal";
import React, { useState } from "react";
import useModal from "@/hooks/common/useModal";
import useUserSearchController from "@/hooks/searchUserList/useUserSearchController";
import TitleBox from "@/components/ui/TitleBox";
import PositionFilter from "@/features/statistics/PositionFilter";
import UserRankHeader from "@/features/statistics/UserRankHeader";
import UserRankItem from "@/features/statistics/UserRankItem";
import { getCurrentYearMonth } from "@/utils/parseTime";

const User: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, open, close } = useModal();
  const [guildId, setGuildId] = useState<string>("");
  const [selectedPosition, setSelectedPosition] = useState<string>("전체");
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
        title="유저 분석"
        date={getCurrentYearMonth()}
        description="내전 판 수 N회 이상 기록 시 등장"
      />

      <PositionFilter
        selectedPosition={selectedPosition}
        onSelectPosition={setSelectedPosition}
        className="mt-4"
      />

      <div className="mt-1">
        <UserRankHeader />
        <div className="space-y-3 mt-2">
          <UserRankItem
            rank={1}
            position="MID"
            nickname="플레이어1"
            totalGames={1234}
            wins={823}
            losses={411}
            kda={3.45}
            winRate={66.667}
          />
          <UserRankItem
            rank={2}
            position="TOP"
            nickname="플레이어2"
            totalGames={987}
            wins={543}
            losses={444}
            kda={2.89}
            winRate={55.016}
          />
          <UserRankItem
            rank={3}
            position="ADC"
            nickname="플레이어3"
            totalGames={856}
            wins={498}
            losses={358}
            kda={4.12}
            winRate={58.178}
          />
        </div>
      </div>
    </div>
  );
};

export default User;
