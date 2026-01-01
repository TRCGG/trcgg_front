import UserStatsOverview from "@/features/matchHistory/UserStatsOverview";
import CardWithTitle from "@/components/ui/CardWithTitle";
import MostPickRank from "@/features/matchHistory/MostPickRank";
import {
  MatchDashboardData,
  RecentGameRecord,
  UserRecentRecordsResponse,
} from "@/data/types/record";
import MatchItem from "@/features/matchHistory/MatchItem";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/services/apiService";
import { getRecentRecords } from "@/services/record";

interface Props {
  riotName: string;
  riotTag: string;
  data: MatchDashboardData;
  onRefreshRecords?: () => void;
}

const UserRecordPanel = ({ riotName, riotTag, data, onRefreshRecords }: Props) => {
  const RECORD_DISPLAY_COUNT = 5;
  const MOST_PICK_DISTPLAY_COUNT = 10;
  const guildId =
    typeof window !== "undefined" ? (localStorage.getItem("guildId") ?? undefined) : undefined;

  const [displayCount, setDisplayCount] = useState(RECORD_DISPLAY_COUNT);

  // 최근 전적 데이터 가져오기
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

  // lines 데이터를 합산하여 전체 통계 계산
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

  const handleRefresh = async () => {
    if (onRefreshRecords) {
      await onRefreshRecords();
    }
    await refetchRecentRecords();
  };

  return (
    <main className="mt-10 md:mt-12 flex flex-col gap-3 md:min-w-[1080px]">
      {/* Summary */}
      <UserStatsOverview
        riotName={data.member.riotName}
        riotTag={data.member.riotNameTag}
        totalData={totalStatData}
        monthData={data.summary}
        mostChampion={data.mostPicks[0]?.champNameEng || ""}
        mostLane={mostLane}
        onRefresh={handleRefresh}
      />
      <div className="flex gap-3 flex-col md:flex-row">
        {/* 모스트 픽 */}
        {data.mostPicks && data.mostPicks.length > 0 && (
          <CardWithTitle title="Most Pick" className="md:w-[350px] w-full self-start">
            <MostPickRank mostPickData={data.mostPicks.slice(0, MOST_PICK_DISTPLAY_COUNT)} />
          </CardWithTitle>
        )}

        {/* 최근 전적 */}
        {displayedRecords && displayedRecords.length > 0 && (
          <CardWithTitle title="Recent Matches" className="w-full">
            <div className="flex flex-1 flex-col gap-4">
              {displayedRecords.map((datum: RecentGameRecord) => (
                <MatchItem matchData={datum} key={datum.gameId} />
              ))}

              {/* 더보기 버튼 */}
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
    </main>
  );
};

export default UserRecordPanel;
