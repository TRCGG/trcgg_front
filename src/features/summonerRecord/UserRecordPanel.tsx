import UserStatsOverview from "@/features/matchHistory/UserStatsOverview";
import CardWithTitle from "@/components/ui/CardWithTitle";
import MostPickRank from "@/features/matchHistory/MostPickRank";
import {
  MatchDashboardData,
  RecentGameRecord,
  UserRecentRecordsResponse,
} from "@/data/types/record";
import MatchItem from "@/features/matchHistory/MatchItem";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/services/apiService";
import { getRecentRecords } from "@/services/record";

interface Props {
  riotName: string;
  riotTag: string;
  data: MatchDashboardData;
}

const UserRecordPanel = ({ riotName, riotTag, data }: Props) => {
  const guildId =
    typeof window !== "undefined" ? (localStorage.getItem("guildId") ?? undefined) : undefined;

  // 최근 전적 데이터 가져오기
  const { data: recentRecordsData } = useQuery<ApiResponse<UserRecentRecordsResponse>>({
    queryKey: ["userRecentRecords", riotName, riotTag, guildId],
    queryFn: () => getRecentRecords(riotName, riotTag, guildId ?? ""),
    staleTime: 3 * 60 * 1000,
    enabled: !!guildId && !!riotName && !!riotTag,
  });

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
        {recentRecordsData?.data?.data && recentRecordsData.data.data.length > 0 && (
          <CardWithTitle title="Recent Matches" className="w-full">
            <div className="flex flex-1 flex-col gap-4">
              {recentRecordsData.data.data.map((datum: RecentGameRecord) => (
                <MatchItem matchData={datum} key={datum.gameId} />
              ))}
            </div>
          </CardWithTitle>
        )}
      </div>
    </main>
  );
};

export default UserRecordPanel;
