import UserStatsOverview from "@/features/matchHistory/UserStatsOverview";
import CardWithTitle from "@/components/ui/CardWithTitle";
import MostPickRank from "@/features/matchHistory/MostPickRank";
import {
  MatchDashboardData,
  RecentGameRecord,
  UserRecentRecordsResponse,
} from "@/data/types/record";
import MatchItem from "@/features/matchHistory/MatchItem";
import React, { useState, useEffect } from "react";
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

  const [page, setPage] = useState(1);
  const [allRecords, setAllRecords] = useState<RecentGameRecord[]>([]);

  // 최근 전적 데이터 가져오기
  const { data: recentRecordsData, isFetching } = useQuery<ApiResponse<UserRecentRecordsResponse>>({
    queryKey: ["userRecentRecords", riotName, riotTag, guildId, page],
    queryFn: () => getRecentRecords(riotName, riotTag, page, guildId ?? ""),
    staleTime: 3 * 60 * 1000,
    enabled: !!guildId && !!riotName && !!riotTag,
  });

  // 새 데이터가 로드되면 누적
  useEffect(() => {
    if (recentRecordsData?.data?.data) {
      const newData = recentRecordsData.data.data;
      if (page === 1) {
        // 첫 페이지는 덮어쓰기
        setAllRecords(newData);
      } else {
        // 이후 페이지는 추가
        setAllRecords((prev) => [...prev, ...newData]);
      }
    }
  }, [recentRecordsData, page]);

  const hasMoreData = recentRecordsData?.data?.data && recentRecordsData.data.data.length === 10;

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
        {allRecords && allRecords.length > 0 && (
          <CardWithTitle title="Recent Matches" className="w-full">
            <div className="flex flex-1 flex-col gap-4">
              {allRecords.map((datum: RecentGameRecord) => (
                <MatchItem matchData={datum} key={datum.gameId} />
              ))}

              {/* 더보기 버튼 */}
              {hasMoreData && (
                <button
                  type="button"
                  onClick={() => setPage((prev) => prev + 1)}
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
