import { useMemo, useState } from "react";
import { CompetitionMatchTeamItem } from "@/data/types/competition";
import BoardMatchRow from "./BoardMatchRow";

interface Props {
  matches: CompetitionMatchTeamItem[];
  guildId: string;
  isManager: boolean;
  /** 종료된 대회는 경기 편집이 잠긴다(백엔드 assertWritable). */
  locked?: boolean;
  onDelete?: (match: CompetitionMatchTeamItem) => void;
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

const isUnassigned = (match: CompetitionMatchTeamItem) =>
  match.blueTeamId === null && match.redTeamId === null;

const BoardMatchesTab = ({
  matches,
  guildId,
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
          {rows.length > 0 && (
            <button
              type="button"
              onClick={toggleAll}
              className="text-xs text-blueText hover:text-primary1"
            >
              {checked.size > 0 ? "선택 해제" : "전체 선택"}
            </button>
          )}
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

      {rows.length === 0 ? (
        <div className="rounded border border-border2 bg-darkBg2 py-11 text-center text-[13px] text-primary3">
          등록된 경기가 없습니다
        </div>
      ) : (
        <div className="flex min-w-0 flex-col gap-2.5">
          {rows.map((match) => (
            <BoardMatchRow
              key={match.customMatchId}
              match={match}
              guildId={guildId}
              editable={editable}
              checked={checked.has(match.customMatchId)}
              onToggleCheck={() => toggle(match.customMatchId)}
              onAssign={onAssign ? () => onAssign(match) : undefined}
              onDelete={onDelete ? () => onDelete(match) : undefined}
              deleting={deletingId === match.customMatchId}
            />
          ))}
        </div>
      )}

      {isManager && unassignedCount > 0 && (
        <p className="text-xs text-primary2">
          팀이 <span className="text-primary1">미배정</span>인 경기 {unassignedCount}건은 순위표에
          집계되지 않습니다. 팀 배정으로 진영별 팀을 지정해 주세요.
        </p>
      )}
    </div>
  );
};

export default BoardMatchesTab;
