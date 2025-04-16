import React from "react";
import { ApiResponse } from "@/services/apiService";
import { UserSearchResult } from "@/data/types/user";

interface Props {
  data: ApiResponse<UserSearchResult[]> | undefined;
  isLoading: boolean;
  isError: boolean;
  enable: boolean;
}

const UserSearchResultList = ({ data, isLoading, isError, enable }: Props) => {
  let content;

  if (isLoading || isError || !data || !Array.isArray(data.data)) {
    content = (
      <div className="flex items-center gap-2 border-t border-rankBg1 px-3 py-2">
        유저를 찾을 수 없습니다.
      </div>
    );
  } else {
    content = data.data.map((user) => (
      <a
        key={user.puuid}
        href={`/summoners/${encodeURIComponent(user.riot_name)}`}
        className="flex items-center gap-2 border-t border-rankBg1 px-3 py-2 hover:bg-rankBg2 focus:bg-gray-100 focus:outline-none focus:ring-0 last-of-type:md:rounded-bl-lg last-of-type:md:rounded-br-lg"
      >
        <span className="flex flex-1 flex-col truncate">
          <span className="truncate text-sm text-white">
            <b>{user.riot_name}</b>
            <em className="ml-1 text-gray">#{user.riot_name_tag}</em>
          </span>
        </span>
      </a>
    ));
  }

  return (
    <div
      className={`text-white bg-darkBg2 md:absolute md:mt-px md:w-[400px] md:rounded-bl-lg md:rounded-br-lg md:shadow-2xl transition-opacity duration-150 ${
        enable ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div className="max-h-[430px] overflow-y-auto scrollbar-thin scrollbar-thumb-border1 scrollbar-track-darkBg2">
        <div className="px-3 py-2 text-sm font-bold">소환사 리스트</div>
        {content}
      </div>
    </div>
  );
};

export default UserSearchResultList;
