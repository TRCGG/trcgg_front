import colors from "@/styles/colors";
import { LanePos, POSITION_LABELS, v2WinRateColor } from "./h2hHelpers";
import LaneIcon from "./LaneIcon";

interface Props {
  label: string;
  myLane: LanePos;
  oppoLane: LanePos;
  count: number;
  wins: number;
  separator?: string;
}

const H2HTopLanePairCard = ({ label, myLane, oppoLane, count, wins, separator = "vs" }: Props) => {
  const losses = count - wins;
  const wr = Math.round((wins / count) * 100);
  return (
    <div
      className="border border-border2 border-l-[3px] border-l-blueText"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto auto",
        alignItems: "center",
        gap: 14,
        padding: "11px 16px",
        background: `linear-gradient(90deg, rgba(107,184,255,0.12), ${colors.darkBg1} 70%)`,
        borderRadius: 4,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
        <span
          className="text-blueText"
          style={{ fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}
        >
          {label}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <LaneIcon position={myLane} size={22} />
            <span className="text-primary1" style={{ fontSize: 14, fontWeight: 600 }}>
              {POSITION_LABELS[myLane]}
            </span>
          </div>
          <span className="text-primary2" style={{ fontSize: 13, fontWeight: 700 }}>
            {separator}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <LaneIcon position={oppoLane} size={22} />
            <span className="text-primary1" style={{ fontSize: 14, fontWeight: 600 }}>
              {POSITION_LABELS[oppoLane]}
            </span>
          </div>
        </div>
      </div>
      <div
        className="text-primary2"
        style={{
          fontSize: 13,
          fontFeatureSettings: '"tnum"',
          textAlign: "right",
        }}
      >
        {count}전 <b className="text-blueText">{wins}</b>승 <b className="text-redText">{losses}</b>
        패
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: v2WinRateColor(wr),
          minWidth: 44,
          textAlign: "right",
          fontFeatureSettings: '"tnum"',
        }}
      >
        {wr}%
      </div>
    </div>
  );
};

export default H2HTopLanePairCard;
