import { ReactNode, useMemo, useState } from "react";
import {
  CompetitionChampionStat,
  CompetitionGameType,
  CompetitionSummary,
  CompetitionUserStat,
} from "@/data/types/competition";
import { Position } from "@/services/statistics";
import { getWinRateColor } from "@/utils/statColors";
import { getChampionSprite } from "@/utils/spriteLoader";
import SpriteImage from "@/components/ui/SpriteImage";
import PlayerNameButton from "@/features/matchHistory/PlayerNameButton";
import PositionFilter from "@/features/statistics/PositionFilter";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { GAME_TYPE_DISPLAY_ORDER, getGameTypeMeta } from "./competitionMeta";

interface Props {
  users: CompetitionUserStat[];
  champions: CompetitionChampionStat[];
  championPosition: Position;
  onChangeChampionPosition: (position: Position) => void;
  isFetchingChampions?: boolean;
  /** 대회 상세의 유형별 활성 경기 수. 상세를 아직 못 받았으면 null */
  matchCounts: Pick<CompetitionSummary, "scrimCount" | "preliminaryCount" | "mainCount"> | null;
}

/** 표본이 적은 참가자가 순위를 흔들지 않도록 프로토타입과 같은 기준을 쓴다. */
const MIN_GAMES = 3;
const PREVIEW_SIZE = 5;
const MAX_SIZE = 10;

const MULTI_KILLS = [
  { key: "penta", label: "펜타", className: "text-yellow" },
  { key: "quadra", label: "쿼드라", className: "text-blueText" },
  { key: "triple", label: "트리플", className: "text-primary1" },
] as const;

type MatchCounts = NonNullable<Props["matchCounts"]>;

const countOf = (counts: MatchCounts, type: CompetitionGameType): number => {
  if (type === "4") return counts.mainCount;
  if (type === "3") return counts.preliminaryCount;
  return counts.scrimCount;
};

const SummaryCard = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex min-h-[116px] flex-col rounded border border-border2 bg-darkBg2 px-4 py-3.5">
    <span className="text-xs text-primary2">{label}</span>
    <div className="mt-1.5 flex flex-1 flex-col">{children}</div>
  </div>
);

const BigNumber = ({ value, unit }: { value: number | string; unit: string }) => (
  <span className="flex items-baseline gap-1">
    <span className="text-[28px] font-bold leading-none tabular-nums text-primary1">{value}</span>
    <span className="text-[13px] text-primary2">{unit}</span>
  </span>
);

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

interface Board {
  title: string;
  note: string;
  rows: BoardRow[];
}

