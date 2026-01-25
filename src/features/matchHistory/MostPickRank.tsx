import { useState } from "react";
import { MostPickStats } from "@/data/types/record";
import RankItem from "./RankItem";

interface Props {
  mostPickData: MostPickStats[];
}

const MostPickRank = ({ mostPickData }: Props) => {
  const [showAll, setShowAll] = useState(false);
  const INITIAL_DISPLAY_COUNT = 5;

  const rankData = mostPickData.map((champRecord, index) => {
    return {
      rank: index + 1,
      championName: champRecord.champName,
      championNameEng: champRecord.champNameEng,
      kda: champRecord.kda,
      winRate: champRecord.winRate,
      games: champRecord.totalCount,
    };
  });

  const displayedData = showAll ? rankData : rankData.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMore = rankData.length > INITIAL_DISPLAY_COUNT;

  return (
    <div className="flex flex-col gap-2 sm:gap-4">
      {displayedData.map((data) => (
        <RankItem key={data.rank} {...data} />
      ))}

      {hasMore && !showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="w-full py-2 rounded bg-darkBg1 border border-border2 text-primary2 hover:bg-grayHover transition-colors text-sm"
        >
          더보기
        </button>
      )}
    </div>
  );
};

export default MostPickRank;
