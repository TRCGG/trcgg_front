import type {
  CompetitionApplicationItem,
  CompetitionChampionStat,
  CompetitionDetail,
  CompetitionHeadToHeadResult,
  CompetitionMatchTeamItem,
  CompetitionStandings,
  CompetitionSummary,
  CompetitionTeamRecordItem,
  CompetitionTeamWithRoster,
  CompetitionUserStat,
  PlayerCompetitionItem,
  RecordCount,
  StandingRow,
  TeamRecordSplit,
} from "@/data/types/competition";
import type { ChampionItem } from "@/data/types/champion";
import {
  DEMO_CHAMPIONS,
  DEMO_FEATURED,
  DEMO_GUILD_ID,
  DemoCompetition,
  DemoCompetitionMatch,
  DemoParticipant,
  DemoTeam,
  LANES,
  getDemoDataset,
} from "@/demo/demoData";

const GAME_TYPE_KEYS = { "2": "scrim", "3": "preliminary", "4": "main" } as const;
type SplitKey = (typeof GAME_TYPE_KEYS)[keyof typeof GAME_TYPE_KEYS];

const round = (value: number, digits: number) => {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
};

const findCompetition = (id: string) =>
  getDemoDataset().competitions.find((c) => String(c.id) === id) ?? null;

const winnerTeamOf = (m: DemoCompetitionMatch) =>
  m.winner === "blue" ? m.blueTeamId : m.redTeamId;

const sideOf = (m: DemoCompetitionMatch, teamId: number) =>
  m.blueTeamId === teamId ? "blue" : "red";

const recordOf = (matches: DemoCompetitionMatch[], teamId: number): RecordCount => {
  const win = matches.filter((m) => winnerTeamOf(m) === teamId).length;
  return { games: matches.length, win, lose: matches.length - win };
};

const splitOf = (matches: DemoCompetitionMatch[], teamId: number): TeamRecordSplit => {
  const played = matches.filter((m) => m.blueTeamId === teamId || m.redTeamId === teamId);
  const byType = (key: SplitKey) => played.filter((m) => GAME_TYPE_KEYS[m.gameType] === key);
  return {
    scrim: recordOf(byType("scrim"), teamId),
    preliminary: recordOf(byType("preliminary"), teamId),
    main: recordOf(byType("main"), teamId),
  };
};

const iso = (date: Date | null) => (date ? date.toISOString() : null);

const summaryOf = (c: DemoCompetition): CompetitionSummary => {
  const count = (type: DemoCompetitionMatch["gameType"]) =>
    c.matches.filter((m) => m.gameType === type).length;
  return {
    id: c.id,
    guildId: DEMO_GUILD_ID,
    name: c.name,
    season: String(c.createDate.getFullYear()),
    status: c.status,
    approvalRequired: c.approvalRequired,
    createDate: c.createDate.toISOString(),
    closeDate: iso(c.closeDate),
    scrimCount: count("2"),
    preliminaryCount: count("3"),
    mainCount: count("4"),
    applicationCount: c.applications.length,
    pendingCount: c.applications.filter((a) => a.status === "PENDING").length,
    teamCount: c.teams.length,
    participantCount: c.teams.reduce((sum, t) => sum + t.members.length, 0),
  };
};

const newestFirst = (a: { date: Date }, b: { date: Date }) => b.date.getTime() - a.date.getTime();

// ── 대회 ──

export const competitionList = (status: string | null, season: string | null) =>
  getDemoDataset()
    .competitions.map(summaryOf)
    .filter((c) => (!status || c.status === status) && (!season || c.season === season));

export const competitionDetail = (id: string): CompetitionDetail | null => {
  const c = findCompetition(id);
  if (!c) return null;
  return {
    ...summaryOf(c),
    matches: [...c.matches].sort(newestFirst).map((m) => ({
      gameId: m.gameId,
      gameType: m.gameType,
      createDate: m.date.toISOString(),
    })),
  };
};

// ── 신청 ──

