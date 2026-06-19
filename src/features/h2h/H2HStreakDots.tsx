import { H2HResult } from "@/data/types/h2h";
import colors from "@/styles/colors";

interface Props {
  streak: H2HResult[];
}

const H2HStreakDots = ({ streak }: Props) => {
  if (streak.length === 0) return null;

  // 현재 연승/연패 계산 (최신 = 배열 끝)
  let curStreak = 1;
  const curKind = streak[streak.length - 1];
  for (let i = streak.length - 2; i >= 0; i -= 1) {
    if (streak[i] === curKind) curStreak += 1;
    else break;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
      <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
        {streak.map((s, i) => {
          const isWin = s === "W";
          return (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              title={`${i + 1}번째 게임 — ${isWin ? "승" : "패"}`}
              style={{
                width: 14,
                height: 22,
                borderRadius: 2,
                background: isWin ? colors.blueText : colors.redText,
                opacity: 0.35 + (i / streak.length) * 0.65,
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          padding: "2px 10px",
          borderRadius: 999,
          background: curKind === "W" ? colors.blue : colors.red,
          color: curKind === "W" ? colors.blueText : colors.redText,
          fontSize: 12,
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}
      >
        {curStreak}
        {curKind === "W" ? "연승" : "연패"} 중
      </div>
    </div>
  );
};

export default H2HStreakDots;
