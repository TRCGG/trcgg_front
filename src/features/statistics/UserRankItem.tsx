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

  const goToSummoner = () => {
    router.push(`/summoners/${encodeURIComponent(riotName)}/${encodeURIComponent(riotNameTag)}`);
  };

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

      {/* 라인 아이콘 36×36 — 전체(라인 없음)에서도 자리를 유지해 행 높이를 일정하게 */}
      <div className="shrink-0 w-8 sm:w-9 h-9 flex items-center justify-center">
        {position && (
          <Image
            src={laneImageMap[position] || LaneMidLogo}
            alt={position}
            width={36}
            height={36}
            className="w-full h-full object-contain"
          />
        )}
      </div>

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
      <div className="shrink-0 w-12 sm:w-16 text-center">
        <div className={`text-[15px] font-bold tabular-nums ${getKdaColor(kda)}`}>{kda}</div>
      </div>

      {/* 전적 (n전 n승 n패) */}
      <div className="shrink-0 w-[92px] sm:w-40 text-center text-[11px] sm:text-[13px] text-primary2 tabular-nums whitespace-nowrap overflow-hidden">
        {formatNumber(totalGames)}전 {formatNumber(wins)}승 {formatNumber(losses)}패
      </div>

      {/* 승률 pill */}
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

export default UserRankItem;
