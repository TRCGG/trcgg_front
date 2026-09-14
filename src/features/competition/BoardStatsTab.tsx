import { useMemo } from "react";
import { CompetitionChampionStat, CompetitionUserStat } from "@/data/types/competition";
import { getWinRateColor } from "@/utils/statColors";
import { getChampionSprite } from "@/utils/spriteLoader";
import SpriteImage from "@/components/ui/SpriteImage";
import PlayerNameButton from "@/features/matchHistory/PlayerNameButton";

interface Props {
  users: CompetitionUserStat[];
  champions: CompetitionChampionStat[];
}

/** 표본이 적은 참가자가 순위를 흔들지 않도록 프로토타입과 같은 기준을 쓴다. */
const MIN_GAMES = 3;
const BOARD_SIZE = 10;

const num = (value: string | number): number => {
  const parsed = typeof value === "string" ? parseFloat(value) : value;
  return Number.isFinite(parsed) ? parsed : 0;
};

const userKey = (user: CompetitionUserStat) => `${user.riotName}#${user.riotNameTag}`;

/** 1·2·3위만 메달색 원형 뱃지. 나머지는 숫자만. */
const rankClass = (rank: number): string => {
  if (rank === 1) return "bg-yellow/[0.16] text-yellow";
  if (rank === 2) return "bg-primary1/[0.14] text-primary1";
  if (rank === 3) return "bg-damageAmberFrom/[0.16] text-damageAmberFrom";
  return "text-primary3";
};

interface BoardRow {
  rank: number;
  user: CompetitionUserStat;
  main: string;
  /** 1위 대비 비율(%). 행 배경 막대 길이로 쓴다. */
  ratio: number;
}

const BoardStatsTab = ({ users, champions }: Props) => {
  const eligible = useMemo(() => users.filter((user) => user.totalCount >= MIN_GAMES), [users]);

  const boards = useMemo(() => {
    const top = (
      title: string,
      note: string,
      pick: (user: CompetitionUserStat) => number,
      format: (user: CompetitionUserStat) => string
    ) => {
      const sorted = [...eligible].sort((a, b) => pick(b) - pick(a)).slice(0, BOARD_SIZE);
      const best = sorted.length > 0 ? pick(sorted[0]) : 0;
      const rows: BoardRow[] = sorted.map((user, index) => ({
        rank: index + 1,
        user,
        main: format(user),
        ratio: best > 0 ? Math.max((pick(user) / best) * 100, 4) : 0,
      }));
      return { title, note, rows };
    };

    return [
      top(
        "KDA",
        "(킬+어시) / 데스",
        (u) => num(u.kda),
        (u) => num(u.kda).toFixed(2)
      ),
      top(
        "분당 딜량",
        "챔피언에게 넣은 피해",
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
    const pentas = users.reduce((sum, user) => sum + (user.multiKills?.penta ?? 0), 0);
    const quadras = users.reduce((sum, user) => sum + (user.multiKills?.quadra ?? 0), 0);
    return [
      { label: "참가자", value: String(users.length), className: "text-primary1" },
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
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {summary.map((item) => (
          <div
            key={item.label}
            className="flex flex-col gap-1 rounded border border-border2 bg-darkBg2 px-4 py-3.5"
          >
            <span className="text-[11px] text-primary2">{item.label}</span>
            <span className={`text-[22px] font-bold leading-tight tabular-nums ${item.className}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {boards.map((board) => (
          <div
            key={board.title}
            className="overflow-hidden rounded border border-border2 bg-darkBg2"
          >
            <div className="flex items-baseline gap-2 border-b border-border2 px-4 py-3">
              <span className="text-sm font-bold text-primary1">{board.title}</span>
              <span className="text-[11px] text-primary3">{board.note}</span>
              <span className="ml-auto text-[11px] text-primary3">{MIN_GAMES}판 이상</span>
            </div>
            {board.rows.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-primary3">
                {MIN_GAMES}판 이상 참가자가 없습니다
              </div>
            ) : (
              board.rows.map((row) => (
                <div
                  key={userKey(row.user)}
                  className="relative border-b border-cardBorder last:border-0"
                >
                  {/* 1위 대비 비율 막대. 숫자만으로는 격차가 잘 안 읽힌다. */}
                  <div
                    className="absolute inset-y-0 left-0 bg-blueText/[0.06]"
                    style={{ width: `${row.ratio}%` }}
                    aria-hidden="true"
                  />
                  <div className="relative grid grid-cols-[26px_1fr_auto] items-center gap-2.5 px-4 py-2">
                    <span
                      className={`flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11px] font-bold tabular-nums ${rankClass(
                        row.rank
                      )}`}
                    >
                      {row.rank}
                    </span>
                    <PlayerNameButton
                      name={row.user.riotName}
                      tag={row.user.riotNameTag}
                      isCenter={false}
                      className="text-[13px] text-primary1 hover:text-blueText"
                    />
                    <span className="whitespace-nowrap text-xs tabular-nums text-primary3">
                      <span className="text-[13px] font-bold text-primary1">{row.main}</span>{" "}
                      {row.user.totalCount}판
                    </span>
                  </div>
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
                className="flex flex-col items-center gap-2 border-b border-r border-cardBorder px-3 py-4 last:border-r-0"
              >
                <SpriteImage
                  spriteData={getChampionSprite(champion.champNameEng)}
                  width={48}
                  height={48}
                  alt={champion.champName}
                  fallbackSrc={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/champion/${champion.champNameEng}.png`}
                  className="h-12 w-12 rounded-md"
                />
                <span className="max-w-full truncate text-[13px] text-primary1">
                  {champion.champName}
                </span>
                <span className="text-[11px] text-primary2">
                  {champion.totalCount}판 · {champion.win}승 {champion.lose}패
                </span>
                <span className={`text-xs font-bold ${getWinRateColor(champion.winRate)}`}>
                  승률 {num(champion.winRate).toFixed(1)}%
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
