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
}

const UserRecordPanel = ({ riotName, riotTag, data }: Props) => {
  const DISPLAY_COUNT = 5;
  const guildId =
    typeof window !== "undefined" ? (localStorage.getItem("guildId") ?? undefined) : undefined;

  const [displayCount, setDisplayCount] = useState(DISPLAY_COUNT);

  // 최근 전적 데이터 가져오기
  const { data: recentRecordsData, isFetching } = useQuery<ApiResponse<UserRecentRecordsResponse>>({
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

  const totalStatData = {
    totalGameCount: data.summary.totalCount,
    winCount: data.summary.win,
    loseCount: data.summary.lose,
    winRate: data.summary.winRate,
  };

  return (
    <main className="mt-10 md:mt-12 flex flex-col gap-3 md:min-w-[1080px]">
      {/* Summary */}
      <UserStatsOverview
        riotName={riotName}
        riotTag={riotTag}
        totalData={totalStatData}
        monthData={data.summary}
        mostChampion={data.mostPicks[0]?.champNameEng || ""}
        mostLane={mostLane}
      />
      <div className="flex gap-3 flex-col md:flex-row">
        {/* 모스트 픽 */}
        {data.mostPicks && data.mostPicks.length > 0 && (
          <CardWithTitle title="Most Pick" className="md:w-[350px] w-full self-start">
            <MostPickRank mostPickData={data.mostPicks.slice(0, 5)} />
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
                  onClick={() => setDisplayCount((prev) => prev + DISPLAY_COUNT)}
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
