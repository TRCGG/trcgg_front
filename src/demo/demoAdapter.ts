import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { DEMO_FEATURED, DEMO_GUILD_ID, DEMO_GUILD_NAME } from "@/demo/demoData";
import * as demo from "@/demo/demoAggregates";
import * as comp from "@/demo/demoCompetitions";
import type { Position } from "@/services/statistics";
import type { ChampionCombinationType } from "@/data/types/leaderboard";

type Query = URLSearchParams;
type Handler = (segments: string[], query: Query) => unknown;

const respond = (config: InternalAxiosRequestConfig, status: number, data: unknown) => {
  const response: AxiosResponse = { data, status, statusText: "", headers: {}, config };
  if (status >= 400) {
    throw new AxiosError(
      (data as { message?: string })?.message,
      String(status),
      config,
      null,
      response
    );
  }
  return response;
};

const envelope = (data: unknown) => ({ status: "success", message: "", data });

/** 핸들러의 null은 404로 보낸다. 응답 data 자체가 null인 엔드포인트는 이 값을 돌려준다. */
const NULL_DATA = Symbol("null-data");

const statParams = (q: Query) => ({
  position: q.get("position"),
  sortBy: q.get("sortBy"),
  gameType: q.get("gameType"),
  page: q.get("page"),
  limit: q.get("limit"),
});

/**
 * 경로 패턴 → 응답. 세그먼트의 ":"는 아무 값, "*"는 그 값을 핸들러에 넘긴다.
 * 길드 ID 자리는 데모 길드 하나뿐이라 값을 보지 않는다.
 */
const ROUTES: [string[], Handler][] = [
  [["api", "guilds"], () => [{ id: DEMO_GUILD_ID, name: DEMO_GUILD_NAME, isPublic: true }]],
  // 대회는 클랜원만 볼 수 있어 데모 방문자를 데모 클랜의 일반 클랜원으로 둔다.
  [
    ["api", "auth", "gmokGuilds"],
    () => [
      {
        id: DEMO_GUILD_ID,
        name: DEMO_GUILD_NAME,
        icon: "",
        banner: null,
        role: "userNormal",
        nick: DEMO_FEATURED.riotName,
      },
    ],
  ],
  [
    ["api", "guilds", "*"],
    () => ({
      id: DEMO_GUILD_ID,
      name: DEMO_GUILD_NAME,
      languageCode: "ko",
      allowAllUploads: false,
      createDate: new Date(0).toISOString(),
      updateDate: new Date(0).toISOString(),
      isDeleted: false,
    }),
  ],
  [["api", "champions"], () => comp.champions()],
  [["api", "competitions", ":"], (_, q) => comp.competitionList(q.get("status"), q.get("season"))],
  [
    ["api", "competitions", ":", "players", "*", "competitions"],
    ([playerCode], q) => comp.playerCompetitions(playerCode, q.get("status")),
  ],
  [["api", "competitions", ":", "*"], ([id]) => comp.competitionDetail(id)],
  [
    ["api", "competitions", ":", "*", "applications", "me"],
    ([id]) => comp.myApplication(id) ?? NULL_DATA,
  ],
  [
    ["api", "competitions", ":", "*", "applications"],
    ([id], q) => comp.applications(id, q.get("status")),
  ],
  [["api", "competitions", ":", "*", "teams"], ([id]) => comp.teams(id)],
  [
    ["api", "competitions", ":", "*", "teams", "*", "records"],
    ([id, teamId]) => comp.teamRecords(id, teamId),
  ],
  [
    ["api", "competitions", ":", "*", "matches"],
    ([id], q) => comp.matches(id, q.get("unassigned")),
  ],
  [["api", "competitions", ":", "*", "standings"], ([id]) => comp.standings(id)],
  [
    ["api", "competitions", ":", "*", "records"],
    ([id], q) => comp.headToHead(id, q.get("teamA"), q.get("teamB")),
  ],
  [
    ["api", "competitions", ":", "*", "statistics", "users"],
    ([id], q) => comp.userStatistics(id, statParams(q)),
  ],
  [
    ["api", "competitions", ":", "*", "statistics", "champions"],
    ([id], q) => comp.championStatistics(id, statParams(q)),
  ],
  [["api", "guildMember", ":", "*"], ([name], q) => demo.searchMembers(name, q.get("riotNameTag"))],
  [["api", "matches", ":", "games", "*"], ([gameId]) => demo.gameDetail(gameId)],
  [
    ["api", "matches", ":", "*", "dashboard"],
    ([name], q) => demo.dashboard(name, q.get("riotNameTag")),
  ],
  [
    ["api", "matches", ":", "*", "games"],
    ([name], q) => demo.recentGames(name, q.get("riotNameTag")),
  ],
  [
    ["api", "matches", ":", "*", "most-picks"],
    ([name], q) =>
      demo.mostPicks(name, {
        datePreset: q.get("datePreset"),
        season: q.get("season"),
        fromMonth: q.get("fromMonth"),
        toMonth: q.get("toMonth"),
        position: q.get("position"),
      }),
  ],
  [
    ["api", "h2h", ":", "frequent"],
    (_, q) =>
      demo.frequentOpponents(q.get("riotName") ?? "", {
        riotNameTag: q.get("riotNameTag"),
        q: q.get("q"),
        limit: q.get("limit"),
      }),
  ],
  [
    ["api", "h2h", ":"],
    (_, q) =>
      demo.h2hDetail({
        riotName1: q.get("riotName1") ?? "",
        riotNameTag1: q.get("riotNameTag1"),
        riotName2: q.get("riotName2") ?? "",
        riotNameTag2: q.get("riotNameTag2"),
        recentLimit: q.get("recentLimit"),
        recentOffset: q.get("recentOffset"),
      }),
  ],
  [
    ["api", "statistics", ":", "users"],
    (_, q) =>
      demo.userStatistics({
        datePreset: q.get("datePreset"),
        season: q.get("season"),
        fromMonth: q.get("fromMonth"),
        toMonth: q.get("toMonth"),
        position: q.get("position"),
      }),
  ],
  [
    ["api", "statistics", ":", "champions"],
    (_, q) =>
      demo.championStatistics({
        datePreset: q.get("datePreset"),
        season: q.get("season"),
        fromMonth: q.get("fromMonth"),
        toMonth: q.get("toMonth"),
        position: q.get("position"),
      }),
  ],
  [
    ["api", "statistics", ":", "leaderboard", "users"],
    (_, q) =>
      demo.leaderboardUsers((q.get("position") ?? "ALL") as Position, q.get("sortBy") ?? ""),
  ],
  [
    ["api", "statistics", ":", "leaderboard", "champions"],
    (_, q) =>
      demo.leaderboardChampions((q.get("position") ?? "ALL") as Position, q.get("sortBy") ?? ""),
  ],
  [
    ["api", "statistics", ":", "champion-combinations"],
    (_, q) => demo.championCombinations(q.get("combination") as ChampionCombinationType),
  ],
  [["api", "statistics", ":", "duos"], () => demo.clanDuos()],
  [["api", "statistics", ":", "activity"], () => demo.clanActivity()],
  [["api", "statistics", ":", "rising-stars"], () => demo.risingStars()],
  [["api", "statistics", ":", "highlights"], () => demo.highlights()],
  [["api", "statistics", ":", "win-streaks"], () => demo.winStreaks()],
];

