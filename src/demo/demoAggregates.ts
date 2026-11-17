import type {
  FrequentOpponent,
  H2HAgainst,
  H2HCandidate,
  H2HDetail,
  H2HDuoChamp,
  H2HInsight,
  H2HLaneCombo,
  H2HLaneMatrix,
  H2HMatchup,
  H2HMetrics,
  H2HProfile,
  H2HRecent,
  H2HRecentDetailMetrics,
  H2HResult,
  H2HTogether,
  LanePosition,
} from "@/data/types/h2h";
import type {
  ChampionCombination,
  ChampionCombinationType,
  ClanActivity,
  ClanDuo,
  HighlightCategory,
  HighlightEntry,
  Highlights,
  LeaderboardChampionStat,
  LeaderboardUser,
  RisingStar,
  WinStreak,
} from "@/data/types/leaderboard";
import type {
  GameParticipant,
  LineStats,
  MatchDashboardData,
  MostPickStats,
  MostPicksData,
  MultiplePlayerInfo,
  RecentGameRecord,
  SynergyStats,
} from "@/data/types/record";
import type { ChampionStatistics, UserStatistics } from "@/data/types/statistics";
import type { PlayerInfo } from "@/data/types/user";
import { DemoDataset, DemoParticipant, DemoPlayer, LANES, getDemoDataset } from "@/demo/demoData";

type Position = LanePosition | "ALL";

const DAY_MS = 24 * 60 * 60 * 1000;
const RECENT_DAYS = 30;
const MIN_GAMES_FOR_RATE = 5;
const TOP_N = 5;

const round = (value: number, digits: number) => {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
};

const ratio = (wins: number, total: number) => (total === 0 ? 0 : (wins * 100) / total);

/** 백엔드 통계 SQL과 같은 모양: winRate·kda는 소수 둘째 자리 문자열, 무사망은 9999 */
const statOf = (rows: DemoParticipant[]) => {
  const win = rows.filter((r) => r.gameResult === "승").length;
  const kills = rows.reduce((s, r) => s + r.kill, 0);
  const deaths = rows.reduce((s, r) => s + r.death, 0);
  const assists = rows.reduce((s, r) => s + r.assist, 0);
  return {
    totalCount: rows.length,
    win,
    lose: rows.length - win,
    winRate: ratio(win, rows.length).toFixed(2),
    kda: deaths === 0 ? "9999" : ((kills + assists) / deaths).toFixed(2),
  };
};

/** 95% 윌슨 신뢰구간 하한(0~1) — 백엔드 wilsonScore와 같은 식 */
const wilson = (wins: number, total: number) => {
  if (total === 0) return 0;
  const p = wins / total;
  const z2 = 3.8416;
  return (
    (p + z2 / (2 * total) - 1.96 * Math.sqrt((p * (1 - p) + z2 / (4 * total)) / total)) /
    (1 + z2 / total)
  );
};

const groupBy = <T>(rows: T[], key: (row: T) => string) => {
  const map = new Map<string, T[]>();
  rows.forEach((row) => {
    const k = key(row);
    const list = map.get(k);
    if (list) list.push(row);
    else map.set(k, [row]);
  });
  return map;
};

const allRows = (data: DemoDataset) => data.matches.flatMap((m) => m.participants);

const toPlayer = (p: { playerCode: string; riotName: string; riotNameTag: string }) => ({
  playerCode: p.playerCode,
  riotName: p.riotName,
  riotNameTag: p.riotNameTag,
});

const toPlayerInfo = (p: DemoPlayer): PlayerInfo => ({
  ...toPlayer(p),
  isMain: true,
  guildId: "demo",
  createDate: "2026-01-01T00:00:00.000Z",
  updateDate: "2026-01-01T00:00:00.000Z",
  isDeleted: false,
});

const findPlayers = (data: DemoDataset, riotName: string, riotNameTag?: string | null) =>
  data.players.filter(
    (p) =>
      p.riotName.toLowerCase() === riotName.toLowerCase() &&
      (!riotNameTag || p.riotNameTag.toLowerCase() === riotNameTag.toLowerCase())
  );

interface PeriodFilter {
  datePreset?: string | null;
  season?: string | null;
  fromMonth?: string | null;
  toMonth?: string | null;
}

