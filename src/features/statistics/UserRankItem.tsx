import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/router";
import LaneTopLogo from "@/assets/images/laneTop.png";
import LaneJungleLogo from "@/assets/images/laneJungle.png";
import LaneMidLogo from "@/assets/images/laneMid.png";
import LaneSupportLogo from "@/assets/images/laneSupport.png";
import LaneBottomLogo from "@/assets/images/laneBottom.png";
import { getKdaColor, getWinRateColor } from "@/utils/statColors";

interface Props {
  rank: number;
  position?: "TOP" | "JUG" | "MID" | "ADC" | "SUP";
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

  const winRateValue = parseFloat(winRate.replace("%", ""));
  const pillBg = winRateValue > 50 ? "rgba(255,195,100,0.14)" : "rgba(154,160,168,0.12)";

  const goToSummoner = () => {
    router.push(`/summoners/${encodeURIComponent(riotName)}/${encodeURIComponent(riotNameTag)}`);
  };

  return (
    <div
      className={`bg-darkBg2 rounded-md border border-cardBorder pl-3 pr-4 sm:pl-3.5 sm:pr-10 py-[11px] flex items-center gap-1.5 sm:gap-3.5 ${
        className || ""
      }`}
    >
      {/* 순위 (균일 — 1위 강조 없음) */}
      <div className="w-[18px] shrink-0 text-center text-[15px] font-bold text-primary2 tabular-nums">
        {rank}
      </div>

      {/* 라인 아이콘 32×32 */}
      {position && (
        <div className="shrink-0 w-8 h-8 flex items-center justify-center">
          <Image
            src={laneImageMap[position] || LaneMidLogo}
            alt={position}
            width={32}
            height={32}
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* 닉네임 */}
      <div className="flex-1 min-w-0 relative group">
        <button
          type="button"
          className="block text-[15px] text-primary1 truncate w-full text-left hover:text-primary2 transition-colors"
          onClick={goToSummoner}
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
      <div className="w-12 md:w-16 shrink-0 text-center">
        <span className={`text-[13px] md:text-sm font-bold tabular-nums ${getKdaColor(kda)}`}>
          {kda}
        </span>
      </div>

      {/* 전적 (n전 n승 n패) */}
      <div className="w-24 md:w-40 shrink-0 text-center text-[13px] text-primary2 tabular-nums whitespace-nowrap">
        {formatNumber(totalGames)}전 {formatNumber(wins)}승 {formatNumber(losses)}패
      </div>

      {/* 승률 pill */}
      <div className="w-12 md:w-[52px] shrink-0 flex justify-center">
        <span
          className={`inline-block rounded-md text-sm font-bold tabular-nums ${getWinRateColor(
            winRate
          )}`}
          style={{ padding: "3px 10px", backgroundColor: pillBg }}
        >
          {winRate}%
        </span>
      </div>
    </div>
  );
};

export default UserRankItem;
