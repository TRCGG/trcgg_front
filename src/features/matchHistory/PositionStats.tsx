import Image, { StaticImageData } from "next/image";
import LaneTopLogo from "@/assets/images/laneTop.png";
import LaneJungleLogo from "@/assets/images/laneJungle.png";
import LaneMidLogo from "@/assets/images/laneMid.png";
import LaneSupportLogo from "@/assets/images/laneSupport.png";
import LaneBottomLogo from "@/assets/images/laneBottom.png";
import { LineStats } from "@/data/types/record";
import { getKdaColor, getWinRateColor } from "@/utils/statColors";

interface Props {
  linesData: LineStats[];
}

const laneImageMap: Record<string, StaticImageData> = {
  MID: LaneMidLogo,
  TOP: LaneTopLogo,
  JUG: LaneJungleLogo,
  ADC: LaneBottomLogo,
  SUP: LaneSupportLogo,
};

const laneLabelMap: Record<string, string> = {
  TOP: "탑",
  JUG: "정글",
  MID: "미드",
  ADC: "원딜",
  SUP: "서폿",
};

const POSITION_ORDER: Array<"TOP" | "JUG" | "MID" | "ADC" | "SUP"> = [
  "TOP",
  "JUG",
  "MID",
  "ADC",
  "SUP",
];

const PositionStats = ({ linesData }: Props) => {
  // 포지션 순서대로 정렬(재정렬 없음)
  const sortedLines = POSITION_ORDER.map(
    (position) =>
      linesData.find((line) => line.position === position) || {
        position,
        totalCount: 0,
        win: 0,
        lose: 0,
        winRate: "0.00",
        kda: "0.00",
      }
  );

  // 주 포지션(최다 판수) — 판수가 있을 때만 강조
  const maxGames = Math.max(...sortedLines.map((line) => line.totalCount));
  const primaryPosition =
    maxGames > 0 ? sortedLines.find((line) => line.totalCount === maxGames)?.position : undefined;

  return (
    <div className="flex flex-col gap-1">
      {sortedLines.map((line) => {
        const isPrimary = line.position === primaryPosition;
        return (
          <div
            key={line.position}
            className={`flex items-center gap-3 rounded-lg p-2.5 ${
              isPrimary
                ? "bg-primaryLaneBg border border-primaryLaneBorder"
                : "border border-transparent"
            }`}
          >
            {/* 라인 아이콘 32×32 */}
            <div className="shrink-0 w-8 h-8">
              <Image
                src={laneImageMap[line.position]}
                alt={line.position}
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>

            {/* 라인 라벨 + 전적 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={`text-sm ${isPrimary ? "font-bold text-white" : "text-primary1"}`}>
                  {laneLabelMap[line.position]}
                </span>
                {isPrimary && (
                  <span
                    className="text-[11px] font-bold text-teamWin rounded px-1.5 py-0.5"
                    style={{ backgroundColor: "rgba(88,166,255,0.14)" }}
                  >
                    주 포지션
                  </span>
                )}
              </div>
              <div className="text-[11px] text-primary2 mt-0.5 tabular-nums">
                {line.totalCount}전 {line.win}승 {line.lose}패
              </div>
            </div>

            {/* KDA + 승률 */}
            <div className="flex items-center gap-3 shrink-0">
              <span className={`text-xs tabular-nums ${getKdaColor(line.kda)}`}>
                {line.kda} KDA
              </span>
              <span className={`text-sm font-bold tabular-nums ${getWinRateColor(line.winRate)}`}>
                {line.winRate}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PositionStats;