/** recent = 최근 30일, season = 해당 연도, range = 해당 연도의 월 범위 */
const inPeriod = (data: DemoDataset, period: PeriodFilter) => {
  const preset = period.datePreset ?? "recent";
  if (preset === "season" || preset === "range") {
    const season = period.season ?? String(new Date(data.now).getFullYear());
    const from = Number(period.fromMonth ?? 1);
    const to = Number(period.toMonth ?? 12);
    return (row: DemoParticipant) => {
      const d = new Date(row.createDate);
      if (row.season !== season) return false;
      if (preset === "range") return d.getMonth() + 1 >= from && d.getMonth() + 1 <= to;
      return true;
    };
  }
  const since = data.now - RECENT_DAYS * DAY_MS;
  return (row: DemoParticipant) => new Date(row.createDate).getTime() >= since;
};

const byPosition = (position?: string | null) => (row: DemoParticipant) =>
  !position || position === "ALL" || row.position === position;

const stripExtra = ({ extra, playerCode, ...rest }: DemoParticipant): GameParticipant => rest;

const linesOf = (rows: DemoParticipant[]): LineStats[] =>
  Array.from(groupBy(rows, (r) => r.position))
    .map(([position, list]) => ({ position: position as LanePosition, ...statOf(list) }))
    .sort((a, b) => b.totalCount - a.totalCount);

const mostPicksOf = (rows: DemoParticipant[]): MostPickStats[] =>
  Array.from(groupBy(rows, (r) => r.champNameEng))
    .map(([, list]) => ({
      champName: list[0].champName,
      champNameEng: list[0].champNameEng,
      ...statOf(list),
    }))
    .sort((a, b) => b.totalCount - a.totalCount);

// ── 소환사 전적 ─────────────────────────────────────────────

export const searchMembers = (riotName: string, riotNameTag?: string | null): PlayerInfo[] => {
  const q = riotName.toLowerCase();
  return getDemoDataset()
    .players.filter(
      (p) =>
        p.riotName.toLowerCase().includes(q) &&
        (!riotNameTag || p.riotNameTag.toLowerCase().startsWith(riotNameTag.toLowerCase()))
    )
    .map(toPlayerInfo);
};

export const dashboard = (
  riotName: string,
  riotNameTag?: string | null
): MatchDashboardData | MultiplePlayerInfo[] | null => {
  const data = getDemoDataset();
  const found = findPlayers(data, riotName, riotNameTag);
  if (!riotNameTag) return found.map(toPlayer);
  const player = found[0];
  if (!player) return null;

  const rows = allRows(data).filter((r) => r.playerCode === player.playerCode);
  const myGames = new Map(rows.map((r) => [r.gameId, r.gameTeam]));
  const mates = allRows(data).filter(
    (r) => r.playerCode !== player.playerCode && myGames.get(r.gameId) === r.gameTeam
  );
  const synergy: SynergyStats[] = Array.from(groupBy(mates, (r) => r.playerCode))
    .map(([, list]) => ({
      riotName: list[0].riotName,
      riotNameTag: list[0].riotNameTag,
      ...statOf(list),
    }))
    .sort((a, b) => b.totalCount - a.totalCount);

  return {
    member: { ...toPlayerInfo(player) },
    summary: statOf(rows),
    lines: linesOf(rows),
    mostPicks: mostPicksOf(rows),
    synergy,
  };
};

export const recentGames = (riotName: string, riotNameTag?: string | null): RecentGameRecord[] => {
  const data = getDemoDataset();
  const player = findPlayers(data, riotName, riotNameTag)[0];
  if (!player) return [];
  return allRows(data)
    .filter((r) => r.playerCode === player.playerCode)
    .sort((a, b) => b.createDate.localeCompare(a.createDate))
    .map((r) => ({
      ...stripExtra(r),
      gameType: "1",
      competitionId: null,
      competitionName: null,
      teamName: null,
      opponentTeamName: null,
    }));
};

export const mostPicks = (
  riotName: string,
  params: PeriodFilter & { position?: string | null }
): MostPicksData => {
  const data = getDemoDataset();
  const player = findPlayers(data, riotName)[0];
  if (!player) return { mostPicks: [], lines: [] };
  const rows = allRows(data)
    .filter((r) => r.playerCode === player.playerCode)
    .filter(inPeriod(data, params));
  return {
    mostPicks: mostPicksOf(rows.filter(byPosition(params.position))),
    lines: linesOf(rows),
  };
};

export const gameDetail = (gameId: string): GameParticipant[] | null => {
  const match = getDemoDataset().matches.find((m) => m.gameId === gameId);
  return match ? match.participants.map(stripExtra) : null;
};

