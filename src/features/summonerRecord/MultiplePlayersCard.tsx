import Card from "@/components/ui/Card";
import React from "react";
import { useRouter } from "next/router";
import { MultiplePlayerInfo } from "@/data/types/record";

interface Props {
  riotName: string;
  players: MultiplePlayerInfo[];
}

const MultiplePlayersCard = ({ riotName, players }: Props) => {
  const router = useRouter();
  return (
    <main className="mt-14 flex flex-col gap-3 md:min-w-[1080px]">
      <div className="flex flex-col text-white">
        <Card className="w-full p-4 text-center mt-10">
          <p>해당 클랜 내 &quot;{riotName}&quot; 유저에 대한 검색 결과입니다.</p>
        </Card>
        <Card className="w-full p-2">
          <div className="flex flex-col gap-2 items-center">
            {players.map((player) => (
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
        </Card>
      </div>
    </main>
  );
};

export default MultiplePlayersCard;
