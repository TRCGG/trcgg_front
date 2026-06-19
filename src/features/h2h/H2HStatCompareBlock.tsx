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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "60px 1fr 1fr 60px",
        alignItems: "center",
        gap: 12,
        padding: "10px 0",
      }}
    >
      {/* Left value */}
      <div
        style={{
          textAlign: "right",
          fontSize: 14,
          fontWeight: mineBetter ? 700 : 400,
          color: mineBetter ? colors.blueText : colors.primary1,
          fontFeatureSettings: '"tnum"',
        }}
      >
        {fmtVal(mine)}
        {unit}
      </div>
      {/* my bar */}
      <div
        className="bg-rankBg3"
        style={{
          flex: 1,
          height: 8,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${minePct}%`,
            background: mineBetter ? colors.blueText : colors.primary2,
            transition: "width 200ms",
          }}
        />
      </div>
      {/* oppo bar (mirrored) */}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <div
          className="bg-rankBg3"
          style={{
            flex: 1,
            height: 8,
            borderRadius: 2,
            overflow: "hidden",
            direction: "rtl",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${oppoPct}%`,
              background: oppoBetter ? colors.yellow : colors.primary2,
              transition: "width 200ms",
              direction: "ltr",
            }}
          />
        </div>
      </div>
      <div
        style={{
          textAlign: "left",
          fontSize: 14,
          fontWeight: oppoBetter ? 700 : 400,
          color: oppoBetter ? colors.yellow : colors.primary1,
          fontFeatureSettings: '"tnum"',
        }}
      >
        {fmtVal(oppo)}
        {unit}
      </div>
      {/* label row */}
      <div
        style={{
          gridColumn: "1 / -1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          marginTop: -4,
        }}
      >
        <span className="text-primary2" style={{ fontSize: 11 }}>
          {label}
        </span>
        <span
          className="bg-rankBg2 border border-border2"
          style={{
            fontSize: 10,
            padding: "1px 8px",
            borderRadius: 999,
            color: diffBadgeColor,
            fontFeatureSettings: '"tnum"',
          }}
        >
          {diffStr}
          {unit}
        </span>
      </div>
    </div>
  );
};

interface Props {
  mine: H2HMetrics;
  oppos: H2HMetrics;
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
  const rows: Row[] = [
    { label: "KDA", mine: mine.kda, oppo: oppos.kda, fmt: (v) => v.toFixed(2) },
    {
      label: "분당 피해 (DPM)",
      mine: mine.dpm,
      oppo: oppos.dpm,
      fmt: (v) => Math.round(v).toLocaleString(),
    },
    {
      label: "라인 골드 차",
      mine: mine.laneGoldDiff,
      oppo: oppos.laneGoldDiff,
      fmt: (v) => Math.round(v).toLocaleString(),
      unit: "g",
      signed: true,
    },
    {
      label: "15분 이전 처치 관여",
      mine: mine.tdBefore15,
      oppo: oppos.tdBefore15,
      fmt: (v) => v.toFixed(1),
    },
    {
      label: "포탑 방패 파괴",
      mine: mine.turretPlates,
      oppo: oppos.turretPlates,
      fmt: (v) => v.toFixed(1),
    },
    {
      label: "분당 경험치",
      mine: mine.expPerMin,
      oppo: oppos.expPerMin,
      fmt: (v) => Math.round(v).toLocaleString(),
    },
    {
      label: "사망 시간 비율",
      mine: mine.deadTimePct,
      oppo: oppos.deadTimePct,
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
    <SectionCard
      title="평균 지표 비교"
      subtitle="왼쪽 — 나 / 오른쪽 — 상대 · 정글 매치업엔 상대 정글 CS 추가"
    >
      <div style={{ padding: "4px 16px 12px" }}>
        <div
          className="text-primary2"
          style={{
            display: "grid",
            gridTemplateColumns: "60px 1fr 1fr 60px",
            gap: 12,
            fontSize: 10,
            marginBottom: 4,
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "right" }}>나</div>
          <div />
          <div style={{ textAlign: "right" }} />
          <div style={{ textAlign: "left" }}>상대</div>
        </div>
        {rows.map((r, i) => (
          <React.Fragment key={r.label}>
            {i > 0 && <div className="bg-border2" style={{ height: 1 }} />}
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
