import type { NextPage } from "next";
import SummonerPageHeader from "@/components/layout/SummonerPageHeader";
import DiscordLoginModal from "@/features/discordLogin/DiscordLoginModal";
import React, { useState, useEffect, useRef } from "react";
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
    data: championStatisticsData,
    isLoading: isLoadingStatistics,
    isError: isErrorStatistics,
  } = useQuery<ApiResponse<ChampionStatisticsResponse>>({
    queryKey: ["championStatistics", guildId],
    queryFn: () => getChampionStatistics(guildId),
    enabled: !!guildId,
    staleTime: 10 * 60 * 1000,
  });

  const allChampions = championStatisticsData?.data?.data || [];
  const displayedChampions = allChampions.slice(0, displayCount);
  const hasMore = allChampions.length > displayCount;

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
        title="대상 분석"
        date={getCurrentYearMonth()}
        description="챔피언 플레이 기록이 30판 이상인 경우에만 통계에 표시"
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
            (allChampions.length > 0 ? (
              <>
                {displayedChampions.map((champion, index) => (
                  <ChampionRankItem
                    key={champion.champNameEng}
                    rank={index + 1}
                    championName={champion.champName}
                    championNameEng={champion.champNameEng}
                    position={champion.position}
                    winRate={champion.winRate}
                    gameCount={champion.totalCount}
                  />
                ))}
                {/* 무한 스크롤 트리거 */}
                {hasMore && <div ref={observerTarget} className="h-10" />}
              </>
            ) : (
              <div className="text-center py-10 text-primary2 bg-darkBg2 rounded border border-border2">
                30판 이상 플레이한 챔피언이 없어 통계 데이터를 확인할 수 없습니다.
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Champion;
