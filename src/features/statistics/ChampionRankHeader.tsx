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

  const mobileSortClass = (column: SortBy, width: string) =>
    `${width} shrink-0 text-center text-[13px] transition-colors cursor-pointer ${
      sortBy === column ? "text-primary1 font-bold" : "text-primary2 hover:text-primary1"
    }`;

  return (
    <>
      {/* 모바일 정렬 (열제목 스타일 — 각 열 중앙 정렬) */}
      <div
        className={`flex md:hidden items-center gap-2.5 sm:gap-3.5 px-3 sm:px-3.5 pb-1.5 ${
          className || ""
        }`}
      >
        {/* 랭크 + 아이콘 + 챔피언 (자리) */}
        <div className="flex-1 min-w-0" />
        {/* 라인 (자리) */}
        <div className="w-9 shrink-0" />
        <button
          type="button"
          onClick={() => onSort("totalGames")}
          className={mobileSortClass("totalGames", "w-14 sm:w-16")}
        >
          판수{getSortIndicator("totalGames")}
        </button>
        <button
          type="button"
          onClick={() => onSort("winRate")}
          className={mobileSortClass("winRate", "w-12 sm:w-14")}
        >
          승률{getSortIndicator("winRate")}
        </button>
      </div>

      <div className={`hidden md:flex items-center gap-3.5 px-3.5 py-2 ${className || ""}`}>
        {/* 랭크 (자리) */}
        <div className="w-5 shrink-0" />

        {/* 챔피언 아이콘 (자리) */}
        <div className="w-11 shrink-0" />

        {/* 챔피언 */}
        <div className="flex-1 min-w-0 text-[13px] text-primary2">챔피언</div>

        {/* 라인 (자리) */}
        <div className="w-9 shrink-0" />

        {/* 판수 정렬 */}
        <button
          type="button"
          onClick={() => onSort("totalGames")}
          className={`w-14 sm:w-16 shrink-0 text-center text-[13px] transition-colors cursor-pointer ${
            sortBy === "totalGames"
              ? "text-primary1 font-bold"
              : "text-primary2 hover:text-primary1"
          }`}
        >
          판수{getSortIndicator("totalGames")}
        </button>

        {/* 승률 정렬 */}
        <button
          type="button"
          onClick={() => onSort("winRate")}
          className={`w-12 sm:w-14 shrink-0 text-center text-[13px] transition-colors cursor-pointer ${
            sortBy === "winRate" ? "text-primary1 font-bold" : "text-primary2 hover:text-primary1"
          }`}
        >
          승률{getSortIndicator("winRate")}
        </button>
      </div>
    </>
  );
};

export default ChampionRankHeader;
