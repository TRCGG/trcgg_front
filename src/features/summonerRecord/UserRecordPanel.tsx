import UserStatsOverview from "@/features/matchHistory/UserStatsOverview";
import CardWithTitle from "@/components/ui/CardWithTitle";
import MostPickRank from "@/features/matchHistory/MostPickRank";
import {
  LineStats,
  MatchDashboardData,
  MostPicksResponse,
  MostPickStats,
  RecentGameRecord,
  UserRecentRecordsResponse,
} from "@/data/types/record";
import MatchItem from "@/features/matchHistory/MatchItem";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/services/apiService";
import { getMostPicks, getRecentRecords } from "@/services/record";
import PositionStats from "@/features/matchHistory/PositionStats";
import TeamworkStats from "@/features/matchHistory/TeamworkStats";
import SummonerTabBar, { SummonerTab } from "@/features/summonerRecord/SummonerTabBar";
import UserChampionRow from "@/features/matchHistory/UserChampionRow";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PositionFilter from "@/features/statistics/PositionFilter";
import DateRangeFilter, { DateRangeValue } from "@/features/statistics/DateRangeFilter";
import { Position } from "@/services/statistics";
import H2HPanel from "@/features/h2h/H2HPanel";

interface Props {
  riotName: string;
  riotTag: string;
  data: MatchDashboardData;
  onRefreshRecords?: () => void;
}

type ChampionSortType = "gameCount" | "winRate" | "kda";