// ── 유저·챔피언 분석 ────────────────────────────────────────

export const userStatistics = (
  params: PeriodFilter & { position?: string | null }
): UserStatistics[] => {
  const data = getDemoDataset();
  const rows = allRows(data).filter(inPeriod(data, params)).filter(byPosition(params.position));
  return Array.from(groupBy(rows, (r) => r.playerCode))
    .map(([, list]) => ({
      ...toPlayer(list[0]),
      position: linesOf(list)[0].position,
      ...statOf(list),
    }))
    .filter((u) => u.totalCount >= MIN_GAMES_FOR_RATE)
    .sort((a, b) => Number(b.winRate) - Number(a.winRate) || b.totalCount - a.totalCount);
};

export const championStatistics = (
  params: PeriodFilter & { position?: string | null }
): ChampionStatistics[] => {
  const data = getDemoDataset();
  const rows = allRows(data).filter(inPeriod(data, params)).filter(byPosition(params.position));
  return Array.from(groupBy(rows, (r) => `${r.champNameEng}|${r.position}`))
    .map(([, list]) => ({
      champName: list[0].champName,
      champNameEng: list[0].champNameEng,
      position: list[0].position,
      ...statOf(list),
    }))
    .filter((c) => c.totalCount >= MIN_GAMES_FOR_RATE)
    .sort((a, b) => Number(b.winRate) - Number(a.winRate) || b.totalCount - a.totalCount);
};

// ── 리더보드 (최근 30일) ────────────────────────────────────

const recentRows = (data: DemoDataset) => allRows(data).filter(inPeriod(data, {}));

export const leaderboardUsers = (position: Position, sortBy: string): LeaderboardUser[] => {
  const data = getDemoDataset();
  const rows = recentRows(data).filter(byPosition(position));
  const users = Array.from(groupBy(rows, (r) => r.playerCode)).map(([, list]) => {
    const stat = statOf(list);
    return { ...toPlayer(list[0]), ...stat, wilsonScore: wilson(stat.win, stat.totalCount) };
  });
  if (sortBy === "wilsonScore") {
    return users
      .filter((u) => u.totalCount >= MIN_GAMES_FOR_RATE)
      .sort((a, b) => b.wilsonScore - a.wilsonScore)
      .slice(0, TOP_N);
  }
  return users.sort((a, b) => b.totalCount - a.totalCount).slice(0, TOP_N);
};

export const leaderboardChampions = (
  position: Position,
  sortBy: string
): LeaderboardChampionStat[] => {
  const data = getDemoDataset();
  const rows = recentRows(data);
  const totalMatches = new Set(rows.map((r) => r.gameId)).size;
  const champs = Array.from(groupBy(rows.filter(byPosition(position)), (r) => r.champNameEng)).map(
    ([, list]) => {
      const stat = statOf(list);
      const matchCount = new Set(list.map((r) => r.gameId)).size;
      return {
        champName: list[0].champName,
        champNameEng: list[0].champNameEng,
        position: position === "ALL" ? undefined : position,
        ...stat,
        matchCount,
        totalMatches,
        pickRate: round(ratio(matchCount, totalMatches), 2),
        wilsonScore: wilson(stat.win, stat.totalCount),
      };
    }
  );
  if (sortBy === "wilsonScore") {
    return champs
      .filter((c) => c.totalCount >= MIN_GAMES_FOR_RATE)
      .sort((a, b) => b.wilsonScore - a.wilsonScore)
      .slice(0, TOP_N);
  }
  return champs.sort((a, b) => b.pickRate - a.pickRate).slice(0, TOP_N);
};

/** 같은 경기·같은 팀의 두 라인 쌍 */
const pairsOf = (data: DemoDataset, lanes: [LanePosition, LanePosition]) =>
  data.matches
    .filter((m) => m.date.getTime() >= data.now - RECENT_DAYS * DAY_MS)
    .flatMap((m) =>
      (["blue", "red"] as const).map((side) => {
        const team = m.participants.filter((p) => p.gameTeam === side);
        return {
          won: m.winner === side,
          a: team.find((p) => p.position === lanes[0])!,
          b: team.find((p) => p.position === lanes[1])!,
        };
      })
    );

