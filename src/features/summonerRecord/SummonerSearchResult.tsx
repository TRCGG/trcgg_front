import React, { useState } from "react";
import { useRouter } from "next/router";
import Card from "@/components/ui/Card";
import { UserRecordResponse, PlayerInfo } from "@/data/types/record";
import EmptySearchResultCard from "@/features/summonerRecord/EmptySearchResultCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface Props {
  riotNameString: string;
  userRecordData: UserRecordResponse | null;
  isLoading: boolean;
}

const SummonerSearchResult = ({ riotNameString, userRecordData, isLoading }: Props) => {
  const router = useRouter();

  // 타입 가드: data가 PlayerInfo[] 배열인지 확인
  const isPlayerInfoArray = (data: unknown): data is PlayerInfo[] => {
    return Array.isArray(data);
  };

  const players =
    userRecordData?.data && isPlayerInfoArray(userRecordData.data) ? userRecordData.data : null;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = players ? Math.ceil(players.length / itemsPerPage) : 1;
  const pagedPlayers = players?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const setPage = (pageNum: number) => {
    setCurrentPage(pageNum);
  };

  if (isLoading || (players && players.length === 1)) {
    return (
      <main>
        <LoadingSpinner />
      </main>
    );
  }

  if (players && players.length > 1) {
    return (
      <main className="mt-10 md:mt-12 flex flex-col gap-3 md:min-w-[1080px]">
        <div className="flex flex-col text-white">
          <Card className="w-full p-4 text-center">
            <p>해당 클랜 내 &quot;{riotNameString}&quot; 유저에 대한 검색 결과입니다.</p>
          </Card>
          <Card className="w-full p-2">
            <div className="flex flex-col gap-2 items-center">
              {pagedPlayers?.map((player) => (
                <button
                  key={player.playerCode}
                  type="button"
                  className="bg-darkBg1 w-full max-w-[900px] p-4 text-left"
                  onClick={() =>
                    router.push(
                      `/summoners/${encodeURIComponent(player.riotName)}/${encodeURIComponent(player.riotNameTag)}`
                    )
                  }
                >
                  {player.riotName} #{player.riotNameTag}
                </button>
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-4 text-white">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 border rounded ${
                    currentPage === i + 1 ? "bg-primary1 text-black" : "text-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </main>
    );
  }

  return <EmptySearchResultCard riotName={riotNameString} />;
};

export default SummonerSearchResult;
