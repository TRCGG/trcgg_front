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

const MatchLoserDetail = ({ players }: MatchDetailProps) => {
  return (
    <>
      <hr className="border-t border-border2 my-[3px]" />
      <div className="bg-redLighten rounded-md mb-5 text-xs sm:text-base">
        <div className="grid grid-cols-[0.7fr_2fr_0.7fr_1.3fr_1fr_0.7fr] place-items-center text-center gap-y-1 py-[2px] whitespace-nowrap">
          <div className="text-white flex items-center justify-center row-span-5 text-base sm:text-xl font-medium">
            패배
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
    </>
  );
};

export default MatchLoserDetail;
