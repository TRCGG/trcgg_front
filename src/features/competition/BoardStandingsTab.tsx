import { useState } from "react";
import { CompetitionStandings, StandingRow } from "@/data/types/competition";
import { getWinRateColor } from "@/utils/statColors";

interface Props {
  standings: CompetitionStandings | null;
}

// API가 스크림·본경기를 나눠 주므로 화면에서도 나눠 본다.
const SPLITS = [
  { key: "main", label: "본경기" },
  { key: "scrim", label: "스크림" },
] as const;

const GRID = "grid-cols-[56px_1fr_72px_84px_78px_92px]";

const BoardStandingsTab = ({ standings }: Props) => {
  const [split, setSplit] = useState<"main" | "scrim">("main");
  const rows: StandingRow[] = standings?.[split] ?? [];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {SPLITS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setSplit(item.key)}
            className={`rounded border px-3.5 py-1.5 text-[13px] ${
              split === item.key
                ? "border-blueText bg-blueText/10 text-primary1"
                : "border-border2 bg-darkBg2 text-primary2 hover:text-primary1"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded border border-border2 bg-darkBg2">
        <div className="min-w-[620px]">
          <div
            className={`grid ${GRID} gap-2.5 border-b border-border2 px-4 py-2.5 text-xs text-primary2`}
          >
            <span className="text-center">순위</span>
            <span>팀</span>
            <span className="text-center">경기</span>
            <span className="text-center">승 - 패</span>
            <span className="text-center">승률</span>
            <span className="text-center">평균 KDA</span>
          </div>
          {rows.length === 0 ? (
            <div className="px-4 py-11 text-center text-[13px] text-primary3">
              집계된 경기가 없습니다
            </div>
          ) : (
            rows.map((row) => (
              <div
                key={row.teamId}
                className={`grid ${GRID} items-center gap-2.5 border-b border-cardBorder px-4 py-3 last:border-0 ${
                  row.rank === 1 ? "bg-yellow/[0.04]" : ""
                }`}
              >
                <span
                  className={`text-center text-[15px] font-bold ${
                    row.rank === 1 ? "text-yellow" : "text-primary2"
                  }`}
                >
                  {row.rank}
                </span>
                <span className="truncate text-sm text-primary1">{row.name}</span>
                <span className="text-center text-[13px] tabular-nums text-primary2">
                  {row.games}
                </span>
                <span className="text-center text-[13px] tabular-nums text-primary1">
                  {row.win} - {row.lose}
                </span>
                <span
                  className={`text-center text-[13px] tabular-nums ${getWinRateColor(row.winRate)}`}
                >
                  {row.winRate}%
                </span>
                <span className="text-center text-[13px] tabular-nums text-primary1">
                  {row.avgKda}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardStandingsTab;