const applicationItemOf = (
  c: DemoCompetition,
  a: DemoCompetition["applications"][number]
): CompetitionApplicationItem => ({
  id: a.id,
  competitionId: c.id,
  playerCode: a.player.playerCode,
  appliedByMemberId: `demo-${a.player.playerCode}`,
  mainPosition: a.player.main,
  subPositions: [a.player.sub],
  availableTime: a.availableTime,
  captainAvailable: a.captainAvailable,
  practiceLevel: a.practiceLevel,
  comment: a.comment,
  status: a.status,
  decidedByMemberId: a.status === "PENDING" ? null : "demo-manager",
  decidedDate: a.status === "PENDING" ? null : a.createDate.toISOString(),
  createDate: a.createDate.toISOString(),
  updateDate: a.createDate.toISOString(),
  riotName: a.player.riotName,
  riotNameTag: a.player.riotNameTag,
  appliedByDisplayName: a.player.riotName,
  champions: a.champions.map((champ) => ({
    id: champ.eng,
    champName: champ.kor,
    champNameEng: champ.eng,
    riotKey: null,
  })),
});

export const applications = (id: string, status: string | null) => {
  const c = findCompetition(id);
  if (!c) return null;
  return c.applications
    .filter((a) => !status || a.status === status)
    .map((a) => applicationItemOf(c, a));
};

/** 데모 방문자는 주인공 소환사의 신청서를 자기 것으로 본다. */
export const myApplication = (id: string) => {
  const c = findCompetition(id);
  if (!c) return null;
  const mine = c.applications.find((a) => a.player.riotName === DEMO_FEATURED.riotName);
  return mine ? applicationItemOf(c, mine) : null;
};

export const champions = (): ChampionItem[] =>
  DEMO_CHAMPIONS.map((champ) => ({
    id: champ.eng,
    champName: champ.kor,
    champNameEng: champ.eng,
    riotKey: null,
  }));

// ── 팀·경기 ──

const rosterOf = (team: DemoTeam) =>
  team.members.map((p, l) => ({
    playerCode: p.playerCode,
    riotName: p.riotName,
    riotNameTag: p.riotNameTag,
    position: LANES[l],
  }));

export const teams = (id: string): CompetitionTeamWithRoster[] | null => {
  const c = findCompetition(id);
  if (!c) return null;
  return c.teams.map((team) => ({
    id: team.id,
    competitionId: c.id,
    name: team.name,
    captainPlayerCode: team.captain.playerCode,
    isWinner: c.winnerTeamId === team.id,
    createDate: c.createDate.toISOString(),
    roster: rosterOf(team),
    records: splitOf(c.matches, team.id),
  }));
};

const teamName = (c: DemoCompetition, teamId: number) =>
  c.teams.find((t) => t.id === teamId)?.name ?? null;

const playersOn = (m: DemoCompetitionMatch, side: "blue" | "red") =>
  m.participants
    .filter((p) => p.gameTeam === side)
    .map((p) => ({ playerCode: p.playerCode, riotName: p.riotName, riotNameTag: p.riotNameTag }));

export const matches = (
  id: string,
  unassigned: string | null
): CompetitionMatchTeamItem[] | null => {
  const c = findCompetition(id);
  if (!c) return null;
  // 데모 경기는 모두 팀에 귀속돼 있다.
  if (unassigned === "true") return [];
  return [...c.matches].sort(newestFirst).map((m) => ({
    customMatchId: m.gameId,
    gameType: m.gameType,
    date: m.date.toISOString(),
    blueTeamId: m.blueTeamId,
    redTeamId: m.redTeamId,
    blueTeamName: teamName(c, m.blueTeamId),
    redTeamName: teamName(c, m.redTeamId),
    winnerTeamId: winnerTeamOf(m),
    gameLength: m.participants[0]?.timePlayed ?? null,
    blue: playersOn(m, "blue"),
    red: playersOn(m, "red"),
  }));
};

// ── 순위표·전적 ──

const teamKda = (matchesPlayed: DemoCompetitionMatch[], teamId: number) => {
  const rows = matchesPlayed.flatMap((m) =>
    m.participants.filter((p) => p.gameTeam === sideOf(m, teamId))
  );
  const deaths = rows.reduce((s, r) => s + r.death, 0);
  const ka = rows.reduce((s, r) => s + r.kill + r.assist, 0);
  return round(ka / Math.max(1, deaths), 2);
};

const standingsOf = (c: DemoCompetition): CompetitionStandings => {
  const rowsFor = (key: SplitKey): StandingRow[] =>
    c.teams
      .map((team) => {
        const played = c.matches.filter(
          (m) =>
            GAME_TYPE_KEYS[m.gameType] === key &&
            (m.blueTeamId === team.id || m.redTeamId === team.id)
        );
        const { games, win, lose } = recordOf(played, team.id);
        return {
          rank: 0,
          teamId: team.id,
          name: team.name,
          games,
          win,
          lose,
          winRate: games === 0 ? 0 : round((win * 100) / games, 2),
          avgKda: teamKda(played, team.id),
        };
      })
      .filter((row) => row.games > 0)
      .sort((a, b) => b.win - a.win || b.winRate - a.winRate || b.avgKda - a.avgKda)
      .map((row, i) => ({ ...row, rank: i + 1 }));

  return { scrim: rowsFor("scrim"), preliminary: rowsFor("preliminary"), main: rowsFor("main") };
};

