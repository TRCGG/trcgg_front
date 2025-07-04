import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import Image from "next/image";
import MatchDetail from "@/features/matchHistory/MatchDetail";
import { GameRecordResponse, RecentGame } from "@/data/types/record";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/services/apiService";
import { getGameRecords } from "@/services/record";

interface Props {
  matchData: RecentGame;
}

const MatchItem = ({ matchData }: Props) => {
  const [isOpen, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!isOpen);
  const isWin = matchData.game_result === "승";

  const guildId =
    typeof window !== "undefined" ? (localStorage.getItem("guildId") ?? undefined) : undefined;

  const { data: gameData } = useQuery<ApiResponse<GameRecordResponse>>({
    queryKey: ["gameData", matchData.game_id, guildId],
    queryFn: () => getGameRecords(matchData.game_id, guildId),
    staleTime: 3 * 60 * 1000,
    enabled: isOpen && !!guildId,
  });

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        className={`flex w-full h-auto min-h-24 rounded-md border-l-[15px] ${isWin ? "bg-blueDarken border-blue" : "bg-redDarken border-red"}`}
        onClick={toggleOpen}
      >
        <div className="flex flex-1 items-center justify-between px-5">
          <div className="flex flex-1 items-center gap-14">
            {/* 챔피온 아이콘 */}
            <div>
              <Image
                width={48}
                height={48}
                alt="챔피언"
                src={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/champion/${matchData.champ_name_eng}.png`}
              />
            </div>

            {/* 챔피온 명 */}
            <div className="text-lg whitespace-nowrap">{matchData.champ_name}</div>
          </div>

          {/* KDA */}
          <div className="text-lg whitespace-nowrap">
            {matchData.kill} / {matchData.death} / {matchData.assist}
          </div>
        </div>

        {/* 펼치기 버튼 */}
        <div className="relative flex md:basis-10 md:flex-col justify-center">
          <button
            className={`flex flex-1 flex-col justify-center items-center rounded-md ${isWin ? "bg-blue hover:bg-blueHover" : "bg-red hover:bg-redHover"}`}
            type="button"
            onClick={toggleOpen}
          >
            <span className="sr-only">Show More Detail Games</span>
            <MdKeyboardArrowDown
              className={`text-[2rem] transition-transform duration-150 ease-out transform ${isOpen ? "rotate-[180deg]" : "rotate-[0deg]"} ${isWin ? "text-blueButton" : "text-redButton"}`}
            />
          </button>
        </div>
      </button>
      {isOpen && gameData?.data?.data && (
        <div className="flex flex-col w-full">
          <MatchDetail participantData={gameData?.data?.data} />
        </div>
      )}
    </div>
  );
};
export default MatchItem;
