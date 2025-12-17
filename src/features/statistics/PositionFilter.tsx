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
}

const positions: Array<{ label: string; value: Position; icon: StaticImageData | null }> = [
  { label: "전체", value: "ALL", icon: null },
  { label: "탑", value: "TOP", icon: LaneTopLogo },
  { label: "정글", value: "JUG", icon: LaneJungleLogo },
  { label: "미드", value: "MID", icon: LaneMidLogo },
  { label: "원딜", value: "ADC", icon: LaneBottomLogo },
  { label: "서폿", value: "SUP", icon: LaneSupportLogo },
];

const PositionFilter = ({ selectedPosition, onSelectPosition, className }: Props) => {
  return (
    <div className={`flex gap-2 flex-wrap ${className || ""}`}>
      {positions.map((position) => {
        const isSelected = selectedPosition === position.value;
        return (
          <button
            key={position.value}
            type="button"
            onClick={() => onSelectPosition(position.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded border transition-colors border-border2 ${
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
                className="w-5 h-5 object-contain"
              />
            )}
            <span className="text-sm font-medium">{position.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default PositionFilter;
