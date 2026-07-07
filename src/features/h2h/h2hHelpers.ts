import { H2HAgainst, H2HLaneMatrix, H2HMatchup } from "@/data/types/h2h";
import colors from "@/styles/colors";

export type LanePos = "TOP" | "JUG" | "MID" | "ADC" | "SUP";

export const POSITIONS: LanePos[] = ["TOP", "JUG", "MID", "ADC", "SUP"];

export const POSITION_LABELS: Record<string, string> = {
  TOP: "탑",
  JUG: "정글",
  MID: "미드",
  ADC: "원딜",
  SUP: "서폿",
};

export const v2Pct = (num: number, den: number): number => {
  if (!den) return 0;
  return Math.round((num / den) * 100);
};

export const v2WinRateColor = (pct: number): string => {
  if (pct >= 65) return colors.yellow;
  if (pct >= 55) return colors.blueText;
  if (pct >= 45) return colors.primary1;
  if (pct >= 35) return colors.primary2;
  return colors.redText;
};

// 부호(+/-/0)에 따른 색상 — 양수/음수/동률
export const diffColor = (
  n: number,
  positive = colors.neonGreen,
  negative = colors.redText,
  zero = colors.primary1
): string => {
  if (n > 0) return positive;
  if (n < 0) return negative;
  return zero;
};

// 라인 매트릭스 셀 배경 — 채도는 표본 수에 비례
export const v2MatrixCellBg = (count: number, winRate: number): string => {
  if (count === 0) return colors.darkBg1;
  const sat = Math.min(1, count / 6); // 6+ = full saturation
  if (winRate >= 60) return `rgba(107, 184, 255, ${0.1 + sat * 0.32})`;
  if (winRate >= 50) return `rgba(107, 184, 255, ${0.06 + sat * 0.16})`;
  if (winRate >= 40) return `rgba(255, 107, 139, ${0.06 + sat * 0.16})`;
  return `rgba(255, 107, 139, ${0.1 + sat * 0.32})`;
};

// 가장 많이 맞붙은 '맞라인' 매치업 1개 추출 (laneMatrix 대각선 = 동일 position 최다)
export interface TopLanePair {
  myLane: LanePos;
  oppoLane: LanePos;
  count: number;
  wins: number;
}

export const topLaneMatchup = (matrix?: H2HLaneMatrix | null): TopLanePair | null => {
  if (!matrix) return null;
  let best: TopLanePair | null = null;
  POSITIONS.forEach((lane) => {
    const cell = matrix[lane]?.[lane];
    if (cell && cell.c > 0 && (!best || cell.c > best.count)) {
      best = { myLane: lane, oppoLane: lane, count: cell.c, wins: cell.w };
    }
  });
  return best;
};

// 초 → "mm:ss"
export const formatGameLen = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

// ISO → "M/D HH:mm"
export const formatPlayedDate = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
};

// ISO → 상대 시간 ("2시간 전", "1일 전" 등)
export const formatAgo = (iso: string): string => {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMin = Math.max(0, Math.floor((now - then) / 60000));
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}시간 전`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}일 전`;
  const diffWk = Math.floor(diffDay / 7);
  if (diffWk < 5) return `${diffWk}주 전`;
  const diffMo = Math.floor(diffDay / 30);
  return `${diffMo}개월 전`;
};

// ISO → "YYYY년 M월 D일"
export const formatFullDate = (iso: string | null): string => {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
};

export type InsightKind = "best" | "worst" | "lane" | "counter";

export interface BuiltInsight {
  kind: InsightKind;
  title: string;
  body: string;
  stat: string;
}

interface InsightAgg {
  key: string;
  g: number; // games
  w: number; // wins
  champ?: string;
  lane?: LanePos;
}

const laneLabel = (lane?: LanePos): string => (lane ? POSITION_LABELS[lane] : "");

/**
 * 인사이트는 프론트 소유(C-3) — 백엔드 insights는 무시하고 matchups/streak/winRate로 재생성한다.
 * 카드마다 집계 단위가 다르다: (myChamp+myLane) / oppoChamp / myLane.
 * koName: 영문 챔피언 키 → 한글명 변환 (미주입 시 영문 그대로)
 */
