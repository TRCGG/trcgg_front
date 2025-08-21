import UserStatsOverview from "@/features/matchHistory/UserStatsOverview";
import CardWithTitle from "@/components/ui/CardWithTitle";
import MostPickRank from "@/features/matchHistory/MostPickRank";
import { PlayerStatsData, RecentGame } from "@/data/types/record";
import MatchItem from "@/features/matchHistory/MatchItem";
import React from "react";

interface Props {
  riotName: string;
  riotTag: string;
  data: PlayerStatsData;
}

const UserRecordPanel = ({ riotName, riotTag, data }: Props) => {
  const mostLane = data.record_data.reduce((prev, curr) =>
    curr.total_count > prev.total_count ? curr : prev
  ).position;

  const totalGameCount = data.record_data.reduce((sum, curr) => sum + curr.total_count, 0);
  const winCount = data.record_data.reduce((sum, curr) => sum + curr.win, 0);
  const loseCount = data.record_data.reduce((sum, curr) => sum + curr.lose, 0);
  const winRate =
    totalGameCount > 0 ? Math.round((winCount / totalGameCount) * 100 * 100) / 100 : 0;
  const totalStatData = {
    totalGameCount,
    winCount,
    loseCount,
    winRate,
  };

  return (
    <main className="mt-10 md:mt-12 flex flex-col gap-3 md:min-w-[1080px]">
      {/* Summary */}
      <UserStatsOverview
        riotName={riotName}
        riotTag={riotTag}
        totalData={totalStatData}
        monthData={data.month_data[0]}
        mostChampion={data.most_pick_data[0].champ_name_eng}
        mostLane={mostLane}
      />
      <div className="flex gap-3 flex-col md:flex-row">
        {/* 모스트 픽 */}
        {data.most_pick_data && (
          <CardWithTitle title="Most Pick" className="md:w-[350px] w-full self-start">
            <MostPickRank mostPickData={data.most_pick_data.slice(0, 5)} />
          </CardWithTitle>
        )}

        {/* 최근 전적 */}
        {data.recent_data && (
          <CardWithTitle title="Recent Matches" className="w-full">
            <div className="flex flex-1 flex-col gap-4">
              {data.recent_data.map((datum: RecentGame) => (
                <MatchItem matchData={datum} key={datum.game_id} />
              ))}
            </div>
          </CardWithTitle>
        )}
      </div>
    </main>
  );
};

export default UserRecordPanel;
