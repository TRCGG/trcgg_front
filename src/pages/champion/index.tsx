import type { NextPage } from "next";
import SummonerPageHeader from "@/components/layout/SummonerPageHeader";
import DiscordLoginModal from "@/features/discordLogin/DiscordLoginModal";
import React, { useState } from "react";
import useModal from "@/hooks/common/useModal";
import useUserSearchController from "@/hooks/searchUserList/useUserSearchController";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import TitleBox from "@/components/ui/TitleBox";
import ChampionRankHeader from "@/features/statistics/ChampionRankHeader";
import ChampionRankItem from "@/features/statistics/ChampionRankItem";
import { getCurrentYearMonth } from "@/utils/parseTime";
import { useQuery } from "@tanstack/react-query";
import { getChampionStatistics } from "@/services/statistics";
import { ApiResponse } from "@/services/apiService";
import { ChampionStatisticsResponse } from "@/data/types/statistics";

const Champion: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, open, close } = useModal();
  const { guildId, guilds, isLoggedIn, username, handleGuildChange } = useGuildManagement();
  const {
    data: userSearchData,
    isLoading,
    isError,
    handleSearchButtonClick,
  } = useUserSearchController(searchTerm, guildId);

  const {
    data: championStatisticsData,
    isLoading: isLoadingStatistics,
    isError: isErrorStatistics,
  } = useQuery<ApiResponse<ChampionStatisticsResponse>>({
    queryKey: ["championStatistics", guildId],
    queryFn: () => getChampionStatistics(guildId),
    enabled: !!guildId,
    staleTime: 10 * 60 * 1000,
  });

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
        guilds={guilds}
        selectedGuildId={guildId}
        onGuildChange={handleGuildChange}
        username={username}
        isLoggedIn={isLoggedIn}
      />

      <DiscordLoginModal isOpen={isOpen} close={close} onSave={handleGuildChange} />
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
          {isLoadingStatistics && (
            <div className="text-center py-10 text-primary2">데이터를 불러오는 중...</div>
          )}
          {isErrorStatistics && (
            <div className="text-center py-10 text-redText">데이터를 불러오는데 실패했습니다.</div>
          )}
          {!isLoadingStatistics &&
            !isErrorStatistics &&
            championStatisticsData?.data?.data?.map((champion, index) => (
              <ChampionRankItem
                key={champion.champNameEng}
                rank={index + 1}
                championName={champion.champName}
                championNameEng={champion.champNameEng}
                position="MID"
                winRate={champion.winRate}
                gameCount={champion.totalCount}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Champion;
