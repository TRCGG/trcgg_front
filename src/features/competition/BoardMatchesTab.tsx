import { useMemo, useState } from "react";
import { CompetitionMatchTeamItem } from "@/data/types/competition";

interface Props {
  matches: CompetitionMatchTeamItem[];
  isManager: boolean;
  onDelete?: (customMatchId: string) => void;
  deletingId?: string | null;
}

const FILTERS = [
  { key: "ALL", label: "전체" },
  { key: "2", label: "스크림" },
  { key: "3", label: "본경기" },
] as const;

const GRID = "grid-cols-[104px_1fr_140px_1fr_120px]";

const formatLength = (seconds: number | null): string => {
  if (seconds === null) return "-";
  const min = Math.floor(seconds / 60);
  const sec = String(seconds % 60).padStart(2, "0");
  return `${min}:${sec}`;
};

const formatDate = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

/** 미배정 경기는 팀 이름이 없어 순위표에도 잡히지 않는다 — 운영진이 수동 배정해야 한다. */
const sideName = (name: string | null): string => name ?? "미배정";

const BoardMatchesTab = ({ matches, isManager, onDelete, deletingId }: Props) => {
  const [filter, setFilter] = useState<"ALL" | "2" | "3">("ALL");

  const rows = useMemo(
    () => (filter === "ALL" ? matches : matches.filter((match) => match.gameType === filter)),
    [matches, filter]
  );

  const resultBadge = (
    match: CompetitionMatchTeamItem,
    side: "blue" | "red"
  ): { label: string; className: string } => {
    const teamId = side === "blue" ? match.blueTeamId : match.redTeamId;
    if (match.winnerTeamId === null || teamId === null) {
      return { label: "-", className: "bg-rankBg2 text-primary3" };
    }
    return match.winnerTeamId === teamId
      ? { label: "승", className: "bg-blueText/10 text-blueText" }
      : { label: "패", className: "bg-redDarken text-redText" };
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setFilter(item.key)}
            className={`rounded border px-3.5 py-1.5 text-[13px] ${
              filter === item.key
                ? "border-blueText bg-blueText/10 text-primary1"
                : "border-border2 bg-darkBg2 text-primary2 hover:text-primary1"
            }`}
          >
            {item.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-primary2">총 {rows.length}경기</span>
      </div>

      <div className="overflow-x-auto rounded border border-border2 bg-darkBg2">
        <div className="min-w-[720px]">
          <div
            className={`grid ${GRID} items-center gap-3 border-b border-border2 px-4 py-2.5 text-[11px] font-bold tracking-wide`}
          >
            <span />
            <span className="text-right text-blueText">BLUE</span>
            <span />
            <span className="text-teamLoss">RED</span>
            <span />
          </div>

          {rows.length === 0 ? (
            <div className="px-4 py-11 text-center text-[13px] text-primary3">
              등록된 경기가 없습니다
            </div>
          ) : (
            rows.map((match) => {
              const blue = resultBadge(match, "blue");
              const red = resultBadge(match, "red");
              return (
                <div
                  key={match.customMatchId}
                  className={`grid ${GRID} items-center gap-3 border-b border-cardBorder px-4 py-3 last:border-0`}
                >
                  <div className="flex flex-col gap-[3px]">
                    <span
                      className={`w-fit rounded px-1.5 py-0.5 text-[11px] font-bold ${
                        match.gameType === "3"
                          ? "bg-yellow/10 text-yellow"
                          : "bg-rankBg2 text-primary2"
                      }`}
                    >
                      {match.gameType === "3" ? "★본경기" : "스크림"}
                    </span>
                    <span className="text-[11px] text-primary3">{formatDate(match.date)}</span>
                  </div>

                  <div className="flex min-w-0 items-center justify-end gap-2">
                    <span className="truncate text-sm text-primary1">
                      {sideName(match.blueTeamName)}
                    </span>
                    <span className="h-[22px] w-[3px] shrink-0 rounded-sm bg-bluePrimary" />
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${blue.className}`}>
                      {blue.label}
                    </span>
                    <span className="text-[13px] tabular-nums text-primary3">
                      {formatLength(match.gameLength)}
                    </span>
                    <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${red.className}`}>
                      {red.label}
                    </span>
                  </div>

                  <div className="flex min-w-0 items-center gap-2">
                    <span className="h-[22px] w-[3px] shrink-0 rounded-sm bg-teamLoss" />
                    <span className="truncate text-sm text-primary1">
                      {sideName(match.redTeamName)}
                    </span>
                  </div>

                  <div className="flex items-center justify-end">
                    {isManager && onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(match.customMatchId)}
                        disabled={deletingId === match.customMatchId}
                        className="whitespace-nowrap text-xs text-redText disabled:opacity-40"
                      >
                        {deletingId === match.customMatchId ? "삭제 중..." : "삭제"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {isManager && (
            <p className="px-4 py-3 text-xs text-primary2">
              팀이 <span className="text-primary1">미배정</span>인 경기는 순위표에 집계되지
              않습니다. 로스터 편성에서 진영별 팀을 지정해 주세요.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardMatchesTab;
