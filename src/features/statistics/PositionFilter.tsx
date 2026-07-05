import Image, { StaticImageData } from "next/image";
import LaneTopLogo from "@/assets/images/laneTop.png";
import LaneJungleLogo from "@/assets/images/laneJungle.png";
import LaneMidLogo from "@/assets/images/laneMid.png";
import LaneSupportLogo from "@/assets/images/laneSupport.png";
import LaneBottomLogo from "@/assets/images/laneBottom.png";
import { Position } from "@/services/statistics";

interface Props {
  selectedPosition: Position;
  onSelectPosition: (position: Position) => void;
  className?: string;
  /** 각 라인의 플레이 비중(%) — "전체"엔 표기하지 않음. 미주입 시 % 숨김 */
  share?: (position: Position) => number;
}

const positions: Array<{ label: string; value: Position; icon: StaticImageData | null }> = [
  { label: "전체", value: "ALL", icon: null },
  { label: "탑", value: "TOP", icon: LaneTopLogo },
  { label: "정글", value: "JUG", icon: LaneJungleLogo },
  { label: "미드", value: "MID", icon: LaneMidLogo },
  { label: "원딜", value: "ADC", icon: LaneBottomLogo },
  { label: "서폿", value: "SUP", icon: LaneSupportLogo },
];

const PositionFilter = ({ selectedPosition, onSelectPosition, className, share }: Props) => {
  return (
    <div className={`flex gap-2 flex-wrap ${className || ""}`}>
      {positions.map((position) => {
        const isSelected = selectedPosition === position.value;
        const pct = share && position.value !== "ALL" ? share(position.value) : null;
        return (
          <button
            key={position.value}
            type="button"
            onClick={() => onSelectPosition(position.value)}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded border transition-colors border-border2 ${
              isSelected
                ? "bg-primary1 text-blueDarken"
                : "bg-darkBg2 text-primary2 hover:bg-grayHover"
            }`}
          >
            {position.icon && (
              <Image
                src={position.icon}
                alt={position.label}
                width={20}
                height={20}
                className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
              />
            )}
            <span className="text-xs sm:text-sm font-medium">{position.label}</span>
            {pct != null && (
              <span
                className={`text-[10px] font-bold tabular-nums ${
                  isSelected ? "text-blueDarken" : "text-blueText"
                }`}
              >
                {pct}%
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default PositionFilter;
