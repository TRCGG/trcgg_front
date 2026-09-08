import { useMemo, useState } from "react";
import { CompetitionMatchTeamItem } from "@/data/types/competition";

interface Props {
  matches: CompetitionMatchTeamItem[];
  isManager: boolean;
  /** 종료된 대회는 경기 편집이 잠긴다(백엔드 assertWritable). */
  locked?: boolean;
  onDelete?: (customMatchId: string) => void;
  deletingId?: string | null;
  onAssign?: (match: CompetitionMatchTeamItem) => void;
  onChangeGameType?: (customMatchIds: string[], gameType: "2" | "3") => void;
  changingGameType?: boolean;
}

const FILTERS = [
  { key: "ALL", label: "전체" },
  { key: "2", label: "스크림" },
  { key: "3", label: "본경기" },
  { key: "UNASSIGNED", label: "미배정" },
] as const;

type Filter = (typeof FILTERS)[number]["key"];

const GRID = "grid-cols-[34px_104px_1fr_140px_1fr_150px]";

const formatLength = (seconds: number | null): string => {
  if (seconds === null) return "-";
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

const formatDate = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

const isUnassigned = (match: CompetitionMatchTeamItem) =>
  match.blueTeamId === null && match.redTeamId === null;

const BoardMatchesTab = ({
  matches,
  isManager,
  locked = false,
  onDelete,
  deletingId,
  onAssign,
  onChangeGameType,
  changingGameType = false,
}: Props) => {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const rows = useMemo(() => {
    if (filter === "ALL") return matches;
    if (filter === "UNASSIGNED") return matches.filter(isUnassigned);
    return matches.filter((match) => match.gameType === filter);
  }, [matches, filter]);

  const unassignedCount = useMemo(() => matches.filter(isUnassigned).length, [matches]);
  const editable = isManager && !locked;

  const toggle = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () =>
    setChecked((prev) =>
      prev.size > 0 ? new Set() : new Set(rows.map((row) => row.customMatchId))
    );

  const runGameType = (gameType: "2" | "3") => {
    if (checked.size === 0 || !onChangeGameType) return;
    onChangeGameType(Array.from(checked), gameType);
    setChecked(new Set());
  };

  const resultBadge = (match: CompetitionMatchTeamItem, side: "blue" | "red") => {
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
        {FILTERS.map((item) => {
          if (item.key === "UNASSIGNED" && unassignedCount === 0) return null;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setFilter(item.key);
                setChecked(new Set());
              }}
              className={`rounded border px-3.5 py-1.5 text-[13px] ${
                filter === item.key
                  ? "border-blueText bg-blueText/10 text-primary1"
                  : "border-border2 bg-darkBg2 text-primary2 hover:text-primary1"
              }`}
            >
              {item.label}
              {item.key === "UNASSIGNED" && ` ${unassignedCount}`}
            </button>
          );
        })}
        <span className="ml-auto text-xs text-primary2">총 {rows.length}경기</span>
      </div>

      {editable && (
        <div
          className={`flex flex-wrap items-center gap-3 rounded border bg-darkBg2 px-4 py-3 ${
            checked.size > 0 ? "border-blueText2" : "border-border2"
          }`}
        >
          <span className="text-[13px] text-primary1">
            {checked.size > 0 ? `${checked.size}경기 선택됨` : "경기를 선택해 유형을 바꿉니다"}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => runGameType("2")}
              disabled={checked.size === 0 || changingGameType}
              className="h-[34px] rounded border border-border2 bg-darkBg1 px-3.5 text-[13px] text-primary1 disabled:cursor-not-allowed disabled:opacity-40"
            >
              스크림으로
            </button>
            <button
              type="button"
              onClick={() => runGameType("3")}
              disabled={checked.size === 0 || changingGameType}
              className="h-[34px] rounded border border-yellow/40 bg-darkBg1 px-3.5 text-[13px] text-yellow disabled:cursor-not-allowed disabled:opacity-40"
            >
              ★본경기로
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded border border-border2 bg-darkBg2">
        <div className="min-w-[820px]">
          <div
            className={`grid ${GRID} items-center gap-3 border-b border-border2 px-4 py-2.5 text-[11px] font-bold tracking-wide`}
          >
            {editable ? (
              <button
                type="button"
                onClick={toggleAll}
                aria-label={checked.size > 0 ? "선택 해제" : "전체 선택"}
                className={`flex h-[18px] w-[18px] items-center justify-center rounded border ${
                  checked.size > 0
                    ? "border-bluePrimary bg-bluePrimary"
                    : "border-border1 bg-darkBg1"
                }`}
              >
                {checked.size > 0 && (
                  <svg
                    className="h-3 w-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth={3.2}
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </button>
            ) : (
              <span />
            )}
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
              const rowChecked = checked.has(match.customMatchId);
              return (
                <div
                  key={match.customMatchId}
                  className={`grid ${GRID} items-center gap-3 border-b border-cardBorder px-4 py-3 last:border-0 ${
                    rowChecked ? "bg-bluePrimary/[0.06]" : ""
                  }`}
                >
                  {editable ? (
                    <button
                      type="button"
                      onClick={() => toggle(match.customMatchId)}
                      aria-label={`${match.customMatchId} 선택`}
                      aria-pressed={rowChecked}
                      className={`flex h-[18px] w-[18px] items-center justify-center rounded border ${
                        rowChecked
                          ? "border-bluePrimary bg-bluePrimary"
                          : "border-border1 bg-darkBg1"
                      }`}
                    >
                      {rowChecked && (
                        <svg
                          className="h-3 w-3"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#fff"
                          strokeWidth={3.2}
                          strokeLinecap="round"
                          aria-hidden="true"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </button>
                  ) : (
                    <span />
                  )}

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
                    <span
                      className={`truncate text-sm ${
                        match.blueTeamName ? "text-primary1" : "text-primary3"
                      }`}
                    >
                      {match.blueTeamName ?? "미배정"}
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
                    <span
                      className={`truncate text-sm ${
                        match.redTeamName ? "text-primary1" : "text-primary3"
                      }`}
                    >
                      {match.redTeamName ?? "미배정"}
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2.5">
                    {editable && onAssign && (
                      <button
                        type="button"
                        onClick={() => onAssign(match)}
                        className={`whitespace-nowrap text-xs ${
                          isUnassigned(match) ? "font-bold text-yellow" : "text-blueText"
                        }`}
                      >
                        팀 배정
                      </button>
                    )}
                    {editable && onDelete && (
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

          {isManager && unassignedCount > 0 && (
            <p className="px-4 py-3 text-xs text-primary2">
              팀이 <span className="text-primary1">미배정</span>인 경기 {unassignedCount}건은
              순위표에 집계되지 않습니다. 팀 배정으로 진영별 팀을 지정해 주세요.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardMatchesTab;
