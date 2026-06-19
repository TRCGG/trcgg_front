import colors from "@/styles/colors";

interface SameLaneChipProps {
  active?: boolean;
  onChange?: (next: boolean) => void;
}

// 맞라인만 토글 칩 — 챔피언 매치업 / 최근 맞대결 공용
export const SameLaneChip = ({ active = false, onChange }: SameLaneChipProps) => (
  <button
    type="button"
    onClick={() => onChange?.(!active)}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "4px 10px",
      borderRadius: 999,
      fontSize: 11,
      border: `1px solid ${active ? colors.blueText : colors.border2}`,
      background: active ? colors.blue : colors.rankBg2,
      color: active ? colors.blueText : colors.primary1,
      cursor: "pointer",
      whiteSpace: "nowrap",
      transition: "background 120ms, border-color 120ms",
    }}
  >
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: active ? colors.blueText : colors.primary2,
      }}
    />
    맞라인만
  </button>
);

// 정렬 칩 (판수 순) — 매치업/듀오 리스트는 이미 판수 DESC로 정렬되어 옴
export const SortChip = () => (
  <div
    className="bg-rankBg2 border border-border2 text-primary1"
    style={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      padding: "4px 10px",
      borderRadius: 999,
      fontSize: 11,
    }}
  >
    판수 순
    <svg
      width={10}
      height={10}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);