export const championCombinations = (type: ChampionCombinationType): ChampionCombination[] => {
  const data = getDemoDataset();
  const lanes: [LanePosition, LanePosition] = type === "ADCSUP" ? ["ADC", "SUP"] : ["MID", "JUG"];
  return Array.from(groupBy(pairsOf(data, lanes), (p) => `${p.a.champNameEng}|${p.b.champNameEng}`))
    .map(([, list]) => {
      const win = list.filter((p) => p.won).length;
      return {
        champions: [list[0].a, list[0].b].map((c) => ({
          champName: c.champName,
          champNameEng: c.champNameEng,
          position: c.position,
        })),
        totalCount: list.length,
        win,
        lose: list.length - win,
        winRate: round(ratio(win, list.length), 2),
        wilsonScore: wilson(win, list.length),
        playerPairCount: new Set(list.map((p) => `${p.a.playerCode}|${p.b.playerCode}`)).size,
      };
    })
    .filter((c) => c.totalCount >= 2)
    .sort((a, b) => b.wilsonScore - a.wilsonScore)
    .slice(0, TOP_N);
};

export const clanDuos = (): ClanDuo[] => {
  const data = getDemoDataset();
  const pairs = data.matches
    .filter((m) => m.date.getTime() >= data.now - RECENT_DAYS * DAY_MS)
    .flatMap((m) =>
      (["blue", "red"] as const).flatMap((side) => {
        const team = m.participants
          .filter((p) => p.gameTeam === side)
          .sort((a, b) => a.playerCode.localeCompare(b.playerCode));
        return team.flatMap((a, i) =>
          team.slice(i + 1).map((b) => ({ a, b, won: m.winner === side }))
        );
      })
    );
  return Array.from(groupBy(pairs, (p) => `${p.a.playerCode}|${p.b.playerCode}`))
    .map(([, list]) => {
      const win = list.filter((p) => p.won).length;
      return {
        players: [toPlayer(list[0].a), toPlayer(list[0].b)],
        totalCount: list.length,
        win,
        lose: list.length - win,
        winRate: round(ratio(win, list.length), 2),
      };
    })
    .sort((a, b) => b.totalCount - a.totalCount)
    .slice(0, TOP_N);
};

const kstDateKey = (date: Date) => {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
};

export const clanActivity = (): ClanActivity => {
  const data = getDemoDataset();
  const matches = data.matches.filter((m) => m.date.getTime() >= data.now - RECENT_DAYS * DAY_MS);
  const daily = groupBy(matches, (m) => kstDateKey(m.date));
  const blueWins = matches.filter((m) => m.winner === "blue").length;
  const redWins = matches.length - blueWins;
  return {
    totalMatches: matches.length,
    totalPlayers: new Set(matches.flatMap((m) => m.participants.map((p) => p.playerCode))).size,
    dailyMatches: Array.from(daily).map(([date, list]) => ({ date, matchCount: list.length })),
    sideWinRates: {
      blue: { win: blueWins, winRate: round(ratio(blueWins, matches.length), 2) },
      red: { win: redWins, winRate: round(ratio(redWins, matches.length), 2) },
    },
  };
};

export const risingStars = (): RisingStar[] => {
  const data = getDemoDataset();
  const since = data.now - RECENT_DAYS * DAY_MS;
  const before = since - RECENT_DAYS * DAY_MS;
  const period = (list: DemoParticipant[], from: number, to: number) => {
    const rows = list.filter((r) => {
      const t = new Date(r.createDate).getTime();
      return t >= from && t < to;
    });
    const win = rows.filter((r) => r.gameResult === "승").length;
    return { totalCount: rows.length, win, winRate: round(ratio(win, rows.length), 2) };
  };
  return Array.from(groupBy(allRows(data), (r) => r.playerCode))
    .map(([, list]) => {
      const previous = period(list, before, since);
      const current = period(list, since, data.now + 1);
      return {
        ...toPlayer(list[0]),
        previous,
        current,
        improvementPp: round(current.winRate - previous.winRate, 2),
      };
    })
    .filter(
      (r) =>
        r.previous.totalCount >= MIN_GAMES_FOR_RATE &&
        r.current.totalCount >= MIN_GAMES_FOR_RATE &&
        r.improvementPp > 0
    )
    .sort((a, b) => b.improvementPp - a.improvementPp)
    .slice(0, TOP_N);
};

const HIGHLIGHT_VALUE: Record<HighlightCategory, (r: DemoParticipant) => number> = {
  kills: (r) => r.kill,
  assists: (r) => r.assist,
  championDamage: (r) => r.totalDamageChampions,
  visionScore: (r) => r.visionScore,
  damageTaken: (r) => r.totalDamageTaken,
  buildingDamage: (r) => r.extra.buildingDmg,
};

