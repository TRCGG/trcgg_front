import React, { useEffect, useRef, useState } from "react";
import { H2HRecent, H2HRecentDetailMetrics, H2HRelation } from "@/data/types/h2h";
import colors from "@/styles/colors";
import { POSITION_LABELS, formatAgo, formatGameLen, formatPlayedDate } from "./h2hHelpers";
import ChampIcon from "./ChampIcon";
import LaneIcon from "./LaneIcon";
import SectionCard from "./SectionCard";
import LoadMoreButton from "./LoadMoreButton";
import { SameLaneChip } from "./chips";

const PAGE_SIZE = 5;

type MetricKey = keyof H2HRecentDetailMetrics;

interface StatDef {
  k: MetricKey;
  label: string;
  betterIs?: "high" | "low";
  fmt?: (v: number) => string;
}

const dtlSigned = (v: number) => `${v > 0 ? "+" : ""}${v.toLocaleString()}g`;
const dtlPct = (v: number) => `${v}%`;
const dtlKda = (v: number) => v.toFixed(2);

// 라인별 세부 보기 지표 세트 — row.myLane 기준 자동 선택
const DETAIL_STAT_SETS: Record<string, StatDef[]> = {
  TOP: [
    { k: "dmg", label: "가한 피해" },
    { k: "taken", label: "받은 피해", betterIs: "low" },
    { k: "selfMit", label: "경감 피해" },
    { k: "laneGoldDiff", label: "라인 골드 차", fmt: dtlSigned },
    { k: "td15", label: "15분 이전 처치 관여" },
    { k: "underTurretTd", label: "포탑 아래 처치 (다이브)" },
    { k: "turretTd", label: "포탑 철거 관여" },
    { k: "ccTime", label: "CC 시간(초)" },
  ],
  JUG: [
    { k: "dmg", label: "가한 피해" },
    { k: "gold", label: "획득 골드" },
    { k: "kda", label: "KDA", fmt: dtlKda },
    { k: "enemyJungleCs", label: "상대 정글 CS" },
    { k: "objDmg", label: "오브젝트 피해" },
    { k: "epicKills", label: "에픽 처치 (용·바론·전령)" },
    { k: "td15", label: "15분 이전 처치 관여" },
    { k: "objSteals", label: "오브젝트 스틸" },
  ],
  MID: [
    { k: "dmg", label: "가한 피해" },
    { k: "taken", label: "받은 피해", betterIs: "low" },
    { k: "gold", label: "획득 골드" },
    { k: "cs", label: "CS" },
    { k: "laneGoldDiff", label: "라인 골드 차", fmt: dtlSigned },
    { k: "kda", label: "KDA", fmt: dtlKda },
    { k: "td15", label: "15분 이전 처치 관여" },
    { k: "turretTd", label: "포탑 철거 관여" },
  ],
  ADC: [
    { k: "dmg", label: "가한 피해" },
    { k: "taken", label: "받은 피해", betterIs: "low" },
    { k: "gold", label: "획득 골드" },
    { k: "cs", label: "CS" },
    { k: "laneGoldDiff", label: "라인 골드 차", fmt: dtlSigned },
    { k: "plates", label: "포탑 방패 파괴" },
    { k: "deadPct", label: "사망 시간 비율", betterIs: "low", fmt: dtlPct },
    { k: "turretTd", label: "포탑 철거 관여" },
  ],
  SUP: [
    { k: "vision", label: "시야 점수" },
    { k: "wardsP", label: "와드 설치" },
    { k: "wardsK", label: "와드 파괴" },
    { k: "controlW", label: "제어와드 구매" },
    { k: "healShield", label: "아군 힐+실드" },
    { k: "ccTime", label: "CC 시간(초)" },
    { k: "missPings", label: "미아핑" },
    { k: "td15", label: "15분 이전 처치 관여" },
  ],
};

interface CellProps {
  label: string;
  mine: number;
  oppo: number;
  fmt?: (v: number) => string;
  betterIs?: "high" | "low";
}

