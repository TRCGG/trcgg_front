import type { NextPage } from "next";
import SummonerPageHeader from "@/components/layout/SummonerPageHeader";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import useUserSearchController from "@/hooks/searchUserList/useUserSearchController";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import TitleBox from "@/components/ui/TitleBox";
import PositionFilter from "@/features/statistics/PositionFilter";
import ChampionRankHeader from "@/features/statistics/ChampionRankHeader";
import ChampionRankItem from "@/features/statistics/ChampionRankItem";
import { useQuery } from "@tanstack/react-query";
import { getChampionStatistics, Position, DatePreset } from "@/services/statistics";
import { ApiResponse } from "@/services/apiService";
import { ChampionStatisticsResponse } from "@/data/types/statistics";
import TextCard from "@/components/ui/TextCard";

type DateMode = "recent" | "season" | "range";
type SortBy = "totalGames" | "winRate";
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

const Champion: NextPage = () => {
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
    data: championStatisticsData,
    isLoading: isLoadingStatistics,
    isFetching: isFetchingStatistics,
    isFetched: isFetchedStatistics,
    isError: isErrorStatistics,
  } = useQuery<ApiResponse<ChampionStatisticsResponse>>({
    queryKey: [
      "championStatistics",
      guildId,
      selectedPosition,
      dateMode,
      querySeason,
      queryFromMonth,
      queryToMonth,
    ],
    queryFn: () =>
      getChampionStatistics(
        guildId,
        selectedPosition,
        dateMode as DatePreset,
        querySeason,
        queryFromMonth,
        queryToMonth
      ),
    enabled: !!guildId,
    staleTime: 10 * 60 * 1000,
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

  const popularChampions = useMemo(
    () =>
      [...(championStatisticsData?.data?.data || [])]
        .sort((a, b) => b.totalCount - a.totalCount)
        .slice(0, 10)
        .map((c) => c.champNameEng),
    [championStatisticsData?.data?.data]
  );

  const sortedChampions = useMemo(() => {
    const champions = [...(championStatisticsData?.data?.data || [])];
    champions.sort((a, b) => {
      const aValue = sortBy === "totalGames" ? a.totalCount : parseFloat(a.winRate) || 0;
      const bValue = sortBy === "totalGames" ? b.totalCount : parseFloat(b.winRate) || 0;
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });
    return champions;
  }, [championStatisticsData?.data?.data, sortBy, sortOrder]);

  const displayedChampions = sortedChampions.slice(0, displayCount);
  const hasMore = sortedChampions.length > displayCount;
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
        title="챔피언 분석"
        description="챔피언 플레이 기록이 5판 이상인 경우에만 통계에 표시"
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
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  dateMode === mode
                    ? "bg-primary1 text-darkBg2 shadow"
                    : "text-primary2 hover:text-primary1"
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
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blueButton hover:bg-blueText2 text-white transition-colors duration-150"
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
        <ChampionRankHeader sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
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
                  sortedChampions.length > 0 && (
                    <>
                      {displayedChampions.map((champion, index) => {
                        const rank = index + 1;
                        const totalChampions = sortedChampions.length;

                        let tier: 1 | 5 | undefined;
                        if (rank <= 10 && totalChampions - rank >= 10) {
                          tier = 1;
                        } else if (totalChampions - rank < 10 && rank > 10) {
                          tier = 5;
                        }

                        const isPopular = popularChampions.includes(champion.champNameEng);

                        return (
                          <ChampionRankItem
                            key={`${champion.champNameEng}_${champion.position}`}
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
                      {hasMore && <div ref={sentinelRef} className="h-10" />}
                    </>
                  )}

                {!(isErrorStatistics || isLoadingStatistics || isFetchingStatistics) &&
                  isFetchedStatistics &&
                  sortedChampions.length === 0 && (
                    <div className="text-center py-10 text-primary2 bg-darkBg2 rounded border border-border2">
                      5판 이상 플레이한 챔피언이 없어 통계 데이터를 확인할 수 없습니다.
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
