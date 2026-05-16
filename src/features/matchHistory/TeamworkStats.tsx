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
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [displayCount, setDisplayCount] = useState(5);

  const handleClick = (riotName: string, riotTag: string) => {
    router.push(`/summoners/${encodeURIComponent(riotName)}/${encodeURIComponent(riotTag)}`);
  };

  const handleSort = (type: SortType) => {
    if (type === sortType) {
      setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortType(type);
      setSortOrder("desc");
      setDisplayCount(5);
    }
  };

  const getSortIndicator = (type: SortType) => {
    if (sortType !== type) return "";
    return sortOrder === "desc" ? " ▼" : " ▲";
  };

  const sortedData = useMemo(() => {
    const sorted = [...synergyData];
    const multiplier = sortOrder === "asc" ? -1 : 1;
    if (sortType === "winRate") {
      sorted.sort((a, b) => multiplier * (parseFloat(b.winRate) - parseFloat(a.winRate)));
    } else {
      sorted.sort((a, b) => multiplier * (b.totalCount - a.totalCount));
    }
    return sorted;
  }, [synergyData, sortType, sortOrder]);

  const displayedData = sortedData.slice(0, displayCount);
  const hasMore = sortedData.length > displayCount && displayCount < 10;

  return (
    <div className="flex flex-col gap-2">
      {/* 열 제목 헤더 */}
      <div className="flex items-center gap-2 sm:gap-4 px-2 sm:px-3 py-1 text-xs font-medium text-primary2">
        <div className="flex-1 min-w-0" />
        <button
          type="button"
          onClick={() => handleSort("gameCount")}
          className={`w-24 sm:w-28 text-center shrink-0 transition-colors ${
            sortType === "gameCount" ? "text-primary1" : "hover:text-primary1"
          }`}
        >
          판수{getSortIndicator("gameCount")}
        </button>
        <button
          type="button"
          onClick={() => handleSort("winRate")}
          className={`w-14 sm:w-20 text-center shrink-0 transition-colors ${
            sortType === "winRate" ? "text-primary1" : "hover:text-primary1"
          }`}
        >
          승률{getSortIndicator("winRate")}
        </button>
      </div>

      {/* 데이터 목록 */}
      <div className="flex flex-col gap-1 sm:gap-2">
        {displayedData.map((synergy) => (
          <button
            key={`${synergy.riotName}-${synergy.riotNameTag}`}
            type="button"
            onClick={() => handleClick(synergy.riotName, synergy.riotNameTag)}
            className="bg-darkBg1 rounded border border-border2 p-2 sm:p-3 flex items-center gap-2 sm:gap-4 hover:bg-grayHover transition-colors text-left w-full"
          >
            {/* 닉네임 */}
            <div className="flex-1 min-w-0">
              <div className="text-xs sm:text-sm text-primary1 truncate">{synergy.riotName}</div>
              <div className="text-xs text-primary2">#{synergy.riotNameTag}</div>
            </div>

            {/* 판수 */}
            <div className="w-24 sm:w-28 text-center shrink-0">
              <div className="text-xs sm:text-sm text-primary1">{synergy.totalCount}전</div>
              <div className="text-xs text-primary2 mt-0.5">
                {synergy.win}승 {synergy.lose}패
              </div>
            </div>

            {/* 승률 */}
            <div className="w-14 sm:w-20 text-center shrink-0">
              <div className="text-xs sm:text-sm text-primary1">{synergy.winRate}%</div>
            </div>
          </button>
        ))}
      </div>

      {/* 더보기 버튼 */}
      {hasMore && (
        <button
          type="button"
          onClick={() => setDisplayCount(10)}
          className="w-full py-2 rounded bg-darkBg1 border border-border2 text-primary2 hover:bg-grayHover transition-colors text-sm"
        >
          더보기
        </button>
      )}
    </div>
  );
};

export default TeamworkStats;