const UserRecordPanel = ({ riotName, riotTag, data, onRefreshRecords }: Props) => {
  const RECORD_DISPLAY_COUNT = 10;
  const MOST_PICK_DISTPLAY_COUNT = 10;
  const guildId =
    typeof window !== "undefined" ? (localStorage.getItem("guildId") ?? undefined) : undefined;

  // 탭 상태를 URL 쿼리(?tab=)로 승격 — 딥링크/새로고침/뒤로가기 대응. 잘못된 값은 overview로 폴백.
  const router = useRouter();
  const tabParam = router.query.tab;
  const activeTab: SummonerTab =
    tabParam === "champion" || tabParam === "h2h" ? tabParam : "overview";
  const [displayCount, setDisplayCount] = useState(RECORD_DISPLAY_COUNT);
  const [championSortType, setChampionSortType] = useState<ChampionSortType>("gameCount");
  const [championSortOrder, setChampionSortOrder] = useState<"asc" | "desc">("desc");
  const [championDateRange, setChampionDateRange] = useState<DateRangeValue>({
    datePreset: "recent",
  });
  const [championPosition, setChampionPosition] = useState<Position>("ALL");

  const { data: recentRecordsData, refetch: refetchRecentRecords } = useQuery<
    ApiResponse<UserRecentRecordsResponse>
  >({
    queryKey: ["userRecentRecords", riotName, riotTag, guildId],
    queryFn: () => getRecentRecords(riotName, riotTag, guildId),
    staleTime: 3 * 60 * 1000,
    enabled: !!guildId && !!riotName && !!riotTag,
  });

  // 라인 비중은 most-picks 응답의 lines에서 온다. 아래에서 기록 없는 라인의 조회를
  // 막는데, 막힌 동안 응답이 없다고 비중 표시까지 사라지면 안 되므로 마지막 값을 남긴다.
  const [shareLines, setShareLines] = useState<LineStats[]>([]);
  const dateRangeKey = JSON.stringify(championDateRange);

  // 기록이 없는 라인은 조회해도 빈 목록이라 요청하지 않는다.
  // lines를 아직 못 받았으면 막지 않는다 — 첫 진입은 ALL이라 그대로 통과한다.
  const hasRecordInPosition =
    championPosition === "ALL" ||
    shareLines.length === 0 ||
    shareLines.some((line) => line.position === championPosition && line.totalCount > 0);

  const {
    data: mostPicksData,
    isLoading: isLoadingMostPicks,
    isFetching: isFetchingMostPicks,
  } = useQuery<ApiResponse<MostPicksResponse>>({
    queryKey: ["mostPicks", riotName, guildId, championDateRange, championPosition],
    queryFn: () =>
      getMostPicks(riotName, guildId!, {
        datePreset: championDateRange.datePreset,
        season: championDateRange.season,
        fromMonth: championDateRange.fromMonth,
        toMonth: championDateRange.toMonth,
        position: championPosition,
      }),
    staleTime: 3 * 60 * 1000,
    enabled: activeTab === "champion" && !!guildId && !!riotName && hasRecordInPosition,
  });

  // 기간이 바뀌면 이전 기간의 lines로 판단하지 않도록 비운다. 비면 게이트가 열려
  // 새 기간의 lines를 다시 받아온다.
  useEffect(() => {
    setShareLines([]);
  }, [dateRangeKey]);

  useEffect(() => {
    const lines = mostPicksData?.data?.data?.lines;
    if (lines) setShareLines(lines);
  }, [mostPicksData]);

  const allRecords = recentRecordsData?.data?.data || [];
  const displayedRecords = allRecords.slice(0, displayCount);
  const hasMoreData = allRecords.length > displayCount;

  // 무한 스크롤: 하단 센티넬이 뷰포트에 들어오면 표시 개수를 늘린다.
  // displayCount 변경 시 옵저버를 재생성해, 센티넬이 여전히 보이면 연속으로 더 채운다.
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!hasMoreData) return undefined;
    const target = loadMoreRef.current;
    if (!target) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setDisplayCount((prev) => prev + RECORD_DISPLAY_COUNT);
        }
      },
      { rootMargin: "100px" }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMoreData, displayCount]);

  const mostLane = data.lines.reduce((prev, curr) =>
    curr.totalCount > prev.totalCount ? curr : prev
  ).position;

  const totalGames = data.lines.reduce((sum, line) => sum + line.totalCount, 0);
  const laneShareTotal = shareLines.reduce((sum, line) => sum + line.totalCount, 0);
  const championLaneShare = (position: Position) => {
    if (laneShareTotal === 0) return 0;
    const count = shareLines.find((line) => line.position === position)?.totalCount ?? 0;
    return Math.round((count / laneShareTotal) * 100);
  };
  const totalWins = data.lines.reduce((sum, line) => sum + line.win, 0);
  const totalLoses = data.lines.reduce((sum, line) => sum + line.lose, 0);
  const calculatedWinRate = totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(2) : "0.00";

  const totalStatData = {
    totalGameCount: totalGames,
    winCount: totalWins,
    loseCount: totalLoses,
    winRate: calculatedWinRate,
  };

  const handleChampionSort = (type: ChampionSortType) => {
    if (type === championSortType) {
      setChampionSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setChampionSortType(type);
      setChampionSortOrder("desc");
    }
  };

  const getSortIndicator = (type: ChampionSortType) => {
    if (championSortType !== type) return "";
    return championSortOrder === "desc" ? " ▼" : " ▲";
  };

  const sortedChampions = useMemo((): MostPickStats[] => {
    const source = mostPicksData?.data?.data?.mostPicks ?? [];
    const sorted = [...source];
    const multiplier = championSortOrder === "asc" ? -1 : 1;
    if (championSortType === "winRate") {
      sorted.sort((a, b) => multiplier * (parseFloat(b.winRate) - parseFloat(a.winRate)));
    } else if (championSortType === "kda") {
      sorted.sort((a, b) => multiplier * (parseFloat(b.kda) - parseFloat(a.kda)));
    } else {
      sorted.sort((a, b) => multiplier * (b.totalCount - a.totalCount));
    }
    return sorted;
  }, [mostPicksData, championSortType, championSortOrder]);

  const handleRefresh = async () => {
    if (onRefreshRecords) {
      await onRefreshRecords();
    }
    await refetchRecentRecords();
  };

  const handleTabChange = (tab: SummonerTab) => {
    setDisplayCount(RECORD_DISPLAY_COUNT);
    // URL만 갱신(데이터 refetch·스크롤 리셋 없이). activeTab은 router.query.tab에서 파생됨.
    router.push({ pathname: router.pathname, query: { ...router.query, tab } }, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  return (
    <main className="mt-6 md:mt-8 px-4 md:px-0 flex flex-col gap-3 md:min-w-[1080px]">
      {/* Summary */}
      <UserStatsOverview
        riotName={data.member.riotName}
        riotTag={data.member.riotNameTag}
        totalData={totalStatData}
        monthData={data.summary}
        mostLane={mostLane}
        onRefresh={activeTab === "overview" ? handleRefresh : undefined}
      />

      {/* 탭 바 */}
      <SummonerTabBar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* ── 종합 탭 ── */}
      {activeTab === "overview" && (
        <div className="flex gap-3 flex-col md:flex-row">
          <div className="flex flex-col gap-3">
            {data.mostPicks && data.mostPicks.length > 0 && (
              <CardWithTitle title="모스트 픽" className="md:w-[350px] w-full self-start">
                <MostPickRank mostPickData={data.mostPicks.slice(0, MOST_PICK_DISTPLAY_COUNT)} />
              </CardWithTitle>
            )}

            <CardWithTitle title="포지션 승률">
              <PositionStats linesData={data.lines} />
            </CardWithTitle>

            {data.synergy && data.synergy.length > 0 && (
              <CardWithTitle title="팀워크">
                <TeamworkStats synergyData={data.synergy} />
              </CardWithTitle>
            )}
          </div>

          {displayedRecords && displayedRecords.length > 0 && (
            <CardWithTitle title="최근 전적" className="w-full min-w-0">
              <div className="flex flex-1 flex-col gap-4 min-w-0">
                {displayedRecords.map((datum: RecentGameRecord) => (
                  <MatchItem matchData={datum} key={datum.gameId} />
                ))}

                {hasMoreData && (
                  <div
                    ref={loadMoreRef}
                    className="flex items-center justify-center gap-2 py-4 text-sm text-primary2"
                  >
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    불러오는 중...
                  </div>
                )}
              </div>
            </CardWithTitle>
          )}
        </div>
      )}

      {/* ── 챔피언 탭 ── */}
      {activeTab === "champion" && (
        <CardWithTitle title="챔피언 전적">
          <div className="flex flex-col gap-4">
            {/* 필터 영역: 기간 토글 + 라인 토글 */}
            <div className="flex flex-wrap items-center gap-3">
              <DateRangeFilter onChange={setChampionDateRange} />
              <div className="hidden sm:block h-5 w-px bg-border1" />
              <PositionFilter
                selectedPosition={championPosition}
                onSelectPosition={setChampionPosition}
                share={laneShareTotal > 0 ? championLaneShare : undefined}
              />
            </div>

            {(isLoadingMostPicks || isFetchingMostPicks) && <LoadingSpinner />}
            {!(isLoadingMostPicks || isFetchingMostPicks) && sortedChampions.length === 0 && (
              <div className="text-center text-primary2 py-8 bg-darkBg2 rounded border border-border2">
                챔피언 전적 데이터가 없습니다
              </div>
            )}
            {!(isLoadingMostPicks || isFetchingMostPicks) && sortedChampions.length > 0 && (
              <div className="flex flex-col gap-1">
                {/* 열 제목 헤더 */}
                <div className="flex items-center gap-1 sm:gap-3 px-2 sm:px-3 py-1 text-xs font-bold text-primary2">
                  <div className="w-5 sm:w-7 shrink-0" />
                  <div className="w-10 sm:w-12 shrink-0" />
                  <div className="flex-1 min-w-0 sm:w-28 sm:flex-none" />
                  <button
                    type="button"
                    onClick={() => handleChampionSort("gameCount")}
                    className={`w-14 sm:w-32 text-center transition-colors shrink-0 ${
                      championSortType === "gameCount" ? "text-primary1" : "hover:text-primary1"
                    }`}
                  >
                    판수{getSortIndicator("gameCount")}
                  </button>
                  <div className="flex-1 min-w-0 hidden sm:block" />
                  <button
                    type="button"
                    onClick={() => handleChampionSort("kda")}
                    className={`w-14 sm:w-28 text-center transition-colors shrink-0 ${
                      championSortType === "kda" ? "text-primary1" : "hover:text-primary1"
                    }`}
                  >
                    KDA{getSortIndicator("kda")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChampionSort("winRate")}
                    className={`w-12 sm:w-24 text-center transition-colors shrink-0 ${
                      championSortType === "winRate" ? "text-primary1" : "hover:text-primary1"
                    }`}
                  >
                    승률{getSortIndicator("winRate")}
                  </button>
                </div>

                {/* 챔피언 목록 */}
                <div className="flex flex-col gap-2">
                  {sortedChampions.map((champ, i) => (
                    <UserChampionRow key={champ.champNameEng} rank={i + 1} data={champ} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardWithTitle>
      )}

      {/* ── 상대전적 탭 ── */}
      {activeTab === "h2h" && <H2HPanel riotName={riotName} riotTag={riotTag} guildId={guildId} />}
    </main>
  );
};

export default UserRecordPanel;
