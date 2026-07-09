type SortBy = "totalGames" | "winRate" | "kda";
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

  const sortClass = (column: SortBy, width: string) =>
    `${width} shrink-0 text-center text-[13px] transition-colors cursor-pointer ${
      sortBy === column ? "text-primary1 font-bold" : "text-primary2 hover:text-primary1"
    }`;

  return (
    <>
      {/* 모바일 정렬 (열제목 스타일 — 각 열 중앙 정렬) */}
      <div
        className={`flex md:hidden items-center gap-1.5 sm:gap-3.5 pl-3 pr-4 sm:pl-3.5 sm:pr-10 pb-1.5 ${
          className || ""
        }`}
      >
        {/* 순위 + 라인 + 닉네임 (자리) */}
        <div className="flex-1 min-w-0" />
        <button type="button" onClick={() => onSort("kda")} className={sortClass("kda", "w-12")}>
          KDA{getSortIndicator("kda")}
        </button>
        <button
          type="button"
          onClick={() => onSort("totalGames")}
          className={sortClass("totalGames", "w-24")}
        >
          전적{getSortIndicator("totalGames")}
        </button>
        <button
          type="button"
          onClick={() => onSort("winRate")}
          className={sortClass("winRate", "w-12")}
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

        {/* KDA */}
        <button type="button" onClick={() => onSort("kda")} className={sortClass("kda", "w-16")}>
          KDA{getSortIndicator("kda")}
        </button>

        {/* 전적 */}
        <button
          type="button"
          onClick={() => onSort("totalGames")}
          className={sortClass("totalGames", "w-40")}
        >
          전적{getSortIndicator("totalGames")}
        </button>

        {/* 승률 */}
        <button
          type="button"
          onClick={() => onSort("winRate")}
          className={sortClass("winRate", "w-[52px]")}
        >
          승률{getSortIndicator("winRate")}
        </button>
      </div>
    </>
  );
};

export default UserRankHeader;
