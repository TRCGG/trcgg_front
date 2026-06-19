import { FrequentOpponent } from "@/data/types/h2h";
import { formatAgo, v2WinRateColor } from "./h2hHelpers";
import LaneIcon from "./LaneIcon";

interface Props {
  opponent: FrequentOpponent;
  onSelect: (opponent: FrequentOpponent) => void;
}

const FrequentOpponentCardLarge = ({ opponent, onSelect }: Props) => {
  const wr = Math.round(opponent.winRate);
  return (
    <button
      type="button"
      onClick={() => onSelect(opponent)}
      className="bg-darkBg2 border border-border2 text-white"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 14,
        borderRadius: 4,
        textAlign: "left",
        cursor: "pointer",
        transition: "border-color 120ms, background 120ms",
        width: "100%",
      }}
    >
      <div
        className="bg-rankBg2 border border-border1 text-primary2"
        style={{
          width: 44,
          height: 44,
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontWeight: 700,
          fontSize: 16,
          position: "relative",
        }}
      >
        {opponent.riotName.slice(0, 1)}
        <div
          className="bg-darkBg2 border border-border1"
          style={{
            position: "absolute",
            right: -4,
            bottom: -4,
            width: 18,
            height: 18,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LaneIcon position={opponent.mainLane} size={12} />
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          className="text-primary1"
          style={{
            fontSize: 14,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontWeight: 500,
          }}
        >
          {opponent.riotName}
          <span className="text-primary2" style={{ fontWeight: 400, marginLeft: 4 }}>
            #{opponent.riotNameTag}
          </span>
        </div>
        <div
          className="text-primary2"
          style={{ display: "flex", gap: 8, marginTop: 4, fontSize: 11 }}
        >
          <span>
            <b className="text-primary1">{opponent.matchups}</b>판
          </span>
          <span className="bg-border1" style={{ width: 1 }} />
          <span style={{ color: v2WinRateColor(wr) }}>승률 {wr}%</span>
          <span className="bg-border1" style={{ width: 1 }} />
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
