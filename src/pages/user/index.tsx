import type { NextPage } from "next";
import SummonerPageHeader from "@/components/layout/SummonerPageHeader";
import React, { useState, useEffect, useRef, useMemo } from "react";
import useUserSearchController from "@/hooks/searchUserList/useUserSearchController";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import TitleBox from "@/components/ui/TitleBox";
import PositionFilter from "@/features/statistics/PositionFilter";
import UserRankHeader from "@/features/statistics/UserRankHeader";
import UserRankItem from "@/features/statistics/UserRankItem";
import { useQuery } from "@tanstack/react-query";
import { getUserStatistics, Position } from "@/services/statistics";
import { ApiResponse } from "@/services/apiService";
import { UserStatisticsResponse } from "@/data/types/statistics";
import TextCard from "@/components/ui/TextCard";

type DateMode = "recent" | "monthly";
type SortBy = "totalGames" | "winRate";
type SortOrder = "asc" | "desc";

const now = new Date();
const CURRENT_YEAR = now.getFullYear();
const CURRENT_MONTH = now.getMonth() + 1;
const START_YEAR = 2024;
const YEAR_OPTIONS = Array.from(
  { length: CURRENT_YEAR - START_YEAR + 1 },
  (_, i) => START_YEAR + i
);
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

const User: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState<Position>("ALL");
  const [displayCount, setDisplayCount] = useState(10);
  const [sortBy, setSortBy] = useState<SortBy>("winRate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [dateMode, setDateMode] = useState<DateMode>("recent");
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH);
  const observerTarget = useRef<HTMLDivElement>(null);

  const { guildId, guilds, isLoggedIn, username, handleGuildChange } = useGuildManagement();
  const {
    data: userSearchData,
    isLoading,
    isError,
    handleSearchButtonClick,
  } = useUserSearchController(searchTerm, guildId);

  const queryYear = dateMode === "monthly" ? selectedYear : undefined;
  const queryMonth = dateMode === "monthly" ? selectedMonth : undefined;

  const {
    data: userStatisticsData,
    isLoading: isLoadingStatistics,
    isFetching: isFetchingStatistics,
    isFetched: isFetchedStatistics,
    isError: isErrorStatistics,
  } = useQuery<ApiResponse<UserStatisticsResponse>>({
    queryKey: ["userStatistics", guildId, selectedPosition, dateMode, queryYear, queryMonth],
    queryFn: () => getUserStatistics(guildId, selectedPosition, queryYear, queryMonth),
    enabled: !!guildId,
    staleTime: 5 * 60 * 1000, // 5분
    structuralSharing: false,
    placeholderData: undefined,
  });

  // 정렬 핸들러
  const handleSort = (column: SortBy) => {
    if (sortBy === column) {
      // 같은 컬럼 선택 시
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  // 정렬된 사용자 목록
  const sortedUsers = useMemo(() => {
    const users = [...(userStatisticsData?.data?.data || [])];

    users.sort((a, b) => {
      let aValue: number;
      let bValue: number;

      if (sortBy === "totalGames") {
        aValue = a.totalCount || 0;
        bValue = b.totalCount || 0;
      } else {
        // winRate
        aValue = parseFloat(a.winRate) || 0;
        bValue = parseFloat(b.winRate) || 0;
      }

      if (sortOrder === "asc") {
        return aValue - bValue;
      }
      return bValue - aValue;
    });

    return users;
  }, [userStatisticsData?.data?.data, sortBy, sortOrder]);

  const displayedUsers = sortedUsers.slice(0, displayCount);
  const hasMore = sortedUsers.length > displayCount;

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
        title="유저 분석"
        description="내전 플레이 기록이 5판 이상인 경우에만 통계에 표시"
      />

      {/* 기간 선택 토글 + 드롭다운 */}
      <div className="flex flex-wrap items-center gap-3 mt-3">
        {/* 세그먼트 컨트롤 토글 */}
        <div className="flex p-0.5 rounded-lg bg-rankBg1 border border-border1">
          <button
            type="button"
            onClick={() => setDateMode("recent")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              dateMode === "recent"
                ? "bg-primary1 text-darkBg2 shadow"
                : "text-primary2 hover:text-primary1"
            }`}
          >
            최근 1개월
          </button>
          <button
            type="button"
            onClick={() => setDateMode("monthly")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              dateMode === "monthly"
                ? "bg-primary1 text-darkBg2 shadow"
                : "text-primary2 hover:text-primary1"
            }`}
          >
            월별
          </button>
        </div>

        {/* 구분선 */}
        <div className="hidden sm:block h-5 w-px bg-border1" />

        {/* 연도 드롭다운 */}
        <div
          className={`relative transition-opacity duration-200 ${
            dateMode === "recent" ? "opacity-30 pointer-events-none" : "opacity-100"
          }`}
        >
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            disabled={dateMode === "recent"}
            className="appearance-none bg-rankBg2 border border-border1 hover:border-blueText2 rounded-lg pl-3 pr-8 py-1.5 text-sm text-primary1 cursor-pointer focus:outline-none focus:border-blueText2 transition-colors duration-150"
          >
            {YEAR_OPTIONS.map((year) => (
              <option key={year} value={year}>
                {year}년
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center">
            <svg
              className="w-3 h-3 text-primary2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* 월 드롭다운 */}
        <div
          className={`relative transition-opacity duration-200 ${
            dateMode === "recent" ? "opacity-30 pointer-events-none" : "opacity-100"
          }`}
        >
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            disabled={dateMode === "recent"}
            className="appearance-none bg-rankBg2 border border-border1 hover:border-blueText2 rounded-lg pl-3 pr-8 py-1.5 text-sm text-primary1 cursor-pointer focus:outline-none focus:border-blueText2 transition-colors duration-150"
          >
            {MONTH_OPTIONS.map((month) => (
              <option key={month} value={month}>
                {month}월
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center">
            <svg
              className="w-3 h-3 text-primary2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <PositionFilter
        selectedPosition={selectedPosition}
        onSelectPosition={setSelectedPosition}
        className="mt-4"
      />

      <div className="mt-1">
        <UserRankHeader sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
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
                  sortedUsers.length > 0 && (
                    <>
                      {displayedUsers.map((user, index) => (
                        <UserRankItem
                          key={user.playerCode}
                          rank={index + 1}
                          position={selectedPosition === "ALL" ? undefined : user.position}
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
                  sortedUsers.length === 0 && (
                    <div className="text-center py-10 text-primary2 bg-darkBg2 rounded border border-border2">
                      5판 이상 플레이한 유저가 없어 통계 데이터를 확인할 수 없습니다.
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

export default User;
