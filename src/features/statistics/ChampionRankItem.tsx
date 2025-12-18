import Image, { StaticImageData } from "next/image";
import LaneTopLogo from "@/assets/images/laneTop.png";
import LaneJungleLogo from "@/assets/images/laneJungle.png";
import LaneMidLogo from "@/assets/images/laneMid.png";
import LaneSupportLogo from "@/assets/images/laneSupport.png";
import LaneBottomLogo from "@/assets/images/laneBottom.png";

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
  const getTierBgClass = (tierLevel?: number) => {
    switch (tierLevel) {
      case 1:
        return "bg-tierBlue";
      case 5:
        return "bg-tierBrown";
      default:
        return "bg-blue";
    }
  };
  return (
    <div className={`bg-darkBg2 rounded border border-border2 p-3 ${className || ""}`}>
      {/* 데스크톱 레이아웃 */}
      <div className="hidden md:flex items-center gap-3">
        {/* 랭크 */}
        <div className="flex-shrink-0 w-8 text-center">
          <span className="text-lg font-bold text-primary1">{rank}</span>
        </div>

        {/* 챔피언 아이콘 */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <Image
            src={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/champion/${championNameEng}.png`}
            alt={championName}
            width={48}
            height={48}
            className="w-12 h-12 rounded"
          />
        </div>

        {/* 챔피언 이름 + 태그 */}
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <p className="text-base text-primary1 truncate">{championName}</p>
          {tier && (
            <span
              className={`${getTierBgClass(tier)} text-white text-xs px-2 py-1 font-bold flex-shrink-0`}
            >
              {tier}
            </span>
          )}
          {isPopular && (
            <span className="bg-redPopular text-white text-xs px-2 py-1 font-bold flex-shrink-0">
              인기
            </span>
          )}
        </div>

        {/* 라인 */}
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
          <Image
            src={laneImageMap[position] || LaneMidLogo}
            alt={position}
            width={48}
            height={48}
            className="w-full h-full object-contain"
          />
        </div>

        {/* 승률 */}
        <div className="flex-shrink-0 w-20 text-center">
          <span className="text-sm text-primary1">{winRate}%</span>
        </div>

        {/* 게임 수 */}
        <div className="flex-shrink-0 w-20 text-center">
          <span className="text-sm text-primary2">{gameCount}게임</span>
        </div>
      </div>

      {/* 모바일 레이아웃 */}
      <div className="flex md:hidden items-center gap-2">
        {/* 순위 */}
        <div className="flex-shrink-0 w-6 text-center">
          <span className="text-base font-bold text-primary1">{rank}</span>
        </div>

        {/* 챔피언 아이콘 */}
        <div className="flex-shrink-0">
          <Image
            src={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/champion/${championNameEng}.png`}
            alt={championName}
            width={40}
            height={40}
            className="w-10 h-10 rounded"
          />
        </div>

        {/* 챔피언 이름 + 라인 */}
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <p className="text-sm text-primary1 truncate">{championName}</p>
          {tier && (
            <span
              className={`${getTierBgClass(tier)} text-white text-xs px-1.5 py-0.5 font-bold flex-shrink-0`}
            >
              {tier}
            </span>
          )}
          {isPopular && (
            <span className="bg-redPopular text-white text-xs px-1.5 py-0.5 font-bold flex-shrink-0">
              인기
            </span>
          )}
        </div>

        {/* 라인 아이콘 */}
        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
          <Image
            src={laneImageMap[position] || LaneMidLogo}
            alt={position}
            width={24}
            height={24}
            className="w-full h-full object-contain"
          />
        </div>

        {/* 승률 + 게임 수 */}
        <div className="flex-shrink-0 text-right">
          <div className="text-sm text-primary1">{winRate}%</div>
          <div className="text-xs text-primary2">{gameCount}게임</div>
        </div>
      </div>
    </div>
  );
};

export default ChampionRankItem;