export const highlights = (): Highlights => {
  const data = getDemoDataset();
  const rows = recentRows(data);
  const entryOf = (r: DemoParticipant, value: number): HighlightEntry => ({
    ...toPlayer(r),
    champion: { champName: r.champName, champNameEng: r.champNameEng },
    registeredDate: r.createDate,
    value,
  });
  const categories = Object.fromEntries(
    (Object.keys(HIGHLIGHT_VALUE) as HighlightCategory[]).map((category) => {
      const valueOf = HIGHLIGHT_VALUE[category];
      const top = [...rows].sort((a, b) => valueOf(b) - valueOf(a))[0];
      return [
        category,
        top
          ? { value: valueOf(top), entries: [entryOf(top, valueOf(top))] }
          : { value: null, entries: [] },
      ];
    })
  ) as Record<HighlightCategory, Highlights["kills"]>;
  const pentas = rows.filter((r) => r.pentaKills > 0);
  return {
    ...categories,
    pentakills: {
      totalPlayers: new Set(pentas.map((r) => r.playerCode)).size,
      totalPentaKills: pentas.reduce((s, r) => s + r.pentaKills, 0),
      entries: pentas.map((r) => ({
        ...toPlayer(r),
        champion: { champName: r.champName, champNameEng: r.champNameEng },
        registeredDate: r.createDate,
        pentaKills: r.pentaKills,
      })),
    },
  };
};

export const winStreaks = (): WinStreak[] => {
  const data = getDemoDataset();
  return Array.from(groupBy(recentRows(data), (r) => r.playerCode))
    .map(([, list]) => {
      const sorted = [...list].sort((a, b) => b.createDate.localeCompare(a.createDate));
      const lossAt = sorted.findIndex((r) => r.gameResult === "패");
      return {
        ...toPlayer(sorted[0]),
        streak: lossAt === -1 ? sorted.length : lossAt,
        latestRegisteredDate: sorted[0].createDate,
      };
    })
    .filter((s) => s.streak >= 2)
    .sort((a, b) => b.streak - a.streak)
    .slice(0, TOP_N);
};

// ── 상대전적 ────────────────────────────────────────────────

interface Pair {
  me: DemoParticipant;
  op: DemoParticipant;
  date: Date;
}

const pairsBetween = (data: DemoDataset, me: DemoPlayer, op: DemoPlayer, against: boolean) =>
  data.matches
    .map((m) => ({
      me: m.participants.find((p) => p.playerCode === me.playerCode),
      op: m.participants.find((p) => p.playerCode === op.playerCode),
      date: m.date,
    }))
    .filter((p): p is Pair => !!p.me && !!p.op && (p.me.gameTeam !== p.op.gameTeam) === against)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

const mainLaneOf = (data: DemoDataset, player: DemoPlayer): LanePosition | null =>
  linesOf(allRows(data).filter((r) => r.playerCode === player.playerCode))[0]?.position ?? null;

export const frequentOpponents = (
  riotName: string,
  params: { riotNameTag?: string | null; q?: string | null; limit?: string | null }
): FrequentOpponent[] => {
  const data = getDemoDataset();
  const me = findPlayers(data, riotName, params.riotNameTag)[0];
  if (!me) return [];
  const q = params.q?.toLowerCase();
  return data.players
    .filter((p) => p.playerCode !== me.playerCode)
    .filter((p) => !q || `${p.riotName}#${p.riotNameTag}`.toLowerCase().includes(q))
    .map((op) => {
      const pairs = pairsBetween(data, me, op, true);
      const wins = pairs.filter((p) => p.me.gameResult === "승").length;
      return {
        puuid: `demo-puuid-${op.playerCode}`,
        riotName: op.riotName,
        riotNameTag: op.riotNameTag,
        mainLane: mainLaneOf(data, op),
        matchups: pairs.length,
        winRate: round(ratio(wins, pairs.length), 1),
        lastPlayedDate: pairs[pairs.length - 1]?.date.toISOString() ?? "",
      };
    })
    .filter((o) => o.matchups > 0)
    .sort((a, b) => b.matchups - a.matchups)
    .slice(0, Number(params.limit ?? 12));
};

const avg = (values: number[]) =>
  values.length ? round(values.reduce((s, v) => s + v, 0) / values.length, 2) : null;

