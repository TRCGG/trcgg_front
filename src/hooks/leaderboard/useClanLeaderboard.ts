import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Position } from "@/services/statistics";
import {
  getChampionCombinations,
  getClanActivity,
  getClanDuos,
  getHighlights,
  getLeaderboardChampions,
  getLeaderboardUsers,
  getRisingStars,
  getWinStreaks,
} from "@/services/leaderboard";
import { timeUntilLeaderboardRefresh } from "@/utils/leaderboardSchedule";

/**
 * 클랜 리더보드 화면의 쿼리 묶음. 카드마다 따로 로딩·실패하도록 쿼리를 합치지 않는다.
 * 포지션은 판수·우수 성적·픽률·메타 카드에만 걸린다.
 * @param guildId Base64 인코딩된 길드 ID
 */
const useClanLeaderboard = (guildId: string, position: Position) => {
  const enabled = !!guildId;
  // 하루 한 번 바뀌는 집계라 고정 시간이 아니라 다음 갱신 시각까지 fresh로 둔다.
  const base = {
    enabled,
    staleTime: (query: { state: { dataUpdatedAt: number } }) =>
      timeUntilLeaderboardRefresh(query.state.dataUpdatedAt),
  };
  // 포지션을 바꿔도 이전 순위를 들고 있어야 카드가 비었다 채워지며 깜빡이지 않는다.
  const byPosition = { ...base, placeholderData: keepPreviousData };

  const activity = useQuery({
    ...base,
    queryKey: ["clanLeaderboard", "activity", guildId],
    queryFn: () => getClanActivity(guildId),
  });
  const highlights = useQuery({
    ...base,
    queryKey: ["clanLeaderboard", "highlights", guildId],
    queryFn: () => getHighlights(guildId),
  });
  const mostGames = useQuery({
    ...byPosition,
    queryKey: ["clanLeaderboard", "users", guildId, position, "totalCount"],
    queryFn: () => getLeaderboardUsers(guildId, position, "totalCount"),
  });
  const bestUsers = useQuery({
    ...byPosition,
    queryKey: ["clanLeaderboard", "users", guildId, position, "wilsonScore"],
    queryFn: () => getLeaderboardUsers(guildId, position, "wilsonScore"),
  });
  const pickRate = useQuery({
    ...byPosition,
    queryKey: ["clanLeaderboard", "champions", guildId, position, "pickRate"],
    queryFn: () => getLeaderboardChampions(guildId, position, "pickRate"),
  });
  const metaChampions = useQuery({
    ...byPosition,
    queryKey: ["clanLeaderboard", "champions", guildId, position, "wilsonScore"],
    queryFn: () => getLeaderboardChampions(guildId, position, "wilsonScore"),
  });
  const duos = useQuery({
    ...base,
    queryKey: ["clanLeaderboard", "duos", guildId],
    queryFn: () => getClanDuos(guildId),
  });
  const botCombos = useQuery({
    ...base,
    queryKey: ["clanLeaderboard", "combinations", guildId, "ADCSUP"],
    queryFn: () => getChampionCombinations(guildId, "ADCSUP"),
  });
  const midJugCombos = useQuery({
    ...base,
    queryKey: ["clanLeaderboard", "combinations", guildId, "MIDJUG"],
    queryFn: () => getChampionCombinations(guildId, "MIDJUG"),
  });
  const winStreaks = useQuery({
    ...base,
    queryKey: ["clanLeaderboard", "winStreaks", guildId],
    queryFn: () => getWinStreaks(guildId),
  });
  const risingStars = useQuery({
    ...base,
    queryKey: ["clanLeaderboard", "risingStars", guildId],
    queryFn: () => getRisingStars(guildId),
  });

  return {
    activity,
    highlights,
    mostGames,
    bestUsers,
    pickRate,
    metaChampions,
    duos,
    botCombos,
    midJugCombos,
    winStreaks,
    risingStars,
  };
};

export default useClanLeaderboard;
