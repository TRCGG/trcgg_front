import Image, { StaticImageData } from "next/image";
import LaneTopLogo from "@/assets/images/laneTop.png";
import LaneJungleLogo from "@/assets/images/laneJungle.png";
import LaneMidLogo from "@/assets/images/laneMid.png";
import LaneSupportLogo from "@/assets/images/laneSupport.png";
import LaneBottomLogo from "@/assets/images/laneBottom.png";
import SpriteImage from "@/components/ui/SpriteImage";
import { getChampionSprite } from "@/utils/spriteLoader";
import { getWinRateColor } from "@/utils/statColors";

interface Props {
  rank: number;
  championName: string;
  championNameEng: string;
  position: "TOP" | "JUG" | "MID" | "ADC" | "SUP";
  winRate: string;
  gameCount: number;
  tier?: 1 | 5;
  isPopular?: boolean;
  className?: string;
}

const laneImageMap: Record<string, StaticImageData> = {
  MID: LaneMidLogo,
  TOP: LaneTopLogo,
  JUG: LaneJungleLogo,
  ADC: LaneBottomLogo,
  SUP: LaneSupportLogo,
};

const getTierBgClass = (tierLevel?: number) => {
  if (tierLevel === 1) return "bg-tierBlue";
  if (tierLevel === 5) return "bg-tierBrown";
  return "";
};

const ChampionRankItem = ({
  rank,
  championName,
  championNameEng,
  position,
  winRate,
  gameCount,
  tier,
  isPopular,
  className,
}: Props) => {
  return (
    <div
      className={`bg-darkBg2 rounded-md border border-cardBorder px-3 sm:px-3.5 py-[11px] flex items-center gap-2.5 sm:gap-3.5 ${
        className || ""
      }`}
    >
      {/* 순위 (균일 — 1위 강조 없음) */}
      <div className="w-5 shrink-0 text-center text-[15px] font-bold text-primary2 tabular-nums">
        {rank}
      </div>

      {/* 챔피언 아이콘 + 티어 칩 */}
      <div className="relative shrink-0 w-11 h-11">
        <SpriteImage
          spriteData={getChampionSprite(championNameEng)}
          alt={championName}
          width={44}
          height={44}
          fallbackSrc={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/champion/${championNameEng}.png`}
          className="w-11 h-11 rounded-lg"
        />
        {tier && (
          <span
            className={`absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 ${getTierBgClass(
              tier
            )} text-white text-[10px] font-bold leading-none px-1 py-0.5 rounded border border-darkBg2`}
          >
            T{tier}
          </span>
        )}
      </div>

      {/* 챔피언 이름 + 인기 배지 */}
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <p className="text-[15px] text-primary1 truncate">{championName}</p>
        {isPopular && (
          <span className="shrink-0 bg-redPopular text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            인기
          </span>
        )}
      </div>

      {/* 라인 아이콘 36×36 */}
      <div className="shrink-0 w-9 h-9 flex items-center justify-center">
        <Image
          src={laneImageMap[position] || LaneMidLogo}
          alt={position}
          width={36}
          height={36}
          className="w-full h-full object-contain"
        />
      </div>

      {/* 승률 + 게임 수 */}
      <div className="shrink-0 w-[72px] sm:w-[88px] text-center">
        <div className={`text-[15px] font-bold tabular-nums ${getWinRateColor(winRate)}`}>
          {winRate}%
        </div>
        <div className="text-[11px] text-primary2 tabular-nums">{gameCount}게임</div>
      </div>
    </div>
  );
};

export default ChampionRankItem;
