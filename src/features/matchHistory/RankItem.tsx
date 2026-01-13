import SpriteImage from "@/components/ui/SpriteImage";
import { getChampionSprite } from "@/utils/spriteLoader";
import { getKdaColor, getWinRateColor } from "@/utils/statColors";

// RankItem 컴포넌트의 props 타입 정의
interface RankItemProps {
  rank: number;
  championName: string;
  championNameEng: string;
  kda: string;
  winRate: string;
  games: number;
}

const getRankBgColor = (rank: number): string => {
  if (rank === 1) return "bg-rankBg1";
  if (rank === 2 || rank === 3) return "bg-rankBg2";
  return "bg-rankBg3";
};

const RankItem: React.FC<RankItemProps> = ({
  rank,
  championName,
  championNameEng,
  kda,
  winRate,
  games,
}) => {
  return (
    <div className="flex h-[28px] sm:h-[52px] items-center justify-between md:justify-center">
      {/* 순위 */}
      <div
        className={`w-[21px] h-[28px] sm:h-[52px] ${getRankBgColor(rank)} text-primary2 text-center text-lg font-bold flex items-center justify-center`}
      >
        {rank}
      </div>

      {/* 챔피언 아이콘 */}
      <div className="flex items-center justify-center shrink-0 flex-none ml-1">
        {/* 모바일 */}
        <SpriteImage
          spriteData={getChampionSprite(championNameEng)}
          alt={championName}
          width={28}
          height={28}
          fallbackSrc={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/champion/${championNameEng}.png`}
          className="w-7 h-7 sm:hidden"
        />
        {/* 데스크탑 */}
        <SpriteImage
          spriteData={getChampionSprite(championNameEng)}
          alt={championName}
          width={52}
          height={52}
          fallbackSrc={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/champion/${championNameEng}.png`}
          className="hidden sm:block w-[52px] h-[52px]"
        />
      </div>

      {/* 챔피언 정보 */}
      <div className="ml-1 w-20 text-left whitespace-nowrap">{championName}</div>

      {/* KDA */}
      <div className={`ml-2 w-[72px] font-semibold ${getKdaColor(kda)} whitespace-nowrap`}>
        {kda} KDA
      </div>

      {/* 승률 및 게임 수 */}
      <div className="flex flex-col ml-6 text-center whitespace-nowrap text-xs sm:text-sm">
        <div className={`font-semibold ${getWinRateColor(winRate)}`}>{winRate}%</div>
        <div className="text-gray">{games} 게임</div>
      </div>
    </div>
  );
};

export default RankItem;
