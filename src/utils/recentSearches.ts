export interface RecentSearch {
  riotName: string;
  riotTag: string;
}

const STORAGE_KEY = "recentSearches";
const MAX_RECENT_SEARCHES = 10;

/**
 * 최근 검색어 목록 불러오기
 */
export const getRecentSearches = (): RecentSearch[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to load recent searches:", error);
    return [];
  }
};

/**
 * 최근 검색어를 추가 (중복 제거 및 최신순 정렬)
 */
export const addRecentSearch = (search: RecentSearch): void => {
  if (typeof window === "undefined") {
    return;
  }

  if (!search.riotName || !search.riotTag) {
    return;
  }

  try {
    const recentSearches = getRecentSearches();

    // 중복 제거: 동일한 riotName과 riotTag를 가진 항목 제거
    const filtered = recentSearches.filter(
      (item) => !(item.riotName === search.riotName && item.riotTag === search.riotTag)
    );

    // 맨 앞에 새 검색어 추가
    const updated = [search, ...filtered];

    // 최대 개수만큼만 유지
    const limited = updated.slice(0, MAX_RECENT_SEARCHES);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error("Failed to save recent search:", error);
  }
};

/**
 * 특정 최근 검색어를 삭제
 */
export const removeRecentSearch = (riotName: string, riotTag: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const recentSearches = getRecentSearches();
    const filtered = recentSearches.filter(
      (item) => !(item.riotName === riotName && item.riotTag === riotTag)
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to remove recent search:", error);
  }
};

/**
 * 모든 최근 검색어를 삭제
 */
export const clearRecentSearches = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear recent searches:", error);
  }
};