const metricsOf = (rows: DemoParticipant[], jungle: DemoParticipant[]): H2HMetrics => ({
  kda: avg(rows.map((r) => r.extra.kda)),
  dpm: avg(rows.map((r) => r.extra.dpm)),
  laneGoldDiff: avg(rows.map((r) => r.extra.laneGoldDiff)),
  tdBefore15: avg(rows.map((r) => r.extra.td15)),
  turretPlates: avg(rows.map((r) => r.extra.plates)),
  expPerMin: avg(rows.map((r) => r.extra.expPerMin)),
  deadTimePct: avg(rows.map((r) => r.extra.deadPct)),
  jungleCsEnemy: jungle.length ? avg(jungle.map((r) => r.extra.jungleCsEnemy)) : null,
});

const detailOf = (r: DemoParticipant): H2HRecentDetailMetrics => ({
  dmg: r.totalDamageChampions,
  taken: r.totalDamageTaken,
  selfMit: r.extra.selfMit,
  gold: r.extra.gold,
  cs: r.extra.cs,
  kda: r.extra.kda,
  laneGoldDiff: r.extra.laneGoldDiff,
  td15: r.extra.td15,
  underTurretTd: r.extra.underTurretTd,
  turretTd: r.extra.turretTd,
  plates: r.extra.plates,
  enemyJungleCs: r.extra.jungleCsEnemy,
  objDmg: r.extra.objDmg,
  epicKills: r.extra.epicKills,
  objSteals: r.extra.objSteals,
  deadPct: r.extra.deadPct,
  vision: r.visionScore,
  wardsP: r.extra.wardsP,
  wardsK: r.extra.wardsK,
  controlW: r.extra.controlW,
  healShield: r.extra.healShield,
  ccTime: r.extra.ccTime,
  missPings: r.extra.missPings,
});

const recentOf = (pair: Pair, withDetail: boolean): H2HRecent => ({
  matchId: pair.me.gameId,
  playedDate: pair.date.toISOString(),
  myResult: pair.me.gameResult === "승" ? "W" : "L",
  myLane: pair.me.position,
  oppoLane: pair.op.position,
  myChamp: pair.me.champNameEng,
  oppoChamp: pair.op.champNameEng,
  myKda: `${pair.me.kill}/${pair.me.death}/${pair.me.assist}`,
  oppoKda: `${pair.op.kill}/${pair.op.death}/${pair.op.assist}`,
  gameLen: pair.me.timePlayed,
  ...(withDetail && pair.me.position === pair.op.position
    ? { detail: { mine: detailOf(pair.me), oppo: detailOf(pair.op) } }
    : {}),
});

const longestStreak = (streak: H2HResult[]) => {
  let best = { kind: "W" as H2HResult, len: 0, start: 0 };
  let run = 0;
  streak.forEach((s, i) => {
    run = i > 0 && streak[i - 1] === s ? run + 1 : 1;
    if (run > best.len) best = { kind: s, len: run, start: i - run + 1 };
  });
  return best;
};

const currentStreakLength = (streak: H2HResult[]) => {
  let len = 0;
  for (let i = streak.length - 1; i >= 0 && streak[i] === streak[streak.length - 1]; i -= 1) {
    len += 1;
  }
  return len;
};

