import { H2HResult, H2HSeasonBreak } from "@/data/types/h2h";
import colors from "@/styles/colors";
import { diffColor } from "./h2hHelpers";
import SectionCard from "./SectionCard";

const advantageLabel = (cur: number): string => {
  if (cur > 0) return `+${cur} 내 우위`;
  if (cur < 0) return `${cur} 상대 우위`;
  return "동률";
};

interface Props {
  streak: H2HResult[];
  seasonBreaks?: H2HSeasonBreak[];
}

const H2HRivalryTimeline = ({ streak, seasonBreaks = [] }: Props) => {
  const pts = [0];
  streak.forEach((s) => pts.push(pts[pts.length - 1] + (s === "W" ? 1 : -1)));

  const w = 1040;
  const h = 170;
  const padL = 24;
  const padR = 76;
  const padT = 18;
  const padB = 26;
  const maxAbs = Math.max(2, ...pts.map((v) => Math.abs(v)));
  const x = (i: number) => padL + (i / (pts.length - 1 || 1)) * (w - padL - padR);
  const y = (v: number) => padT + (1 - (v + maxAbs) / (2 * maxAbs)) * (h - padT - padB);
  const linePath = pts
    .map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`)
    .join(" ");
  const cur = pts[pts.length - 1];
  const curColor = diffColor(cur, colors.blueText, colors.redText, colors.primary2);

  return (
    <SectionCard
      title="라이벌 히스토리"
      subtitle="맞대결 누적 우위 (내 승 − 내 패) · 좌→우 시간순"
      rightSlot={
        <span
          className="bg-rankBg2 border border-border2"
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: curColor,
            padding: "2px 10px",
            borderRadius: 999,
            fontFeatureSettings: '"tnum"',
            whiteSpace: "nowrap",
          }}
        >
          현재 {advantageLabel(cur)}
        </span>
      }
    >
      <div style={{ padding: "8px 16px 14px" }}>
        <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "auto", display: "block" }}>
          {/* zero baseline */}
          <line
            className="stroke-border1"
            x1={padL}
            y1={y(0)}
            x2={w - padR}
            y2={y(0)}
            strokeDasharray="4 4"
          />
          {/* zone labels */}
          <text className="fill-blueText" x={padL} y={padT + 4} fontSize={10} opacity={0.75}>
            내 우위 ↑
          </text>
          <text className="fill-redText" x={padL} y={h - padB + 2} fontSize={10} opacity={0.75}>
            상대 우위 ↓
          </text>
          {/* season breaks */}
          {seasonBreaks.map((b) => (
            <g key={b.index}>
              <line
                className="stroke-border1"
                x1={x(b.index)}
                y1={padT - 6}
                x2={x(b.index)}
                y2={h - padB + 6}
                strokeDasharray="2 3"
              />
              <text className="fill-primary2" x={x(b.index) + 5} y={padT + 2} fontSize={10}>
                {b.label}
              </text>
            </g>
          ))}
          {/* cumulative step line */}
          <path className="stroke-primary2" d={linePath} fill="none" strokeWidth={1.5} />
          {/* per-game dots */}
          {pts.map((v, i) =>
            i === 0 ? null : (
              <circle
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                className="stroke-darkBg2"
                cx={x(i)}
                cy={y(v)}
                r={4}
                fill={streak[i - 1] === "W" ? colors.blueText : colors.redText}
                strokeWidth={1.5}
              >
                <title>{`${i}번째 맞대결 — ${streak[i - 1] === "W" ? "승" : "패"} (누적 ${
                  v > 0 ? `+${v}` : v
                })`}</title>
              </circle>
            )
          )}
          {/* current value */}
          <text
            x={x(pts.length - 1) + 10}
            y={y(cur) + 4}
            fill={curColor}
            fontSize={13}
            fontWeight={700}
            style={{ fontFeatureSettings: '"tnum"' }}
          >
            {cur > 0 ? `+${cur}` : cur}
          </text>
        </svg>
      </div>
    </SectionCard>
  );
};

export default H2HRivalryTimeline;