export const standings = (id: string) => {
  const c = findCompetition(id);
  return c ? standingsOf(c) : null;
};

const between = (c: DemoCompetition, a: number, b: number) =>
  c.matches.filter(
    (m) => (m.blueTeamId === a && m.redTeamId === b) || (m.blueTeamId === b && m.redTeamId === a)
  );

export const teamRecords = (id: string, teamId: string): CompetitionTeamRecordItem[] | null => {
  const c = findCompetition(id);
  if (!c) return null;
  const me = Number(teamId);
  return c.teams
    .filter((t) => t.id !== me)
    .map((opponent) => ({
      teamId: opponent.id,
      name: opponent.name,
      ...splitOf(between(c, me, opponent.id), me),
    }));
};

export const headToHead = (
  id: string,
  teamA: string | null,
  teamB: string | null
): CompetitionHeadToHeadResult | null => {
  const c = findCompetition(id);
  if (!c) return null;
  const a = Number(teamA);
  const games = between(c, a, Number(teamB));
  return {
    ...splitOf(games, a),
    matches: [...games].sort(newestFirst).map((m) => ({
      customMatchId: m.gameId,
      gameType: m.gameType,
      date: m.date.toISOString(),
      winnerTeamId: winnerTeamOf(m),
    })),
  };
};

// ── 대회 통계 ──

interface StatParams {
  position: string | null;
  sortBy: string | null;
  gameType: string | null;
  page: string | null;
  limit: string | null;
}

interface StatRow {
  p: DemoParticipant;
  match: DemoCompetitionMatch;
}

const statRowsOf = (c: DemoCompetition, params: StatParams): StatRow[] => {
  const types = params.gameType ? params.gameType.split(",") : null;
  const position = params.position && params.position !== "ALL" ? params.position : null;
  return c.matches
    .filter((m) => !types || types.includes(m.gameType))
    .flatMap((match) => match.participants.map((p) => ({ p, match })))
    .filter(({ p }) => !position || p.position === position);
};

const groupRows = (rows: StatRow[], key: (row: StatRow) => string) => {
  const groups = new Map<string, StatRow[]>();
  rows.forEach((row) => {
    const k = key(row);
    groups.set(k, [...(groups.get(k) ?? []), row]);
  });
  return [...groups.values()];
};

const baseStat = (rows: StatRow[]) => {
  const win = rows.filter(({ p }) => p.gameResult === "승").length;
  const kills = rows.reduce((s, { p }) => s + p.kill, 0);
  const deaths = rows.reduce((s, { p }) => s + p.death, 0);
  const assists = rows.reduce((s, { p }) => s + p.assist, 0);
  return {
    totalCount: rows.length,
    win,
    lose: rows.length - win,
    winRate: round((win * 100) / rows.length, 2),
    kda: round((kills + assists) / Math.max(1, deaths), 2),
    kills,
    avgDpm: Math.round(rows.reduce((s, { p }) => s + p.extra.dpm, 0) / rows.length),
  };
};

const sortAndPage = <T extends { totalCount: number; winRate: number }>(
  items: T[],
  params: StatParams
) => {
  const sorted = [...items].sort((a, b) =>
    params.sortBy === "winRate"
      ? b.winRate - a.winRate || b.totalCount - a.totalCount
      : b.totalCount - a.totalCount || b.winRate - a.winRate
  );
  const limit = Number(params.limit) || 20;
  const page = Math.max(1, Number(params.page) || 1);
  return sorted.slice((page - 1) * limit, page * limit);
};

const teamTotal = (
  match: DemoCompetitionMatch,
  side: string,
  pickValue: (p: DemoParticipant) => number
) => match.participants.filter((p) => p.gameTeam === side).reduce((s, p) => s + pickValue(p), 0);

