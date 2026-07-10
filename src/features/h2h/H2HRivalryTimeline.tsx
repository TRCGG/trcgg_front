import { useEffect, useRef, useState } from "react";
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

// 데스크톱은 넓고 낮게, 모바일은 좁고 높게 — viewBox 비율을 바꿔
// 100% 폭으로 줄어도 높이가 충분히 확보되어 가독성을 유지한다.
// minGap: 점 사이 최소 간격(px). 맞대결이 많아 이 간격을 확보하지 못하면
// 차트 폭을 늘리고 가로 스크롤로 전환해 점/라벨이 겹치지 않게 한다.
const DIMS = {
  desktop: {
    w: 1040,
    h: 170,
    padL: 24,
    padR: 76,
    padT: 18,
    padB: 26,
    fz: 10,
    fzCur: 13,
    dotR: 4,
    minGap: 18,
  },
  mobile: {
    w: 360,
    h: 240,
    padL: 16,
    padR: 52,
    padT: 18,
    padB: 26,
    fz: 12,
    fzCur: 15,
    dotR: 4.5,
    minGap: 24,
  },
};

const H2HRivalryTimeline = ({ streak, seasonBreaks = [] }: Props) => {
  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const {
    w: baseW,
    h,
    padL,
    padR,
    padT,
    padB,
    fz,
    fzCur,
    dotR,
    minGap,
  } = isMobile ? DIMS.mobile : DIMS.desktop;

  const pts = [0];
  streak.forEach((s) => pts.push(pts[pts.length - 1] + (s === "W" ? 1 : -1)));

  // 점 사이 최소 간격을 확보할 만큼 폭을 넓힌다. 기본 폭을 넘으면 가로 스크롤.
  const neededW = padL + padR + (pts.length - 1) * minGap;
  const w = Math.max(baseW, neededW);
  const scrolls = w > baseW;

  const maxAbs = Math.max(2, ...pts.map((v) => Math.abs(v)));
  const x = (i: number) => padL + (i / (pts.length - 1 || 1)) * (w - padL - padR);
  const y = (v: number) => padT + (1 - (v + maxAbs) / (2 * maxAbs)) * (h - padT - padB);
  const linePath = pts
    .map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`)
    .join(" ");
  const cur = pts[pts.length - 1];
  const curColor = diffColor(cur, colors.blueText, colors.redText, colors.primary2);

  // 스크롤 위치에 따라 양쪽 페이드(더 볼 내용 있음) 표시 여부를 갱신한다.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setCanScrollLeft(el.scrollLeft > 1);
      setCanScrollRight(el.scrollLeft < max - 1);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [scrolls, w]);

  const edgeFade = (side: "left" | "right", show: boolean) => (
    <div
      aria-hidden
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        [side]: 0,
        width: 44,
        pointerEvents: "none",
        opacity: show ? 1 : 0,
        transition: "opacity 0.2s ease",
        // 가장자리(바깥쪽)가 불투명하고 안쪽으로 갈수록 투명해지도록 중앙 방향으로 페이드.
        background: `linear-gradient(to ${side === "left" ? "right" : "left"}, ${colors.darkBg2} 30%, ${colors.darkBg2}00 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: side === "left" ? "flex-start" : "flex-end",
      }}
    >
      <span
        className="text-primary2"
        style={{
          fontSize: 16,
          fontWeight: 700,
          padding: side === "left" ? "0 0 0 6px" : "0 6px 0 0",
        }}
      >
        {side === "left" ? "‹" : "›"}
      </span>
    </div>
  );

  return (
    <SectionCard
      title="라이벌 히스토리"
      subtitle={`맞대결 누적 우위 (내 승 − 내 패) · 좌→우 시간순${scrolls ? " · 좌우 스크롤 ↔" : ""}`}
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
      <div style={{ position: "relative" }}>
        <div
          ref={scrollRef}
          style={{
            padding: "8px 16px 14px",
            overflowX: scrolls ? "auto" : "visible",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <svg
            viewBox={`0 0 ${w} ${h}`}
            style={{
              width: scrolls ? `${w}px` : "100%",
              height: "auto",
              display: "block",
            }}
          >
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
            <text className="fill-blueText" x={padL} y={padT + 4} fontSize={fz} opacity={0.75}>
              내 우위 ↑
            </text>
            <text className="fill-redText" x={padL} y={h - padB + 2} fontSize={fz} opacity={0.75}>
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
                <text className="fill-primary2" x={x(b.index) + 5} y={padT + 2} fontSize={fz}>
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
                  r={dotR}
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
              fontSize={fzCur}
              fontWeight={700}
              style={{ fontFeatureSettings: '"tnum"' }}
            >
              {cur > 0 ? `+${cur}` : cur}
            </text>
          </svg>
        </div>
        {scrolls && edgeFade("left", canScrollLeft)}
        {scrolls && edgeFade("right", canScrollRight)}
      </div>
    </SectionCard>
  );
};

export default H2HRivalryTimeline;
