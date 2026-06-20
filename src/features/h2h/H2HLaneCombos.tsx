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
      <div style={{ padding: "12px 16px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {combos.map((c, i) => {
          const pct = (c.count / maxCount) * 100;
          const wr = Math.round((c.wins / c.count) * 100);
          return (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 110 }}>
                <LaneIcon position={c.mine} size={18} />
                <span className="text-primary1" style={{ fontSize: 11 }}>
                  {POSITION_LABELS[c.mine]}
                </span>
                <span className="text-primary2" style={{ fontSize: 10, margin: "0 2px" }}>
                  +
                </span>
                <LaneIcon position={c.oppo} size={18} />
                <span className="text-primary1" style={{ fontSize: 11 }}>
                  {POSITION_LABELS[c.oppo]}
                </span>
              </div>
              <div
                className="bg-rankBg3"
                style={{
                  position: "relative",
                  height: 18,
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <div
                  className="bg-blueText"
                  style={{
                    height: "100%",
                    width: `${pct}%`,
                    opacity: 0.5,
                  }}
                />
                <div
                  className="text-white"
                  style={{
                    position: "absolute",
                    left: 8,
                    top: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    fontSize: 10,
                  }}
                >
                  {c.count}판 · {c.wins}승 {c.count - c.wins}패
                </div>
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: v2WinRateColor(wr),
                  minWidth: 40,
                  textAlign: "right",
                  fontFeatureSettings: '"tnum"',
                }}
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
