import { useMemo, useState } from "react";
import { CompetitionGameType, CompetitionMatchTeamItem } from "@/data/types/competition";
import BoardMatchRow from "./BoardMatchRow";
import { GAME_TYPE_DISPLAY_ORDER, getGameTypeMeta, isCompetitionGameType } from "./competitionMeta";

interface TeamOption {
  id: number;
  name: string;
}

interface Props {
  /** 유형 필터를 거친 경기. 양 진영이 모두 팀에 귀속된 경기만 집계된다 */
  matches: CompetitionMatchTeamItem[];
  teams: TeamOption[];
  guildId: string;
}

interface Side {
  teamId: number;
  name: string;
  wins: number;
}

interface Matchup {
  key: string;
  left: Side;
  right: Side;
  /** 승자 진영이 팀에 귀속되지 않아 승패를 알 수 없는 경기 수 */
  unknown: number;
  games: CompetitionMatchTeamItem[];
  lastDate: string;
}

// 시리즈(bo3 등) 개념이 백엔드에 없어, 같은 두 팀이 붙은 경기를 묶어 승수를 센다
const buildMatchups = (matches: CompetitionMatchTeamItem[]): Matchup[] => {
  const map = new Map<string, Matchup>();

  matches.forEach((match) => {
    const { blueTeamId, redTeamId } = match;
    if (blueTeamId === null || redTeamId === null) return;

    const [aId, bId] = blueTeamId < redTeamId ? [blueTeamId, redTeamId] : [redTeamId, blueTeamId];
    const key = `${aId}:${bId}`;
    const nameOf = (id: number) =>
      (id === blueTeamId ? match.blueTeamName : match.redTeamName) ?? "알 수 없는 팀";

    let matchup = map.get(key);
    if (!matchup) {
      matchup = {
        key,
        left: { teamId: aId, name: nameOf(aId), wins: 0 },
        right: { teamId: bId, name: nameOf(bId), wins: 0 },
        unknown: 0,
        games: [],
        lastDate: match.date,
      };
      map.set(key, matchup);
    }

    if (match.winnerTeamId === aId) matchup.left.wins += 1;
    else if (match.winnerTeamId === bId) matchup.right.wins += 1;
    else matchup.unknown += 1;

    matchup.games.push(match);
    if (match.date > matchup.lastDate) matchup.lastDate = match.date;
  });

  return Array.from(map.values()).sort((a, b) => b.lastDate.localeCompare(a.lastDate));
};

const flip = (matchup: Matchup): Matchup => ({
  ...matchup,
  left: matchup.right,
  right: matchup.left,
});

/** 기준 팀이 있으면 그 팀을 왼쪽에, 없으면 앞선 팀을 왼쪽에 둬 "3 : 1"처럼 읽히게 한다 */
const orient = (matchup: Matchup, pivotId: number | null): Matchup => {
  if (pivotId !== null) return matchup.right.teamId === pivotId ? flip(matchup) : matchup;
  return matchup.right.wins > matchup.left.wins ? flip(matchup) : matchup;
};

const scoreClass = (mine: number, theirs: number) => {
  if (mine > theirs) return "text-blueText";
  if (mine < theirs) return "text-redText";
  return "text-primary1";
};

/** 기준 팀(left) 관점의 유형별 승패 */
const splitByType = (matchup: Matchup) =>
  GAME_TYPE_DISPLAY_ORDER.map((type: CompetitionGameType) => {
    const games = matchup.games.filter(
      (game) => isCompetitionGameType(game.gameType) && game.gameType === type
    );
    return {
      type,
      games: games.length,
      win: games.filter((game) => game.winnerTeamId === matchup.left.teamId).length,
      lose: games.filter((game) => game.winnerTeamId === matchup.right.teamId).length,
    };
  }).filter((split) => split.games > 0);

const Score = ({
  left,
  right,
  large = false,
}: {
  left: number;
  right: number;
  large?: boolean;
}) => (
  <span className={`font-bold tabular-nums ${large ? "text-[28px]" : "text-xl"}`}>
    <span className={scoreClass(left, right)}>{left}</span>
    <span className="mx-2 text-primary3">:</span>
    <span className={scoreClass(right, left)}>{right}</span>
  </span>
);

const GameList = ({ games, guildId }: { games: CompetitionMatchTeamItem[]; guildId: string }) => (
  <div className="flex flex-col gap-2">
    {games.map((match) => (
      <BoardMatchRow
        key={match.customMatchId}
        match={match}
        guildId={guildId}
        editable={false}
        checked={false}
        onToggleCheck={() => {}}
        deleting={false}
      />
    ))}
  </div>
);

const SELECT_CLASS =
  "h-9 min-w-0 flex-1 rounded border border-border2 bg-darkBg1 px-3 text-[13px] text-primary1 outline-none focus:border-blueText2 sm:w-44 sm:flex-none";

