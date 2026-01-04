interface Props {
  className?: string;
}

const UserRankHeader = ({ className }: Props) => {
  return (
    <div className={`hidden md:flex items-center gap-3 px-3 py-2 ${className || ""}`}>
      {/* 순위 (빈 공간) */}
      <div className="flex-shrink-0 w-8 text-center" />

      {/* 라인 (빈 공간) */}
      <div className="flex-shrink-0 w-10 text-center" />

      {/* 닉네임 (빈 공간) */}
      <div className="flex-1 min-w-0" />

      {/* 전적 */}
      <div className="flex-shrink-0 w-32 text-center">
        <span className="text-sm font-medium text-primary2">전적</span>
      </div>

      {/* KDA */}
      <div className="flex-shrink-0 w-20 text-center">
        <span className="text-sm font-medium text-primary2">KDA</span>
      </div>

      {/* 승률 */}
      <div className="flex-shrink-0 w-20 text-center">
        <span className="text-sm font-medium text-primary2">승률</span>
      </div>
    </div>
  );
};

export default UserRankHeader;
