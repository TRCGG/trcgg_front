import UserStatsOverview from "@/features/matchHistory/UserStatsOverview";
import CardWithTitle from "@/components/ui/CardWithTitle";
import MostPickRank from "@/features/matchHistory/MostPickRank";
import {
  MatchDashboardData,
  MostPicksResponse,
  MostPickStats,
  RecentGameRecord,
  UserRecentRecordsResponse,
} from "@/data/types/record";
import MatchItem from "@/features/matchHistory/MatchItem";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useQuery, useQueries } from "@tanstack/react-query";
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

const SHARE_LANES = ["TOP", "JUG", "MID", "ADC", "SUP"] as const;

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
    enabled: activeTab === "champion" && !!guildId && !!riotName,
  });

  // 라인 비중(%) 계산 — most-picks 응답엔 포지션 정보가 없으므로, 선택한
  // 기간(championDateRange)에 맞춰 라인별로 most-picks를 조회해 각 라인의 플레이
  // 수를 합산한다. queryKey가 메인 쿼리와 동일한 규칙이라 특정 라인 선택 시엔
  // 캐시를 공유한다. 기간(시즌)을 바꾸면 queryKey가 바뀌어 자동 재계산된다.
  const laneShareQueries = useQueries({
    queries: SHARE_LANES.map((lane) => ({
      queryKey: ["mostPicks", riotName, guildId, championDateRange, lane],
      queryFn: () =>
        getMostPicks(riotName, guildId!, {
          datePreset: championDateRange.datePreset,
          season: championDateRange.season,
          fromMonth: championDateRange.fromMonth,
          toMonth: championDateRange.toMonth,
          position: lane,
        }),
      staleTime: 3 * 60 * 1000,
      enabled: activeTab === "champion" && !!guildId && !!riotName,
    })),
  });

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
  // 라인별 플레이 수 = 각 라인 most-picks 응답의 totalCount 합
  const laneShareCounts = SHARE_LANES.map((lane, i) =>
    (laneShareQueries[i].data?.data?.data ?? []).reduce((sum, champ) => sum + champ.totalCount, 0)
  );
  const laneShareTotal = laneShareCounts.reduce((sum, count) => sum + count, 0);
  const championLaneShare = (position: Position) => {
    const index = SHARE_LANES.indexOf(position as (typeof SHARE_LANES)[number]);
    if (index < 0 || laneShareTotal === 0) return 0;
    return Math.round((laneShareCounts[index] / laneShareTotal) * 100);
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
    const source = mostPicksData?.data?.data ?? [];
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