export const buildInsights = (
  against: H2HAgainst,
  koName: (en?: string | null) => string = (en) => en ?? ""
): BuiltInsight[] => {
  const ms = against.matchups || [];
  const wrOf = (w: number, g: number): number => (g ? Math.round((w / g) * 100) : 0);

  const aggBy = (
    keyFn: (m: H2HMatchup) => string,
    extra: (m: H2HMatchup) => Partial<InsightAgg>
  ): InsightAgg[] => {
    const map: Record<string, InsightAgg> = {};
    ms.forEach((m) => {
      const k = keyFn(m);
      if (!map[k]) map[k] = { key: k, g: 0, w: 0, ...extra(m) };
      map[k].g += m.count;
      map[k].w += m.wins;
    });
    return Object.values(map);
  };

  // C-1: 최소 표본 games ≥ 3 (2판 100% 같은 과대표본 방지)
  const my = aggBy(
    (m) => `${m.myChamp}|${m.myLane}`,
    (m) => ({ champ: m.myChamp, lane: m.myLane })
  ).filter((x) => x.g >= 3);
  const op = aggBy(
    (m) => m.oppoChamp,
    (m) => ({ champ: m.oppoChamp })
  ).filter((x) => x.g >= 3);
  const ln = aggBy(
    (m) => m.myLane,
    (m) => ({ lane: m.myLane })
  ).filter((x) => x.g >= 3);

  const byWrDesc = (a: InsightAgg, b: InsightAgg) => wrOf(b.w, b.g) - wrOf(a.w, a.g);
  const rec = (x: InsightAgg) => `${x.g}판 ${wrOf(x.w, x.g)}% · ${x.w}승 ${x.g - x.w}패`;

  const out: BuiltInsight[] = [];
  let bestPickLane: LanePos | undefined;

  // 최고의 픽 — my 그룹이 있으면 항상
  if (my.length) {
    const b = [...my].sort(byWrDesc)[0];
    bestPickLane = b.lane;
    out.push({
      kind: "best",
      title: "최고의 픽",
      body: `내 ${koName(b.champ)} · ${laneLabel(b.lane)}`,
      stat: rec(b),
    });
  }
  // 피해야 할 픽 — 최저 승률 & < 50%
  if (my.length) {
    const w = [...my].sort(byWrDesc).reverse()[0];
    if (wrOf(w.w, w.g) < 50) {
      out.push({
        kind: "worst",
        title: "피해야 할 픽",
        body: `내 ${koName(w.champ)} · ${laneLabel(w.lane)}`,
        stat: rec(w),
      });
    }
  }
  // 강한 상대 — 최고 승률 & ≥ 55%
  if (op.length) {
    const b = [...op].sort(byWrDesc)[0];
    if (wrOf(b.w, b.g) >= 55) {
      out.push({
        kind: "lane",
        title: "강한 상대",
        body: `상대 ${koName(b.champ)} 픽이면 해볼 만함`,
        stat: rec(b),
      });
    }
  }
  // 천적 챔피언 — 최저 승률 & < 50%
  if (op.length) {
    const n = [...op].sort(byWrDesc).reverse()[0];
    if (wrOf(n.w, n.g) < 50) {
      out.push({
        kind: "counter",
        title: "천적 챔피언",
        body: `상대 ${koName(n.champ)} 픽이면 긴장`,
        stat: rec(n),
      });
    }
  }
  // 라인 우위 — 최고 승률. C-2: 최고의 픽과 같은 라인이면 생략(중복 가드)
  if (ln.length) {
    const l = [...ln].sort(byWrDesc)[0];
    if (l.lane !== bestPickLane) {
      out.push({
        kind: "lane",
        title: "라인 우위",
        body: `${laneLabel(l.lane)} 라인에서 우위`,
        stat: rec(l),
      });
    }
  }
  // 요즘 기세 — B: 총 맞대결 ≥ 5 & |최근5판 승률 − 통산 승률| ≥ 20%p
  const st = against.streak || [];
  if (against.games >= 5 && st.length) {
    const recent = st.slice(-5);
    const rw = recent.filter((s) => s === "W").length;
    const career = Math.round(against.winRate);
    const rwr = Math.round((rw / recent.length) * 100);
    if (Math.abs(rwr - career) >= 20) {
      const up = rwr >= career;
      out.push({
        kind: up ? "best" : "worst",
        title: "요즘 기세",
        body: up ? `최근 ${recent.length}판 ${rw}승 — 흐름 좋음` : "최근 흐름은 주춤",
        stat: `통산 ${career}% → 최근 ${recent.length}판 ${rwr}%`,
      });
    }
  }

  // 노출: 코드 순서대로, 상위 6장
  return out.slice(0, 6);
};
