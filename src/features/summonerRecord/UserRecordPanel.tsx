import UserStatsOverview from "@/features/matchHistory/UserStatsOverview";
import CardWithTitle from "@/components/ui/CardWithTitle";
import MostPickRank from "@/features/matchHistory/MostPickRank";
import {
  MatchDashboardData,
  MostPickStats,
  RecentGameRecord,
  UserRecentRecordsResponse,
} from "@/data/types/record";
import MatchItem from "@/features/matchHistory/MatchItem";
import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/services/apiService";
import { getRecentRecords } from "@/services/record";
import PositionStats from "@/features/matchHistory/PositionStats";
import TeamworkStats from "@/features/matchHistory/TeamworkStats";
import SummonerTabBar, { SummonerTab } from "@/features/summonerRecord/SummonerTabBar";
import UserChampionRow from "@/features/matchHistory/UserChampionRow";

interface Props {
  riotName: string;
  riotTag: string;
  data: MatchDashboardData;
  onRefreshRecords?: () => void;
}

type ChampionSortType = "gameCount" | "winRate";

const UserRecordPanel = ({ riotName, riotTag, data, onRefreshRecords }: Props) => {
  const RECORD_DISPLAY_COUNT = 5;
  const MOST_PICK_DISTPLAY_COUNT = 10;
  const guildId =
    typeof window !== "undefined" ? (localStorage.getItem("guildId") ?? undefined) : undefined;

  const [activeTab, setActiveTab] = useState<SummonerTab>("overview");
  const [displayCount, setDisplayCount] = useState(RECORD_DISPLAY_COUNT);
  const [championSortType, setChampionSortType] = useState<ChampionSortType>("gameCount");

  const {
    data: recentRecordsData,
    isFetching,
    refetch: refetchRecentRecords,
  } = useQuery<ApiResponse<UserRecentRecordsResponse>>({
    queryKey: ["userRecentRecords", riotName, riotTag, guildId],
    queryFn: () => getRecentRecords(riotName, riotTag, guildId),
    staleTime: 3 * 60 * 1000,
    enabled: !!guildId && !!riotName && !!riotTag,
  });

  const allRecords = recentRecordsData?.data?.data || [];
  const displayedRecords = allRecords.slice(0, displayCount);
  const hasMoreData = allRecords.length > displayCount;

  const mostLane = data.lines.reduce((prev, curr) =>
    curr.totalCount > prev.totalCount ? curr : prev
  ).position;

  const totalGames = data.lines.reduce((sum, line) => sum + line.totalCount, 0);
  const totalWins = data.lines.reduce((sum, line) => sum + line.win, 0);
  const totalLoses = data.lines.reduce((sum, line) => sum + line.lose, 0);
  const calculatedWinRate = totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(2) : "0.00";

  const totalStatData = {
    totalGameCount: totalGames,
    winCount: totalWins,
    loseCount: totalLoses,
    winRate: calculatedWinRate,
  };

  const sortedChampions = useMemo((): MostPickStats[] => {
    const sorted = [...data.mostPicks];
    if (championSortType === "winRate") {
      sorted.sort((a, b) => parseFloat(b.winRate) - parseFloat(a.winRate));
    } else {
      sorted.sort((a, b) => b.totalCount - a.totalCount);
    }
    return sorted;
  }, [data.mostPicks, championSortType]);

  const handleRefresh = async () => {
    if (onRefreshRecords) {
      await onRefreshRecords();
    }
    await refetchRecentRecords();
  };

  const handleTabChange = (tab: SummonerTab) => {
    setActiveTab(tab);
    setDisplayCount(RECORD_DISPLAY_COUNT);
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
        onRefresh={handleRefresh}
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
            <CardWithTitle title="최근 전적" className="w-full">
              <div className="flex flex-1 flex-col gap-4">
                {displayedRecords.map((datum: RecentGameRecord) => (
                  <MatchItem matchData={datum} key={datum.gameId} />
                ))}

                {hasMoreData && (
                  <button
                    type="button"
                    onClick={() => setDisplayCount((prev) => prev + RECORD_DISPLAY_COUNT)}
                    disabled={isFetching}
                    className="w-full py-3 rounded bg-darkBg2 border border-border2 text-primary1 hover:bg-grayHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isFetching ? "불러오는 중..." : "더보기"}
                  </button>
                )}
              </div>
            </CardWithTitle>
          )}
        </div>
      )}

      {/* ── 챔피언 탭 ── */}
      {activeTab === "champion" && (
        <CardWithTitle title="챔피언 전적">
          {data.mostPicks.length === 0 ? (
            <div className="text-center text-primary2 py-8">챔피언 전적 데이터가 없습니다</div>
          ) : (
            <div className="flex flex-col gap-3">
              {/* 정렬 탭 */}
              <div className="flex gap-2 border-b border-border2">
                <button
                  type="button"
                  onClick={() => setChampionSortType("gameCount")}
                  className={`px-4 py-2 text-sm transition-colors ${
                    championSortType === "gameCount"
                      ? "text-primary1 border-b-2 border-primary1"
                      : "text-primary2 hover:text-primary1"
                  }`}
                >
                  판수 순
                </button>
                <button
                  type="button"
                  onClick={() => setChampionSortType("winRate")}
                  className={`px-4 py-2 text-sm transition-colors ${
                    championSortType === "winRate"
                      ? "text-primary1 border-b-2 border-primary1"
                      : "text-primary2 hover:text-primary1"
                  }`}
                >
                  승률 순
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
        </CardWithTitle>
      )}
    </main>
  );
};

export default UserRecordPanel;
