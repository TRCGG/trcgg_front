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
    <div
      className={`hidden md:flex items-center gap-3.5 px-3.5 py-2 text-[13px] ${className || ""}`}
    >
      {/* 순위 (자리) */}
      <div className="w-[18px] shrink-0" />

      {/* 라인 (자리) */}
      <div className="w-8 shrink-0" />

      {/* 닉네임 (자리) */}
      <div className="flex-1 min-w-0" />

      {/* 전적 */}
      <button
        type="button"
        onClick={() => onSort("totalGames")}
        className={`shrink-0 transition-colors cursor-pointer ${
          sortBy === "totalGames" ? "text-primary1 font-bold" : "text-primary2 hover:text-primary1"
        }`}
      >
        전적{getSortIndicator("totalGames")}
      </button>

      {/* 승률 */}
      <button
        type="button"
        onClick={() => onSort("winRate")}
        className={`shrink-0 w-[52px] text-center transition-colors cursor-pointer ${
          sortBy === "winRate" ? "text-primary1 font-bold" : "text-primary2 hover:text-primary1"
        }`}
      >
        승률{getSortIndicator("winRate")}
      </button>
    </div>
  );
};

export default UserRankHeader;
