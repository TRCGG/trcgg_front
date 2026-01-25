export interface FavoriteSearch {
  riotName: string;
  riotTag: string;
}

const STORAGE_KEY = "favoriteSearches";

/**
 * 즐겨찾기 목록 불러오기
 */
export const getFavoriteSearches = (): FavoriteSearch[] => {
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
    console.error("Failed to load favorite searches:", error);
    return [];
  }
};

/**
 * 즐겨찾기에 추가
 */
export const addFavoriteSearch = (search: FavoriteSearch): void => {
  if (typeof window === "undefined") {
    return;
  }

  if (!search.riotName || !search.riotTag) {
    return;
  }

  try {
    const favoriteSearches = getFavoriteSearches();

    // 이미 즐겨찾기에 있는지 확인
    const exists = favoriteSearches.some(
      (item) => item.riotName === search.riotName && item.riotTag === search.riotTag
    );

    if (exists) {
      return;
    }

    // 맨 앞에 추가
    const updated = [search, ...favoriteSearches];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to add favorite search:", error);
  }
};

/**
 * 즐겨찾기에서 제거
 */
export const removeFavoriteSearch = (riotName: string, riotTag: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const favoriteSearches = getFavoriteSearches();
    const filtered = favoriteSearches.filter(
      (item) => !(item.riotName === riotName && item.riotTag === riotTag)
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to remove favorite search:", error);
  }
};

/**
 * 즐겨찾기 여부 확인
 */
export const isFavoriteSearch = (riotName: string, riotTag: string): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const favoriteSearches = getFavoriteSearches();
    return favoriteSearches.some((item) => item.riotName === riotName && item.riotTag === riotTag);
  } catch (error) {
    console.error("Failed to check favorite search:", error);
    return false;
  }
};

/**
 * 즐겨찾기 토글 (있으면 제거, 없으면 추가)
 */
export const toggleFavoriteSearch = (search: FavoriteSearch): boolean => {
  if (isFavoriteSearch(search.riotName, search.riotTag)) {
    removeFavoriteSearch(search.riotName, search.riotTag);
    return false;
  }
  addFavoriteSearch(search);
  return true;
};
