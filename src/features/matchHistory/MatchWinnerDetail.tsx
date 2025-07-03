import Image from "next/image";
import React from "react";

interface Player {
  name: string;
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
    <div className="bg-blueLighten rounded-md">
      <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] place-items-center text-center gap-y-1 py-2 whitespace-nowrap">
        {/* 제목 행 */}
        <div className="bg-border1 text-white font-bold w-full">결과</div>
        <div className="bg-border1 text-white font-bold w-full">소환사명</div>
        <div className="bg-border1 text-white font-bold w-full">챔피언</div>
        <div className="bg-border1 text-white font-bold w-full">KDA</div>
        <div className="bg-border1 text-white font-bold w-full">피해량</div>
        <div className="bg-border1 text-white font-bold w-full">제어와드</div>

        {/* 데이터 행 */}
        <div className="text-white flex items-center justify-center row-span-5">승리</div>
        {players.map((player) => (
          <React.Fragment key={`${player.name}-name`}>
            <div className="truncate">{player.name}</div>
            <div
              key={`${player.name}-champion`}
              title={player.name}
              className="flex items-center h-12 truncate"
            >
              <Image width={48} height={48} alt="챔피언" src={player.championImage} />
            </div>
            <div key={`${player.name}-kda-`}>{player.kda}</div>
            <div key={`${player.name}-damage`}>{player.damage}</div>
            <div key={`${player.name}-wards`}>{player.wards}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
export default MatchWinnerDetail;
