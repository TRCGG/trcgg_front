import { H2HMatchup } from "@/data/types/h2h";
import { TopLanePair, diffColor, v2WinRateColor } from "./h2hHelpers";
import ChampIcon from "./ChampIcon";
import LaneIcon from "./LaneIcon";
import SectionCard from "./SectionCard";
import H2HTopLanePairCard from "./H2HTopLanePairCard";
import { SameLaneChip, SortChip } from "./chips";

const H2HChampMatchupRow = ({ matchup }: { matchup: H2HMatchup }) => {
  const wr = Math.round((matchup.wins / matchup.count) * 100);
  const kdaDiffNum = parseFloat(matchup.kdaDiff);
  return (
    <div
      title={`${matchup.myChamp} vs ${matchup.oppoChamp}`}
      className="bg-darkBg1 border border-border2"
      style={{
        display: "grid",
        gridTemplateColumns: "8px auto 1fr 90px 90px 56px",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        borderLeft: `3px solid ${v2WinRateColor(wr)}`,
        borderRadius: 4,
      }}
    >
      <span />
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {matchup.myLane && <LaneIcon position={matchup.myLane} size={16} />}
        <ChampIcon en={matchup.myChamp} size={40} mine />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flexShrink: 0,
            gap: 1,
          }}
        >
          <span
            className="text-redText"
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            VS
          </span>
          <span className="text-primary2" style={{ fontSize: 10, fontFeatureSettings: '"tnum"' }}>
            {matchup.count}판
          </span>
        </div>
        <ChampIcon en={matchup.oppoChamp} size={40} />
        {matchup.oppoLane && <LaneIcon position={matchup.oppoLane} size={16} />}
      </div>
      <div className="text-primary2" style={{ fontSize: 13, fontFeatureSettings: '"tnum"' }}>
        <b className="text-blueText">{matchup.wins}</b>승{" "}
        <b className="text-redText">{matchup.count - matchup.wins}</b>패
      </div>
      <div style={{ textAlign: "center" }}>
        <div className="text-primary2" style={{ fontSize: 11 }}>
          내 KDA
        </div>
        <div className="text-primary1" style={{ fontSize: 13, fontFeatureSettings: '"tnum"' }}>
          {matchup.myKda}
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div className="text-primary2" style={{ fontSize: 11 }}>
          KDA Diff
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: diffColor(kdaDiffNum),
            fontFeatureSettings: '"tnum"',
          }}
        >
          {matchup.kdaDiff}
        </div>
      </div>
      <div
        style={{
          textAlign: "right",
          fontSize: 18,
          fontWeight: 700,
          color: v2WinRateColor(wr),
          fontFeatureSettings: '"tnum"',
        }}
      >
        {wr}%
      </div>
    </div>
  );
};

interface Props {
  matchups: H2HMatchup[];
  topLanePair: TopLanePair | null;
  sameLaneOnly: boolean;
  onToggleSameLane: (next: boolean) => void;
}

const H2HChampMatchups = ({ matchups, topLanePair, sameLaneOnly, onToggleSameLane }: Props) => {
  const filtered = sameLaneOnly
    ? matchups.filter((m) => !m.oppoLane || m.oppoLane === m.myLane)
    : matchups;
  return (
    <SectionCard
      title="라인 · 챔피언 매치업"
      subtitle={`${filtered.length}개 매치업${
        sameLaneOnly ? " · 맞라인(동일 position)만" : " · 같은 게임 적팀 전체"
      }`}
      rightSlot={
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <SameLaneChip active={sameLaneOnly} onChange={onToggleSameLane} />
          <SortChip />
        </div>
      }
    >
      <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
        {topLanePair && (
          <H2HTopLanePairCard label="가장 많이 맞붙은 라인" {...topLanePair} separator="vs" />
        )}
        {filtered.length > 0 ? (
          filtered.map((m, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <H2HChampMatchupRow key={i} matchup={m} />
          ))
        ) : (
          <div className="text-primary2" style={{ padding: 24, textAlign: "center", fontSize: 13 }}>
            매치업이 없어요
          </div>
        )}
      </div>
    </SectionCard>
  );
};

export default H2HChampMatchups;
