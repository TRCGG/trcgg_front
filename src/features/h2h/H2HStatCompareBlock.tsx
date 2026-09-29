import React from "react";
import { H2HMetrics } from "@/data/types/h2h";
import colors from "@/styles/colors";
import SectionCard from "./SectionCard";

interface DiffBarProps {
  label: string;
  mine: number;
  oppo: number;
  format?: (v: number) => string | number;
  unit?: string;
  betterIs?: "high" | "low";
  signed?: boolean;
}

const H2HStatDiffBar = ({
  label,
  mine,
  oppo,
  format = (v) => v,
  unit = "",
  betterIs = "high",
  signed = false,
}: DiffBarProps) => {
  const maxAbs = Math.max(Math.abs(mine), Math.abs(oppo)) || 1;
  const minePct = (Math.abs(mine) / maxAbs) * 100;
  const oppoPct = (Math.abs(oppo) / maxAbs) * 100;
  const mineBetter = betterIs === "high" ? mine > oppo : mine < oppo;
  const oppoBetter = betterIs === "high" ? oppo > mine : oppo < mine;
  const diff = mine - oppo;
  const fmtVal = (v: number) => (signed && v > 0 ? "+" : "") + format(v);
  const diffStr = (diff > 0 ? "+" : "") + format(diff);
  let diffBadgeColor: string = colors.primary2;
  if (diff !== 0) diffBadgeColor = mineBetter ? colors.blueText : colors.yellow;

  return (
    <div className="grid grid-cols-[60px_1fr_1fr_60px] items-center gap-3 py-2.5 px-0">
      {/* Left value */}
      <div
        className={`text-right text-sm tabular-nums ${
          mineBetter ? "font-bold text-blueText" : "font-normal text-primary1"
        }`}
      >
        {fmtVal(mine)}
        {unit}
      </div>
      {/* my bar */}
      <div className="bg-rankBg3 flex-1 h-2 rounded-sm overflow-hidden">
        <div
          className={`h-full transition-[width] duration-[200ms] ${
            mineBetter ? "bg-blueText" : "bg-primary2"
          }`}
          // 막대 길이는 데이터 비율이라 Tailwind 클래스로 표현할 수 없다.
          style={{ width: `${minePct}%` }}
        />
      </div>
      {/* oppo bar (mirrored) */}
      <div className="relative flex items-center">
        <div className="bg-rankBg3 flex-1 h-2 rounded-sm overflow-hidden [direction:rtl]">
          <div
            className={`h-full transition-[width] duration-[200ms] [direction:ltr] ${
              oppoBetter ? "bg-yellow" : "bg-primary2"
            }`}
            style={{ width: `${oppoPct}%` }}
          />
        </div>
      </div>
      <div
        className={`text-left text-sm tabular-nums ${
          oppoBetter ? "font-bold text-yellow" : "font-normal text-primary1"
        }`}
      >
        {fmtVal(oppo)}
        {unit}
      </div>
      {/* label row */}
      <div className="col-span-full flex items-center justify-center gap-3 -mt-1">
        <span className="text-primary2 text-[11px]">{label}</span>
        <span
          className="bg-rankBg2 border border-border2 text-[10px] py-px px-2 rounded-full tabular-nums"
          style={{ color: diffBadgeColor }}
        >
          {diffStr}
          {unit}
        </span>
      </div>
    </div>
  );
};

interface Props {
  mine: H2HMetrics | null;
  oppos: H2HMetrics | null;
}

interface Row {
  label: string;
  mine: number;
  oppo: number;
  fmt: (v: number) => string | number;
  unit?: string;
  betterIs?: "high" | "low";
  signed?: boolean;
}

const H2HStatCompareBlock = ({ mine, oppos }: Props) => {
  // 게임이 없으면 객체는 있어도 모든 지표가 null로 온다 → 비교 불가
  if (!mine || !oppos || mine.kda == null || oppos.kda == null) {
    return (
      <SectionCard title="평균 지표 비교" subtitle="왼쪽 — 나 / 오른쪽 — 상대">
        <div className="text-primary2 p-6 text-center text-[13px]">
          비교할 평균 지표가 아직 없어요
        </div>
      </SectionCard>
    );
  }

  const rows: Row[] = [
    { label: "KDA", mine: mine.kda ?? 0, oppo: oppos.kda ?? 0, fmt: (v) => v.toFixed(2) },
    {
      label: "분당 피해 (DPM)",
      mine: mine.dpm ?? 0,
      oppo: oppos.dpm ?? 0,
      fmt: (v) => Math.round(v).toLocaleString(),
    },
    {
      label: "라인 골드 차",
      mine: mine.laneGoldDiff ?? 0,
      oppo: oppos.laneGoldDiff ?? 0,
      fmt: (v) => Math.round(v).toLocaleString(),
      unit: "g",
      signed: true,
    },
    {
      label: "15분 이전 처치 관여",
      mine: mine.tdBefore15 ?? 0,
      oppo: oppos.tdBefore15 ?? 0,
      fmt: (v) => v.toFixed(1),
    },
    {
      label: "포탑 방패 파괴",
      mine: mine.turretPlates ?? 0,
      oppo: oppos.turretPlates ?? 0,
      fmt: (v) => v.toFixed(1),
    },
    {
      label: "분당 경험치",
      mine: mine.expPerMin ?? 0,
      oppo: oppos.expPerMin ?? 0,
      fmt: (v) => Math.round(v).toLocaleString(),
    },
    {
      label: "사망 시간 비율",
      mine: mine.deadTimePct ?? 0,
      oppo: oppos.deadTimePct ?? 0,
      fmt: (v) => v.toFixed(1),
      unit: "%",
      betterIs: "low",
    },
  ];

  // 정글 매치업에서만 카운터정글 지표 추가
  if (mine.jungleCsEnemy != null && oppos.jungleCsEnemy != null) {
    rows.splice(5, 0, {
      label: "상대 정글 CS",
      mine: mine.jungleCsEnemy,
      oppo: oppos.jungleCsEnemy,
      fmt: (v) => v.toFixed(0),
    });
  }

  return (
    <SectionCard title="평균 지표 비교" subtitle="왼쪽 — 나 / 오른쪽 — 상대">
      <div className="pt-1 px-4 pb-3">
        <div className="text-primary2 grid grid-cols-[60px_1fr_1fr_60px] gap-3 text-[10px] mb-1 items-center">
          <div className="text-right">나</div>
          <div />
          <div className="text-right" />
          <div className="text-left">상대</div>
        </div>
        {rows.map((r, i) => (
          <React.Fragment key={r.label}>
            {i > 0 && <div className="bg-border2 h-[1px]" />}
            <H2HStatDiffBar
              label={r.label}
              mine={r.mine}
              oppo={r.oppo}
              format={r.fmt}
              unit={r.unit || ""}
              betterIs={r.betterIs || "high"}
              signed={!!r.signed}
            />
          </React.Fragment>
        ))}
      </div>
    </SectionCard>
  );
};

export default H2HStatCompareBlock;
