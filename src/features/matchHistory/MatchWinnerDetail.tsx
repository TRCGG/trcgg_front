import Image from "next/image";
import React from "react";
import PlayerNameButton from "@/features/matchHistory/PlayerNameButton";

interface Player {
  name: string;
  tag: string;
  championImage: string;
  kda: string;
  damage: number;
  wards: number;
}

interface MatchDetailProps {
  players: Player[];
}

const MatchWinnerDetail = ({ players }: MatchDetailProps) => {
  return (
    <div className="bg-blueLighten rounded-md text-xs sm:text-base">
      <div className="grid grid-cols-[0.7fr_2fr_0.7fr_1.3fr_1fr_0.7fr] place-items-center text-center gap-y-1 py-[2px] whitespace-nowrap">
        {/* 제목 행 */}
        <div className="bg-border1 text-white font-bold w-full">결과</div>
        <div className="bg-border1 text-white font-bold w-full">소환사명</div>
        <div className="bg-border1 text-white font-bold w-full">챔피언</div>
        <div className="bg-border1 text-white font-bold w-full">KDA</div>
        <div className="bg-border1 text-white font-bold w-full">피해량</div>
        <div className="bg-border1 text-white font-bold w-full">제어와드</div>

        {/* 데이터 행 */}
        <div className="text-white flex items-center justify-center row-span-5 text-base sm:text-xl font-medium">
          승리
        </div>

        {players.map((player) => (
          <React.Fragment key={`${player.name}-${player.tag}`}>
            <PlayerNameButton name={player.name} tag={player.tag} />

            <div className="flex items-center w-[36px] h-[36px] sm:w-[48px] sm:h-[48px]">
              <Image width={48} height={48} alt="챔피언" src={player.championImage} />
            </div>

            <div>{player.kda}</div>
            <div>{player.damage}</div>
            <div>{player.wards}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
export default MatchWinnerDetail;
