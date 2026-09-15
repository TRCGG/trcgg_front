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
      className="border border-border2 border-l-[3px] border-l-blueText grid grid-cols-[1fr_auto_auto] items-center gap-3.5 py-[11px] px-4 rounded"
      style={{
        background: `linear-gradient(90deg, rgba(107,184,255,0.12), ${colors.darkBg1} 70%)`,
      }}
    >
      <div className="flex items-center gap-2 min-w-0 flex-wrap">
        <span className="text-blueText text-[11px] font-bold whitespace-nowrap">{label}</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-[5px]">
            <LaneIcon position={myLane} size={22} />
            <span className="text-primary1 text-sm font-bold">{POSITION_LABELS[myLane]}</span>
          </div>
          <span className="text-primary2 text-[13px] font-bold">{separator}</span>
          <div className="flex items-center gap-[5px]">
            <LaneIcon position={oppoLane} size={22} />
            <span className="text-primary1 text-sm font-bold">{POSITION_LABELS[oppoLane]}</span>
          </div>
        </div>
      </div>
      <div className="text-primary2 text-[13px] tabular-nums text-right">
        {count}전 <b className="text-blueText">{wins}</b>승 <b className="text-redText">{losses}</b>
        패
      </div>
      <div
        className="text-lg font-bold min-w-[44px] text-right tabular-nums"
        style={{ color: v2WinRateColor(wr) }}
      >
        {wr}%
      </div>
    </div>
  );
};

export default H2HTopLanePairCard;
