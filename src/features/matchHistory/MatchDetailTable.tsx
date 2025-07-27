import Image from "next/image";
import React from "react";
import PlayerNameButton from "@/features/matchHistory/PlayerNameButton";
import LaneSupportLogo from "@/assets/images/laneSupport.png";
import { LuEye } from "react-icons/lu";
import { TbSwords, TbShield } from "react-icons/tb";

interface Player {
  name: string;
  tag: string;
  championImage: string;
  kda: string;
  kdaRate: number;
  damage: number;
  damageTaken: number;
  visionScore: number;
  wards: number;
  items: number[];
  spells: number[];
  keystone: number;
  perk: number;
  killParticipation: number;
}

interface MatchDetailProps {
  players: Player[];
  isWin: boolean;
}

const MatchDetailTable = ({ players, isWin }: MatchDetailProps) => {
  return (
    <div
      className={`${isWin ? "bg-blueLighten" : "bg-redLighten"} rounded-md text-xs sm:text-base`}
    >
      <div className="grid grid-cols-[1.5fr_0.5fr_2fr_1fr_1fr_1fr_1fr] place-items-center text-center gap-y-1 py-[2px] whitespace-nowrap">
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
            {/* 챔피언 이름 */}
            <PlayerNameButton name={player.name} tag={player.tag} />

            {/* 챔피언 이미지 */}
            <div className="flex text-left w-[28px] h-[28px] sm:w-[36px] sm:h-[36px]">
              <Image width={36} height={36} alt="챔피언" src={player.championImage} />
            </div>

            {/* 룬, 스펠, 아이템 */}
            <div className="flex gap-x-2">
              <div className="flex">
                <div className="flex flex-col gap-0">
                  <Image
                    width={18}
                    height={18}
                    alt="스펠 1"
                    src={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/spell/SummonerHaste.png`} // FIXME : 정현님과 논의 후 수정 필요
                    // src={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/spell/${matchData.summoner_spell_1}.png`}
                  />
                  <Image
                    width={18}
                    height={18}
                    alt="스펠 2"
                    src={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/spell/SummonerFlash.png`}
                  />
                </div>
                <div className="flex flex-col">
                  <Image
                    width={18}
                    height={18}
                    alt="룬 1"
                    src="https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7200_Domination.png"
                  />
                  <Image
                    width={18}
                    height={18}
                    alt="룬 1"
                    src="https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 grid-rows-2 max-w-[96px]">
                {player.items
                  .filter((item) => item !== 0)
                  .map((item, index) => (
                    <Image
                      key={item}
                      width={18}
                      height={18}
                      alt={`아이템 ${index + 1}`}
                      src={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/item/${item}.png`}
                    />
                  ))}
              </div>
            </div>

            {/* KDA */}
            <div className="flex flex-col">
              <span>{player.kda}</span>
              <span className="text-xs text-neonGreen">{player.kdaRate.toFixed(2)} KDA</span>
            </div>

            {/* 킬 관여율 */}
            <div>{player.killParticipation}%</div>

            {/* 준 피해량, 받은 피해량 */}
            <div className="flex flex-col items-baseline">
              <div className="flex gap-x-1.5">
                <div className="flex items-center justify-center">
                  <TbSwords className="w-5 h-5 text-primary2 stroke-[1.5]" />
                </div>
                <span>{player.damage.toLocaleString()}</span>
              </div>

              <div className="flex gap-x-1.5">
                <div className="flex items-center justify-center">
                  <TbShield className="w-5 h-5 text-primary2 stroke-[1.5]" />
                </div>
                <span>{player.damageTaken.toLocaleString()}</span>
              </div>
            </div>

            {/* 시야 점수, 제어 와드 개수 */}
            <div className="flex flex-col items-baseline">
              <div className="flex gap-x-1.5">
                <div className="flex items-center justify-center">
                  <LuEye className="w-5 h-5 text-primary2 stroke-[1.5]" />
                </div>
                <span>{player.visionScore}</span>
              </div>
              <div className="flex gap-x-1.5">
                <div className="flex items-center justify-center w-5 h-5">
                  <Image
                    src={LaneSupportLogo}
                    alt="lane logo"
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
