import { useMemo, useState } from "react";
import { CompetitionMatchTeamItem } from "@/data/types/competition";
import BoardMatchRow from "./BoardMatchRow";

interface Props {
  /** 유형 필터를 거친 경기. 양 진영이 모두 팀에 귀속된 경기만 집계된다 */
  matches: CompetitionMatchTeamItem[];
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

  return Array.from(map.values())
    .map((matchup) =>
      // 앞선 팀을 왼쪽에 둬 스코어가 "3 : 1"처럼 읽히게 한다
      matchup.right.wins > matchup.left.wins
        ? { ...matchup, left: matchup.right, right: matchup.left }
        : matchup
    )
    .sort((a, b) => b.lastDate.localeCompare(a.lastDate));
};

const scoreClass = (mine: number, theirs: number) => {
  if (mine > theirs) return "text-blueText";
  if (mine < theirs) return "text-redText";
  return "text-primary1";
};

const BoardMatchupList = ({ matches, guildId }: Props) => {
  const matchups = useMemo(() => buildMatchups(matches), [matches]);
  const [openKey, setOpenKey] = useState<string | null>(null);

  if (matchups.length === 0) {
    return (
      <div className="rounded border border-border2 bg-darkBg2 py-11 text-center text-[13px] text-primary3">
        양 팀이 모두 배정된 경기가 없습니다
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-2.5">
      {matchups.map((matchup) => {
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
                <span className="text-xl font-bold tabular-nums">
                  <span className={scoreClass(left.wins, right.wins)}>{left.wins}</span>
                  <span className="mx-2 text-primary3">:</span>
                  <span className={scoreClass(right.wins, left.wins)}>{right.wins}</span>
                </span>
                <span className="text-[11px] text-primary3">
                  {matchup.games.length}경기
                  {matchup.unknown > 0 && ` · 승패 미상 ${matchup.unknown}`}
                </span>
              </span>
              <span className="truncate text-[15px] font-bold text-primary1">{right.name}</span>
            </button>

            {isOpen && (
              <div className="flex flex-col gap-2 border-l-2 border-border2 pl-3">
                {matchup.games.map((match) => (
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
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BoardMatchupList;
