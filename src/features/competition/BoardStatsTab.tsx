import { useMemo } from "react";
import { CompetitionChampionStat, CompetitionUserStat } from "@/data/types/competition";
import { getWinRateColor } from "@/utils/statColors";

interface Props {
  users: CompetitionUserStat[];
  champions: CompetitionChampionStat[];
}

/** 표본이 적은 참가자가 순위를 흔들지 않도록 프로토타입과 같은 기준을 쓴다. */
const MIN_GAMES = 3;
const BOARD_SIZE = 10;

const displayName = (user: CompetitionUserStat) => `${user.riotName}#${user.riotNameTag}`;

const num = (value: string | number): number => {
  const parsed = typeof value === "string" ? parseFloat(value) : value;
  return Number.isFinite(parsed) ? parsed : 0;
};

const BoardStatsTab = ({ users, champions }: Props) => {
  const eligible = useMemo(() => users.filter((user) => user.totalCount >= MIN_GAMES), [users]);

  const boards = useMemo(() => {
    const top = (
      title: string,
      note: string,
      pick: (user: CompetitionUserStat) => number,
      format: (user: CompetitionUserStat) => string
    ) => ({
      title,
      note,
      rows: [...eligible]
        .sort((a, b) => pick(b) - pick(a))
        .slice(0, BOARD_SIZE)
        .map((user, index) => ({
          rank: index + 1,
          name: displayName(user),
          main: format(user),
          sub: `${user.totalCount}판`,
        })),
    });

    return [
      top(
        "KDA",
        "킬 관여 기여도",
        (u) => num(u.kda),
        (u) => num(u.kda).toFixed(2)
      ),
      top(
        "분당 딜량",
        "avgDpm",
        (u) => num(u.avgDpm),
        (u) => Math.round(num(u.avgDpm)).toLocaleString()
      ),
      top(
        "킬 관여율",
        "(킬+어시) / 팀 킬",
        (u) => num(u.killParticipation),
        (u) => `${num(u.killParticipation).toFixed(1)}%`
      ),
      top(
        "딜 비중",
        "팀 챔피언 피해 대비",
        (u) => num(u.damageShare),
        (u) => `${num(u.damageShare).toFixed(1)}%`
      ),
    ];
  }, [eligible]);

  const summary = useMemo(() => {
    const totalGames = users.reduce((sum, user) => sum + user.totalCount, 0);
    const pentas = users.reduce((sum, user) => sum + (user.multiKills?.penta ?? 0), 0);
    const quadras = users.reduce((sum, user) => sum + (user.multiKills?.quadra ?? 0), 0);
    return [
      { label: "참가자", value: String(users.length), className: "text-primary1" },
      { label: "집계 경기 수(인원 합)", value: String(totalGames), className: "text-primary1" },
      { label: "쿼드라 킬", value: String(quadras), className: "text-blueText" },
      { label: "펜타 킬", value: String(pentas), className: "text-yellow" },
    ];
  }, [users]);

  const topChampions = useMemo(
    () => [...champions].sort((a, b) => b.totalCount - a.totalCount).slice(0, 5),
    [champions]
  );

  if (users.length === 0 && champions.length === 0) {
    return (
      <div className="rounded border border-border2 bg-darkBg2 py-11 text-center text-[13px] text-primary3">
        집계할 경기가 없습니다
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-6 rounded border border-border2 bg-darkBg2 px-5 py-4">
        {summary.map((item) => (
          <div key={item.label} className="flex flex-col gap-1">
            <span className="text-[11px] text-primary2">{item.label}</span>
            <span className={`text-[19px] font-bold ${item.className}`}>{item.value}</span>
          </div>
        ))}
        <span className="ml-auto text-xs text-primary3">순위는 {MIN_GAMES}판 이상 참가자 기준</span>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {boards.map((board) => (
          <div
            key={board.title}
            className="overflow-hidden rounded border border-border2 bg-darkBg2"
          >
            <div className="flex items-center gap-2 border-b border-border2 px-4 py-3">
              <span className="text-sm font-bold text-primary1">{board.title}</span>
              <span className="text-[11px] text-primary3">{board.note}</span>
            </div>
            {board.rows.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-primary3">
                {MIN_GAMES}판 이상 참가자가 없습니다
              </div>
            ) : (
              board.rows.map((row) => (
                <div
                  key={row.name}
                  className="grid grid-cols-[28px_1fr_auto] items-center gap-2.5 border-b border-cardBorder px-4 py-2 last:border-0"
                >
                  <span
                    className={`text-center text-xs font-bold ${
                      row.rank <= 3 ? "text-yellow" : "text-primary3"
                    }`}
                  >
                    {row.rank}
                  </span>
                  <span className="truncate text-[13px] text-primary1">{row.name}</span>
                  <span className="whitespace-nowrap text-xs tabular-nums text-primary2">
                    <span className="font-bold text-primary1">{row.main}</span> {row.sub}
                  </span>
                </div>
              ))
            )}
          </div>
        ))}
      </div>

      {topChampions.length > 0 && (
        <div className="overflow-hidden rounded border border-border2 bg-darkBg2">
          <div className="border-b border-border2 px-4 py-3 text-sm font-bold text-primary1">
            많이 나온 챔피언 Top 5
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {topChampions.map((champion) => (
              <div
                key={champion.champNameEng}
                className="flex flex-col items-center gap-2 border-b border-r border-cardBorder p-4 last:border-r-0"
              >
                <span className="text-[13px] text-primary1">{champion.champName}</span>
                <span className="text-xs text-primary2">
                  {champion.totalCount}판 · 승률{" "}
                  <span className={getWinRateColor(champion.winRate)}>
                    {num(champion.winRate).toFixed(1)}%
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardStatsTab;
