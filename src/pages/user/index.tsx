import type { NextPage } from "next";
import SummonerPageHeader from "@/components/layout/SummonerPageHeader";
import DiscordLoginModal from "@/features/discordLogin/DiscordLoginModal";
import React, { useState } from "react";
import useModal from "@/hooks/common/useModal";
import useUserSearchController from "@/hooks/searchUserList/useUserSearchController";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import TitleBox from "@/components/ui/TitleBox";
import PositionFilter from "@/features/statistics/PositionFilter";
import UserRankHeader from "@/features/statistics/UserRankHeader";
import UserRankItem from "@/features/statistics/UserRankItem";
import { getCurrentYearMonth } from "@/utils/parseTime";
import { useQuery } from "@tanstack/react-query";
import { getUserStatistics } from "@/services/statistics";
import { ApiResponse } from "@/services/apiService";
import { UserStatisticsResponse } from "@/data/types/statistics";

const User: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, open, close } = useModal();
  const [selectedPosition, setSelectedPosition] = useState<string>("전체");

  const { guildId, guilds, isLoggedIn, username, handleGuildChange } = useGuildManagement();
  const {
    data: userSearchData,
    isLoading,
    isError,
    handleSearchButtonClick,
  } = useUserSearchController(searchTerm, guildId);

  const {
    data: userStatisticsData,
    isLoading: isLoadingStatistics,
    isError: isErrorStatistics,
  } = useQuery<ApiResponse<UserStatisticsResponse>>({
    queryKey: ["userStatistics", guildId],
    queryFn: () => getUserStatistics(guildId),
    enabled: !!guildId,
    staleTime: 60 * 1000,
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
          {isLoadingStatistics && (
            <div className="text-center py-10 text-primary2">데이터를 불러오는 중...</div>
          )}
          {isErrorStatistics && (
            <div className="text-center py-10 text-redText">데이터를 불러오는데 실패했습니다.</div>
          )}
          {!isLoadingStatistics &&
            !isErrorStatistics &&
            userStatisticsData?.data?.data?.map((user, index) => (
              <UserRankItem
                key={user.playerCode}
                rank={index + 1}
                position={user.position}
                nickname={`${user.riotName}#${user.riotNameTag}`}
                totalGames={user.totalCount}
                wins={user.win}
                losses={user.lose}
                kda={user.kda}
                winRate={user.winRate}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default User;
