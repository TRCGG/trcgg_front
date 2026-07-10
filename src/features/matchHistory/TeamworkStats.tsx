import { useRouter } from "next/router";
import { SynergyStats } from "@/data/types/record";
import { useState, useMemo, useRef, useEffect } from "react";
import { getWinRateColor } from "@/utils/statColors";

interface Props {
  synergyData: SynergyStats[];
}

type SortType = "winRate" | "gameCount";

const TeamworkStats = ({ synergyData }: Props) => {
  const router = useRouter();
  const [sortType, setSortType] = useState<SortType>("gameCount");
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

  // 이전 렌더의 개수를 기억해 "더보기로 새로 붙은 항목"만 순차 등장시킴
  const prevCountRef = useRef(displayedData.length);
  const prevCount = prevCountRef.current;
  useEffect(() => {
    prevCountRef.current = displayedData.length;
  }, [displayedData.length]);

  return (
    <div className="flex flex-col gap-2 w-full min-w-0">
      {/* 정렬 토글 */}
      <div className="flex items-center justify-end gap-3 px-1 text-xs">
        <button
          type="button"
          onClick={() => handleSort("gameCount")}
          className={`transition-colors ${
            sortType === "gameCount"
              ? "text-primary1 font-bold"
              : "text-primary2 hover:text-primary1"
          }`}
        >
          판수{getSortIndicator("gameCount")}
        </button>
        <button
          type="button"
          onClick={() => handleSort("winRate")}
          className={`transition-colors ${
            sortType === "winRate" ? "text-primary1 font-bold" : "text-primary2 hover:text-primary1"
          }`}
        >
          승률{getSortIndicator("winRate")}
        </button>
      </div>

      {/* 시너지 목록 */}
      <div className="flex flex-col gap-1.5 w-full min-w-0">
        {displayedData.map((synergy, i) => {
          const isNew = i >= prevCount;
          return (
            <button
              key={`${synergy.riotName}-${synergy.riotNameTag}`}
              type="button"
              onClick={() => handleClick(synergy.riotName, synergy.riotNameTag)}
              style={isNew ? { animationDelay: `${(i - prevCount) * 60}ms` } : undefined}
              className={`bg-darkBg1 rounded-lg border border-cardBorder px-3 py-2.5 flex items-center gap-3 hover:bg-grayHover transition-colors text-left w-full ${
                isNew ? "motion-safe:animate-fadeUp" : ""
              }`}
            >
              {/* 순위 */}
              <div className="w-5 shrink-0 text-center text-sm font-bold text-primary2 tabular-nums">
                {i + 1}
              </div>

              {/* 닉네임 + 전적 */}
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">
                  <span className="text-primary1">{synergy.riotName}</span>
                  <span className="text-[11px] text-primary3"> #{synergy.riotNameTag}</span>
                </div>
                <div className="text-[11px] text-primary2 mt-0.5 tabular-nums">
                  {synergy.win}승 {synergy.lose}패 · {synergy.totalCount}판
                </div>
              </div>

              {/* 함께 승률 */}
              <div className="shrink-0 text-right">
                <div
                  className={`text-sm font-bold tabular-nums ${getWinRateColor(synergy.winRate)}`}
                >
                  {synergy.winRate}%
                </div>
                <div className="text-[10px] text-primary3">함께 승률</div>
              </div>
            </button>
          );
        })}
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
