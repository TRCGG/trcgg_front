import Image from "next/image";

interface Player {
  name: string;
  championImage: string;
  kda: string;
  damage: string;
  wards: string;
}

interface MatchDetailProps {
  players: Player[];
}

const MatchLoserDetail = ({ players }: MatchDetailProps) => {
  return (
    <>
      <hr className="border-t border-border2 my-[3px]" />
      <div className="bg-redLighten rounded-md mb-5">
        <div className="grid grid-cols-6 place-items-center text-center gap-y-1 py-[2px]">
          <div className="text-white flex items-center justify-center row-span-5">패배</div>
          {players.map((player) => (
            <>
              <div key={`${player.name}-name`} className="truncate w-[100px]">
                {player.name}
              </div>
              <div key={`${player.name}-champion`} className="flex items-center w-[48px] h-[48px]">
                <Image width={48} height={48} alt="챔피언" src={player.championImage} />
              </div>
              <div key={`${player.name}-kda`}>{player.kda}</div>
              <div key={`${player.name}-damage`}>{player.damage}</div>
              <div key={`${player.name}-wards`}>{player.wards}</div>
            </>
          ))}
        </div>
      </div>
    </>
  );
};
export default MatchLoserDetail;
