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

  const mobileSortClass = (column: SortBy) =>
    `px-2.5 py-1 rounded-md border text-[12px] transition-colors cursor-pointer ${
      sortBy === column
        ? "border-primary2 text-primary1 font-bold bg-darkBg2"
        : "border-cardBorder text-primary2 hover:text-primary1"
    }`;

  return (
    <>
      {/* 모바일 정렬 바 */}
      <div className={`flex md:hidden items-center justify-end gap-2 px-1 pb-1 ${className || ""}`}>
        <span className="text-[12px] text-primary2">정렬</span>
        <button
          type="button"
          onClick={() => onSort("totalGames")}
          className={mobileSortClass("totalGames")}
        >
          전적{getSortIndicator("totalGames")}
        </button>
        <button
          type="button"
          onClick={() => onSort("winRate")}
          className={mobileSortClass("winRate")}
        >
          승률{getSortIndicator("winRate")}
        </button>
      </div>

      <div
        className={`hidden md:flex items-center gap-3.5 pl-3.5 pr-10 py-2 text-[13px] ${className || ""}`}
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
          className={`w-40 shrink-0 text-center transition-colors cursor-pointer ${
            sortBy === "totalGames"
              ? "text-primary1 font-bold"
              : "text-primary2 hover:text-primary1"
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
    </>
  );
};

export default UserRankHeader;
