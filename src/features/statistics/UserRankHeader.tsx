type SortBy = "totalGames" | "winRate";
type SortOrder = "asc" | "desc";

interface Props {
  className?: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSort: (column: SortBy) => void;
}

const UserRankHeader = ({ className, sortBy, sortOrder, onSort }: Props) => {
  const getSortIndicator = (column: SortBy) => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? " ▲" : " ▼";
  };

  return (
    <div className={`hidden md:flex items-center gap-3 px-3 py-2 ${className || ""}`}>
      {/* 순위 (빈 공간) */}
      <div className="flex-shrink-0 w-8 text-center" />

      {/* 라인 (빈 공간) */}
      <div className="flex-shrink-0 w-10 text-center" />

      {/* 닉네임 (빈 공간) */}
      <div className="flex-1 min-w-0" />

      {/* KDA */}
      <div className="flex-shrink-0 w-20 text-center">
        <span className="text-sm font-medium text-primary2">KDA</span>
      </div>

      {/* 전적 */}
      <div className="flex-shrink-0 w-32 text-center">
        <button
          type="button"
          onClick={() => onSort("totalGames")}
          className="text-sm font-medium text-primary2 hover:text-primary1 transition-colors cursor-pointer"
        >
          전적{getSortIndicator("totalGames")}
        </button>
      </div>

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
    </div>
  );
};

export default UserRankHeader;
