import React from "react";
import { ApiResponse } from "@/services/apiService";
import { UserSearchResult } from "@/data/types/user";
import UserSearchLoadingSkeleton from "@/features/search/UserSearchLoadingSkeleton";

interface Props {
  data: ApiResponse<UserSearchResult[]> | undefined;
  isLoading: boolean;
  isError: boolean;
}

const UserSearchResultList = ({ data, isLoading, isError }: Props) => {
  if (isLoading) return <UserSearchLoadingSkeleton />;
  if (isError || !data || !data.data) return null;

  if (data.data.toString().endsWith("계정이 게임 기록에 존재하지 않습니다.")) {
    return (
      <div className="text-white bg-darkBg2 z-10 md:absolute md:mt-px md:w-[400px] md:rounded-bl-lg md:rounded-br-lg md:shadow-2xl block">
        <div className="max-h-[430px] overflow-y-auto">
          <div className="px-3 py-2 text-sm font-bold">소환사 리스트</div>
          <div className="flex items-center gap-2 border-t border-rankBg1 px-3 py-2 last-of-type:md:rounded-bl-lg last-of-type:md:rounded-br-lg">
            유저를 찾을 수 없습니다.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white bg-darkBg2 md:absolute md:mt-px md:w-[400px] md:rounded-bl-lg md:rounded-br-lg md:shadow-2xl block">
      <div className="max-h-[430px] overflow-y-auto">
        <div className="px-3 py-2 text-sm font-bold">소환사 리스트</div>
        {data.data.map((user) => (
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
        ))}
      </div>
    </div>
  );
};

export default UserSearchResultList;
