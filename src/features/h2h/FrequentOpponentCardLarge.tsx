import { FrequentOpponent } from "@/data/types/h2h";
import { formatAgo, v2WinRateColor } from "./h2hHelpers";
import LaneIcon from "./LaneIcon";

interface Props {
  opponent: FrequentOpponent;
  onSelect: (opponent: { riotName: string; riotNameTag?: string }) => void;
}

const FrequentOpponentCardLarge = ({ opponent, onSelect }: Props) => {
  const wr = Math.round(opponent.winRate);
  return (
    <button
      type="button"
      onClick={() => onSelect({ riotName: opponent.riotName, riotNameTag: opponent.riotNameTag })}
      className="bg-darkBg2 border border-border2 text-white flex items-center gap-3 p-3.5 rounded text-left cursor-pointer transition-[border-color,background] duration-[120ms] w-full"
    >
      <div className="bg-rankBg2 border border-border1 text-primary2 w-11 h-11 rounded-md flex items-center justify-center shrink-0 font-bold text-base relative">
        {opponent.riotName.slice(0, 1)}
        <div className="bg-darkBg2 border border-border1 absolute -right-1 -bottom-1 w-[18px] h-[18px] rounded-full flex items-center justify-center">
          <LaneIcon position={opponent.mainLane} size={12} />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-primary1 text-sm overflow-hidden text-ellipsis whitespace-nowrap font-normal">
          {opponent.riotName}
          <span className="text-primary2 font-normal ml-1">#{opponent.riotNameTag}</span>
        </div>
        <div className="text-primary2 flex gap-2 mt-1 text-[11px]">
          <span>
            <b className="text-primary1">{opponent.matchups}</b>판
          </span>
          <span className="bg-border1 w-[1px]" />
          <span style={{ color: v2WinRateColor(wr) }}>승률 {wr}%</span>
          <span className="bg-border1 w-[1px]" />
          <span>{formatAgo(opponent.lastPlayedDate)}</span>
        </div>
      </div>
      <svg
        className="stroke-primary2"
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={2}
      >
        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
};

export default FrequentOpponentCardLarge;
