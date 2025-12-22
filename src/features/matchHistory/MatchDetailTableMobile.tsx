import Image from "next/image";
import React from "react";
import PlayerNameButton from "@/features/matchHistory/PlayerNameButton";
import ShieldIcon from "@/assets/images/shield.png";
import EyeIcon from "@/assets/images/eye.png";
import SwordIcon from "@/assets/images/sword.png";
import WardIcon from "@/assets/images/ward.png";
import SpriteImage from "@/components/ui/SpriteImage";
import { getChampionSprite, getItemSprite, getSummonerSpellSprite } from "@/utils/spriteLoader";

interface Player {
  name: string;
  tag: string;
  champNameEng: string;
  kda: string;
  kdaRate: number;
  damage: number;
  damageTaken: number;
  visionScore: number;
  wards: number;
  items: number[];
  spells: string[];
  keystone: string;
  perk: string;
  killParticipation: number;
}

interface MatchDetailProps {
  players: Player[];
  isWin: boolean;
}

const MatchDetailTableMobile = ({ players, isWin }: MatchDetailProps) => {
  return (
    <div className={`${isWin ? "bg-blueLighten" : "bg-redLighten"} rounded-md text-xs p-0.5`}>
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_0.7fr] place-items-center text-center gap-y-1 py-[2px]">
        {/* 데이터 행 */}
        {players.map((player) => (
          <React.Fragment key={`${player.name}-${player.tag}`}>
            {/* 1. 챔피언 이미지, 룬 스펠 */}
            <div className="flex gap-1 w-[56px] h-[24px]">
              <SpriteImage
                spriteData={getChampionSprite(player.champNameEng)}
                width={24}
                height={24}
                alt="챔피언"
                fallbackSrc={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/champion/${player.champNameEng}.png`}
                className="w-[24px] h-[24px]"
              />
              <div className="flex">
                <div className="flex flex-col gap-0">
                  <SpriteImage
                    spriteData={getSummonerSpellSprite(player.spells[0])}
                    width={12}
                    height={12}
                    alt="스펠 1"
                    fallbackSrc={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/spell/${player.spells[0]}.png`}
                    className="w-[12px] h-[12px]"
                  />
                  <SpriteImage
                    spriteData={getSummonerSpellSprite(player.spells[1])}
                    width={12}
                    height={12}
                    alt="스펠 2"
                    fallbackSrc={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/spell/${player.spells[1]}.png`}
                    className="w-[12px] h-[12px]"
                  />
                </div>
                <div className="flex flex-col">
                  <Image
                    width={12}
                    height={12}
                    alt="룬 1"
                    src={`https://ddragon.leagueoflegends.com/cdn/img/${player.keystone}`}
                    loading="lazy"
                    unoptimized
                  />
                  <Image
                    width={12}
                    height={12}
                    alt="룬 2"
                    src={`https://ddragon.leagueoflegends.com/cdn/img/${player.perk}`}
                    loading="lazy"
                    unoptimized
                  />
                </div>
              </div>
            </div>

            {/* 2. 챔피언 이름, 아이템 */}
            <div className="flex flex-col gap-x-1 text-left justify-self-start w-[72px] max-w-[72px]">
              <PlayerNameButton name={player.name} tag={player.tag} isCenter={false} />
              <div className="w-[72px] flex">
                {player.items
                  .filter((item) => item !== 0)
                  .map((item, index) => (
                    <SpriteImage
                      key={item}
                      spriteData={getItemSprite(item)}
                      width={12}
                      height={12}
                      alt={`아이템 ${index + 1}`}
                      fallbackSrc={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/item/${item}.png`}
                      className="w-[12px] h-[12px]"
                    />
                  ))}
              </div>
            </div>

            {/* 4. KDA */}
            <div className="flex flex-col">
              <span>{player.kda}</span>
              <span className="text-xs text-neonGreen">{player.kdaRate.toFixed(2)} KDA</span>
            </div>

            {/* 6. 준 피해량, 받은 피해량 */}
            <div className="flex flex-col items-baseline">
              <div className="flex gap-x-1.5 items-center">
                <div className="flex items-center justify-center w-4 h-4">
                  <Image
                    src={SwordIcon}
                    alt="sword icon"
                    width={16}
                    height={16}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span>{player.damage.toLocaleString()}</span>
              </div>

              <div className="flex gap-x-1.5 items-center">
                <div className="flex items-center justify-center w-4 h-4">
                  <Image
                    src={ShieldIcon}
                    alt="shield icon"
                    width={16}
                    height={16}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span>{player.damageTaken.toLocaleString()}</span>
              </div>
            </div>

            {/* 시야 점수, 제어 와드 개수 */}
            <div className="flex flex-col items-baseline">
              <div className="flex gap-x-1.5 items-center">
                <div className="flex items-center justify-center w-4 h-4">
                  <Image
                    src={EyeIcon}
                    alt="vision score icon"
                    width={16}
                    height={16}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span>{player.visionScore}</span>
              </div>
              <div className="flex gap-x-1.5 items-center">
                <div className="flex items-center justify-center w-4 h-4">
                  <Image
                    src={WardIcon}
                    alt="ward icon"
                    width={16}
                    height={16}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span>{player.wards}</span>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
export default MatchDetailTableMobile;
