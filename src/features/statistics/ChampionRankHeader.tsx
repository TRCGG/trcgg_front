type SortBy = "totalGames" | "winRate";
type SortOrder = "asc" | "desc";

interface Props {
  className?: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSort: (column: SortBy) => void;
}

const ChampionRankHeader = ({ className, sortBy, sortOrder, onSort }: Props) => {
  const getSortIndicator = (column: SortBy) => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? " ▲" : " ▼";
  };

  return (
    <div className={`hidden md:flex items-center gap-3.5 px-3.5 py-2 ${className || ""}`}>
      {/* 랭크 (자리) */}
      <div className="w-5 shrink-0" />

      {/* 챔피언 아이콘 (자리) */}
      <div className="w-11 shrink-0" />

      {/* 챔피언 */}
      <div className="flex-1 min-w-0 text-[13px] text-primary2">챔피언</div>

      {/* 라인 (자리) */}
      <div className="w-9 shrink-0" />

      {/* 승률 / 게임 수 정렬 */}
      <div className="w-[88px] shrink-0 flex items-center justify-center gap-2 text-[13px]">
        <button
          type="button"
          onClick={() => onSort("winRate")}
          className={`transition-colors cursor-pointer ${
            sortBy === "winRate" ? "text-primary1 font-bold" : "text-primary2 hover:text-primary1"
          }`}
        >
          승률{getSortIndicator("winRate")}
        </button>
        <button
          type="button"
          onClick={() => onSort("totalGames")}
          className={`transition-colors cursor-pointer ${
            sortBy === "totalGames"
              ? "text-primary1 font-bold"
              : "text-primary2 hover:text-primary1"
          }`}
        >
          게임{getSortIndicator("totalGames")}
        </button>
      </div>
    </div>
  );
};

export default ChampionRankHeader;
