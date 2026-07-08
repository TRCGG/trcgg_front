import React, { useState } from "react";
import MatchDetail from "@/features/matchHistory/MatchDetail";
import { GameRecordResponse, RecentGameRecord } from "@/data/types/record";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/services/apiService";
import { getGameRecords } from "@/services/record";
import { formatTimeAgo } from "@/utils/parseTime";
import SpriteImage from "@/components/ui/SpriteImage";
import Tooltip from "@/components/ui/Tooltip";
import { getChampionSprite } from "@/utils/spriteLoader";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getKdaColor } from "@/utils/statColors";
import ItemWithTooltip from "@/components/ui/ItemWithTooltip";
import SpellWithTooltip from "@/components/ui/SpellWithTooltip";
import RuneWithTooltip from "@/components/ui/RuneWithTooltip";

interface Props {
  matchData: RecentGameRecord;
}

const MatchItem = ({ matchData }: Props) => {
  const [isOpen, setOpen] = useState(false);
  const toggleOpen = () => setOpen((prev) => !prev);
  const isWin = matchData.gameResult === "승";

  const guildId =
    typeof window !== "undefined" ? (localStorage.getItem("guildId") ?? undefined) : undefined;

  const { data: gameData, isLoading: isLoadingGameData } = useQuery<
    ApiResponse<GameRecordResponse>
  >({
    queryKey: ["gameData", matchData.gameId, guildId],
    queryFn: () => getGameRecords(matchData.gameId, guildId),
    staleTime: 3 * 60 * 1000,
    enabled: isOpen && !!guildId,
  });

  const itemArr = [
    { slot: 0, itemId: matchData.item0 },
    { slot: 1, itemId: matchData.item1 },
    { slot: 2, itemId: matchData.item2 },
    { slot: 3, itemId: matchData.item3 },
    { slot: 4, itemId: matchData.item4 },
    { slot: 5, itemId: matchData.item5 },
  ];

  const kdaRate =
    matchData.death === 0
      ? matchData.kill + matchData.assist
      : (matchData.kill + matchData.assist) / matchData.death;

  const durationMin = Math.floor(matchData.timePlayed / 60);
  const durationSec = String(matchData.timePlayed % 60).padStart(2, "0");

  return (
    <div className="flex flex-col gap-1.5">
      <div
        role="button"
        tabIndex={0}
        onClick={toggleOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") toggleOpen();
        }}
        className={`flex w-full rounded-lg cursor-pointer transition-opacity hover:opacity-90 ${
          isWin ? "bg-blueDarken" : "bg-redDarken"
        }`}
      >
        {/* 좌측 - 승패 + 게임 시간 + 경과 시간 */}
        <div
          className={`flex flex-col items-center justify-center gap-1.5 w-[52px] sm:w-[68px] shrink-0 py-3 border-r rounded-l-lg ${
            isWin ? "bg-blue/20 border-blue/30" : "bg-red/20 border-red/30"
          }`}
        >
          <span className={`text-sm font-bold ${isWin ? "text-blueText" : "text-redText"}`}>
            {isWin ? "승" : "패"}
          </span>
          <div className={`w-7 h-px ${isWin ? "bg-blueText/20" : "bg-redText/20"}`} />
          <span className="text-primary2 text-xs text-center leading-snug">
            {durationMin}:{durationSec}
          </span>
          <span className="text-primary2 text-xs text-center leading-snug whitespace-nowrap">
            {formatTimeAgo(matchData.createDate)}
          </span>
        </div>

        {/* 본문 */}
        <div className="flex flex-1 items-center gap-2 sm:gap-4 px-2 sm:px-4 py-2 sm:py-3 min-w-0">
          {/* 챔피언 이미지 + 레벨 뱃지 */}
          <Tooltip content={matchData.champName} compact className="relative shrink-0">
            <SpriteImage
              spriteData={getChampionSprite(matchData.champNameEng)}
              width={40}
              height={40}
              alt="챔피언"
              fallbackSrc={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/champion/${matchData.champNameEng}.png`}
              className="w-10 h-10 sm:hidden rounded-md"
            />
            <SpriteImage
              spriteData={getChampionSprite(matchData.champNameEng)}
              width={56}
              height={56}
              alt="챔피언"
              fallbackSrc={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/champion/${matchData.champNameEng}.png`}
              className="hidden sm:block w-14 h-14 rounded-md"
            />
            <span className="absolute -bottom-1 -right-1 bg-black text-primary1 text-[9px] font-bold rounded px-1 leading-4 border border-border1">
              {matchData.level}
            </span>
          </Tooltip>

          {/* 스펠 + 룬 */}
          {/* 모바일 */}
          <div className="sm:hidden flex gap-0.5 shrink-0">
            <div className="flex flex-col gap-0.5">
              {matchData.summonerSpell1Key && (
                <SpellWithTooltip
                  spellKey={matchData.summonerSpell1Key}
                  spellName={matchData.summonerSpell1Name}
                  width={18}
                  height={18}
                  alt="스펠 1"
                  className="w-[18px] h-[18px] rounded-sm"
                />
              )}
              {matchData.summonerSpell2Key && (
                <SpellWithTooltip
                  spellKey={matchData.summonerSpell2Key}
                  spellName={matchData.summonerSpell2Name}
                  width={18}
                  height={18}
                  alt="스펠 2"
                  className="w-[18px] h-[18px] rounded-sm"
                />
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              {matchData.keystoneIcon && (
                <RuneWithTooltip
                  iconPath={matchData.keystoneIcon}
                  runeName={matchData.keystoneName}
                  width={18}
                  height={18}
                  alt="메인 룬"
                />
              )}
              {matchData.substyleIcon && (
                <RuneWithTooltip
                  iconPath={matchData.substyleIcon}
                  runeName={matchData.substyleName}
                  width={18}
                  height={18}
                  alt="서브 룬"
                />
              )}
            </div>
          </div>
          {/* 데스크탑 */}
          <div className="hidden sm:flex gap-0.5 shrink-0">
            <div className="flex flex-col gap-0.5">
              {matchData.summonerSpell1Key && (
                <SpellWithTooltip
                  spellKey={matchData.summonerSpell1Key}
                  spellName={matchData.summonerSpell1Name}
                  width={24}
                  height={24}
                  alt="스펠 1"
                  className="w-6 h-6 rounded-sm"
                />
              )}
              {matchData.summonerSpell2Key && (
                <SpellWithTooltip
                  spellKey={matchData.summonerSpell2Key}
                  spellName={matchData.summonerSpell2Name}
                  width={24}
                  height={24}
                  alt="스펠 2"
                  className="w-6 h-6 rounded-sm"
                />
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              {matchData.keystoneIcon && (
                <RuneWithTooltip
                  iconPath={matchData.keystoneIcon}
                  runeName={matchData.keystoneName}
                  width={24}
                  height={24}
                  alt="메인 룬"
                />
              )}
              {matchData.substyleIcon && (
                <RuneWithTooltip
                  iconPath={matchData.substyleIcon}
                  runeName={matchData.substyleName}
                  width={24}
                  height={24}
                  alt="서브 룬"
                />
              )}
            </div>
          </div>

          {/* KDA */}
          <div className="flex flex-col justify-center items-center shrink-0">
            <div className="text-sm sm:text-base font-bold whitespace-nowrap">
              <span className="text-primary1">{matchData.kill}</span>
              <span className="text-primary2 mx-0.5 font-normal">/</span>
              <span className="text-redText">{matchData.death}</span>
              <span className="text-primary2 mx-0.5 font-normal">/</span>
              <span className="text-primary1">{matchData.assist}</span>
            </div>
            <span className={`text-xs font-semibold ${getKdaColor(kdaRate)}`}>
              {kdaRate.toFixed(2)} KDA
            </span>
          </div>

          {/* 아이템 (데스크탑) */}
          <div className="hidden sm:flex gap-1 flex-wrap min-w-0 flex-1 items-center">
            {itemArr.map((item) =>
              item.itemId !== 0 ? (
                <ItemWithTooltip
                  key={`${matchData.gameId}_${matchData.riotName}_slot${item.slot}`}
                  itemId={item.itemId}
                  width={28}
                  height={28}
                  alt={`아이템 ${item.slot + 1}`}
                  className="w-7 h-7"
                />
              ) : (
                <div
                  key={`${matchData.gameId}_${matchData.riotName}_slot${item.slot}`}
                  className="w-7 h-7 rounded-[4px] bg-border1"
                />
              )
            )}
          </div>

          {/* 아이템 (모바일) */}
          <div className="sm:hidden grid grid-cols-3 gap-1 shrink-0">
            {itemArr.map((item) =>
              item.itemId !== 0 ? (
                <ItemWithTooltip
                  key={`${matchData.gameId}_${matchData.riotName}_slot${item.slot}`}
                  itemId={item.itemId}
                  width={18}
                  height={18}
                  alt={`아이템 ${item.slot + 1}`}
                  className="w-[18px] h-[18px]"
                />
              ) : (
                <div
                  key={`${matchData.gameId}_${matchData.riotName}_slot${item.slot}`}
                  className="w-[18px] h-[18px] rounded-[4px] bg-border1"
                />
              )
            )}
          </div>
        </div>

        {/* 펼치기 버튼 */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleOpen();
          }}
          className={`flex flex-col justify-center items-center w-8 sm:w-10 shrink-0 transition-colors rounded-r-lg ${
            isWin ? "bg-blue hover:bg-blueHover" : "bg-red hover:bg-redHover"
          }`}
        >
          <span className="sr-only">펼치기</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`w-5 h-5 transition-transform duration-150 ${
              isOpen ? "rotate-180" : "rotate-0"
            } ${isWin ? "text-blueButton" : "text-redButton"}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <>
          {isLoadingGameData && <LoadingSpinner />}
          {!isLoadingGameData && gameData?.data?.data && (
            <div className="flex flex-col w-full">
              <MatchDetail participantData={gameData.data.data} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MatchItem;
