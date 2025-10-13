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
  tier?: 1 | 2 | 3 | 4 | 5;
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
  const getTierColor = (tierLevel?: number) => {
    switch (tierLevel) {
      case 1:
        return "bg-blue-600";
      case 2:
        return "bg-blue-500";
      case 3:
        return "bg-blue-400";
      case 4:
        return "bg-blue-300";
      case 5:
        return "bg-blue-200";
      default:
        return "bg-blue-500";
    }
  };
  return (
    <div
      className={`flex items-center gap-3 bg-darkBg2 rounded border border-border2 p-3 ${className || ""}`}
    >
      {/* 랭크 */}
      <div className="flex-shrink-0 w-8 text-center">
        <span className="text-lg font-bold text-primary1">{rank}</span>
      </div>

      {/* 챔피언 아이콘 */}
      <div className="flex-shrink-0">
        <img
          src={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/champion/${championNameEng}.png`}
          alt={championName}
          className="w-12 h-12 rounded"
        />
      </div>

      {/* 챔피언 이름 + 태그 */}
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <p className="text-base text-primary1 truncate">{championName}</p>
        {tier && (
          <span
            className={`${getTierColor(tier)} text-white text-xs px-2 py-1 font-bold flex-shrink-0`}
          >
            {tier}
          </span>
        )}
        {isPopular && (
          <span className="bg-redButton text-white text-xs px-2 py-1 font-bold flex-shrink-0">
            인기
          </span>
        )}
      </div>

      {/* 라인 */}
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
        <Image
          src={laneImageMap[position] || LaneMidLogo}
          alt={position}
          width={40}
          height={40}
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
  );
};

export default ChampionRankItem;