const BoardMatchupList = ({ matches, teams, guildId }: Props) => {
  const [teamA, setTeamA] = useState<number | null>(null);
  const [teamB, setTeamB] = useState<number | null>(null);
  const [openKey, setOpenKey] = useState<string | null>(null);

  const matchups = useMemo(() => buildMatchups(matches), [matches]);

  // 팀 A만 고르면 A의 상대별 전적, 둘 다 고르면 그 맞대결만 남긴다
  const visible = useMemo(() => {
    const pivot = teamA ?? teamB;
    const other = teamA !== null ? teamB : null;
    return matchups
      .filter((matchup) => {
        const ids = [matchup.left.teamId, matchup.right.teamId];
        if (pivot !== null && !ids.includes(pivot)) return false;
        if (other !== null && !ids.includes(other)) return false;
        return true;
      })
      .map((matchup) => orient(matchup, pivot));
  }, [matchups, teamA, teamB]);

  const isHeadToHead = teamA !== null && teamB !== null;
  const headToHead = isHeadToHead ? (visible[0] ?? null) : null;
  const nameOf = (id: number | null) => teams.find((team) => team.id === id)?.name ?? "";

  const selectTeam = (slot: "A" | "B", value: string) => {
    const id = value === "" ? null : Number(value);
    if (slot === "A") setTeamA(id);
    else setTeamB(id);
    setOpenKey(null);
  };

  const renderBody = () => {
    if (isHeadToHead) {
      if (!headToHead) {
        return (
          <div className="rounded border border-border2 bg-darkBg2 py-11 text-center text-[13px] text-primary3">
            {nameOf(teamA)} vs {nameOf(teamB)} 맞대결 기록이 없습니다
          </div>
        );
      }
      const splits = splitByType(headToHead);
      return (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col items-center gap-4 rounded-lg border border-blueText2 bg-darkBg2 px-4 py-6">
            <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4">
              <span className="truncate text-right text-lg font-bold text-primary1">
                {headToHead.left.name}
              </span>
              <Score left={headToHead.left.wins} right={headToHead.right.wins} large />
              <span className="truncate text-lg font-bold text-primary1">
                {headToHead.right.name}
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {splits.map((split) => {
                const meta = getGameTypeMeta(split.type);
                return (
                  <span
                    key={split.type}
                    className="inline-flex items-center gap-2 rounded-full border border-border2 bg-darkBg1 px-3 py-1 text-xs text-primary2"
                  >
                    <span className={`h-2 w-2 rounded-full ${meta.dotClass}`} aria-hidden="true" />
                    {meta.label}
                    <span className="tabular-nums text-primary1">
                      {split.win}승 {split.lose}패
                    </span>
                  </span>
                );
              })}
              {headToHead.unknown > 0 && (
                <span className="rounded-full border border-border2 bg-darkBg1 px-3 py-1 text-xs text-primary3">
                  승패 미상 {headToHead.unknown}
                </span>
              )}
            </div>
          </div>
          <GameList games={headToHead.games} guildId={guildId} />
        </div>
      );
    }

    if (visible.length === 0) {
      return (
        <div className="rounded border border-border2 bg-darkBg2 py-11 text-center text-[13px] text-primary3">
          {teamA !== null || teamB !== null
            ? `${nameOf(teamA ?? teamB)}의 대진 기록이 없습니다`
            : "양 팀이 모두 배정된 경기가 없습니다"}
        </div>
      );
    }

    return (
      <div className="flex min-w-0 flex-col gap-2.5">
        {visible.map((matchup) => {
          const isOpen = openKey === matchup.key;
          const { left, right } = matchup;
          return (
            <div key={matchup.key} className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setOpenKey(isOpen ? null : matchup.key)}
                aria-expanded={isOpen}
                className={`grid w-full grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-lg border bg-darkBg2 px-4 py-3.5 text-left transition-opacity hover:opacity-90 ${
                  isOpen ? "border-blueText2" : "border-border2"
                }`}
              >
                <span className="truncate text-right text-[15px] font-bold text-primary1">
                  {left.name}
                </span>
                <span className="flex flex-col items-center gap-0.5">
                  <Score left={left.wins} right={right.wins} />
                  <span className="text-[11px] text-primary3">
                    {matchup.games.length}경기
                    {matchup.unknown > 0 && ` · 승패 미상 ${matchup.unknown}`}
                  </span>
                </span>
                <span className="truncate text-[15px] font-bold text-primary1">{right.name}</span>
              </button>
              {isOpen && (
                <div className="border-l-2 border-border2 pl-3">
                  <GameList games={matchup.games} guildId={guildId} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border2 bg-darkBg2 px-3 py-2.5 sm:px-4">
        <span className="mr-1 text-xs text-primary2">팀 선택</span>
        <select
          aria-label="팀 A"
          value={teamA ?? ""}
          onChange={(e) => selectTeam("A", e.target.value)}
          className={SELECT_CLASS}
        >
          <option value="">전체 팀</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id} disabled={team.id === teamB}>
              {team.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => {
            setTeamA(teamB);
            setTeamB(teamA);
          }}
          disabled={teamA === null && teamB === null}
          aria-label="두 팀 순서 바꾸기"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-border2 bg-darkBg1 text-primary2 hover:text-primary1 disabled:opacity-40"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M7 16H3m0 0l4 4m-4-4l4-4M17 8h4m0 0l-4-4m4 4l-4 4" />
          </svg>
        </button>
        <select
          aria-label="팀 B"
          value={teamB ?? ""}
          onChange={(e) => selectTeam("B", e.target.value)}
          className={SELECT_CLASS}
        >
          <option value="">전체 상대</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id} disabled={team.id === teamA}>
              {team.name}
            </option>
          ))}
        </select>
        {(teamA !== null || teamB !== null) && (
          <button
            type="button"
            onClick={() => {
              setTeamA(null);
              setTeamB(null);
            }}
            className="ml-auto text-xs text-blueText hover:text-primary1"
          >
            선택 해제
          </button>
        )}
      </div>
      {renderBody()}
    </div>
  );
};

export default BoardMatchupList;
