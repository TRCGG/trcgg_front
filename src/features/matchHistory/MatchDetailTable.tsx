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

const MatchDetailTable = ({ players, isWin }: MatchDetailProps) => {
  return (
    <div className={`${isWin ? "bg-blueLighten" : "bg-redLighten"} rounded-md text-base`}>
      <div className="grid grid-cols-[1.5fr_0.5fr_1.5fr_1fr_1fr_1fr_1fr] place-items-center text-center gap-y-1 py-[2px] whitespace-nowrap">
        {/* 제목 행 */}
        {isWin && (
          <>
            <div className="bg-border1 text-white font-bold w-full">소환사명</div>
            <div className="bg-border1 text-white font-bold w-full">챔피언</div>
            <div className="bg-border1 text-white font-bold w-full">빌드</div>
            <div className="bg-border1 text-white font-bold w-full">KDA</div>
            <div className="bg-border1 text-white font-bold w-full">킬관여율</div>
            <div className="bg-border1 text-white font-bold w-full">피해량</div>
            <div className="bg-border1 text-white font-bold w-full">시야</div>
          </>
        )}

        {/* 데이터 행 */}
        {players.map((player) => (
          <React.Fragment key={`${player.name}-${player.tag}`}>
            {/* 1. 챔피언 이름 */}
            <PlayerNameButton name={player.name} tag={player.tag} />

            {/* 2. 챔피언 이미지 */}
            <div className="flex text-left w-[36px] h-[36px]">
              <SpriteImage
                spriteData={getChampionSprite(player.champNameEng)}
                width={36}
                height={36}
                alt="챔피언"
                fallbackSrc={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/champion/${player.champNameEng}.png`}
                className="w-[36px] h-[36px]"
              />
            </div>

            {/* 3. 빌드(룬, 스펠, 아이템) */}
            <div className="flex gap-x-2">
              <div className="flex">
                <div className="flex flex-col gap-0">
                  <SpriteImage
                    spriteData={getSummonerSpellSprite(player.spells[0])}
                    width={18}
                    height={18}
                    alt="스펠 1"
                    fallbackSrc={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/spell/${player.spells[0]}.png`}
                    className="w-[18px] h-[18px]"
                  />
                  <SpriteImage
                    spriteData={getSummonerSpellSprite(player.spells[1])}
                    width={18}
                    height={18}
                    alt="스펠 2"
                    fallbackSrc={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/spell/${player.spells[1]}.png`}
                    className="w-[18px] h-[18px]"
                  />
                </div>
                <div className="flex flex-col">
                  <Image
                    width={18}
                    height={18}
                    alt="룬 1"
                    src={`https://ddragon.leagueoflegends.com/cdn/img/${player.keystone}`}
                    loading="lazy"
                    unoptimized
                  />
                  <Image
                    width={18}
                    height={18}
                    alt="룬 2"
                    src={`https://ddragon.leagueoflegends.com/cdn/img/${player.perk}`}
                    loading="lazy"
                    unoptimized
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 grid-rows-2 max-w-[96px]">
                {player.items
                  .filter((item) => item !== 0)
                  .map((item, index) => (
                    <SpriteImage
                      key={item}
                      spriteData={getItemSprite(item)}
                      width={18}
                      height={18}
                      alt={`아이템 ${index + 1}`}
                      fallbackSrc={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/item/${item}.png`}
                      className="w-[18px] h-[18px]"
                    />
                  ))}
              </div>
            </div>

            {/* 4. KDA */}
            <div className="flex flex-col">
              <span>{player.kda}</span>
              <span className="text-xs text-neonGreen">{player.kdaRate.toFixed(2)} KDA</span>
            </div>

            {/* 5. 킬 관여율 */}
            <div>{player.killParticipation}%</div>

            {/* 6. 준 피해량, 받은 피해량 */}
            <div className="flex flex-col items-baseline">
              <div className="flex gap-x-1.5">
                <div className="flex items-center justify-center">
                  <Image
                    src={SwordIcon}
                    alt="sword icon"
                    width={20}
                    height={20}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span>{player.damage.toLocaleString()}</span>
              </div>

              <div className="flex gap-x-1.5">
                <div className="flex items-center justify-center">
                  <Image
                    src={ShieldIcon}
                    alt="shield icon"
                    width={20}
                    height={20}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span>{player.damageTaken.toLocaleString()}</span>
              </div>
            </div>

            {/* 시야 점수, 제어 와드 개수 */}
            <div className="flex flex-col items-baseline">
              <div className="flex gap-x-1.5">
                <div className="flex items-center justify-center">
                  <Image
                    src={EyeIcon}
                    alt="vision score icon"
                    width={20}
                    height={20}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span>{player.visionScore}</span>
              </div>
              <div className="flex gap-x-1.5">
                <div className="flex items-center justify-center w-5 h-5">
                  <Image
                    src={WardIcon}
                    alt="ward icon"
                    width={20}
                    height={20}
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
export default MatchDetailTable;