const userStatOf = (rows: StatRow[], position: string | null): CompetitionUserStat => {
  const sum = (pickValue: (row: StatRow) => number) => rows.reduce((s, r) => s + pickValue(r), 0);
  const kills = sum(({ p }) => p.kill);
  const deaths = sum(({ p }) => p.death);
  const damage = sum(({ p }) => p.totalDamageChampions);
  const minutes = sum(({ p }) => p.timePlayed / 60);
  const { p: first } = rows[0];
  return {
    riotName: first.riotName,
    riotNameTag: first.riotNameTag,
    ...(position ? { position } : {}),
    ...baseStat(rows),
    killParticipation: (
      (sum(({ p }) => p.kill + p.assist) * 100) /
      Math.max(
        1,
        sum(({ p, match }) => teamTotal(match, p.gameTeam, (x) => x.kill))
      )
    ).toFixed(1),
    damageShare: (
      (damage * 100) /
      Math.max(
        1,
        sum(({ p, match }) => teamTotal(match, p.gameTeam, (x) => x.totalDamageChampions))
      )
    ).toFixed(1),
    goldPerMin: (sum(({ p }) => p.extra.gold) / Math.max(1, minutes)).toFixed(1),
    avgVisionScore: (sum(({ p }) => p.visionScore) / rows.length).toFixed(1),
    damagePerDeath: (damage / Math.max(1, deaths)).toFixed(0),
    deadTimePct: (sum(({ p }) => p.extra.deadPct) / rows.length).toFixed(1),
    // 데모 경기에는 연속 킬 기록이 없어 킬 수로 어림한다.
    multiKills: {
      double: Math.round(kills * 0.12),
      triple: Math.round(kills * 0.03),
      quadra: Math.floor(kills / 70),
      penta: sum(({ p }) => p.pentaKills),
    },
  };
};

export const userStatistics = (id: string, params: StatParams): CompetitionUserStat[] | null => {
  const c = findCompetition(id);
  if (!c) return null;
  const position = params.position && params.position !== "ALL" ? params.position : null;
  const stats = groupRows(statRowsOf(c, params), ({ p }) => p.playerCode).map((rows) =>
    userStatOf(rows, position)
  );
  return sortAndPage(stats, params);
};

export const championStatistics = (
  id: string,
  params: StatParams
): CompetitionChampionStat[] | null => {
  const c = findCompetition(id);
  if (!c) return null;
  const position = params.position && params.position !== "ALL" ? params.position : null;
  const stats = groupRows(statRowsOf(c, params), ({ p }) => p.champNameEng).map((rows) => ({
    champName: rows[0].p.champName,
    champNameEng: rows[0].p.champNameEng,
    ...(position ? { position } : {}),
    ...baseStat(rows),
  }));
  return sortAndPage(stats, params);
};

// ── 선수별 대회 ──

export const playerCompetitions = (
  playerCode: string,
  status: string | null
): PlayerCompetitionItem[] =>
  getDemoDataset()
    .competitions.filter((c) => !status || c.status === status)
    .flatMap((c): PlayerCompetitionItem[] => {
      const team = c.teams.find((t) => t.members.some((p) => p.playerCode === playerCode));
      const application = c.applications.find((a) => a.player.playerCode === playerCode);
      if (!team && !application) return [];

      const rows = c.matches
        .flatMap((m) => m.participants.map((p) => ({ p, date: m.date })))
        .filter(({ p }) => p.playerCode === playerCode)
        .sort(newestFirst);
      const win = rows.filter(({ p }) => p.gameResult === "승").length;
      const kills = rows.reduce((s, { p }) => s + p.kill + p.assist, 0);
      const deaths = rows.reduce((s, { p }) => s + p.death, 0);
      const table = standingsOf(c);
      const rankIn = (key: SplitKey) =>
        team ? (table[key].find((row) => row.teamId === team.id)?.rank ?? null) : null;
      const lane = team ? LANES[team.members.findIndex((p) => p.playerCode === playerCode)] : null;

      return [
        {
          competitionId: c.id,
          name: c.name,
          status: c.status,
          season: String(c.createDate.getFullYear()),
          createDate: c.createDate.toISOString(),
          closeDate: iso(c.closeDate),
          team: team
            ? {
                id: team.id,
                name: team.name,
                position: lane,
                isCaptain: team.captain.playerCode === playerCode,
              }
            : null,
          applicationStatus: application?.status ?? null,
          record: {
            games: rows.length,
            win,
            lose: rows.length - win,
            winRate: rows.length === 0 ? 0 : round((win * 100) / rows.length, 2),
            kda: round(kills / Math.max(1, deaths), 2),
          },
          teamRank: {
            scrim: rankIn("scrim"),
            preliminary: rankIn("preliminary"),
            main: rankIn("main"),
          },
          recent: rows.slice(0, 6).map(({ p }) => p.gameResult),
        },
      ];
    });
