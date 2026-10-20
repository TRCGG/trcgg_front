import Image, { StaticImageData } from "next/image";
import LaneTopLogo from "@/assets/images/laneTop.png";
import LaneJungleLogo from "@/assets/images/laneJungle.png";
import LaneMidLogo from "@/assets/images/laneMid.png";
import LaneSupportLogo from "@/assets/images/laneSupport.png";
import LaneBottomLogo from "@/assets/images/laneBottom.png";
import { Position } from "@/services/statistics";

export const LANE_ICONS: Record<Exclude<Position, "ALL">, StaticImageData> = {
  TOP: LaneTopLogo,
  JUG: LaneJungleLogo,
  MID: LaneMidLogo,
  ADC: LaneBottomLogo,
  SUP: LaneSupportLogo,
};

const POSITIONS: { value: Position; label: string }[] = [
  { value: "ALL", label: "전체" },
  { value: "TOP", label: "탑" },
  { value: "JUG", label: "정글" },
  { value: "MID", label: "미드" },
  { value: "ADC", label: "원딜" },
  { value: "SUP", label: "서폿" },
];

interface Props {
  selected: Position;
  onSelect: (position: Position) => void;
}

const LeaderboardPositionFilter = ({ selected, onSelect }: Props) => (
  <div className="flex gap-1">
    {POSITIONS.map(({ value, label }) => {
      const isSelected = selected === value;
      return (
        <button
          key={value}
          type="button"
          title={label}
          aria-pressed={isSelected}
          onClick={() => onSelect(value)}
          className={`flex items-center justify-center min-w-[32px] h-[30px] px-[7px] rounded border text-xs transition-colors ${
            isSelected
              ? "bg-primaryLaneBg border-blueText2 text-primary1"
              : "bg-darkBg1 border-border2 text-primary2 hover:text-primary1"
          }`}
        >
          {value === "ALL" ? (
            label
          ) : (
            <span className={`flex ${isSelected ? "" : "opacity-55"}`}>
              <Image src={LANE_ICONS[value]} alt={label} width={16} height={16} />
            </span>
          )}
        </button>
      );
    })}
  </div>
);

export default LeaderboardPositionFilter;
