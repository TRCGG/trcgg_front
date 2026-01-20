import Image, { StaticImageData } from "next/image";
import LaneTopLogo from "@/assets/images/laneTop.png";
import LaneJungleLogo from "@/assets/images/laneJungle.png";
import LaneMidLogo from "@/assets/images/laneMid.png";
import LaneSupportLogo from "@/assets/images/laneSupport.png";
import LaneBottomLogo from "@/assets/images/laneBottom.png";
import { LineStats } from "@/data/types/record";

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

const POSITION_ORDER: Array<"TOP" | "JUG" | "MID" | "ADC" | "SUP"> = [
  "TOP",
  "JUG",
  "MID",
  "ADC",
  "SUP",
];

const PositionStats = ({ linesData }: Props) => {
  // 포지션 순서대로 정렬
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

  return (
    <div className="flex flex-col gap-2 sm:gap-4">
      {sortedLines.map((line) => (
        <div
          key={line.position}
          className="bg-darkBg1 rounded border border-border2 p-3 flex items-center gap-4"
        >
          {/* 라인 아이콘 */}
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
            <Image
              src={laneImageMap[line.position]}
              alt={line.position}
              width={48}
              height={48}
              className="w-full h-full object-contain"
            />
          </div>

          {/* 통계 정보 */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <div className="flex-1">
              {/* 첫 번째 줄: n전 m승 b패 */}
              <div className="text-sm text-primary1">
                {line.totalCount}전 {line.win}승 {line.lose}패
              </div>
              {/* 두 번째 줄: 승률, KDA */}
              <div className="text-xs text-primary2 mt-1">승률 {line.winRate}%</div>
            </div>
          </div>
          <div className="text-sm text-primary1">KDA {line.kda}</div>
        </div>
      ))}
    </div>
  );
};

export default PositionStats;