const StatBoard = ({ board }: { board: Board }) => {
  const [expanded, setExpanded] = useState(false);
  const visible = board.rows.slice(0, expanded ? MAX_SIZE : PREVIEW_SIZE);
  const canExpand = board.rows.length > PREVIEW_SIZE;

  return (
    <div className="overflow-hidden rounded border border-border2 bg-darkBg2">
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
        visible.map((row) => (
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
      {canExpand && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="w-full border-t border-border2 py-2 text-xs text-primary2 hover:bg-grayHover hover:text-primary1"
        >
          {expanded ? "접기" : "더보기"}
        </button>
      )}
    </div>
  );
};

const BoardStatsTab = ({
  users,
  champions,
  championPosition,
  onChangeChampionPosition,
  isFetchingChampions = false,
  matchCounts,
}: Props) => {
  const eligible = useMemo(() => users.filter((user) => user.totalCount >= MIN_GAMES), [users]);

  const boards = useMemo(() => {
    /** lowerIsBetter면 오름차순으로 순위를 매기고, 막대는 1위 값 ÷ 내 값으로 줄어든다. */
    const top = (
      title: string,
      note: string,
      pick: (user: CompetitionUserStat) => number,
      format: (user: CompetitionUserStat) => string,
      lowerIsBetter = false
    ): Board => {
      const sorted = [...eligible].sort((a, b) =>
        lowerIsBetter ? pick(a) - pick(b) : pick(b) - pick(a)
      );
      const best = sorted.length > 0 ? pick(sorted[0]) : 0;
      const ratioOf = (value: number) => {
        if (lowerIsBetter) return value > 0 ? Math.max((best / value) * 100, 4) : 100;
        return best > 0 ? Math.max((value / best) * 100, 4) : 0;
      };
      const rows = sorted.map((user, index) => ({
        rank: index + 1,
        user,
        main: format(user),
        ratio: ratioOf(pick(user)),
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
      top(
        "분당 골드",
        "골드 / 플레이 시간",
        (u) => num(u.goldPerMin),
        (u) => Math.round(num(u.goldPerMin)).toLocaleString()
      ),
      top(
        "평균 시야 점수",
        "판당 시야 점수",
        (u) => num(u.avgVisionScore),
        (u) => num(u.avgVisionScore).toFixed(1)
      ),
      top(
        "데스당 딜량",
        "챔피언 피해 / 데스",
        (u) => num(u.damagePerDeath),
        (u) => Math.round(num(u.damagePerDeath)).toLocaleString()
      ),
      top(
        "사망 시간 비율",
        "게임 시간 중 죽어 있던 비율 · 낮을수록 좋음",
        (u) => num(u.deadTimePct),
        (u) => `${num(u.deadTimePct).toFixed(1)}%`,
        true
      ),
      top(
        "총 킬",
        "대회 누적 킬",
        (u) => num(u.kills),
        (u) => num(u.kills).toLocaleString()
      ),
    ];
  }, [eligible]);

  const multiKills = useMemo(
    () =>
      users.reduce(
        (acc, user) => ({
          penta: acc.penta + (user.multiKills?.penta ?? 0),
          quadra: acc.quadra + (user.multiKills?.quadra ?? 0),
          triple: acc.triple + (user.multiKills?.triple ?? 0),
        }),
        { penta: 0, quadra: 0, triple: 0 }
      ),
    [users]
  );

  const totalMatches = matchCounts
    ? matchCounts.mainCount + matchCounts.preliminaryCount + matchCounts.scrimCount
    : null;

  const topChampions = useMemo(
    () => [...champions].sort((a, b) => b.totalCount - a.totalCount).slice(0, 5),
    [champions]
  );

  if (users.length === 0 && champions.length === 0 && championPosition === "ALL") {
    return (
      <div className="rounded border border-border2 bg-darkBg2 py-11 text-center text-[13px] text-primary3">
        집계할 경기가 없습니다
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        <SummaryCard label="총 경기 수">
          <BigNumber value={totalMatches ?? "-"} unit="경기" />
          {matchCounts && (
            <div className="mt-auto pt-3">
              <div className="flex gap-3 text-[11px] text-primary2">
                {GAME_TYPE_DISPLAY_ORDER.map((type) => (
                  <span key={type} className="flex items-center gap-1">
                    {getGameTypeMeta(type).label}
                    <span className="tabular-nums text-primary1">{countOf(matchCounts, type)}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </SummaryCard>

        <SummaryCard label="참가자">
          <BigNumber value={users.length} unit="명" />
          <div className="mt-auto pt-3">
            <span className="text-[11px] text-primary2">
              랭킹 집계 대상 <span className="tabular-nums text-primary1">{eligible.length}명</span>{" "}
              · {MIN_GAMES}판 이상
            </span>
          </div>
        </SummaryCard>

        <SummaryCard label="멀티킬">
          <div className="mt-auto grid grid-cols-3 divide-x divide-border2">
            {MULTI_KILLS.map((item) => {
              const count = multiKills[item.key];
              return (
                <div key={item.key} className="flex flex-col items-center gap-1 py-1">
                  <span
                    className={`text-[26px] font-bold leading-none tabular-nums ${
                      count > 0 ? item.className : "text-primary3"
                    }`}
                  >
                    {count}
                  </span>
                  <span className="text-[11px] text-primary2">{item.label}</span>
                </div>
              );
            })}
          </div>
        </SummaryCard>
      </div>

      <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-2">
        {boards.map((board) => (
          <StatBoard key={board.title} board={board} />
        ))}
      </div>

      <div className="overflow-hidden rounded border border-border2 bg-darkBg2">
        <div className="flex flex-wrap items-center gap-2.5 border-b border-border2 px-4 py-3">
          <span className="text-sm font-bold text-primary1">많이 나온 챔피언 Top 5</span>
          <PositionFilter
            selectedPosition={championPosition}
            onSelectPosition={onChangeChampionPosition}
            className="ml-auto"
          />
        </div>
        {topChampions.length === 0 && isFetchingChampions && <LoadingSpinner />}
        {topChampions.length === 0 && !isFetchingChampions && (
          <div className="px-4 py-8 text-center text-xs text-primary3">
            이 라인에서 플레이된 챔피언이 없습니다
          </div>
        )}
        {topChampions.length > 0 && (
          <div className="relative">
            <div
              className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 ${
                isFetchingChampions ? "opacity-40" : ""
              }`}
            >
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
            {isFetchingChampions && (
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardStatsTab;
