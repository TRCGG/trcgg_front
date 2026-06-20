import { useState } from "react";
import { H2HDetail, H2HRelation } from "@/data/types/h2h";
import { topLaneMatchup } from "./h2hHelpers";
import OpponentSearchInput from "./OpponentSearchInput";
import H2HRelationToggle from "./H2HRelationToggle";
import H2HVersusHero from "./H2HVersusHero";
import H2HSummaryBanner from "./H2HSummaryBanner";
import H2HRivalryTimeline from "./H2HRivalryTimeline";
import H2HStatCompareBlock from "./H2HStatCompareBlock";
import H2HLaneMatrix from "./H2HLaneMatrix";
import H2HLaneCombos from "./H2HLaneCombos";
import H2HInsightStack from "./H2HInsightStack";
import H2HChampMatchups from "./H2HChampMatchups";
import H2HDuoCombos from "./H2HDuoCombos";
import H2HRecentList from "./H2HRecentList";

interface Props {
  data: H2HDetail;
  guildId?: string;
  meName: string;
  meTag?: string;
  onSelect: (opponent: { riotName: string; riotNameTag?: string }) => void;
  onClear: () => void;
}

const H2HResultSection = ({ data, guildId, meName, meTag, onSelect, onClear }: Props) => {
  // 맞붙은 기록이 없고 함께한 기록만 있으면 "함께한"으로 시작
  const initialRelation: H2HRelation =
    data.against.games === 0 && data.together.games > 0 ? "with" : "against";
  const [relation, setRelation] = useState<H2HRelation>(initialRelation);
  // 매치업 섹션과 최근 맞대결 리스트의 "맞라인만" 토글은 서로 독립
  const [matchupSameLane, setMatchupSameLane] = useState(false);
  const [recentSameLane, setRecentSameLane] = useState(false);

  const counts = { with: data.together.games, against: data.against.games };
  const isWith = relation === "with";

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Section title row */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
          <h2 className="text-primary1" style={{ margin: 0, fontSize: 22, fontWeight: 500 }}>
            상대전적
          </h2>
          <span className="text-primary2" style={{ fontSize: 13 }}>
            <b className="text-primary1">{data.oppo.riotName}</b>
            <span className="text-primary2">#{data.oppo.riotNameTag}</span> 와 만난 모든 기록
          </span>
        </div>
        <div style={{ minWidth: 280, flex: "0 1 360px" }}>
          <OpponentSearchInput
            guildId={guildId}
            meName={meName}
            meTag={meTag}
            value={`${data.oppo.riotName}#${data.oppo.riotNameTag}`}
            showClear
            onSelect={onSelect}
            onClear={onClear}
          />
        </div>
      </div>

      {/* Filter bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <H2HRelationToggle value={relation} onChange={setRelation} counts={counts} />
      </div>

      {/* Hero */}
      <H2HVersusHero me={data.me} oppo={data.oppo} relation={relation} />

      {/* Summary banner */}
      <H2HSummaryBanner
        relation={relation}
        firstMet={data.firstMet}
        lastMet={data.lastMet}
        against={data.against}
        together={data.together}
      />

      {/* Rivalry timeline — 맞붙은 모드 전용 */}
      {relation === "against" && (
        <H2HRivalryTimeline streak={data.against.streak} seasonBreaks={data.against.seasonBreaks} />
      )}

      {/* Mid section */}
      {isWith ? (
        <H2HLaneCombos combos={data.together.laneCombos} />
      ) : (
        <div className="h2h-mid-grid">
          <H2HStatCompareBlock mine={data.against.mine} oppos={data.against.oppos} />
          <H2HLaneMatrix matrix={data.against.laneMatrix} />
          <H2HInsightStack insights={data.against.insights} />
        </div>
      )}

      {/* Champion matchups or duo combos */}
      {isWith ? (
        <H2HDuoCombos combos={data.together.duoChamps} topLaneCombo={data.together.topLaneCombo} />
      ) : (
        <H2HChampMatchups
          matchups={data.against.matchups}
          topLanePair={topLaneMatchup(data.against.laneMatrix)}
          sameLaneOnly={matchupSameLane}
          onToggleSameLane={setMatchupSameLane}
        />
      )}

      {/* Recent matches */}
      <H2HRecentList
        rows={isWith ? data.together.recent : data.against.recent}
        mode={relation}
        sameLaneOnly={recentSameLane}
        onToggleSameLane={setRecentSameLane}
      />

      <style jsx>{`
        .h2h-mid-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr 0.9fr;
          gap: 16px;
          align-items: stretch;
        }
        @media (max-width: 900px) {
          .h2h-mid-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default H2HResultSection;
