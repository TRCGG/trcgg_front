import { H2HResult } from "@/data/types/h2h";

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
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex gap-[3px] flex-wrap">
        {streak.map((s, i) => {
          const isWin = s === "W";
          return (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              title={`${i + 1}번째 게임 — ${isWin ? "승" : "패"}`}
              className={`h-[22px] w-3.5 rounded-sm ${isWin ? "bg-blueText" : "bg-redText"}`}
              // 최근 경기일수록 진하게 — 인덱스로 계산하는 값이라 클래스로 표현할 수 없다.
              style={{ opacity: 0.35 + (i / streak.length) * 0.65 }}
            />
          );
        })}
      </div>
      <div
        className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold ${
          curKind === "W" ? "bg-blue text-blueText" : "bg-red text-redText"
        }`}
      >
        {curStreak}
        {curKind === "W" ? "연승" : "연패"} 중
      </div>
    </div>
  );
};

export default H2HStreakDots;
