import React, { useEffect, useState } from "react";
import { IoMdClose, IoMdStar, IoMdStarOutline } from "react-icons/io";
import { IoTimeOutline } from "react-icons/io5";
import { getRecentSearches, removeRecentSearch, RecentSearch } from "@/utils/recentSearches";
import {
  getFavoriteSearches,
  toggleFavoriteSearch,
  isFavoriteSearch,
  FavoriteSearch,
} from "@/utils/favoriteSearches";

interface Props {
  enable: boolean;
  onSearchClick: (riotName: string, riotTag: string) => void;
}

type TabType = "recent" | "favorite";

const RecentSearchList = ({ enable, onSearchClick }: Props) => {
  const [activeTab, setActiveTab] = useState<TabType>("recent");
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [favoriteSearches, setFavoriteSearches] = useState<FavoriteSearch[]>([]);

  useEffect(() => {
    if (enable) {
      const searches = getRecentSearches();
      const favorites = getFavoriteSearches();
      setRecentSearches(searches);
      setFavoriteSearches(favorites);
    }
  }, [enable]);

  const handleDelete = (e: React.MouseEvent, riotName: string, riotTag: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeRecentSearch(riotName, riotTag);
    setRecentSearches((prev) =>
      prev.filter((s) => s.riotName !== riotName || s.riotTag !== riotTag)
    );
  };

  const handleToggleFavorite = (
    e: React.MouseEvent,
    riotName: string,
    riotTag: string,
    fromFavoriteTab: boolean
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const isFavorite = toggleFavoriteSearch({ riotName, riotTag });

    // 즐겨찾기 리스트 갱신
    const updatedFavorites = getFavoriteSearches();
    setFavoriteSearches(updatedFavorites);

    // 만약 즐겨찾기 탭에서 제거한 경우, 최근 검색어도 갱신
    if (!isFavorite && fromFavoriteTab) {
      const searches = getRecentSearches();
      setRecentSearches(searches);
    }
  };

  const currentList = activeTab === "recent" ? recentSearches : favoriteSearches;

  if (!enable || (recentSearches.length === 0 && favoriteSearches.length === 0)) {
    return null;
  }

  return (
    <div
      className={`text-white bg-darkBg2 absolute w-full md:w-[400px] md:rounded-bl-lg md:rounded-br-lg md:shadow-2xl transition-opacity duration-150 ${
        enable ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {/* 탭 헤더 */}
      <div className="flex border-b border-border1">
        <button
          type="button"
          onClick={() => setActiveTab("recent")}
          className={`flex-1 px-3 py-2 text-sm font-bold flex items-center justify-center gap-1 transition-colors ${
            activeTab === "recent"
              ? "text-white bg-rankBg2"
              : "text-gray hover:text-white hover:bg-rankBg3"
          }`}
        >
          <IoTimeOutline className="w-4 h-4" />
          최근 검색어
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("favorite")}
          className={`flex-1 px-3 py-2 text-sm font-bold flex items-center justify-center gap-1 transition-colors ${
            activeTab === "favorite"
              ? "text-white bg-rankBg2"
              : "text-gray hover:text-white hover:bg-rankBg3"
          }`}
        >
          <IoMdStar className="w-4 h-4" />
          즐겨찾기
        </button>
      </div>

      {/* 리스트 */}
      <div className="max-h-[430px] overflow-y-auto scrollbar-thin scrollbar-thumb-border1 scrollbar-track-darkBg2">
        {currentList.length === 0 ? (
          <div className="px-3 py-8 text-center text-gray text-sm">
            {activeTab === "recent" ? "최근 검색 기록이 없습니다" : "즐겨찾기가 없습니다"}
          </div>
        ) : (
          currentList.map((search) => {
            const isFav = isFavoriteSearch(search.riotName, search.riotTag);
            return (
              <button
                type="button"
                key={`${search.riotName}-${search.riotTag}`}
                onClick={() => onSearchClick(search.riotName, search.riotTag)}
                className="flex items-center gap-2 border-t border-rankBg1 px-3 py-2 hover:bg-rankBg2 focus:bg-gray-100 focus:outline-none focus:ring-0 last-of-type:md:rounded-bl-lg last-of-type:md:rounded-br-lg w-full"
              >
                <span className="flex flex-1 flex-col truncate text-left">
                  <span className="truncate text-sm text-white">
                    <b>{search.riotName}</b>
                    <em className="ml-1 text-gray">#{search.riotTag}</em>
                  </span>
                </span>

                {/* 즐겨찾기 버튼 */}
                <button
                  type="button"
                  onClick={(e) =>
                    handleToggleFavorite(
                      e,
                      search.riotName,
                      search.riotTag,
                      activeTab === "favorite"
                    )
                  }
                  className="text-gray hover:text-yellow-400 transition-colors"
                  aria-label={isFav ? "즐겨찾기 해제" : "즐겨찾기 추가"}
                >
                  {isFav ? (
                    <IoMdStar className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <IoMdStarOutline className="w-5 h-5" />
                  )}
                </button>

                {/* 삭제 버튼 (최근 검색어 탭에서만) */}
                {activeTab === "recent" && (
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, search.riotName, search.riotTag)}
                    className="text-gray hover:text-white transition-colors"
                    aria-label="삭제"
                  >
                    <IoMdClose className="w-5 h-5" />
                  </button>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentSearchList;
