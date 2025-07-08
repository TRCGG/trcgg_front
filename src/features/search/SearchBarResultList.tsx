import React from "react";
import { PlayerInfo } from "@/data/types/user";

interface Props {
  users: PlayerInfo[] | undefined;
  isLoading: boolean;
  isError: boolean;
  enable: boolean;
  searchTerm: string;
}

const SearchBarResultList = ({ users, isLoading, isError, enable, searchTerm }: Props) => {
  if (isLoading || isError || !users || !Array.isArray(users) || searchTerm.length < 2) {
    return null;
  }

  return (
    <div
      className={`text-white bg-darkBg2 absolute w-full md:w-[400px] md:rounded-bl-lg md:rounded-br-lg md:shadow-2xl transition-opacity duration-150 ${
        enable ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div className="max-h-[430px] overflow-y-auto scrollbar-thin scrollbar-thumb-border1 scrollbar-track-darkBg2">
        <div className="px-3 py-2 text-sm font-bold">소환사 리스트</div>
        {users.map((user) => (
          <a
            key={user.puuid}
            href={`/summoners/${encodeURIComponent(user.riot_name)}/${encodeURIComponent(user.riot_name_tag)}`}
            className="flex items-center gap-2 border-t border-rankBg1 px-3 py-2 hover:bg-rankBg2 focus:bg-gray-100 focus:outline-none focus:ring-0 last-of-type:md:rounded-bl-lg last-of-type:md:rounded-br-lg"
          >
            <span className="flex flex-1 flex-col truncate">
              <span className="truncate text-sm text-white">
                <b>{user.riot_name}</b>
                <em className="ml-1 text-gray">#{user.riot_name_tag}</em>
              </span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SearchBarResultList;
