import colors from "@/styles/colors";
import { LanePosition } from "@/data/types/h2h";
import ChampIcon from "./ChampIcon";
import LaneIcon from "./LaneIcon";

interface Props {
  en: string;
  lane?: LanePosition | null;
  size?: number;
  /** 기준 플레이어(나) 표시용 파란 링 */
  mine?: boolean;
  /** 라인 배지 테두리색 — 맞라인/교차 신호 등 */
  ringColor?: string;
}

// 챔피언 초상 + 우하단 원형 라인 배지
const ChampPortrait = ({ en, lane, size = 40, mine = false, ringColor }: Props) => (
  <div style={{ position: "relative", flexShrink: 0, width: size, height: size }}>
    <ChampIcon en={en} size={size} mine={mine} />
    {lane && (
      <div
        className="bg-darkBg2"
        style={{
          position: "absolute",
          right: -4,
          bottom: -4,
          width: size * 0.5,
          height: size * 0.5,
          borderRadius: "50%",
          border: `1px solid ${ringColor || colors.border1}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LaneIcon position={lane} size={size * 0.32} />
      </div>
    )}
  </div>
);

export default ChampPortrait;