const DetailStatCell = ({
  label,
  mine,
  oppo,
  fmt = (v) => v.toLocaleString(),
  betterIs = "high",
}: CellProps) => {
  const mineBetter = betterIs === "high" ? mine > oppo : mine < oppo;
  const oppoBetter = betterIs === "high" ? oppo > mine : oppo < mine;
  return (
    <div
      className="bg-darkBg1 border border-border2"
      style={{
        borderRadius: 4,
        padding: "8px 10px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div className="text-primary2" style={{ fontSize: 10 }}>
        {label}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 6,
          fontFeatureSettings: '"tnum"',
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: mineBetter ? 700 : 400,
            color: mineBetter ? colors.blueText : colors.primary1,
          }}
        >
          {fmt(mine)}
        </span>
        <span className="text-primary2" style={{ fontSize: 9 }}>
          vs
        </span>
        <span
          style={{
            fontSize: 13,
            fontWeight: oppoBetter ? 700 : 400,
            color: oppoBetter ? colors.yellow : colors.primary1,
          }}
        >
          {fmt(oppo)}
        </span>
      </div>
    </div>
  );
};

const H2HRecentDetail = ({ row }: { row: H2HRecent }) => {
  if (!row.detail) return null;
  const isWin = row.myResult === "W";
  const accentText = isWin ? colors.blueText : colors.redText;
  const { mine, oppo } = row.detail;
  const statSet = DETAIL_STAT_SETS[row.myLane] || DETAIL_STAT_SETS.ADC;
  return (
    <div
      className="bg-darkBg2 border border-border2"
      style={{
        marginLeft: 20,
        borderLeft: `3px solid ${accentText}`,
        borderRadius: 4,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
          <span className="text-primary1" style={{ fontSize: 12, fontWeight: 600 }}>
            이 경기 1:1 비교
          </span>
          <span
            className="bg-rankBg2 border border-border2 text-primary1"
            style={{
              fontSize: 10,
              padding: "1px 8px",
              borderRadius: 999,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <LaneIcon position={row.myLane} size={11} />
            <span>{POSITION_LABELS[row.myLane]} 지표 세트</span>
          </span>
          <span className="text-primary2" style={{ fontSize: 10 }}>
            {formatPlayedDate(row.playedDate)} · {formatGameLen(row.gameLen)} · 왼쪽 — 나 / 오른쪽 —
            상대
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {statSet.map((c) => (
          <DetailStatCell
            key={c.k}
            label={c.label}
            mine={mine[c.k]}
            oppo={oppo[c.k]}
            betterIs={c.betterIs || "high"}
            fmt={c.fmt || ((v) => v.toLocaleString())}
          />
        ))}
      </div>
    </div>
  );
};

interface RowProps {
  row: H2HRecent;
  mode: H2HRelation;
  open: boolean;
  onToggle: () => void;
}

const H2HRecentRow = ({ row, mode, open, onToggle }: RowProps) => {
  const isCrossLane = mode === "against" && !!row.oppoLane && row.oppoLane !== row.myLane;
  const noDetail = mode === "with" || isCrossLane || !row.detail;
  const isWin = row.myResult === "W";
  const accentText = isWin ? colors.blueText : colors.redText;
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        className="bg-darkBg1 border border-border2 flex items-center gap-2 rounded px-3 py-2.5 sm:grid sm:grid-cols-[8px_80px_50px_auto_1fr_auto_auto] sm:gap-3 sm:px-3.5"
        style={{ borderLeft: `3px solid ${accentText}` }}
      >
        <span className="hidden sm:block" />
        <div className="shrink-0">
          <div style={{ fontSize: 13, fontWeight: 700, color: accentText }}>
            {isWin ? "승리" : "패배"}
          </div>
          <div className="text-primary2" style={{ fontSize: 10 }}>
            {formatAgo(row.playedDate)}
          </div>
        </div>
        <div className="text-primary2 hidden sm:block" style={{ fontSize: 11 }}>
          {formatGameLen(row.gameLen)}
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <LaneIcon position={row.myLane} size={16} />
          <ChampIcon en={row.myChamp} size={32} mine />
          <span
            style={{
              fontSize: 10,
              color: mode === "with" ? colors.blueText : colors.primary2,
              fontWeight: mode === "with" ? 700 : 400,
              margin: "0 2px",
            }}
          >
            {mode === "with" ? "+" : "vs"}
          </span>
          <ChampIcon en={row.oppoChamp} size={32} />
          <LaneIcon position={row.oppoLane} size={16} />
        </div>

        <div className="flex min-w-0 flex-col gap-0.5" style={{ fontSize: 11 }}>
          <span className="text-primary1 truncate" style={{ fontFeatureSettings: '"tnum"' }}>
            <b className="text-blueText">나</b> · {row.myKda}
          </span>
          <span className="text-primary2 truncate" style={{ fontFeatureSettings: '"tnum"' }}>
            {mode === "with" ? "팀원" : "상대"} · {row.oppoKda}
          </span>
        </div>

        <button
          type="button"
          onClick={onToggle}
          disabled={noDetail}
          title={isCrossLane ? "교차 라인 게임은 세부 비교를 제공하지 않아요" : undefined}
          className="shrink-0"
          style={{
            padding: "4px 10px",
            background: open ? colors.blue : colors.rankBg2,
            border: `1px solid ${open ? colors.blueText : colors.border2}`,
            borderRadius: 999,
            color: open ? colors.blueText : colors.primary2,
            fontSize: 11,
            cursor: noDetail ? "default" : "pointer",
            whiteSpace: "nowrap",
            visibility: noDetail ? "hidden" : "visible",
          }}
        >
          {open ? "접기" : "세부 보기"}
        </button>
        <span
          className="text-primary2 hidden sm:inline"
          style={{ fontSize: 10, whiteSpace: "nowrap" }}
        >
          {formatPlayedDate(row.playedDate)}
        </span>
      </div>
      {/* grid-rows 0fr→1fr 트랜지션으로 부드럽게 펼침 (기존 gap:4는 pt-1로 대체) */}
      {!noDetail && (
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="pt-1">{open && <H2HRecentDetail row={row} />}</div>
          </div>
        </div>
      )}
    </div>
  );
};

interface Props {
  rows: H2HRecent[];
  mode: H2HRelation;
  sameLaneOnly: boolean;
  onToggleSameLane: (next: boolean) => void;
}

const H2HRecentList = ({ rows, mode, sameLaneOnly, onToggleSameLane }: Props) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const filtered =
    mode === "against" && sameLaneOnly ? rows.filter((r) => r.myLane === r.oppoLane) : rows;

  // 모드/필터 변경 시 다시 5개부터, 펼침 상태 초기화
  useEffect(() => {
    setVisible(PAGE_SIZE);
    setOpenIdx(null);
  }, [mode, sameLaneOnly]);

  const shown = filtered.slice(0, visible);
  const remaining = filtered.length - shown.length;

  // 더보기로 새로 붙은 항목만 순차 등장 (필터/모드 변경 시엔 개수가 줄어 애니메이션 없음)
  const prevCountRef = useRef(shown.length);
  const prevCount = prevCountRef.current;
  useEffect(() => {
    prevCountRef.current = shown.length;
  }, [shown.length]);

  return (
    <SectionCard
      title={mode === "with" ? "최근 함께한 게임" : "최근 맞대결"}
      subtitle={`최근 ${filtered.length}게임${mode === "against" && sameLaneOnly ? " · 맞라인만" : ""}`}
      rightSlot={
        mode === "against" ? (
          <SameLaneChip active={sameLaneOnly} onChange={onToggleSameLane} />
        ) : undefined
      }
    >
      <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
        {filtered.length > 0 ? (
          shown.map((r, i) => {
            const isNew = i >= prevCount;
            return (
              <div
                key={r.matchId}
                className={isNew ? "motion-safe:animate-fadeUp" : undefined}
                style={isNew ? { animationDelay: `${(i - prevCount) * 60}ms` } : undefined}
              >
                <H2HRecentRow
                  row={r}
                  mode={mode}
                  open={openIdx === i}
                  onToggle={() => setOpenIdx(openIdx === i ? null : i)}
                />
              </div>
            );
          })
        ) : (
          <div className="text-primary2" style={{ padding: 24, textAlign: "center", fontSize: 13 }}>
            최근 기록이 없어요
          </div>
        )}
        {remaining > 0 && (
          <LoadMoreButton onClick={() => setVisible((v) => v + PAGE_SIZE)} remaining={remaining} />
        )}
      </div>
    </SectionCard>
  );
};

export default H2HRecentList;
