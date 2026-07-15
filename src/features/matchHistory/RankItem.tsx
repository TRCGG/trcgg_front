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

const RankItem: React.FC<RankItemProps> = ({
  rank,
  championName,
  championNameEng,
  kda,
  winRate,
  games,
}) => {
  return (
    <div className="flex items-center gap-2 px-1.5 py-[9px]">
      {/* 순위 */}
      <div className="w-3.5 shrink-0 text-center text-[13px] font-bold text-primary2 tabular-nums">
        {rank}
      </div>

      {/* 챔피언 아이콘 40×40, radius 8, border */}
      <SpriteImage
        spriteData={getChampionSprite(championNameEng)}
        alt={championName}
        width={40}
        height={40}
        fallbackSrc={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/champion/${championNameEng}.png`}
        className="w-10 h-10 shrink-0 rounded-lg border border-border1"
      />

      {/* 이름 + 판수 */}
      <div className="flex-1 min-w-0">
        <div className="text-sm text-primary1 truncate">{championName}</div>
        <div className="text-[11px] text-primary2 tabular-nums">{games}판</div>
      </div>

      {/* KDA */}
      <div className={`shrink-0 text-xs tabular-nums ${getKdaColor(kda)}`}>{kda} KDA</div>

      {/* 승률 */}
      <div
        className={`min-w-[44px] shrink-0 text-right text-sm font-bold tabular-nums ${getWinRateColor(winRate)}`}
      >
        {winRate}%
      </div>
    </div>
  );
};

export default RankItem;
