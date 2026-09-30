import { useState } from "react";
import { CompetitionStandings, StandingRow } from "@/data/types/competition";
import { getWinRateColor } from "@/utils/statColors";
import { getGameTypeMeta } from "./competitionMeta";
import WinnerBadge from "./WinnerBadge";

interface Props {
  standings: CompetitionStandings | null;
  winnerTeamId: number | null;
}

type Split = keyof CompetitionStandings;

// API가 유형별로 나눠 주므로 화면에서도 나눠 본다. 결과가 가장 중요한 본선을 먼저 둔다.
const SPLITS: readonly { key: Split; meta: ReturnType<typeof getGameTypeMeta> }[] = [
  { key: "main", meta: getGameTypeMeta("4") },
  { key: "preliminary", meta: getGameTypeMeta("3") },
  { key: "scrim", meta: getGameTypeMeta("2") },
];

const GRID = "grid-cols-[56px_1fr_72px_84px_78px_92px]";

const BoardStandingsTab = ({ standings, winnerTeamId }: Props) => {
  const [split, setSplit] = useState<Split>("main");
  const rows: StandingRow[] = standings?.[split] ?? [];
  // 백엔드는 정렬 키가 같은 팀에 같은 등수를 줘서 0판 팀끼리 한 등수로 묶인다(전부 0판이면 전원 1위).
  const hasGames = rows.some((row) => row.games > 0);
  const splitLabel = SPLITS.find((item) => item.key === split)?.meta.label ?? "";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {SPLITS.map(({ key, meta }) => {
          const active = split === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSplit(key)}
              aria-pressed={active}
              className={`inline-flex h-8 items-center gap-2 rounded-full border px-3.5 text-[13px] transition-colors ${
                active
                  ? `${meta.borderClass} ${meta.bgClass} font-bold text-primary1`
                  : "border-border2 bg-darkBg1 text-primary2 hover:border-border1 hover:text-primary1"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${meta.dotClass}`} aria-hidden="true" />
              {meta.label}
            </button>
          );
        })}
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
          {!hasGames ? (
            <div className="px-4 py-11 text-center text-[13px] text-primary3">
              아직 등록된 {splitLabel} 경기가 없습니다
            </div>
          ) : (
            rows.map((row) => {
              const ranked = row.games > 0;
              const isFirst = ranked && row.rank === 1;
              return (
                <div
                  key={row.teamId}
                  className={`grid ${GRID} items-center gap-2.5 border-b border-cardBorder px-4 py-3 last:border-0 ${
                    isFirst ? "bg-yellow/[0.04]" : ""
                  } ${ranked ? "" : "opacity-50"}`}
                >
                  <span
                    className={`text-center text-[15px] font-bold ${
                      isFirst ? "text-yellow" : "text-primary2"
                    }`}
                  >
                    {ranked ? row.rank : "-"}
                  </span>
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span className="truncate text-sm text-primary1">{row.name}</span>
                    {row.teamId === winnerTeamId && <WinnerBadge />}
                  </span>
                  <span className="text-center text-[13px] tabular-nums text-primary2">
                    {row.games}
                  </span>
                  <span className="text-center text-[13px] tabular-nums text-primary1">
                    {row.win} - {row.lose}
                  </span>
                  <span
                    className={`text-center text-[13px] tabular-nums ${
                      ranked ? getWinRateColor(row.winRate) : "text-primary3"
                    }`}
                  >
                    {ranked ? `${row.winRate}%` : "-"}
                  </span>
                  <span className="text-center text-[13px] tabular-nums text-primary1">
                    {ranked ? row.avgKda : "-"}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardStandingsTab;
