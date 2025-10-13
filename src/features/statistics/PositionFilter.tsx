import Image from "next/image";
import LaneTopLogo from "@/assets/images/laneTop.png";
import LaneJungleLogo from "@/assets/images/laneJungle.png";
import LaneMidLogo from "@/assets/images/laneMid.png";
import LaneSupportLogo from "@/assets/images/laneSupport.png";
import LaneBottomLogo from "@/assets/images/laneBottom.png";

interface Props {
  selectedPosition: string;
  onSelectPosition: (position: string) => void;
  className?: string;
}

const positions = [
  { label: "전체", value: "전체", icon: null },
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
            className={`flex items-center gap-2 px-4 py-2 rounded border transition-colors ${
              isSelected
                ? "bg-primary1 border-blueButton text-blueDarken"
                : "bg-darkBg2 border-border2 text-primary2 hover:border-primary2"
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
