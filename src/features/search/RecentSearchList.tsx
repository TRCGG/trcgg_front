import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoTimeOutline } from "react-icons/io5";
import { getRecentSearches, removeRecentSearch, RecentSearch } from "@/utils/recentSearches";

interface Props {
  enable: boolean;
  onSearchClick: (riotName: string, riotTag: string) => void;
}

const RecentSearchList = ({ enable, onSearchClick }: Props) => {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  useEffect(() => {
    if (enable) {
      const searches = getRecentSearches();
      setRecentSearches(searches);
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

  if (!enable || recentSearches.length === 0) {
    return null;
  }

  return (
    <div
      className={`text-white bg-darkBg2 absolute w-full md:w-[400px] md:rounded-bl-lg md:rounded-br-lg md:shadow-2xl transition-opacity duration-150 ${
        enable ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div className="max-h-[430px] overflow-y-auto scrollbar-thin scrollbar-thumb-border1 scrollbar-track-darkBg2">
        <div className="px-3 py-2 text-sm font-bold flex items-center gap-1">
          <IoTimeOutline className="w-4 h-4" />
          최근 검색어
        </div>
        {recentSearches.map((search) => (
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
            <button
              type="button"
              onClick={(e) => handleDelete(e, search.riotName, search.riotTag)}
              className="text-gray hover:text-white transition-colors"
              aria-label="삭제"
            >
              <IoMdClose className="w-5 h-5" />
            </button>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentSearchList;
