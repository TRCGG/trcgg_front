import React, { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import Image from "next/image";
import MatchDetail from "@/features/matchHistory/MatchDetail";
import { GameRecordResponse, RecentGame } from "@/data/types/record";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/services/apiService";
import { getGameRecords } from "@/services/record";
import { formatTimeAgo } from "@/utils/parseTime";

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

  const itemArr = [
    matchData.item0,
    matchData.item1,
    matchData.item2,
    matchData.item3,
    matchData.item4,
    matchData.item5,
    // matchData.item6, // Trinket(와드 토템, 예언자의 렌즈, 파란 정찰 와드 등을 통칭)
  ];

  return (
    <div className="flex flex-col gap-2">
      <div
        role="button"
        tabIndex={0}
        onClick={toggleOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") toggleOpen();
        }}
        className={`flex w-full h-auto min-h-[86px] rounded-md border-l-[15px] ${isWin ? "bg-blueDarken border-blue" : "bg-redDarken border-red"}`}
      >
        <div className="w-full grid grid-cols-[0.7fr_0.7fr_0.7fr_1.5fr_2fr_1fr] md:grid-cols-[72px_72px_100px_64px_200px_84px] items-center justify-between px-3">
          {/* 1. 시간 및 승/패 */}
          <div className="flex flex-col text-xs sm:text-sm">
            <span
              className="relative group cursor-pointer text-sm sm:text-base"
              title={new Date(matchData.create_date).toLocaleString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            >
              {formatTimeAgo(matchData.create_date)}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block px-3 py-1 rounded bg-black text-white whitespace-nowrap z-10  text-sm sm:text-base">
                {new Date(matchData.create_date).toLocaleString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-black" />
              </div>
            </span>
            <span className={` ${isWin ? "text-blueText" : "text-redText"}`}>
              {isWin ? "승리" : "패배"}
            </span>
            <span className="whitespace-nowrap">
              {Math.floor(matchData.time_played / 60)}분 {matchData.time_played % 60}초
            </span>
          </div>

          {/* 2. 챔피온 아이콘 */}
          <div className="flex justify-center">
            <Image
              width={56}
              height={56}
              alt="챔피언"
              src={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/champion/${matchData.champ_name_eng}.png`}
            />
          </div>

          {/* 챔피온 명 */}
          <div className="text-base sm:text-lg whitespace-nowrap">{matchData.champ_name}</div>

          {/* 4. 스펠, 룬 */}
          <div className="flex">
            <div className="flex flex-col gap-0">
              <Image
                width={28}
                height={28}
                alt="스펠 1"
                src={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/spell/SummonerHaste.png`} // FIXME : 정현님과 논의 후 수정 필요
                // src={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/spell/${matchData.summoner_spell_1}.png`}
              />
              <Image
                width={28}
                height={28}
                alt="스펠 2"
                src={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/spell/SummonerFlash.png`}
              />
            </div>
            <div className="flex flex-col">
              <Image
                width={28}
                height={28}
                alt="룬 1"
                src="https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7200_Domination.png"
              />
              <Image
                width={28}
                height={28}
                alt="룬 1"
                src="https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png"
              />
            </div>
          </div>

          {/* 5. 아이템 */}
          <div className="grid grid-cols-3 grid-rows-2 max-w-[96px] md:flex md:flex-row md:max-w-[192px]">
            {itemArr
              .filter((item) => item !== 0)
              .map((item, index) => (
                <Image
                  key={item}
                  width={28}
                  height={28}
                  alt={`아이템 ${index + 1}`}
                  src={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/item/${item}.png`}
                />
              ))}
          </div>

          {/* 6. KDA */}
          <div className="flex flex-col sm:text-lg whitespace-nowrap items-center">
            <span>
              {matchData.kill} / {matchData.death} / {matchData.assist}
            </span>
            <span className="text-xs sm:text-sm text-neonGreen">
              {((matchData.kill + matchData.assist) / matchData.death).toFixed(2)} KDA
            </span>
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
      </div>

      {isOpen && gameData?.data?.data && (
        <div className="flex flex-col w-full">
          <MatchDetail participantData={gameData?.data?.data} />
        </div>
      )}
    </div>
  );
};
export default MatchItem;
