import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/router";
import LaneTopLogo from "@/assets/images/laneTop.png";
import LaneJungleLogo from "@/assets/images/laneJungle.png";
import LaneMidLogo from "@/assets/images/laneMid.png";
import LaneSupportLogo from "@/assets/images/laneSupport.png";
import LaneBottomLogo from "@/assets/images/laneBottom.png";

interface Props {
  rank: number;
  position: "TOP" | "JUG" | "MID" | "ADC" | "SUP";
  riotName: string;
  riotNameTag: string;
  totalGames: number;
  wins: number;
  losses: number;
  kda: string;
  winRate: string;
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
  riotName,
  riotNameTag,
  totalGames,
  wins,
  losses,
  kda,
  winRate,
  className,
}: Props) => {
  const router = useRouter();

  return (
    <div className={`bg-darkBg2 rounded border border-border2 p-3 ${className || ""}`}>
      {/* 데스크톱 레이아웃 */}
      <div className="hidden md:flex items-center gap-3">
        {/* 순위 */}
        <div className="flex-shrink-0 w-8 text-center">
          <span className="text-lg font-bold text-primary1">{rank}</span>
        </div>

        {/* 라인 아이콘 */}
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
          <Image
            src={laneImageMap[position] || LaneMidLogo}
            alt={position}
            width={48}
            height={48}
            className="w-full h-full object-contain"
          />
        </div>

        {/* 닉네임 */}
        <div className="flex-1 min-w-0 relative group">
          <button
            type="button"
            className="text-base text-primary1 truncate w-full text-left hover:text-primary2 transition-colors"
            onClick={() => {
              router.push(
                `/summoners/${encodeURIComponent(riotName)}/${encodeURIComponent(riotNameTag)}`
              );
            }}
          >
            {riotName}
          </button>
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block px-3 py-1 rounded bg-black text-white z-10 whitespace-nowrap">
            <span>{riotName}</span>
            <span className="text-primary2"> #{riotNameTag}</span>
            <div className="absolute top-full left-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-black" />
          </div>
        </div>

        {/* KDA */}
        <div className="flex-shrink-0 w-20 text-center">
          <span className="text-sm text-primary2">{kda}</span>
        </div>

        {/* 전적 (n전 n승 n패) */}
        <div className="flex-shrink-0 w-32 text-center">
          <span className="text-sm text-primary1">
            {formatNumber(totalGames)}전 {formatNumber(wins)}승 {formatNumber(losses)}패
          </span>
        </div>

        {/* 승률 */}
        <div className="flex-shrink-0 w-20 text-center">
          <span className="text-sm text-primary1">{winRate}%</span>
        </div>
      </div>

      {/* 모바일 레이아웃 */}
      <div className="flex md:hidden items-center gap-2">
        {/* 순위 */}
        <div className="flex-shrink-0 w-6 text-center">
          <span className="text-base font-bold text-primary1">{rank}</span>
        </div>

        {/* 라인 아이콘 */}
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
          <Image
            src={laneImageMap[position] || LaneMidLogo}
            alt={position}
            width={32}
            height={32}
            className="w-full h-full object-contain"
          />
        </div>

        {/* 닉네임 + KDA */}
        <div className="flex-1 min-w-0">
          <button
            type="button"
            className="text-sm text-primary1 truncate w-full text-left hover:text-primary2 transition-colors"
            onClick={() => {
              router.push(
                `/summoners/${encodeURIComponent(riotName)}/${encodeURIComponent(riotNameTag)}`
              );
            }}
          >
            {riotName}
          </button>
          <div className="text-xs text-primary2">{kda}</div>
        </div>

        {/* 전적 + 승률 */}
        <div className="flex-shrink-0 text-right">
          <div className="text-sm text-primary1">
            {formatNumber(totalGames)}전 {formatNumber(wins)}승 {formatNumber(losses)}패
          </div>
          <div className="text-xs text-primary2">{winRate}%</div>
        </div>
      </div>
    </div>
  );
};

export default UserRankItem;
