import Image from "next/image";
import React from "react";
import PlayerNameButton from "@/features/matchHistory/PlayerNameButton";
import EyeIcon from "@/assets/images/eye.png";
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
  level: number;
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

interface TeamSummary {
  kills: number;
  deaths: number;
  assists: number;
  damage: number;
}

interface MatchDetailProps {
  players: Player[];
  isWin: boolean;
  maxDamage: number;
  maxDamageTaken: number;
  teamLabel: string;
  teamSummary: TeamSummary;
}

// 챔피언 · 소환사 · 빌드 · KDA · 관여 · 가한피해 · 받은피해 · 시야
// 소환사 열만 유동(1fr)으로 남는 공간을 흡수하고 나머지는 고정폭으로 좁게 잡아,
// 최소 레이아웃 폭(min-w-[1080px])에서도 최근 전적 카드 안에 들어가도록 한다.
const GRID_COLUMNS = "40px minmax(76px,1fr) 112px 78px 54px 88px 88px 50px";

const MatchDetailTable = ({
  players,
  isWin,
  maxDamage,
  maxDamageTaken,
  teamLabel,
  teamSummary,
}: MatchDetailProps) => {
  const accent = isWin ? "#58A6FF" : "#F2789F";
  const accentRgb = isWin ? "88,166,255" : "242,120,159";
  const headerBg = isWin ? "#0E1A2B" : "#241019";
  const rowTint = `rgba(${accentRgb},0.04)`;
  const pillBg = `rgba(${accentRgb},0.14)`;

  return (
    <div className="w-full min-w-0 bg-darkBg2 border border-cardBorder rounded-[10px] overflow-hidden text-base">
      {/* 팀 요약 헤더 */}
      <div
        className="flex items-center justify-between py-2 pr-4"
        style={{ backgroundColor: headerBg, borderLeft: `3px solid ${accent}` }}
      >
        <div className="flex items-center gap-2.5 pl-3">
          <span
            className="text-xs font-bold rounded px-2 py-0.5"
            style={{ color: accent, backgroundColor: pillBg }}
          >
            {isWin ? "승리" : "패배"}
          </span>
          <span className="text-xs text-primary2">{teamLabel}</span>
        </div>
        <div className="flex items-center gap-4 text-xs tabular-nums">
          <span className="text-primary2">
            합계{" "}
            <span className="text-primary1 font-bold">
              {teamSummary.kills} / {teamSummary.deaths} / {teamSummary.assists}
            </span>
          </span>
          <span className="text-primary2">
            딜{" "}
            <span className="text-primary1 font-bold">{teamSummary.damage.toLocaleString()}</span>
          </span>
        </div>
      </div>

      {/* 열 제목 */}
      <div
        className="grid items-center gap-1.5 px-3 py-1.5 text-[11px] text-primary3 text-center"
        style={{ gridTemplateColumns: GRID_COLUMNS }}
      >
        <div />
        <div>소환사</div>
        <div>빌드</div>
        <div>KDA</div>
        <div>관여</div>
        <div>가한 피해</div>
        <div>받은 피해</div>
        <div>시야</div>
      </div>

      {/* 플레이어 행 */}
      {players.map((player) => (
        <div
          key={`${player.name}-${player.tag}`}
          className="grid items-center gap-1.5 px-3 py-[7px]"
          style={{
            gridTemplateColumns: GRID_COLUMNS,
            backgroundColor: rowTint,
            borderBottom: "1px solid #141619",
          }}
        >
          {/* 1. 챔피언 + 레벨 배지 */}
          <div className="relative w-9 h-9">
            <Tooltip content={player.champName} compact>
              <SpriteImage
                spriteData={getChampionSprite(player.champNameEng)}
                width={36}
                height={36}
                alt="챔피언"
                fallbackSrc={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/champion/${player.champNameEng}.png`}
                className="w-9 h-9 rounded-lg"
              />
            </Tooltip>
            <span
              className="absolute -bottom-1 -right-1 text-[9px] font-bold leading-none text-primary1 rounded px-1 py-px border border-border1"
              style={{ backgroundColor: "#0A0B0D" }}
            >
              {player.level}
            </span>
          </div>

          {/* 2. 소환사 */}
          <div className="min-w-0">
            <PlayerNameButton
              name={player.name}
              tag={player.tag}
              isCenter={false}
              className="text-[13px] text-primary1"
            />
          </div>

          {/* 3. 빌드 (스펠·룬·아이템) */}
          <div className="flex items-center gap-1.5">
            <div className="flex">
              <div className="flex flex-col">
                <SpellWithTooltip
                  spellKey={player.spells[0]}
                  spellName={player.spellNames[0]}
                  width={20}
                  height={20}
                  alt="스펠 1"
                  className="w-[20px] h-[20px]"
                />
                <SpellWithTooltip
                  spellKey={player.spells[1]}
                  spellName={player.spellNames[1]}
                  width={20}
                  height={20}
                  alt="스펠 2"
                  className="w-[20px] h-[20px]"
                />
              </div>
              <div className="flex flex-col">
                <RuneWithTooltip
                  iconPath={player.keystone}
                  runeName={player.keystoneName}
                  width={20}
                  height={20}
                  alt="룬 1"
                />
                <RuneWithTooltip
                  iconPath={player.perk}
                  runeName={player.perkName}
                  width={20}
                  height={20}
                  alt="룬 2"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-[2px]">
              {[0, 1, 2, 3, 4, 5].map((slot) =>
                player.items[slot] !== 0 ? (
                  <ItemWithTooltip
                    key={`slot-${slot}`}
                    itemId={player.items[slot]}
                    width={20}
                    height={20}
                    alt={`아이템 ${slot + 1}`}
                    className="w-[20px] h-[20px] rounded-[3px]"
                  />
                ) : (
                  <div
                    key={`empty-slot-${slot}`}
                    className="w-[20px] h-[20px] rounded-[3px]"
                    style={{ backgroundColor: "#1C1F24" }}
                  />
                )
              )}
            </div>
          </div>

          {/* 4. KDA */}
          <div className="flex flex-col items-center">
            <span className="text-xs tabular-nums text-primary1">{player.kda}</span>
            <span className={`text-[11px] font-bold tabular-nums ${getKdaColor(player.kdaRate)}`}>
              {player.kdaRate.toFixed(2)} KDA
            </span>
          </div>

          {/* 5. 관여 */}
          <div className="text-center text-xs text-primary2 tabular-nums">
            {player.killParticipation}%
          </div>

          {/* 6. 가한 피해 */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] tabular-nums text-primary1">
              {player.damage.toLocaleString()}
            </span>
            <div
              className="h-1.5 w-full rounded-full overflow-hidden"
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
          </div>

          {/* 7. 받은 피해 */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] tabular-nums text-primary1">
              {player.damageTaken.toLocaleString()}
            </span>
            <div
              className="h-1.5 w-full rounded-full overflow-hidden"
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

          {/* 8. 시야 */}
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1">
              <Tooltip content="시야 점수" compact>
                <div className="flex items-center justify-center w-3.5 h-3.5">
                  <Image
                    src={EyeIcon}
                    alt="vision score icon"
                    width={14}
                    height={14}
                    className="w-full h-full object-contain"
                  />
                </div>
              </Tooltip>
              <span className="text-xs tabular-nums text-primary1">{player.visionScore}</span>
            </div>
            <div className="flex items-center gap-1">
              <Tooltip content="제어 와드 개수" compact>
                <div className="flex items-center justify-center w-3 h-3">
                  <Image
                    src={WardIcon}
                    alt="ward icon"
                    width={12}
                    height={12}
                    className="w-full h-full object-contain"
                  />
                </div>
              </Tooltip>
              <span className="text-[10px] text-primary3 tabular-nums">와드 {player.wards}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchDetailTable;
