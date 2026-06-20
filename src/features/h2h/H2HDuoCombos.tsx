import { useEffect, useState } from "react";
import { H2HDuoChamp, H2HLaneCombo } from "@/data/types/h2h";
import useChampionKoNames from "@/hooks/useChampionKoNames";
import { v2WinRateColor } from "./h2hHelpers";
import ChampIcon from "./ChampIcon";
import LaneIcon from "./LaneIcon";
import SectionCard from "./SectionCard";
import H2HTopLanePairCard from "./H2HTopLanePairCard";
import LoadMoreButton from "./LoadMoreButton";
import { SortChip, SortOption } from "./chips";

const PAGE_SIZE = 5;

interface RowProps {
  combo: H2HDuoChamp;
  koName: (en?: string | null) => string;
}

const H2HDuoComboRow = ({ combo, koName }: RowProps) => {
  const wr = Math.round((combo.wins / combo.count) * 100);
  return (
    <div
      title={`${koName(combo.mine)} + ${koName(combo.oppo)}`}
      className="bg-darkBg1 border border-border2 flex items-center gap-2 rounded px-3 py-2.5 sm:grid sm:grid-cols-[8px_auto_1fr_90px_56px] sm:gap-3 sm:px-3.5"
      style={{ borderLeft: `3px solid ${v2WinRateColor(wr)}` }}
    >
      <span className="hidden sm:block" />
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {combo.mineLane && <LaneIcon position={combo.mineLane} size={16} />}
        <ChampIcon en={combo.mine} size={36} mine />
        <div className="flex shrink-0 flex-col items-center gap-px">
          <span className="text-blueText" style={{ fontSize: 11, fontWeight: 700 }}>
            +
          </span>
          <span className="text-primary2" style={{ fontSize: 10, fontFeatureSettings: '"tnum"' }}>
            {combo.count}판
          </span>
        </div>
        <ChampIcon en={combo.oppo} size={36} />
        {combo.oppoLane && <LaneIcon position={combo.oppoLane} size={16} />}
      </div>
      <div
        className="text-primary2 shrink-0 text-xs sm:text-[13px]"
        style={{ fontFeatureSettings: '"tnum"' }}
      >
        <b className="text-blueText">{combo.wins}</b>승{" "}
        <b className="text-redText">{combo.count - combo.wins}</b>패
      </div>
      <div className="hidden text-center sm:block">
        <div className="text-primary2" style={{ fontSize: 11 }}>
          듀오 KDA
        </div>
        <div className="text-primary1" style={{ fontSize: 13, fontFeatureSettings: '"tnum"' }}>
          {combo.comboKda}
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
  combos: H2HDuoChamp[];
  topLaneCombo: H2HLaneCombo | null;
}

type DuoSort = "count" | "winRate" | "kda";

const SORT_OPTIONS: SortOption<DuoSort>[] = [
  { key: "count", label: "판수순" },
  { key: "winRate", label: "승률순" },
  { key: "kda", label: "KDA순" },
];

const H2HDuoCombos = ({ combos, topLaneCombo }: Props) => {
  const koName = useChampionKoNames();
  const [sortBy, setSortBy] = useState<DuoSort>("count");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const sorted = [...combos].sort((a, b) => {
    if (sortBy === "winRate") {
      return b.wins / b.count - a.wins / a.count;
    }
    if (sortBy === "kda") {
      return (parseFloat(b.comboKda) || 0) - (parseFloat(a.comboKda) || 0);
    }
    return b.count - a.count;
  });

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [sortBy]);

  const shown = sorted.slice(0, visible);
  const remaining = sorted.length - shown.length;

  return (
    <SectionCard
      title="자주 가는 듀오 픽"
      subtitle={`${combos.length}개 조합 · 판수 ≥ 2`}
      rightSlot={<SortChip value={sortBy} options={SORT_OPTIONS} onChange={setSortBy} />}
    >
      <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
        {topLaneCombo && (
          <H2HTopLanePairCard
            label="가장 많이 함께한 포지션"
            myLane={topLaneCombo.mine}
            oppoLane={topLaneCombo.oppo}
            count={topLaneCombo.count}
            wins={topLaneCombo.wins}
            separator="+"
          />
        )}
        {sorted.length > 0 ? (
          shown.map((c, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <H2HDuoComboRow key={i} combo={c} koName={koName} />
          ))
        ) : (
          <div className="text-primary2" style={{ padding: 24, textAlign: "center", fontSize: 13 }}>
            듀오 조합이 없어요
          </div>
        )}
        {remaining > 0 && (
          <LoadMoreButton onClick={() => setVisible((v) => v + PAGE_SIZE)} remaining={remaining} />
        )}
      </div>
    </SectionCard>
  );
};

export default H2HDuoCombos;
