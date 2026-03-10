import { useRouter } from "next/router";
import { SynergyStats } from "@/data/types/record";
import { useState, useMemo } from "react";

interface Props {
  synergyData: SynergyStats[];
}

type SortType = "winRate" | "gameCount";

const TeamworkStats = ({ synergyData }: Props) => {
  const router = useRouter();
  const [sortType, setSortType] = useState<SortType>("winRate");
  const [displayCount, setDisplayCount] = useState(5);

  const handleClick = (riotName: string, riotTag: string) => {
    router.push(`/summoners/${encodeURIComponent(riotName)}/${encodeURIComponent(riotTag)}`);
  };

  // 정렬 데이터 메모이제이션
  const sortedData = useMemo(() => {
    const sorted = [...synergyData];
    if (sortType === "winRate") {
      // 승률 순 정렬 (높은 순)
      sorted.sort((a, b) => parseFloat(b.winRate) - parseFloat(a.winRate));
    } else {
      // 판수 순 정렬 (많은 순)
      sorted.sort((a, b) => b.totalCount - a.totalCount);
    }
    return sorted;
  }, [synergyData, sortType]);

  const displayedData = sortedData.slice(0, displayCount);
  const hasMore = sortedData.length > displayCount && displayCount < 10;

  const handleShowMore = () => {
    setDisplayCount(10);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 탭 */}
      <div className="flex gap-2 border-b border-border2">
        <button
          type="button"
          onClick={() => {
            setSortType("winRate");
            setDisplayCount(5);
          }}
          className={`px-4 py-2 text-sm transition-colors ${
            sortType === "winRate"
              ? "text-primary1 border-b-2 border-primary1"
              : "text-primary2 hover:text-primary1"
          }`}
        >
          승률 순
        </button>
        <button
          type="button"
          onClick={() => {
            setSortType("gameCount");
            setDisplayCount(5);
          }}
          className={`px-4 py-2 text-sm transition-colors ${
            sortType === "gameCount"
              ? "text-primary1 border-b-2 border-primary1"
              : "text-primary2 hover:text-primary1"
          }`}
        >
          판수 순
        </button>
      </div>

      {/* 데이터 목록 */}
      <div className="flex flex-col gap-1 sm:gap-4">
        {displayedData.map((synergy) => (
          <button
            key={`${synergy.riotName}-${synergy.riotNameTag}`}
            type="button"
            onClick={() => handleClick(synergy.riotName, synergy.riotNameTag)}
            className="bg-darkBg1 rounded border border-border2 p-2 sm:p-3 flex items-center gap-2 sm:gap-4 hover:bg-grayHover transition-colors text-left w-full"
          >
            {/* 닉네임 */}
            <div className="flex-1 min-w-0">
              <div className="text-xs sm:text-sm text-primary1 truncate hover:text-primary2">
                {synergy.riotName}
              </div>
              <div className="text-xs text-primary2">#{synergy.riotNameTag}</div>
            </div>

            {/* 전적과 승률 */}
            <div className="text-right">
              <div className="text-xs sm:text-sm text-primary1">
                {synergy.totalCount}전 {synergy.win}승 {synergy.lose}패
              </div>
              <div className="text-xs text-primary2 mt-0.5 sm:mt-1">승률 {synergy.winRate}%</div>
            </div>
          </button>
        ))}
      </div>

      {/* 더보기 버튼 */}
      {hasMore && (
        <button
          type="button"
          onClick={handleShowMore}
          className="w-full py-2 rounded bg-darkBg1 border border-border2 text-primary2 hover:bg-grayHover transition-colors text-sm"
        >
          더보기
        </button>
      )}
    </div>
  );
};

export default TeamworkStats;
