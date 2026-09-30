import { Fragment, useMemo, useState } from "react";
import { CompetitionGameType, CompetitionMatchTeamItem } from "@/data/types/competition";
import BoardMatchRow from "./BoardMatchRow";
import BoardMatchupList from "./BoardMatchupList";
import { GAME_TYPE_DISPLAY_ORDER, getGameTypeMeta } from "./competitionMeta";

interface Props {
  matches: CompetitionMatchTeamItem[];
  /** 팀 대진별 보기의 팀 선택지 */
  teams: { id: number; name: string }[];
  guildId: string;
  isManager: boolean;
  /** 종료된 대회는 경기 편집이 잠긴다(백엔드 assertWritable). */
  locked?: boolean;
  onDelete?: (match: CompetitionMatchTeamItem) => void;
  deletingId?: string | null;
  onAssign?: (match: CompetitionMatchTeamItem) => void;
  /** 실패하면 reject한다(안내는 호출한 쪽의 onError가 맡는다). */
  onChangeGameType?: (
    customMatchIds: string[],
    gameType: CompetitionGameType
  ) => Promise<GameTypeChangeResult>;
  changingGameType?: boolean;
}

type Filter = "ALL" | CompetitionGameType | "UNASSIGNED";

interface FilterItem {
  key: Filter;
  label: string;
  /** 유형 필터만 색 점을 단다 */
  dotClass?: string;
  activeClass: string;
}

const FILTERS: readonly FilterItem[] = [
  { key: "ALL", label: "전체", activeClass: "border-blueText bg-blueText/10" },
  ...GAME_TYPE_DISPLAY_ORDER.map((type) => {
    const meta = getGameTypeMeta(type);
    return {
      key: type,
      label: meta.label,
      dotClass: meta.dotClass,
      activeClass: `${meta.borderClass} ${meta.bgClass}`,
    };
  }),
  { key: "UNASSIGNED", label: "팀 미배정", activeClass: "border-redText/40 bg-redDarken" },
];

type View = "GAMES" | "MATCHUPS";

const VIEWS: readonly { key: View; label: string }[] = [
  { key: "GAMES", label: "게임별" },
  { key: "MATCHUPS", label: "팀 대진별" },
];

const isUnassigned = (match: CompetitionMatchTeamItem) =>
  match.blueTeamId === null && match.redTeamId === null;

export interface GameTypeChangeResult {
  gameType: CompetitionGameType;
  changed: number;
  /** 이미 그 유형이라 서버가 건너뛴 경기 수 */
  skipped: number;
}

type CheckState = "none" | "some" | "all";

const ARIA_CHECKED: Record<CheckState, boolean | "mixed"> = {
  none: false,
  some: "mixed",
  all: true,
};

const checkStateOf = (checkedCount: number, total: number): CheckState => {
  if (checkedCount === 0) return "none";
  return checkedCount === total ? "all" : "some";
};

