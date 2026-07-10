import Image, { StaticImageData } from "next/image";
import LaneTopLogo from "@/assets/images/laneTop.png";
import LaneJungleLogo from "@/assets/images/laneJungle.png";
import LaneMidLogo from "@/assets/images/laneMid.png";
import LaneSupportLogo from "@/assets/images/laneSupport.png";
import LaneBottomLogo from "@/assets/images/laneBottom.png";
import SpriteImage from "@/components/ui/SpriteImage";
import { getChampionSprite } from "@/utils/spriteLoader";
import { getKdaColor, getWinRateColor } from "@/utils/statColors";

interface Props {
  rank: number;
  championName: string;
  championNameEng: string;
  position: "TOP" | "JUG" | "MID" | "ADC" | "SUP";
  winRate: string;
  kda: string;
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

const ChampionRankItem = ({
  rank,
  championName,
  championNameEng,
  position,
  winRate,
  kda,
  gameCount,
  tier,
  isPopular,
  className,
}: Props) => {
  return (
    <div
      className={`bg-darkBg2 rounded-md border border-cardBorder px-3 sm:px-3.5 py-[11px] flex items-center gap-1.5 sm:gap-3.5 ${
        className || ""
      }`}
    >
      {/* 순위 (균일 — 1위 강조 없음) */}
      <div className="w-5 shrink-0 text-center text-[15px] font-bold text-primary2 tabular-nums">
        {rank}
      </div>

      {/* 챔피언 아이콘 + 티어 배지(👍 / 💩) */}
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
            title={tier === 1 ? "1티어" : "5티어"}
            aria-label={tier === 1 ? "1티어" : "5티어"}
            className="absolute -bottom-2 -right-2 grid place-items-center w-6 h-6 rounded-full bg-darkBg2 border border-cardBorder text-[15px] leading-none shadow-md"
          >
            {tier === 1 ? "👍" : "💩"}
          </span>
        )}
      </div>

      {/* 챔피언 이름 + 인기 배지 */}
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <p className="text-[15px] text-primary1 truncate">{championName}</p>
        {isPopular && (
          <span className="shrink-0 inline-flex items-center h-[18px] px-1.5 rounded bg-redPopular text-white text-[10px] font-bold leading-none">
            인기
          </span>
        )}
      </div>

      {/* 라인 아이콘 */}
      <div className="shrink-0 w-8 sm:w-9 h-9 flex items-center justify-center">
        <Image
          src={laneImageMap[position] || LaneMidLogo}
          alt={position}
          width={36}
          height={36}
          className="w-full h-full object-contain"
        />
      </div>

      {/* KDA */}
      <div className="shrink-0 w-12 sm:w-16 text-center">
        <div className={`text-[15px] font-bold tabular-nums ${getKdaColor(kda)}`}>{kda}</div>
      </div>

      {/* 판수 */}
      <div className="shrink-0 w-12 sm:w-16 text-center">
        <div className="text-[15px] font-bold text-primary1 tabular-nums">{gameCount}</div>
      </div>

      {/* 승률 */}
      <div className="shrink-0 w-14 sm:w-16 flex justify-center">
        <span
          className={`inline-flex items-center rounded-md px-2 py-[3px] text-sm font-bold tabular-nums ${getWinRateColor(
            winRate
          )} ${parseFloat(winRate) > 50 ? "bg-yellow/10" : "bg-primary2/10"}`}
        >
          {winRate}%
        </span>
      </div>
    </div>
  );
};

export default ChampionRankItem;
