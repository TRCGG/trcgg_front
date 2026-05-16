import SpriteImage from "@/components/ui/SpriteImage";
import { getChampionSprite } from "@/utils/spriteLoader";
import { getKdaColor, getWinRateColor } from "@/utils/statColors";
import { MostPickStats } from "@/data/types/record";

interface Props {
  rank: number;
  data: MostPickStats;
}

const UserChampionRow = ({ rank, data }: Props) => {
  const { champName, champNameEng, totalCount, win, lose, winRate, kda } = data;
  const winPct = totalCount > 0 ? (win / totalCount) * 100 : 0;

  return (
    <div className="bg-darkBg1 rounded border border-border2 p-2 sm:p-3 flex items-center gap-2 sm:gap-3">
      {/* 순위 */}
      <div className="w-6 sm:w-7 text-center text-primary2 font-bold text-sm sm:text-base shrink-0">
        {rank}
      </div>

      {/* 챔피언 아이콘 */}
      <div className="shrink-0">
        <SpriteImage
          spriteData={getChampionSprite(champNameEng)}
          alt={champName}
          width={40}
          height={40}
          fallbackSrc={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/champion/${champNameEng}.png`}
          className="w-10 h-10 sm:hidden"
        />
        <SpriteImage
          spriteData={getChampionSprite(champNameEng)}
          alt={champName}
          width={48}
          height={48}
          fallbackSrc={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/champion/${champNameEng}.png`}
          className="hidden sm:block w-12 h-12"
        />
      </div>

      {/* 챔피언 이름 */}
      <div className="w-20 sm:w-28 min-w-0 shrink-0">
        <div className="text-xs sm:text-sm text-primary1 truncate">{champName}</div>
      </div>

      {/* 게임 수 */}
      <div className="w-16 sm:w-24 text-center shrink-0">
        <div className="text-xs sm:text-sm text-primary1">{totalCount}게임</div>
        <div className="text-xs text-primary2 mt-0.5">
          {win}승 {lose}패
        </div>
      </div>

      {/* 승패 바 */}
      <div className="flex-1 min-w-0 hidden sm:block">
        <div className="relative h-2 rounded overflow-hidden bg-red">
          <div className="absolute left-0 top-0 h-full bg-blue" style={{ width: `${winPct}%` }} />
        </div>
        <div className="text-xs text-primary2 mt-1">
          <b className="text-blueText">{win}</b>
          {" / "}
          <b className="text-redText">{lose}</b>
        </div>
      </div>

      {/* KDA */}
      <div className="w-16 sm:w-20 text-center shrink-0">
        <div className={`text-xs sm:text-sm font-semibold ${getKdaColor(kda)}`}>{kda}</div>
        <div className="text-xs text-primary2 mt-0.5">KDA</div>
      </div>

      {/* 승률 */}
      <div className="w-14 sm:w-[70px] text-center shrink-0">
        <div className={`text-xs sm:text-sm font-semibold ${getWinRateColor(winRate)}`}>
          {winRate}%
        </div>
        <div className="text-xs text-primary2 mt-0.5">승률</div>
      </div>
    </div>
  );
};

export default UserChampionRow;
