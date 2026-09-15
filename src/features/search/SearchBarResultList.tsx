import React from "react";
import { useRouter } from "next/router";
import { PlayerInfo } from "@/data/types/user";

interface Props {
  users: PlayerInfo[];
  isLoading: boolean;
  isError: boolean;
  enable: boolean;
  searchTerm: string;
}

const SearchBarResultList = ({ users, isLoading, isError, enable, searchTerm }: Props) => {
  const router = useRouter();

  const handleUserClick = (riotName: string, riotTag: string) => {
    router.push(`/summoners/${encodeURIComponent(riotName)}/${encodeURIComponent(riotTag)}`);
  };

  if (isLoading || searchTerm.length < 2) {
    return null;
  }

  const panelClass = `text-white bg-darkBg2 absolute w-full md:w-[400px] md:rounded-bl-lg md:rounded-br-lg md:shadow-2xl transition-opacity duration-150 ${
    enable ? "opacity-100 visible" : "opacity-0 invisible"
  }`;

  // 요청 실패와 "결과 없음"은 다른 상황이다. 예전엔 둘 다 조용히 사라져서
  // 서버가 죽어도 검색 결과가 없는 것처럼 보였다.
  if (isError) {
    return (
      <div className={panelClass}>
        <div className="px-3 py-4 text-center text-sm text-redText">
          검색에 실패했습니다. 잠시 후 다시 시도해주세요.
        </div>
      </div>
    );
  }

  // 결과가 없으면 패널 자체를 띄우지 않는다. 헤더만 있는 빈 목록이 열리는 것을 막는다.
  if (users.length === 0) {
    return null;
  }

  return (
    <div className={panelClass}>
      <div className="max-h-[430px] overflow-y-auto scrollbar-thin scrollbar-thumb-border1 scrollbar-track-darkBg2">
        <div className="px-3 py-2 text-sm font-bold">소환사 리스트</div>
        {users.map((user) => (
          <button
            type="button"
            key={user.playerCode}
            onClick={() => handleUserClick(user.riotName, user.riotNameTag)}
            className="flex items-center gap-2 border-t border-rankBg1 px-3 py-2 hover:bg-rankBg2 focus:bg-gray-100 focus:outline-none focus:ring-0 last-of-type:md:rounded-bl-lg last-of-type:md:rounded-br-lg w-full text-left"
          >
            <span className="flex flex-1 flex-col truncate">
              <span className="truncate text-sm text-white">
                <b>{user.riotName}</b>
                <em className="ml-1 text-gray">#{user.riotNameTag}</em>
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBarResultList;
