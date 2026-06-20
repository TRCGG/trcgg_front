import { useEffect, useState } from "react";
import { H2HMatchup } from "@/data/types/h2h";
import { TopLanePair, diffColor, v2WinRateColor } from "./h2hHelpers";
import ChampIcon from "./ChampIcon";
import LaneIcon from "./LaneIcon";
import SectionCard from "./SectionCard";
import H2HTopLanePairCard from "./H2HTopLanePairCard";
import LoadMoreButton from "./LoadMoreButton";
import { SameLaneChip, SortChip, SortOption } from "./chips";

const PAGE_SIZE = 5;

const H2HChampMatchupRow = ({ matchup }: { matchup: H2HMatchup }) => {
  const wr = Math.round((matchup.wins / matchup.count) * 100);
  const kdaDiffNum = parseFloat(matchup.kdaDiff);
  return (
    <div
      title={`${matchup.myChamp} vs ${matchup.oppoChamp}`}
      className="bg-darkBg1 border border-border2 flex items-center gap-2 rounded px-3 py-2.5 sm:grid sm:grid-cols-[8px_auto_1fr_90px_90px_56px] sm:gap-3 sm:px-3.5"
      style={{ borderLeft: `3px solid ${v2WinRateColor(wr)}` }}
    >
      <span className="hidden sm:block" />
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {matchup.myLane && <LaneIcon position={matchup.myLane} size={16} />}
        <ChampIcon en={matchup.myChamp} size={36} mine />
        <div className="flex shrink-0 flex-col items-center gap-px">
          <span
            className="text-redText"
            style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em" }}
          >
            VS
          </span>
          <span className="text-primary2" style={{ fontSize: 10, fontFeatureSettings: '"tnum"' }}>
            {matchup.count}판
          </span>
        </div>
        <ChampIcon en={matchup.oppoChamp} size={36} />
        {matchup.oppoLane && <LaneIcon position={matchup.oppoLane} size={16} />}
      </div>
      <div
        className="text-primary2 shrink-0 text-xs sm:text-[13px]"
        style={{ fontFeatureSettings: '"tnum"' }}
      >
        <b className="text-blueText">{matchup.wins}</b>승{" "}
        <b className="text-redText">{matchup.count - matchup.wins}</b>패
      </div>
      <div className="hidden text-center sm:block">
        <div className="text-primary2" style={{ fontSize: 11 }}>
          내 KDA
        </div>
        <div className="text-primary1" style={{ fontSize: 13, fontFeatureSettings: '"tnum"' }}>
          {matchup.myKda}
        </div>
      </div>
      <div className="hidden text-center sm:block">
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
        className="ml-auto shrink-0 text-right text-base sm:ml-0 sm:text-lg"
        style={{ fontWeight: 700, color: v2WinRateColor(wr), fontFeatureSettings: '"tnum"' }}
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

type MatchupSort = "count" | "winRate" | "kda";

const SORT_OPTIONS: SortOption<MatchupSort>[] = [
  { key: "count", label: "판수순" },
  { key: "winRate", label: "승률순" },
  { key: "kda", label: "KDA순" },
];

const H2HChampMatchups = ({ matchups, topLanePair, sameLaneOnly, onToggleSameLane }: Props) => {
  const [sortBy, setSortBy] = useState<MatchupSort>("count");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = sameLaneOnly
    ? matchups.filter((m) => !m.oppoLane || m.oppoLane === m.myLane)
    : matchups;

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "winRate") {
      return b.wins / b.count - a.wins / a.count;
    }
    if (sortBy === "kda") {
      return (parseFloat(b.myKda) || 0) - (parseFloat(a.myKda) || 0);
    }
    return b.count - a.count;
  });

  // 정렬/필터 변경 시 다시 5개부터
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [sortBy, sameLaneOnly]);

  const shown = sorted.slice(0, visible);
  const remaining = sorted.length - shown.length;

  return (
    <SectionCard
      title="라인 · 챔피언 매치업"
      subtitle={`${sorted.length}개 매치업${
        sameLaneOnly ? " · 맞라인(동일 position)만" : " · 같은 게임 적팀 전체"
      }`}
      rightSlot={
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <SameLaneChip active={sameLaneOnly} onChange={onToggleSameLane} />
          <SortChip value={sortBy} options={SORT_OPTIONS} onChange={setSortBy} />
        </div>
      }
    >
      <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
        {topLanePair && (
          <H2HTopLanePairCard label="가장 많이 맞붙은 라인" {...topLanePair} separator="vs" />
        )}
        {sorted.length > 0 ? (
          shown.map((m, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <H2HChampMatchupRow key={i} matchup={m} />
          ))
        ) : (
          <div className="text-primary2" style={{ padding: 24, textAlign: "center", fontSize: 13 }}>
            매치업이 없어요
          </div>
        )}
        {remaining > 0 && (
          <LoadMoreButton onClick={() => setVisible((v) => v + PAGE_SIZE)} remaining={remaining} />
        )}
      </div>
    </SectionCard>
  );
};

export default H2HChampMatchups;
