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
  /**
   * 선택할 수 없는 라인 판별 — 기록이 없어 눌러도 볼 것이 없는 경우.
   * "전체"와 현재 선택된 라인은 이 값과 무관하게 항상 활성이다.
   * 선택된 라인까지 비활성이 되면 고장난 것처럼 보이기 때문.
   */
  isDisabled?: (position: Position) => boolean;
}

const positions: Array<{ label: string; value: Position; icon: StaticImageData | null }> = [
  { label: "전체", value: "ALL", icon: null },
  { label: "탑", value: "TOP", icon: LaneTopLogo },
  { label: "정글", value: "JUG", icon: LaneJungleLogo },
  { label: "미드", value: "MID", icon: LaneMidLogo },
  { label: "원딜", value: "ADC", icon: LaneBottomLogo },
  { label: "서폿", value: "SUP", icon: LaneSupportLogo },
];

const PositionFilter = ({
  selectedPosition,
  onSelectPosition,
  className,
  share,
  isDisabled,
}: Props) => {
  return (
    <div className={`flex gap-2 flex-wrap ${className || ""}`}>
      {positions.map((position) => {
        const isSelected = selectedPosition === position.value;
        const pct = share && position.value !== "ALL" ? share(position.value) : null;
        const disabled =
          !isSelected && position.value !== "ALL" && isDisabled?.(position.value) === true;
        const stateClass = isSelected
          ? "bg-blue border-blueButton text-blueText font-bold"
          : "bg-darkBg2 border-border2 text-primary2 font-normal";
        const hoverClass = isSelected ? "" : "hover:bg-grayHover";
        const interactionClass = disabled ? "opacity-40 cursor-not-allowed" : hoverClass;
        return (
          <button
            key={position.value}
            type="button"
            disabled={disabled}
            title={disabled ? `${position.label} 기록이 없습니다` : undefined}
            onClick={() => onSelectPosition(position.value)}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded border transition-colors ${stateClass} ${interactionClass}`}
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
            <span className="text-xs sm:text-sm">{position.label}</span>
            {pct != null && (
              <span
                className={`text-[10px] font-bold tabular-nums ${
                  isSelected ? "text-blueText" : "text-primary2"
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
