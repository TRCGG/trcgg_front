const DAY_MS = 24 * 60 * 60 * 1000;
// 백엔드가 매일 KST 정오에 집계한다. 03:00 UTC = 12:00 KST
const NOON_UTC_HOUR = 3;
// 집계가 끝나기 전에 받아 하루 동안 이전 집계로 남는 일을 막는 여유
const AGGREGATION_BUFFER_MS = 5 * 60 * 1000;

const refreshAt = (dayStartUtc: number) =>
  dayStartUtc + NOON_UTC_HOUR * 60 * 60 * 1000 + AGGREGATION_BUFFER_MS;

/** time 이전의 마지막 갱신 시각(ms) */
export const lastLeaderboardRefresh = (time: number): number => {
  const d = new Date(time);
  const todayRefresh = refreshAt(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  return todayRefresh <= time ? todayRefresh : todayRefresh - DAY_MS;
};

/** updatedAt에 받은 데이터가 다음 갱신까지 fresh로 남을 시간(ms) */
export const timeUntilLeaderboardRefresh = (updatedAt: number): number =>
  lastLeaderboardRefresh(updatedAt) + DAY_MS - updatedAt;
