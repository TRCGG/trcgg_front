import { H2HLaneCombo } from "@/data/types/h2h";
import { POSITION_LABELS, v2WinRateColor } from "./h2hHelpers";
import LaneIcon from "./LaneIcon";
import SectionCard from "./SectionCard";

interface Props {
  combos: H2HLaneCombo[];
}

const H2HLaneCombos = ({ combos }: Props) => {
  const maxCount = Math.max(...combos.map((c) => c.count), 1);
  return (
    <SectionCard title="라인 조합" subtitle="함께한 게임에서의 라인 분포">
      <div className="pt-3 px-4 pb-4 flex flex-col gap-2.5">
        {combos.map((c, i) => {
          const pct = (c.count / maxCount) * 100;
          const wr = Math.round((c.wins / c.count) * 100);
          return (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              className="grid grid-cols-[auto_1fr_auto] gap-3 items-center"
            >
              <div className="flex items-center gap-1.5 min-w-[110px]">
                <LaneIcon position={c.mine} size={18} />
                <span className="text-primary1 text-[11px]">{POSITION_LABELS[c.mine]}</span>
                <span className="text-primary2 text-[10px] my-0 mx-0.5">+</span>
                <LaneIcon position={c.oppo} size={18} />
                <span className="text-primary1 text-[11px]">{POSITION_LABELS[c.oppo]}</span>
              </div>
              <div className="bg-rankBg3 relative h-[18px] rounded-sm overflow-hidden">
                <div className="bg-blueText h-full opacity-[0.5]" style={{ width: `${pct}%` }} />
                <div className="text-white absolute left-2 top-0 bottom-0 flex items-center text-[10px]">
                  {c.count}판 · {c.wins}승 {c.count - c.wins}패
                </div>
              </div>
              <div
                className="text-[13px] font-bold min-w-[40px] text-right tabular-nums"
                style={{ color: v2WinRateColor(wr) }}
              >
                {wr}%
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
};

export default H2HLaneCombos;
