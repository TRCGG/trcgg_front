import type { NextPage } from "next";
import SummonerPageHeader from "@/components/layout/SummonerPageHeader";
import React, { useState, useEffect, useRef } from "react";
import useUserSearchController from "@/hooks/searchUserList/useUserSearchController";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import TitleBox from "@/components/ui/TitleBox";
import PositionFilter from "@/features/statistics/PositionFilter";
import ChampionRankHeader from "@/features/statistics/ChampionRankHeader";
import ChampionRankItem from "@/features/statistics/ChampionRankItem";
import { getCurrentYearMonth } from "@/utils/parseTime";
import { useQuery } from "@tanstack/react-query";
import { getChampionStatistics, Position } from "@/services/statistics";
import { ApiResponse } from "@/services/apiService";
import { ChampionStatisticsResponse } from "@/data/types/statistics";
import TextCard from "@/components/ui/TextCard";

const Champion: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
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
    data: championStatisticsData,
    isLoading: isLoadingStatistics,
    isFetching: isFetchingStatistics,
    isFetched: isFetchedStatistics,
    isError: isErrorStatistics,
  } = useQuery<ApiResponse<ChampionStatisticsResponse>>({
    queryKey: ["championStatistics", guildId, selectedPosition],
    queryFn: () => getChampionStatistics(guildId, selectedPosition),
    enabled: !!guildId,
    staleTime: 10 * 60 * 1000,
    structuralSharing: false,
    placeholderData: undefined,
  });

  const allChampions = championStatisticsData?.data?.data || [];
  const displayedChampions = allChampions.slice(0, displayCount);
  const hasMore = allChampions.length > displayCount;

  // 게임 수 상위 10위 챔피언 계산
  const popularChampions = [...allChampions]
    .sort((a, b) => b.totalCount - a.totalCount)
    .slice(0, 10)
    .map((c) => c.champNameEng);

  // 현재 선택된 클랜 이름 가져오기
  const selectedGuild = guilds.find((guild) => guild.id === guildId);
  const clanName = selectedGuild?.name || "클랜";

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
        guilds={guilds}
        selectedGuildId={guildId}
        onGuildChange={handleGuildChange}
        username={username}
        isLoggedIn={isLoggedIn}
      />
      <TitleBox
        className="mt-10"
        clanName={clanName}
        title="대상 분석"
        date={getCurrentYearMonth()}
        description="챔피언 플레이 기록이 20판 이상인 경우에만 통계에 표시"
      />

      <PositionFilter
        selectedPosition={selectedPosition}
        onSelectPosition={setSelectedPosition}
        className="mt-4"
      />

      <div className="mt-1">
        <ChampionRankHeader />
        <div key={selectedPosition} className="space-y-3 mt-2">
          {(() => {
            // 비로그인 상태
            if (!isLoggedIn) {
              return <TextCard text="로그인 후 이용해주세요" />;
            }

            // 소속 클랜 없음
            if (guilds.length === 0) {
              return <TextCard text="소속된 클랜이 없습니다" />;
            }

            return (
              <>
                {(isLoadingStatistics || isFetchingStatistics) && (
                  <div className="text-center py-10 text-primary2">데이터를 불러오는 중...</div>
                )}

                {isErrorStatistics && (
                  <div className="text-center py-10 text-redText">
                    데이터를 불러오는데 실패했습니다.
                  </div>
                )}

                {!(isErrorStatistics || isLoadingStatistics || isFetchingStatistics) &&
                  allChampions.length > 0 && (
                    <>
                      {displayedChampions.map((champion, index) => {
                        const rank = index + 1;
                        const totalChampions = allChampions.length;

                        // 티어 계산 (겹치지 않을 때만 부여)
                        let tier: 1 | 5 | undefined;
                        if (rank <= 10 && totalChampions - rank >= 10) {
                          tier = 1; // 승률 상위 10위
                        } else if (totalChampions - rank < 10 && rank > 10) {
                          tier = 5; // 승률 하위 10위
                        }

                        // 인기 여부 계산
                        const isPopular = popularChampions.includes(champion.champNameEng);

                        return (
                          <ChampionRankItem
                            key={champion.champNameEng}
                            rank={rank}
                            championName={champion.champName}
                            championNameEng={champion.champNameEng}
                            position={champion.position}
                            winRate={champion.winRate}
                            gameCount={champion.totalCount}
                            tier={tier}
                            isPopular={isPopular}
                          />
                        );
                      })}
                      {/* 무한 스크롤 트리거 */}
                      {hasMore && <div ref={observerTarget} className="h-10" />}
                    </>
                  )}

                {!(isErrorStatistics || isLoadingStatistics || isFetchingStatistics) &&
                  isFetchedStatistics &&
                  allChampions.length === 0 && (
                    <div className="text-center py-10 text-primary2 bg-darkBg2 rounded border border-border2">
                      20판 이상 플레이한 챔피언이 없어 통계 데이터를 확인할 수 없습니다.
                    </div>
                  )}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default Champion;
