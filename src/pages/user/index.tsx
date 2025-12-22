import type { NextPage } from "next";
import SummonerPageHeader from "@/components/layout/SummonerPageHeader";
import DiscordLoginModal from "@/features/discordLogin/DiscordLoginModal";
import React, { useState, useEffect, useRef } from "react";
import useModal from "@/hooks/common/useModal";
import useUserSearchController from "@/hooks/searchUserList/useUserSearchController";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import TitleBox from "@/components/ui/TitleBox";
import PositionFilter from "@/features/statistics/PositionFilter";
import UserRankHeader from "@/features/statistics/UserRankHeader";
import UserRankItem from "@/features/statistics/UserRankItem";
import { getCurrentYearMonth } from "@/utils/parseTime";
import { useQuery } from "@tanstack/react-query";
import { getUserStatistics, Position } from "@/services/statistics";
import { ApiResponse } from "@/services/apiService";
import { UserStatisticsResponse } from "@/data/types/statistics";

const User: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, open, close } = useModal();
  const [selectedPosition, setSelectedPosition] = useState<Position>("ALL");
  const [displayCount, setDisplayCount] = useState(10);
  const observerTarget = useRef<HTMLDivElement>(null);

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
    isFetching: isFetchingStatistics,
    isFetched: isFetchedStatistics,
    isError: isErrorStatistics,
  } = useQuery<ApiResponse<UserStatisticsResponse>>({
    queryKey: ["userStatistics", guildId, selectedPosition],
    queryFn: () => getUserStatistics(guildId, selectedPosition),
    enabled: !!guildId,
    staleTime: 5 * 60 * 1000, // 5분
    structuralSharing: false,
    placeholderData: undefined,
  });

  const allUsers = userStatisticsData?.data?.data || [];
  const displayedUsers = allUsers.slice(0, displayCount);
  const hasMore = allUsers.length > displayCount;

  // 포지션 변경 시 displayCount 리셋
  useEffect(() => {
    setDisplayCount(10);
  }, [selectedPosition]);

  // 무한 스크롤
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setDisplayCount((prev) => prev + 10);
        }
      },
      { threshold: 1.0 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore]);

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
        description="내전 플레이 기록이 30판 이상인 경우에만 통계에 표시"
      />

      <PositionFilter
        selectedPosition={selectedPosition}
        onSelectPosition={setSelectedPosition}
        className="mt-4"
      />

      <div className="mt-1">
        <UserRankHeader />
        <div key={selectedPosition} className="space-y-3 mt-2">
          {(isLoadingStatistics || isFetchingStatistics) && (
            <div className="text-center py-10 text-primary2">데이터를 불러오는 중...</div>
          )}

          {isErrorStatistics && (
            <div className="text-center py-10 text-redText">데이터를 불러오는데 실패했습니다.</div>
          )}

          {!(isErrorStatistics || isLoadingStatistics || isFetchingStatistics) &&
            allUsers.length > 0 && (
              <>
                {displayedUsers.map((user, index) => (
                  <UserRankItem
                    key={user.playerCode}
                    rank={index + 1}
                    position={user.position}
                    riotName={user.riotName}
                    riotNameTag={user.riotNameTag}
                    totalGames={user.totalCount}
                    wins={user.win}
                    losses={user.lose}
                    kda={user.kda}
                    winRate={user.winRate}
                  />
                ))}
                {/* 무한 스크롤 트리거 */}
                {hasMore && <div ref={observerTarget} className="h-10" />}
              </>
            )}

          {!(isErrorStatistics || isLoadingStatistics || isFetchingStatistics) &&
            isFetchedStatistics &&
            allUsers.length === 0 && (
              <div className="text-center py-10 text-primary2 bg-darkBg2 rounded border border-border2">
                30판 이상 플레이한 유저가 없어 통계 데이터를 확인할 수 없습니다.
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default User;