/** 백엔드 h2h.service의 buildInsights를 그대로 옮겼다. */
const insightsOf = (pairs: Pair[], matchups: H2HMatchup[], streak: H2HResult[]): H2HInsight[] => {
  const insights: H2HInsight[] = [];
  const games = pairs.length;
  const wins = pairs.filter((p) => p.me.gameResult === "승").length;
  const withWr = matchups.map((m) => ({
    ...m,
    wr: round(ratio(m.wins, m.count), 1),
    losses: m.count - m.wins,
    diff: parseFloat(m.kdaDiff) || 0,
  }));

  const best = withWr
    .filter((m) => m.count >= 2 && m.wr >= 60)
    .sort((a, b) => b.wr - a.wr || b.diff - a.diff || b.count - a.count)[0];
  if (best) {
    insights.push({
      kind: "best",
      type: "counterPick",
      myChamp: best.myChamp,
      oppoChamp: best.oppoChamp,
      wins: best.wins,
      losses: best.losses,
      winRate: best.wr,
      kdaDiff: best.diff,
    });
  }
  const worst = withWr
    .filter((m) => m.count >= 2 && m.wr <= 40)
    .sort((a, b) => a.wr - b.wr || a.diff - b.diff)[0];
  if (worst) {
    insights.push({
      kind: "worst",
      type: "nemesis",
      myChamp: worst.myChamp,
      oppoChamp: worst.oppoChamp,
      wins: worst.wins,
      losses: worst.losses,
      winRate: worst.wr,
      kdaDiff: worst.diff,
    });
  }

  const losses = pairs.filter((p) => p.me.gameResult === "패");
  const winsRows = pairs.filter((p) => p.me.gameResult === "승");
  const goldAdvLosses = losses.filter((p) => p.me.extra.laneGoldDiff > 0).length;
  const goldDisadvWins = winsRows.filter((p) => p.me.extra.laneGoldDiff < 0).length;
  if (losses.length >= 3 && goldAdvLosses / losses.length >= 0.5) {
    insights.push({
      kind: "counter",
      type: "laneVsResult",
      direction: "laneWinButLose",
      total: losses.length,
      laneCount: goldAdvLosses,
    });
  } else if (winsRows.length >= 3 && goldDisadvWins / winsRows.length >= 0.5) {
    insights.push({
      kind: "best",
      type: "laneVsResult",
      direction: "laneLoseButWin",
      total: winsRows.length,
      laneCount: goldDisadvWins,
    });
  }

  if (games >= 8) {
    const careerWinRate = round(ratio(wins, games), 1);
    const last5 = streak.slice(-5);
    const recentWins = last5.filter((s) => s === "W").length;
    const recentWinRate = round(ratio(recentWins, last5.length), 1);
    if (Math.abs(recentWinRate - careerWinRate) >= 20) {
      insights.push({
        kind: "info",
        type: "momentum",
        direction: recentWinRate > careerWinRate ? "up" : "down",
        recentN: last5.length,
        recentWins,
        recentWinRate,
        careerWinRate,
      });
    }
  }

  if (insights.length < 4) {
    const longest = longestStreak(streak);
    if (longest.len >= 3) {
      insights.push({
        kind: longest.kind === "W" ? "best" : "worst",
        type: "streak",
        streakKind: longest.kind === "W" ? "win" : "lose",
        length: longest.len,
        fromDate: pairs[longest.start]?.date.toISOString(),
        toDate: pairs[longest.start + longest.len - 1]?.date.toISOString(),
        currentLength: currentStreakLength(streak),
      });
    }
  }
  return insights.slice(0, 4);
};

const againstOf = (
  data: DemoDataset,
  me: DemoPlayer,
  pairs: Pair[],
  recentLimit: number,
  recentOffset: number
): H2HAgainst => {
  const wins = pairs.filter((p) => p.me.gameResult === "승").length;
  const streak: H2HResult[] = pairs.map((p) => (p.me.gameResult === "승" ? "W" : "L"));
  const jungle = pairs.filter((p) => p.me.position === "JUG" && p.op.position === "JUG");

  const laneMatrix: H2HLaneMatrix = {};
  LANES.forEach((my) => {
    laneMatrix[my] = {};
    LANES.forEach((oppo) => {
      laneMatrix[my][oppo] = { c: 0, w: 0 };
    });
  });
  pairs.forEach((p) => {
    const cell = laneMatrix[p.me.position][p.op.position];
    cell.c += 1;
    if (p.me.gameResult === "승") cell.w += 1;
  });
  const topLane = LANES.reduce<H2HAgainst["topLane"]>((acc, lane) => {
    const cell = laneMatrix[lane][lane];
    if (cell.c > 0 && (!acc || cell.c > acc.count)) return { lane, count: cell.c, wins: cell.w };
    return acc;
  }, null);

  const seasonKda = avg(
    allRows(data)
      .filter((r) => r.playerCode === me.playerCode)
      .map((r) => r.extra.kda)
  );
  const matchups: H2HMatchup[] = Array.from(
    groupBy(
      pairs,
      (p) => `${p.me.champNameEng}|${p.op.champNameEng}|${p.me.position}|${p.op.position}`
    )
  )
    .map(([, list]) => {
      const myKda = avg(list.map((p) => p.me.extra.kda)) ?? 0;
      const diff = seasonKda === null ? 0 : round(myKda - seasonKda, 2);
      return {
        myLane: list[0].me.position,
        oppoLane: list[0].op.position,
        myChamp: list[0].me.champNameEng,
        oppoChamp: list[0].op.champNameEng,
        count: list.length,
        wins: list.filter((p) => p.me.gameResult === "승").length,
        myKda: String(myKda),
        kdaDiff: `${diff >= 0 ? "+" : ""}${diff}`,
      };
    })
    .sort((a, b) => b.count - a.count);

  return {
    games: pairs.length,
    wins,
    losses: pairs.length - wins,
    winRate: round(ratio(wins, pairs.length), 1),
    streak,
    seasonBreaks: [],
    mine: metricsOf(
      pairs.map((p) => p.me),
      jungle.map((p) => p.me)
    ),
    oppos: metricsOf(
      pairs.map((p) => p.op),
      jungle.map((p) => p.op)
    ),
    laneMatrix,
    topLane,
    matchups,
    insights: insightsOf(pairs, matchups, streak),
    recent: [...pairs]
      .reverse()
      .slice(recentOffset, recentOffset + recentLimit)
      .map((p) => recentOf(p, true)),
    recentTotal: pairs.length,
  };
};