const match = (pattern: string[], segments: string[]): string[] | null => {
  if (pattern.length !== segments.length) return null;
  const captured: string[] = [];
  for (let i = 0; i < pattern.length; i += 1) {
    if (pattern[i] === "*") captured.push(segments[i]);
    else if (pattern[i] !== ":" && pattern[i] !== segments[i]) return null;
  }
  return captured;
};

/** 데모 모드에서 실제 서버 대신 응답하는 axios 어댑터. 읽기만 지원한다. */
const demoAdapter = async (config: InternalAxiosRequestConfig): Promise<AxiosResponse> => {
  if ((config.method ?? "get").toLowerCase() !== "get") {
    return respond(config, 403, { message: "데모에서는 사용할 수 없는 기능입니다." });
  }

  const url = new URL(config.url ?? "", "http://demo.local");
  Object.entries(config.params ?? {}).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const segments = url.pathname
    .split("/")
    .filter(Boolean)
    .map((s) => decodeURIComponent(s));

  // 디스코드 로그인 버튼이 그대로 보이도록 데모 방문자는 로그인하지 않은 상태로 둔다.
  if (segments.join("/") === "api/auth/me") {
    return respond(config, 401, { message: "Unauthorized" });
  }

  const route = ROUTES.find(([pattern]) => match(pattern, segments));
  if (!route) return respond(config, 404, { message: "데모에서는 볼 수 없는 화면입니다." });

  const data = route[1](match(route[0], segments)!, url.searchParams);
  if (data === null) return respond(config, 404, { message: "데모 데이터가 없습니다." });
  return respond(config, 200, envelope(data === NULL_DATA ? null : data));
};

export default demoAdapter;
