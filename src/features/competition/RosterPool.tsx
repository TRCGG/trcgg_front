import { useMemo, useState } from "react";
import {
  COMPETITION_POSITIONS,
  CompetitionApplicationItem,
  CompetitionPosition,
} from "@/data/types/competition";
import { positionLabel, subPositionLabel } from "./competitionMeta";

interface Props {
  applicants: CompetitionApplicationItem[];
  placedCodes: Set<string>;
  picked: CompetitionApplicationItem | null;
  onPick: (applicant: CompetitionApplicationItem | null) => void;
  onDragStart: (applicant: CompetitionApplicationItem) => void;
  onDropToPool: () => void;
  disabled?: boolean;
}

type PosFilter = "ALL" | CompetitionPosition;

const Chip = ({
  applicant,
  dimmed,
  active,
  onPick,
  onDragStart,
  disabled,
}: {
  applicant: CompetitionApplicationItem;
  dimmed?: boolean;
  active: boolean;
  onPick: () => void;
  onDragStart: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    draggable={!disabled}
    onDragStart={onDragStart}
    onClick={onPick}
    disabled={disabled}
    title={`${applicant.riotName}#${applicant.riotNameTag}`}
    className={`flex h-7 items-center gap-1.5 rounded border px-1.5 text-left ${
      active ? "border-blueText bg-blueText/10" : "border-border2 bg-darkBg2"
    } ${dimmed ? "opacity-70" : ""} ${disabled ? "cursor-not-allowed" : "cursor-grab"}`}
  >
    <span className="min-w-0 flex-1 truncate text-xs text-primary1">{applicant.riotName}</span>
    <span
      className={`shrink-0 text-[10px] font-bold ${dimmed ? "text-primary2" : "text-primary1"}`}
    >
      {positionLabel(applicant.mainPosition)}
    </span>
    <span className="shrink-0 text-[10px] text-primary3">
      {subPositionLabel(applicant.subPositions).replace("부 ", "")}
    </span>
    {applicant.captainAvailable && (
      <span
        title="팀장 가능"
        className="h-[5px] w-[5px] shrink-0 rounded-full bg-yellow"
        aria-label="팀장 가능"
      />
    )}
  </button>
);

const RosterPool = ({
  applicants,
  placedCodes,
  picked,
  onPick,
  onDragStart,
  onDropToPool,
  disabled = false,
}: Props) => {
  const [query, setQuery] = useState("");
  const [posFilter, setPosFilter] = useState<PosFilter>("ALL");
  const [expanded, setExpanded] = useState(false);

  const unplaced = useMemo(
    () => applicants.filter((applicant) => !placedCodes.has(applicant.playerCode)),
    [applicants, placedCodes]
  );

  const matchesQuery = (applicant: CompetitionApplicationItem) => {
    const keyword = query.trim().toLowerCase();
    return !keyword || applicant.riotName.toLowerCase().includes(keyword);
  };

  // 주 포지션이 필터와 맞는 사람이 본 목록, 부 포지션으로만 가능한 사람은 아래에 흐리게 따로 둔다.
  const mainPool = useMemo(
    () =>
      unplaced
        .filter((a) => posFilter === "ALL" || a.mainPosition === posFilter)
        .filter(matchesQuery),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [unplaced, posFilter, query]
  );

  const subPool = useMemo(() => {
    if (posFilter === "ALL") return [];
    return unplaced
      .filter(
        (a) =>
          a.mainPosition !== posFilter &&
          (a.subPositions.includes(posFilter) || a.subPositions.includes("ALL"))
      )
      .filter(matchesQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unplaced, posFilter, query]);

  const pickedTitle = picked
    ? `${picked.riotName}#${picked.riotNameTag} · 주 ${positionLabel(picked.mainPosition)} / ${subPositionLabel(picked.subPositions)}${picked.captainAvailable ? " · 팀장 가능" : ""}`
    : "칩을 클릭하면 상세 정보가 표시됩니다";
  const pickedDetail = picked
    ? `${picked.champions.map((c) => c.champName).join(" · ") || "챔피언 미입력"} · ${picked.availableTime || "시간대 미입력"}`
    : "챔피언 · 가능 시간대 · 팀장 여부";

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDropToPool}
      className="flex flex-col gap-2.5 rounded border border-border2 bg-darkBg1 p-3"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[13px] font-bold text-primary1">신청자 풀</span>
        <span className="rounded bg-blueText/10 px-1.5 py-px text-[11px] text-blueText">
          {unplaced.length}
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="소환사명 검색"
          className="h-[30px] w-[190px] rounded border border-border2 bg-darkBg2 px-2.5 text-xs text-primary1 outline-none"
        />
        <div className="flex flex-wrap gap-1">
          {(["ALL", ...COMPETITION_POSITIONS] as PosFilter[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPosFilter(item)}
              className={`rounded border px-2 py-1 text-[11px] ${
                posFilter === item
                  ? "border-blueText bg-blueText/10 text-primary1"
                  : "border-border2 bg-darkBg2 text-primary2"
              }`}
            >
              {item === "ALL" ? "전체" : positionLabel(item)}
            </button>
          ))}
        </div>
        <span className="ml-auto flex items-center gap-2 whitespace-nowrap text-[10px] text-primary3">
          <span>
            주 <span className="text-primary1">/</span> 부
          </span>
          <span className="flex items-center gap-1">
            <span className="h-[5px] w-[5px] rounded-full bg-yellow" />
            팀장 가능
          </span>
        </span>
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="h-[26px] shrink-0 whitespace-nowrap rounded border border-border2 bg-darkBg2 px-2 text-[11px] text-primary1"
        >
          {expanded ? "접기" : "확장"}
        </button>
      </div>

      <div className="flex items-baseline gap-2.5 rounded border border-border2 bg-darkBg2 px-2.5 py-2">
        <span className="truncate text-xs text-primary1">{pickedTitle}</span>
        <span className="truncate text-[11px] text-primary3">{pickedDetail}</span>
      </div>

      <div
        className="grid content-start gap-1 overflow-y-auto pr-0.5"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(212px, 1fr))",
          maxHeight: expanded ? 620 : 288,
        }}
      >
        {mainPool.length === 0 ? (
          <div className="col-span-full px-2 py-5 text-center text-xs text-primary3">
            {query.trim()
              ? `"${query.trim()}" 검색 결과가 없습니다`
              : "해당 포지션의 미배치 신청자가 없습니다"}
          </div>
        ) : (
          mainPool.map((applicant) => (
            <Chip
              key={applicant.playerCode}
              applicant={applicant}
              active={picked?.playerCode === applicant.playerCode}
              onPick={() => onPick(picked?.playerCode === applicant.playerCode ? null : applicant)}
              onDragStart={() => onDragStart(applicant)}
              disabled={disabled}
            />
          ))
        )}
      </div>

      {subPool.length > 0 && (
        <>
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-[11px] text-primary3">
              {positionLabel(posFilter as CompetitionPosition)} 부 포지션 가능 {subPool.length}명
            </span>
            <span className="h-px flex-1 bg-rankBg2" />
          </div>
          <div
            className="grid max-h-[196px] content-start gap-1 overflow-y-auto pr-0.5"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(212px, 1fr))" }}
          >
            {subPool.map((applicant) => (
              <Chip
                key={applicant.playerCode}
                applicant={applicant}
                dimmed
                active={picked?.playerCode === applicant.playerCode}
                onPick={() =>
                  onPick(picked?.playerCode === applicant.playerCode ? null : applicant)
                }
                onDragStart={() => onDragStart(applicant)}
                disabled={disabled}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RosterPool;