// BoardMatchRow의 체크박스와 같은 모양. 역할은 감싼 버튼이 갖고 이건 그림만 그린다.
const CheckBox = ({ state }: { state: CheckState }) => (
  <span
    aria-hidden="true"
    className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border ${
      state === "none" ? "border-border1 bg-darkBg1" : "border-bluePrimary bg-bluePrimary"
    }`}
  >
    {state !== "none" && (
      <svg
        className="h-3 w-3 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={3.2}
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d={state === "all" ? "M20 6L9 17l-5-5" : "M6 12h12"} />
      </svg>
    )}
  </span>
);

const GameTypeResultNotice = ({ result }: { result: GameTypeChangeResult }) => {
  const { label } = getGameTypeMeta(result.gameType);
  return (
    <div className="flex flex-wrap items-center gap-x-2 rounded border border-neonGreen/30 bg-neonGreen/[0.06] px-3.5 py-3 text-sm text-neonGreen">
      {result.changed > 0
        ? `${result.changed}경기를 ${label}으로 바꿨습니다`
        : "바뀐 경기가 없습니다"}
      {result.skipped > 0 && (
        <span className="text-[13px] text-primary2">
          · {result.skipped}경기는 이미 {label}
        </span>
      )}
    </div>
  );
};

const BoardMatchesTab = ({
  matches,
  teams,
  guildId,
  isManager,
  locked = false,
  onDelete,
  deletingId,
  onAssign,
  onChangeGameType,
  changingGameType = false,
}: Props) => {
  const [view, setView] = useState<View>("GAMES");
  const [filter, setFilter] = useState<Filter>("ALL");
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<GameTypeChangeResult | null>(null);

  const rows = useMemo(() => {
    if (filter === "ALL") return matches;
    if (filter === "UNASSIGNED") return matches.filter(isUnassigned);
    return matches.filter((match) => match.gameType === filter);
  }, [matches, filter]);

  const counts = useMemo(() => {
    const byKey: Record<Filter, number> = {
      ALL: matches.length,
      "2": 0,
      "3": 0,
      "4": 0,
      UNASSIGNED: 0,
    };
    matches.forEach((match) => {
      if (match.gameType in byKey) byKey[match.gameType as CompetitionGameType] += 1;
      if (isUnassigned(match)) byKey.UNASSIGNED += 1;
    });
    return byKey;
  }, [matches]);
  const unassignedCount = counts.UNASSIGNED;
  const editable = isManager && !locked && view === "GAMES";

  const changeView = (next: View) => {
    setView(next);
    setChecked(new Set());
    setResult(null);
    // 대진은 양 팀이 배정된 경기만 묶으므로 미배정 필터가 의미 없다
    if (next === "MATCHUPS" && filter === "UNASSIGNED") setFilter("ALL");
  };

  const toggle = (id: string) => {
    setResult(null);
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const checkedInView = rows.filter((row) => checked.has(row.customMatchId)).length;
  const selectAll = checkStateOf(checkedInView, rows.length);

  const toggleAll = () => {
    setResult(null);
    setChecked(selectAll === "all" ? new Set() : new Set(rows.map((row) => row.customMatchId)));
  };

  const selectedMatches = useMemo(
    () => matches.filter((match) => checked.has(match.customMatchId)),
    [matches, checked]
  );

  const runGameType = async (gameType: CompetitionGameType) => {
    if (checked.size === 0 || !onChangeGameType) return;
    try {
      const outcome = await onChangeGameType(Array.from(checked), gameType);
      setChecked(new Set());
      setResult(outcome);
    } catch {
      // 실패 안내는 페이지의 onError가 맡는다. 선택은 남겨 다시 시도할 수 있게 한다.
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-lg border border-border2 bg-darkBg2 p-3 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex rounded-md bg-darkBg1 p-1">
            {VIEWS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => changeView(item.key)}
                aria-pressed={view === item.key}
                className={`rounded px-4 py-1.5 text-[13px] transition-colors ${
                  view === item.key
                    ? "bg-rankBg2 font-bold text-primary1"
                    : "text-primary3 hover:text-primary1"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <span className="text-xs text-primary2">
            총 <span className="font-bold tabular-nums text-primary1">{rows.length}</span>경기
          </span>
        </div>

        <div className="h-px bg-border2" aria-hidden="true" />

        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((item) => {
            if (item.key === "UNASSIGNED" && (unassignedCount === 0 || view === "MATCHUPS")) {
              return null;
            }
            const active = filter === item.key;
            // 유형이 아니라 팀 배정 여부로 거르는 필터라, 유형 칩들과 떼어 놓고 점선으로 구분한다
            const isTeamFilter = item.key === "UNASSIGNED";
            return (
              <Fragment key={item.key}>
                {isTeamFilter && <span className="mx-1 h-5 w-px bg-border2" aria-hidden="true" />}
                <button
                  type="button"
                  onClick={() => {
                    setFilter(item.key);
                    setChecked(new Set());
                    setResult(null);
                  }}
                  aria-pressed={active}
                  className={`inline-flex h-8 items-center gap-2 rounded-full border px-3.5 text-[13px] transition-colors ${
                    isTeamFilter ? "border-dashed" : ""
                  } ${
                    active
                      ? `${item.activeClass} font-bold text-primary1`
                      : "border-border2 bg-darkBg1 text-primary2 hover:border-border1 hover:text-primary1"
                  }`}
                >
                  {item.dotClass && (
                    <span className={`h-2 w-2 rounded-full ${item.dotClass}`} aria-hidden="true" />
                  )}
                  {item.label}
                  <span
                    className={`tabular-nums text-xs ${active ? "text-primary2" : "text-primary3"}`}
                  >
                    {counts[item.key]}
                  </span>
                </button>
              </Fragment>
            );
          })}
        </div>
      </div>

      {result && <GameTypeResultNotice result={result} />}

      {editable && rows.length > 0 && (
        <button
          type="button"
          onClick={toggleAll}
          role="checkbox"
          aria-checked={ARIA_CHECKED[selectAll]}
          className="flex items-center gap-2.5 self-start px-1 text-[13px] text-primary2 hover:text-primary1"
        >
          <CheckBox state={selectAll} />
          {filter === "ALL" || filter === "UNASSIGNED" ? (
            <span>
              {filter === "UNASSIGNED" ? "팀 미배정 " : ""}전체 선택{" "}
              <span className="tabular-nums text-primary3">({rows.length}경기)</span>
            </span>
          ) : (
            <span>
              {getGameTypeMeta(filter).label} <span className="tabular-nums">{rows.length}</span>
              경기 전체 선택
            </span>
          )}
        </button>
      )}

      {view === "MATCHUPS" && <BoardMatchupList matches={rows} teams={teams} guildId={guildId} />}

      {view === "GAMES" && rows.length === 0 && (
        <div className="rounded border border-border2 bg-darkBg2 py-11 text-center text-[13px] text-primary3">
          등록된 경기가 없습니다
        </div>
      )}

      {view === "GAMES" && rows.length > 0 && (
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

      {editable && selectedMatches.length > 0 && (
        // 긴 목록 아래쪽에서 골라도 버튼을 찾으러 올라가지 않도록 화면 하단에 붙인다.
        <div
          role="region"
          aria-label="선택한 경기 유형 바꾸기"
          className="sticky bottom-4 z-10 flex flex-wrap items-center gap-x-3.5 gap-y-2.5 rounded-lg border border-bluePrimary/55 bg-darkBg1 px-4 py-3 shadow-[0_10px_30px_theme(colors.black/0.55)]"
        >
          <span className="text-[13px] font-bold tabular-nums text-primary1">
            {selectedMatches.length}경기 선택
          </span>
          <span className="flex flex-wrap items-center gap-2 text-xs text-primary2">
            {GAME_TYPE_DISPLAY_ORDER.map((type) => {
              const count = selectedMatches.filter((match) => match.gameType === type).length;
              if (count === 0) return null;
              const meta = getGameTypeMeta(type);
              return (
                <span key={type} className="flex items-center gap-1">
                  <span className={`h-2 w-2 rounded-full ${meta.dotClass}`} aria-hidden="true" />
                  {meta.label}
                  <span className="font-bold tabular-nums text-primary1">{count}</span>
                </span>
              );
            })}
          </span>
          <button
            type="button"
            onClick={() => setChecked(new Set())}
            className="px-0.5 py-1 text-xs text-primary2 hover:text-primary1"
          >
            선택 해제
          </button>
          <div className="flex flex-wrap items-center gap-1.5 sm:ml-auto">
            <span className="mr-0.5 text-xs text-primary3">유형 바꾸기</span>
            {GAME_TYPE_DISPLAY_ORDER.map((type) => {
              const meta = getGameTypeMeta(type);
              const allSame = selectedMatches.every((match) => match.gameType === type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => runGameType(type)}
                  disabled={allSame || changingGameType}
                  title={allSame ? `선택한 경기가 모두 ${meta.label}입니다` : undefined}
                  className="inline-flex h-8 items-center gap-2 rounded-full border border-border2 bg-darkBg2 px-3.5 text-[13px] text-primary2 transition-colors hover:border-border1 hover:text-primary1 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-border2 disabled:hover:text-primary2"
                >
                  <span className={`h-2 w-2 rounded-full ${meta.dotClass}`} aria-hidden="true" />
                  {meta.label}으로
                </button>
              );
            })}
          </div>
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
