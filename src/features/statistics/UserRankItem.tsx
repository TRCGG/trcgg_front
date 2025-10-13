import Image, { StaticImageData } from "next/image";
import LaneTopLogo from "@/assets/images/laneTop.png";
import LaneJungleLogo from "@/assets/images/laneJungle.png";
import LaneMidLogo from "@/assets/images/laneMid.png";
import LaneSupportLogo from "@/assets/images/laneSupport.png";
import LaneBottomLogo from "@/assets/images/laneBottom.png";

interface Props {
  rank: number;
  position: "TOP" | "JUG" | "MID" | "ADC" | "SUP";
  nickname: string;
  totalGames: number;
  wins: number;
  losses: number;
  kda: number;
  winRate: number;
  className?: string;
}

const laneImageMap: Record<string, StaticImageData> = {
  MID: LaneMidLogo,
  TOP: LaneTopLogo,
  JUG: LaneJungleLogo,
  ADC: LaneBottomLogo,
  SUP: LaneSupportLogo,
};

const formatNumber = (num: number): string => {
  return num.toLocaleString("ko-KR");
};

const UserRankItem = ({
  rank,
  position,
  nickname,
  totalGames,
  wins,
  losses,
  kda,
  winRate,
  className,
}: Props) => {
  return (
    <div
      className={`flex items-center gap-3 bg-darkBg2 rounded border border-border2 p-3 ${className || ""}`}
    >
      {/* 순위 */}
      <div className="flex-shrink-0 w-8 text-center">
        <span className="text-lg font-bold text-primary1">{rank}</span>
      </div>

      {/* 라인 아이콘 */}
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
        <Image
          src={laneImageMap[position] || LaneMidLogo}
          alt={position}
          width={40}
          height={40}
          className="w-full h-full object-contain"
        />
      </div>

      {/* 닉네임 */}
      <div className="flex-1 min-w-0">
        <p className="text-base text-primary1 truncate">{nickname}</p>
      </div>

      {/* 전적 (n전 n승 n패) */}
      <div className="flex-shrink-0 w-32 text-center">
        <span className="text-sm text-primary2">
          {formatNumber(totalGames)}전 {formatNumber(wins)}승 {formatNumber(losses)}패
        </span>
      </div>

      {/* KDA (소숫점 2자리) */}
      <div className="flex-shrink-0 w-20 text-center">
        <span className="text-sm text-primary1">{kda.toFixed(2)}</span>
      </div>

      {/* 승률 (소숫점 3자리) */}
      <div className="flex-shrink-0 w-20 text-center">
        <span className="text-sm text-primary1">{winRate.toFixed(3)}%</span>
      </div>
    </div>
  );
};

export default UserRankItem;
