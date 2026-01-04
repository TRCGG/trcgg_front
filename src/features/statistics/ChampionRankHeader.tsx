interface Props {
  className?: string;
}

const ChampionRankHeader = ({ className }: Props) => {
  return (
    <div className={`hidden md:flex items-center gap-3 px-3 py-2 ${className || ""}`}>
      {/* 랭크 */}
      <div className="flex-shrink-0 w-8 text-center">
        <span className="text-sm font-medium text-primary2" />
      </div>

      {/* 챔피언 아이콘 (빈 공간) */}
      <div className="flex-shrink-0 w-12" />

      {/* 챔피언 이름 */}
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-primary2" />
      </div>

      {/* 라인 */}
      <div className="flex-shrink-0 w-10 text-center">
        <span className="text-sm font-medium text-primary2" />
      </div>

      {/* 승률 */}
      <div className="flex-shrink-0 w-20 text-center">
        <span className="text-sm font-medium text-primary2">승률</span>
      </div>

      {/* 게임 수 */}
      <div className="flex-shrink-0 w-20 text-center">
        <span className="text-sm font-medium text-primary2">게임 수</span>
      </div>
    </div>
  );
};

export default ChampionRankHeader;