const togetherOf = (pairs: Pair[]): H2HTogether => {
  const wins = pairs.filter((p) => p.me.gameResult === "승").length;
  const laneCombos: H2HLaneCombo[] = Array.from(
    groupBy(pairs, (p) => `${p.me.position}|${p.op.position}`)
  )
    .map(([, list]) => ({
      mine: list[0].me.position,
      oppo: list[0].op.position,
      count: list.length,
      wins: list.filter((p) => p.me.gameResult === "승").length,
    }))
    .sort((a, b) => b.count - a.count);
  const kdaOf = (rows: DemoParticipant[]) => {
    const ka = rows.reduce((s, r) => s + r.kill + r.assist, 0);
    const d = rows.reduce((s, r) => s + r.death, 0);
    return String(round(ka / (d === 0 ? 1 : d), 2));
  };
  const duoChamps: H2HDuoChamp[] = Array.from(
    groupBy(pairs, (p) => `${p.me.champNameEng}|${p.op.champNameEng}`)
  )
    .map(([, list]) => ({
      mine: list[0].me.champNameEng,
      oppo: list[0].op.champNameEng,
      mineLane: list[0].me.position,
      oppoLane: list[0].op.position,
      count: list.length,
      wins: list.filter((p) => p.me.gameResult === "승").length,
      myKda: kdaOf(list.map((p) => p.me)),
      mateKda: kdaOf(list.map((p) => p.op)),
    }))
    .sort((a, b) => b.count - a.count);
  return {
    games: pairs.length,
    wins,
    losses: pairs.length - wins,
    winRate: round(ratio(wins, pairs.length), 1),
    streak: pairs.map((p) => (p.me.gameResult === "승" ? "W" : "L")),
    laneCombos,
    topLaneCombo: laneCombos[0] ?? null,
    duoChamps,
    recent: [...pairs]
      .reverse()
      .slice(0, 8)
      .map((p) => recentOf(p, false)),
  };
};

const profileOf = (data: DemoDataset, player: DemoPlayer): H2HProfile => {
  const season = String(new Date(data.now).getFullYear());
  const rows = allRows(data).filter(
    (r) => r.playerCode === player.playerCode && r.season === season
  );
  const wins = rows.filter((r) => r.gameResult === "승").length;
  return {
    puuid: `demo-puuid-${player.playerCode}`,
    riotName: player.riotName,
    riotNameTag: player.riotNameTag,
    mmr: null,
    mostLane: mainLaneOf(data, player),
    seasonWR: rows.length ? round(ratio(wins, rows.length), 1) : null,
  };
};

export const h2hDetail = (params: {
  riotName1: string;
  riotNameTag1?: string | null;
  riotName2: string;
  riotNameTag2?: string | null;
  recentLimit?: string | null;
  recentOffset?: string | null;
}): H2HDetail | H2HCandidate[] | null => {
  const data = getDemoDataset();
  const me = findPlayers(data, params.riotName1, params.riotNameTag1)[0];
  const oppos = findPlayers(data, params.riotName2, params.riotNameTag2);
  if (!me || oppos.length === 0) return null;
  if (oppos.length > 1) return oppos.map(toPlayer);
  const op = oppos[0];

  const against = pairsBetween(data, me, op, true);
  const together = pairsBetween(data, me, op, false);
  const all = [...against, ...together].sort((a, b) => a.date.getTime() - b.date.getTime());
  return {
    me: profileOf(data, me),
    oppo: profileOf(data, op),
    totalMet: all.length,
    firstMet: all[0]?.date.toISOString() ?? null,
    lastMet: all[all.length - 1]?.date.toISOString() ?? null,
    against: againstOf(
      data,
      me,
      against,
      Number(params.recentLimit ?? 10),
      Number(params.recentOffset ?? 0)
    ),
    together: togetherOf(together),
  };
};
