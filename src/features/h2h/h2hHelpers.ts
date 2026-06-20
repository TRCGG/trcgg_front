import { H2HInsight, H2HLaneMatrix } from "@/data/types/h2h";
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

interface InsightCopy {
  title: string;
  body: string;
  stat: string;
}

// 인사이트 type + 수치 → 한국어 문구 조립 (백엔드는 데이터만, 문구는 프론트)
// koName: 영문 챔피언 키 → 한글명 변환 (미주입 시 영문 그대로)
export const v2InsightCopy = (
  ins: H2HInsight,
  koName: (en?: string | null) => string = (en) => en ?? ""
): InsightCopy => {
  const signed = (n: number) => (n > 0 ? "+" : "") + n;
  const md = (d: string) => {
    const x = new Date(d);
    return `${x.getMonth() + 1}/${x.getDate()}`;
  };
  switch (ins.type) {
    case "counterPick":
      return {
        title: "필승 카드",
        body: `이 상대엔 ${koName(ins.myChamp)} 픽이 답`,
        stat: `vs ${koName(ins.oppoChamp)} ${ins.wins}승 ${ins.losses}패 · ${Math.round(
          ins.winRate ?? 0
        )}% · KDA ${signed(ins.kdaDiff ?? 0)}`,
      };
    case "nemesis":
      return {
        title: "천적 주의보",
        body: `${koName(ins.oppoChamp)} 픽 나오면 일단 긴장`,
        stat: `내 ${koName(ins.myChamp)} vs ${koName(ins.oppoChamp)} ${ins.wins}승 ${
          ins.losses
        }패 · ${Math.round(ins.winRate ?? 0)}% · KDA ${signed(ins.kdaDiff ?? 0)}`,
      };
    case "laneVsResult":
      return ins.direction === "laneLoseButWin"
        ? {
            title: "한타로 다 뒤집음",
            body: "라인 지고도 캐리한 판이 많다",
            stat: `${ins.total}승 중 ${ins.laneCount}판은 라인 골드 열세였음`,
          }
        : {
            title: "이기던 라인, 던진 한타",
            body: "라인전 이기고도 진 판이 많다",
            stat: `패배 ${ins.total}판 중 ${ins.laneCount}판은 라인 골드 우위였음`,
          };
    case "momentum": {
      const up = ins.direction === "up";
      return {
        title: "요즘 기세",
        body: up ? `최근 ${ins.recentN}판 ${ins.recentWins}승 — 슬슬 내 흐름` : "요즘 밀리는 중",
        stat: `통산 ${Math.round(ins.careerWinRate ?? 0)}% → 최근 ${ins.recentN}판 ${Math.round(
          ins.recentWinRate ?? 0
        )}%`,
      };
    }
    case "streak": {
      const win = ins.streakKind === "win";
      const cur =
        (ins.currentLength ?? 0) > 1
          ? ` · 현재 ${ins.currentLength}${win ? "연승" : "연패"} 진행 중`
          : "";
      return {
        title: "역대 기록",
        body: `역대 최장 ${ins.length}${win ? "연승" : "연패"}`,
        stat: `${md(ins.fromDate ?? "")} ~ ${md(ins.toDate ?? "")}${cur}`,
      };
    }
    default:
      return { title: "", body: "", stat: "" };
  }
};
