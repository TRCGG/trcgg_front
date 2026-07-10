import type { NextPage } from "next";
import SummonerPageHeader from "@/components/layout/SummonerPageHeader";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import useUserSearchController from "@/hooks/searchUserList/useUserSearchController";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import TitleBox from "@/components/ui/TitleBox";
import PositionFilter from "@/features/statistics/PositionFilter";
import UserRankHeader from "@/features/statistics/UserRankHeader";
import UserRankItem from "@/features/statistics/UserRankItem";
import { useQuery } from "@tanstack/react-query";
import { getUserStatistics, Position, DatePreset } from "@/services/statistics";
import { ApiResponse } from "@/services/apiService";
import { UserStatisticsResponse } from "@/data/types/statistics";
import TextCard from "@/components/ui/TextCard";

type DateMode = "recent" | "season" | "range";
type SortBy = "totalGames" | "winRate" | "kda";
type SortOrder = "asc" | "desc";

const now = new Date();
const CURRENT_YEAR = now.getFullYear();
const CURRENT_MONTH = now.getMonth() + 1;
const START_YEAR = 2024;
const SEASON_OPTIONS = Array.from({ length: CURRENT_YEAR - START_YEAR + 1 }, (_, i) =>
  String(START_YEAR + i)
);
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

const ChevronDown = () => (
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
);

const SELECT_CLASS =
  "appearance-none bg-rankBg2 border border-border1 hover:border-blueText2 rounded-lg pl-3 pr-8 py-1.5 text-sm text-primary1 cursor-pointer focus:outline-none focus:border-blueText2 transition-colors duration-150";

