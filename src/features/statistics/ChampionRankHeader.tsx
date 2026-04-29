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
    <div className={`hidden md:flex items-center gap-3 px-3 py-2 ${className || ""}`}>
      {/* 랭크 */}
      <div className="flex-shrink-0 w-8 text-center" />

      {/* 챔피언 아이콘 (빈 공간) */}
      <div className="flex-shrink-0 w-12" />

      {/* 챔피언 이름 */}
      <div className="flex-1 min-w-0" />

      {/* 라인 */}
      <div className="flex-shrink-0 w-12 text-center" />

      {/* 승률 */}
      <div className="flex-shrink-0 w-20 text-center">
        <button
          type="button"
          onClick={() => onSort("winRate")}
          className="text-sm font-medium text-primary2 hover:text-primary1 transition-colors cursor-pointer"
        >
          승률{getSortIndicator("winRate")}
        </button>
      </div>

      {/* 게임 수 */}
      <div className="flex-shrink-0 w-20 text-center">
        <button
          type="button"
          onClick={() => onSort("totalGames")}
          className="text-sm font-medium text-primary2 hover:text-primary1 transition-colors cursor-pointer"
        >
          게임 수{getSortIndicator("totalGames")}
        </button>
      </div>
    </div>
  );
};

export default ChampionRankHeader;
