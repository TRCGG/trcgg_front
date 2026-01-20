import Image from "next/image";
import React from "react";
import PlayerNameButton from "@/features/matchHistory/PlayerNameButton";
import ShieldIcon from "@/assets/images/shield.png";
import EyeIcon from "@/assets/images/eye.png";
import SwordIcon from "@/assets/images/sword.png";
import WardIcon from "@/assets/images/ward.png";
import SpriteImage from "@/components/ui/SpriteImage";
import { getChampionSprite } from "@/utils/spriteLoader";
import { getKdaColor } from "@/utils/statColors";
import ItemWithTooltip from "@/components/ui/ItemWithTooltip";
import SpellWithTooltip from "@/components/ui/SpellWithTooltip";
import RuneWithTooltip from "@/components/ui/RuneWithTooltip";

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
  spellNames: string[];
  keystone: string;
  keystoneName: string;
  perk: string;
  perkName: string;
  killParticipation: number;
}

interface MatchDetailProps {
  players: Player[];
  isWin: boolean;
}

const MatchDetailTable = ({ players, isWin }: MatchDetailProps) => {
  return (
    <div className={`${isWin ? "bg-blueLighten" : "bg-redLighten"} rounded-md text-base`}>
      <div className="grid grid-cols-[0.7fr_100px_1.2fr_0.8fr_0.7fr_1fr_0.8fr] place-items-center text-center gap-y-1 py-[2px] whitespace-nowrap">
        {/* 제목 행 */}
        {isWin && (
          <>
            <div className="bg-border1 text-white font-bold w-full">챔피언</div>
            <div className="bg-border1 text-white font-bold w-full">소환사명</div>
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
            {/* 1. 챔피언 이미지 */}
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

            {/* 2. 소환사명 */}
            <PlayerNameButton name={player.name} tag={player.tag} isCenter={false} />

            {/* 3. 빌드(룬, 스펠, 아이템) */}
            <div className="flex gap-x-2">
              <div className="flex">
                <div className="flex flex-col gap-0">
                  <SpellWithTooltip
                    spellKey={player.spells[0]}
                    spellName={player.spellNames[0]}
                    width={18}
                    height={18}
                    alt="스펠 1"
                    className="w-[18px] h-[18px]"
                  />
                  <SpellWithTooltip
                    spellKey={player.spells[1]}
                    spellName={player.spellNames[1]}
                    width={18}
                    height={18}
                    alt="스펠 2"
                    className="w-[18px] h-[18px]"
                  />
                </div>
                <div className="flex flex-col gap-0">
                  <RuneWithTooltip
                    iconPath={player.keystone}
                    runeName={player.keystoneName}
                    width={18}
                    height={18}
                    alt="룬 1"
                  />
                  <RuneWithTooltip
                    iconPath={player.perk}
                    runeName={player.perkName}
                    width={18}
                    height={18}
                    alt="룬 2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 grid-rows-2 max-w-[96px]">
                {player.items
                  .filter((item) => item !== 0)
                  .map((item, index) => (
                    <ItemWithTooltip
                      key={item}
                      itemId={item}
                      width={18}
                      height={18}
                      alt={`아이템 ${index + 1}`}
                      className="w-[18px] h-[18px]"
                    />
                  ))}
              </div>
            </div>

            {/* 4. KDA */}
            <div className="flex flex-col">
              <span>{player.kda}</span>
              <span className={`text-xs font-semibold ${getKdaColor(player.kdaRate)}`}>
                {player.kdaRate.toFixed(2)} KDA
              </span>
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
