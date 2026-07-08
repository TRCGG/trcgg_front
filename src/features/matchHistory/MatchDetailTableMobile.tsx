import Image from "next/image";
import React from "react";
import PlayerNameButton from "@/features/matchHistory/PlayerNameButton";
import ShieldIcon from "@/assets/images/shield.png";
import EyeIcon from "@/assets/images/eye.png";
import SwordIcon from "@/assets/images/sword.png";
import WardIcon from "@/assets/images/ward.png";
import SpriteImage from "@/components/ui/SpriteImage";
import Tooltip from "@/components/ui/Tooltip";
import { getChampionSprite } from "@/utils/spriteLoader";
import { getKdaColor } from "@/utils/statColors";
import ItemWithTooltip from "@/components/ui/ItemWithTooltip";
import SpellWithTooltip from "@/components/ui/SpellWithTooltip";
import RuneWithTooltip from "@/components/ui/RuneWithTooltip";

interface Player {
  name: string;
  tag: string;
  champName: string;
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
  maxDamage: number;
  maxDamageTaken: number;
}

const MatchDetailTableMobile = ({
  players,
  isWin,
  maxDamage,
  maxDamageTaken,
}: MatchDetailProps) => {
  return (
    <div className={`${isWin ? "bg-blueLighten" : "bg-redLighten"} rounded-md text-xs p-0.5`}>
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_0.7fr] place-items-center text-center gap-y-1 py-[2px]">
        {/* 데이터 행 */}
        {players.map((player) => (
          <React.Fragment key={`${player.name}-${player.tag}`}>
            {/* 1. 챔피언 이미지, 룬 스펠 */}
            <div className="flex gap-1 w-[56px] h-[24px]">
              <Tooltip content={player.champName} compact>
                <SpriteImage
                  spriteData={getChampionSprite(player.champNameEng)}
                  width={24}
                  height={24}
                  alt="챔피언"
                  fallbackSrc={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/champion/${player.champNameEng}.png`}
                  className="w-[24px] h-[24px]"
                />
              </Tooltip>
              <div className="flex">
                <div className="flex flex-col gap-0">
                  <SpellWithTooltip
                    spellKey={player.spells[0]}
                    spellName={player.spellNames[0]}
                    width={12}
                    height={12}
                    alt="스펠 1"
                    className="w-[12px] h-[12px]"
                  />
                  <SpellWithTooltip
                    spellKey={player.spells[1]}
                    spellName={player.spellNames[1]}
                    width={12}
                    height={12}
                    alt="스펠 2"
                    className="w-[12px] h-[12px]"
                  />
                </div>
                <div className="flex flex-col gap-0">
                  <RuneWithTooltip
                    iconPath={player.keystone}
                    runeName={player.keystoneName}
                    width={12}
                    height={12}
                    alt="룬 1"
                  />
                  <RuneWithTooltip
                    iconPath={player.perk}
                    runeName={player.perkName}
                    width={12}
                    height={12}
                    alt="룬 2"
                  />
                </div>
              </div>
            </div>

            {/* 2. 챔피언 이름, 아이템 */}
            <div className="flex flex-col gap-x-1 text-left justify-self-start w-[72px] max-w-[72px]">
              <PlayerNameButton name={player.name} tag={player.tag} isCenter={false} />
              <div className="w-[72px] flex gap-px">
                {[0, 1, 2, 3, 4, 5].map((slot) =>
                  player.items[slot] !== 0 ? (
                    <ItemWithTooltip
                      key={`slot-${slot}`}
                      itemId={player.items[slot]}
                      width={12}
                      height={12}
                      alt={`아이템 ${slot + 1}`}
                      className="w-[12px] h-[12px]"
                    />
                  ) : (
                    <div
                      key={`empty-slot-${slot}`}
                      className="w-[12px] h-[12px] rounded-[4px] bg-border1 shrink-0"
                    />
                  )
                )}
              </div>
            </div>

            {/* 4. KDA */}
            <div className="flex flex-col">
              <span>{player.kda}</span>
              <span className={`text-xs font-semibold ${getKdaColor(player.kdaRate)}`}>
                {player.kdaRate.toFixed(2)} KDA
              </span>
            </div>

            {/* 6. 준 피해량, 받은 피해량 */}
            <div className="flex flex-col w-full px-1 gap-y-0.5">
              <div className="flex items-center gap-x-1">
                <Image
                  src={SwordIcon}
                  alt="sword icon"
                  width={10}
                  height={10}
                  className="shrink-0"
                />
                <span className="tabular-nums">{player.damage.toLocaleString()}</span>
              </div>
              <div
                className="h-1 w-full rounded-full overflow-hidden"
                style={{ backgroundColor: "#1C1F24" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(player.damage / maxDamage) * 100}%`,
                    background: "linear-gradient(90deg,#E8913C,#F5C877)",
                  }}
                />
              </div>
              <div className="flex items-center gap-x-1 mt-0.5">
                <Image
                  src={ShieldIcon}
                  alt="shield icon"
                  width={10}
                  height={10}
                  className="shrink-0"
                />
                <span className="tabular-nums">{player.damageTaken.toLocaleString()}</span>
              </div>
              <div
                className="h-1 w-full rounded-full overflow-hidden"
                style={{ backgroundColor: "#1C1F24" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(player.damageTaken / maxDamageTaken) * 100}%`,
                    backgroundColor: "#6B74A0",
                  }}
                />
              </div>
            </div>

            {/* 시야 점수, 제어 와드 개수 */}
            <div className="flex flex-col items-baseline">
              <div className="flex gap-x-1.5 items-center">
                <Tooltip content="시야 점수" compact>
                  <div className="flex items-center justify-center w-4 h-4">
                    <Image
                      src={EyeIcon}
                      alt="vision score icon"
                      width={16}
                      height={16}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </Tooltip>
                <span>{player.visionScore}</span>
              </div>
              <div className="flex gap-x-1.5 items-center">
                <Tooltip content="제어 와드 개수" compact>
                  <div className="flex items-center justify-center w-4 h-4">
                    <Image
                      src={WardIcon}
                      alt="ward icon"
                      width={16}
                      height={16}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </Tooltip>
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