const User: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState<Position>("ALL");
  const [displayCount, setDisplayCount] = useState(10);
  const [sortBy, setSortBy] = useState<SortBy>("winRate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [dateMode, setDateMode] = useState<DateMode>("recent");
  const [selectedSeason, setSelectedSeason] = useState(String(CURRENT_YEAR));
  const [draftRangeSeason, setDraftRangeSeason] = useState(String(CURRENT_YEAR));
  const [draftFromMonth, setDraftFromMonth] = useState(1);
  const [draftToMonth, setDraftToMonth] = useState(CURRENT_MONTH);
  const [appliedRange, setAppliedRange] = useState({
    season: String(CURRENT_YEAR),
    fromMonth: 1,
    toMonth: CURRENT_MONTH,
  });
  const observerInstance = useRef<IntersectionObserver | null>(null);
  const hasMoreRef = useRef(false);

  const { guildId, guilds, isLoggedIn, username, handleGuildChange } = useGuildManagement();
  const {
    data: userSearchData,
    isLoading,
    isError,
    handleSearchButtonClick,
  } = useUserSearchController(searchTerm, guildId);

  let querySeason: string | undefined;
  if (dateMode === "season") querySeason = selectedSeason;
  else if (dateMode === "range") querySeason = appliedRange.season;
  const queryFromMonth = dateMode === "range" ? appliedRange.fromMonth : undefined;
  const queryToMonth = dateMode === "range" ? appliedRange.toMonth : undefined;

  const {
    data: userStatisticsData,
    isLoading: isLoadingStatistics,
    isFetching: isFetchingStatistics,
    isFetched: isFetchedStatistics,
    isError: isErrorStatistics,
  } = useQuery<ApiResponse<UserStatisticsResponse>>({
    queryKey: [
      "userStatistics",
      guildId,
      selectedPosition,
      dateMode,
      querySeason,
      queryFromMonth,
      queryToMonth,
    ],
    queryFn: () =>
      getUserStatistics(
        guildId,
        selectedPosition,
        dateMode as DatePreset,
        querySeason,
        queryFromMonth,
        queryToMonth
      ),
    enabled: !!guildId,
    staleTime: 5 * 60 * 1000,
    structuralSharing: false,
    placeholderData: undefined,
  });

  const handleSort = (column: SortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const handleApplyRange = () => {
    const from = Math.min(draftFromMonth, draftToMonth);
    const to = Math.max(draftFromMonth, draftToMonth);
    setDraftFromMonth(from);
    setDraftToMonth(to);
    setAppliedRange({ season: draftRangeSeason, fromMonth: from, toMonth: to });
  };

  const sortedUsers = useMemo(() => {
    const users = [...(userStatisticsData?.data?.data || [])];

    users.sort((a, b) => {
      let aValue: number;
      let bValue: number;

      if (sortBy === "totalGames") {
        aValue = a.totalCount || 0;
        bValue = b.totalCount || 0;
      } else if (sortBy === "kda") {
        aValue = parseFloat(a.kda) || 0;
        bValue = parseFloat(b.kda) || 0;
      } else {
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
  hasMoreRef.current = hasMore;

  const selectedGuild = guilds.find((guild) => guild.id === guildId);
  const clanName = selectedGuild?.name || "클랜";

  useEffect(() => {
    setDisplayCount(10);
  }, [selectedPosition, dateMode, querySeason, queryFromMonth, queryToMonth]);

  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    if (observerInstance.current) {
      observerInstance.current.disconnect();
      observerInstance.current = null;
    }
    if (!node) return;
    observerInstance.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreRef.current) {
          setDisplayCount((prev) => prev + 10);
        }
      },
      { threshold: 1.0 }
    );
    observerInstance.current.observe(node);
  }, []);

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

      {/* 기간 선택 */}
      <div className="flex flex-wrap items-center gap-3 mt-3">
        {/* 3-way 토글 */}
        <div className="flex p-0.5 rounded-lg bg-rankBg1 border border-border1">
          {(["recent", "season", "range"] as DateMode[]).map((mode) => {
            const labels: Record<DateMode, string> = {
              recent: "최근",
              season: "시즌 전적",
              range: "기간 선택",
            };
            return (
              <button
                key={mode}
                type="button"
                onClick={() => setDateMode(mode)}
                className={`px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${
                  dateMode === mode
                    ? "bg-blue text-blueText font-bold"
                    : "text-primary2 font-normal hover:text-primary1"
                }`}
              >
                {labels[mode]}
              </button>
            );
          })}
        </div>

        {/* 시즌 전적 - 시즌 선택 */}
        {dateMode === "season" && (
          <>
            <div className="hidden sm:block h-5 w-px bg-border1" />
            <div className="relative">
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className={SELECT_CLASS}
              >
                {SEASON_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s} 시즌
                  </option>
                ))}
              </select>
              <ChevronDown />
            </div>
          </>
        )}

        {/* 기간 선택 - 시즌 + 시작 월 + 끝 월 + 적용 */}
        {dateMode === "range" && (
          <>
            <div className="hidden sm:block h-5 w-px bg-border1" />
            <div className="relative">
              <select
                value={draftRangeSeason}
                onChange={(e) => setDraftRangeSeason(e.target.value)}
                className={SELECT_CLASS}
              >
                {SEASON_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s} 시즌
                  </option>
                ))}
              </select>
              <ChevronDown />
            </div>
            <div className="relative">
              <select
                value={draftFromMonth}
                onChange={(e) => setDraftFromMonth(Number(e.target.value))}
                className={SELECT_CLASS}
              >
                {MONTH_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}월
                  </option>
                ))}
              </select>
              <ChevronDown />
            </div>
            <span className="text-primary2 text-sm">~</span>
            <div className="relative">
              <select
                value={draftToMonth}
                onChange={(e) => setDraftToMonth(Number(e.target.value))}
                className={SELECT_CLASS}
              >
                {MONTH_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}월
                  </option>
                ))}
              </select>
              <ChevronDown />
            </div>
            <button
              type="button"
              onClick={handleApplyRange}
              className="px-3 py-1.5 rounded-lg text-sm font-bold bg-bluePrimary hover:opacity-90 text-white transition-opacity duration-150"
            >
              적용
            </button>
          </>
        )}
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
            if (!isLoggedIn) {
              return <TextCard text="로그인 후 이용해주세요" />;
            }

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
                      {hasMore && <div ref={sentinelRef} className="h-10" />}
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
