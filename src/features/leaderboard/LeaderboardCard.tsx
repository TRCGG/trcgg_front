import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import ChampIcon from "@/features/h2h/ChampIcon";
import { LeaderboardChampion } from "@/data/types/leaderboard";

export interface LeaderboardRow {
  key: string;
  players?: { riotName: string; riotNameTag: string }[];
  champions?: LeaderboardChampion[];
  sub: string;
  value: string;
  valueClass: string;
}

interface Props {
  title: string;
  /** 포지션 필터가 걸리는 카드에만 넘긴다 */
  positionIcon?: { src: StaticImageData; active: boolean };
  rows: LeaderboardRow[];
  isLoading: boolean;
  isError: boolean;
}

const RANK_CLASSES = [
  "bg-yellow text-darkBg2",
  "bg-leaderboard-medalSilver text-darkBg2",
  "bg-leaderboard-medalBronze text-darkBg2",
];
const DEFAULT_RANK_CLASS = "bg-leaderboard-cardBorder text-primary2";

const summonerHref = (riotName: string, riotNameTag: string) =>
  `/summoners/${encodeURIComponent(riotName)}/${encodeURIComponent(riotNameTag)}`;

const RowTitle = ({ row, highlighted }: { row: LeaderboardRow; highlighted: boolean }) => {
  if (row.players) {
    return (
      <div className="flex items-center gap-1 min-w-0 overflow-hidden whitespace-nowrap">
        {row.players.map((player, i) => (
          <Fragment key={`${player.riotName}#${player.riotNameTag}`}>
            {i > 0 && <span className="shrink-0 text-xs text-primary3">+</span>}
            <Link href={summonerHref(player.riotName, player.riotNameTag)} passHref>
              <a
                title={`${player.riotName}#${player.riotNameTag} 전적 보기`}
                className={`min-w-0 truncate text-sm font-bold hover:text-blueText transition-colors ${
                  highlighted ? "text-white" : "text-primary1"
                }`}
              >
                {player.riotName}
              </a>
            </Link>
          </Fragment>
        ))}
      </div>
    );
  }
  return (
    <span className="text-sm text-leaderboard-champName truncate">
      {row.champions?.map((c) => c.champName).join(" + ")}
    </span>
  );
};

const LeaderboardCard = ({ title, positionIcon, rows, isLoading, isError }: Props) => {
  const body = (() => {
    if (isLoading) {
      return Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="min-h-[46px] my-0.5 rounded-md bg-rankBg2 animate-pulse" />
      ));
    }
    if (isError) {
      return <p className="py-8 text-center text-sm text-redText">불러오지 못했습니다</p>;
    }
    if (rows.length === 0) {
      return <p className="py-8 text-center text-sm text-primary3">기록이 없습니다</p>;
    }
    return rows.map((row, i) => (
      <div
        key={row.key}
        className={`flex items-center gap-2.5 min-h-[46px] px-2 py-1.5 rounded-md ${
          i === 0 ? "bg-rankBg1" : ""
        }`}
      >
        <span
          className={`shrink-0 flex items-center justify-center w-[22px] h-[22px] rounded-full text-xs font-bold ${
            RANK_CLASSES[i] ?? DEFAULT_RANK_CLASS
          }`}
        >
          {i + 1}
        </span>
        {row.champions && (
          <div className="flex gap-0.5 shrink-0">
            {row.champions.map((c) => (
              <div
                key={c.champNameEng}
                title={c.champName}
                className="bg-leaderboard-iconBg rounded"
              >
                <ChampIcon en={c.champNameEng} size={30} rounded={4} />
              </div>
            ))}
          </div>
        )}
        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <RowTitle row={row} highlighted={i < 3} />
          {row.sub && <span className="text-[11px] text-leaderboard-sub truncate">{row.sub}</span>}
        </div>
        <span className={`shrink-0 text-[15px] font-bold whitespace-nowrap ${row.valueClass}`}>
          {row.value}
        </span>
      </div>
    ));
  })();

  return (
    <div className="flex flex-col bg-leaderboard-cardBg border border-leaderboard-cardBorder rounded-lg overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 pt-3.5 pb-3 border-b border-leaderboard-cardBorder">
        <h3 className="text-[15px] font-bold text-white whitespace-nowrap">{title}</h3>
        {positionIcon && (
          <span
            title="포지션 필터 적용"
            className={`shrink-0 flex ${positionIcon.active ? "" : "opacity-45"}`}
          >
            <Image src={positionIcon.src} alt="" width={13} height={13} />
          </span>
        )}
      </div>
      <div className="flex flex-col px-2 pt-1.5 pb-2">{body}</div>
    </div>
  );
};

export default LeaderboardCard;
