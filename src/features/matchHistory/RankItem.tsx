import Image from "next/image";

// RankItem 컴포넌트의 props 타입 정의
interface RankItemProps {
  rank: number;
  championName: string;
  kda: string;
  winRate: string;
  games: number;
  championImg: string;
}

const getWinRateColor = (rank: number): string => {
  return rank <= 3 ? "text-yellow" : "text-gray";
};

const getKDAColor = (rank: number): string => {
  if (rank === 1) return "text-yellow";
  if (rank === 2) return "text-blueText";
  if (rank === 3) return "text-neonGreen";
  return "text-gray";
};
const getRankBgColor = (rank: number): string => {
  if (rank === 1) return "bg-rankBg1";
  if (rank === 2 || rank === 3) return "bg-rankBg2";
  return "bg-rankBg3";
};

const RankItem: React.FC<RankItemProps> = ({
  rank,
  championName,
  kda,
  winRate,
  games,
  championImg,
}) => {
  return (
    <div className="flex h-fit items-center justify-between px-2 md:justify-center">
      {/* 순위 */}
      <div
        className={`w-6 min-w-6 h-8 sm:w-8 sm:h-12 ${getRankBgColor(rank)} text-primary2 text-center text-lg font-bold flex items-center justify-center`}
      >
        {rank}
      </div>

      {/* 챔피언 아이콘 */}
      <div className="flex items-center justify-center ml-2 w-8 min-w-8 h-8 min-h-8 sm:w-12 sm:h-12">
        <Image width={48} height={48} alt={championName} src={championImg} />
      </div>

      {/* 챔피언 정보 */}
      <div className="ml-1 w-28 text-center whitespace-nowrap">{championName}</div>

      {/* KDA */}
      <div className={`ml-2 w-18 ${getKDAColor(rank)} whitespace-nowrap`}>{kda} KDA</div>

      {/* 승률 및 게임 수 */}
      <div className="flex flex-col ml-6 text-center whitespace-nowrap text-xs sm:text-sm">
        <div className={getWinRateColor(rank)}>{winRate}%</div>
        <div className="text-gray">{games} 게임</div>
      </div>
    </div>
  );
};

export default RankItem;
