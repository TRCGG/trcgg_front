import { H2HAgainst } from "@/data/types/h2h";
import colors from "@/styles/colors";
import useChampionKoNames from "@/hooks/useChampionKoNames";
import { BuiltInsight, InsightKind, buildInsights } from "./h2hHelpers";
import SectionCard from "./SectionCard";

const KIND_CFG: Record<InsightKind | "info", { color: string; bg: string; icon: string }> = {
  best: { color: colors.neonGreen, bg: "rgba(113,255,151,0.06)", icon: "▲" },
  worst: { color: colors.redText, bg: "rgba(255,107,139,0.06)", icon: "▼" },
  lane: { color: colors.blueText, bg: "rgba(107,184,255,0.06)", icon: "◆" },
  counter: { color: colors.yellow, bg: "rgba(255,200,0,0.06)", icon: "✕" },
  info: { color: colors.primary1, bg: colors.darkBg1, icon: "·" },
};

interface CardProps {
  insight: BuiltInsight;
}

const H2HInsightCard = ({ insight }: CardProps) => {
  const cfg = KIND_CFG[insight.kind] || KIND_CFG.info;
  return (
    <div
      className="border border-border2"
      style={{
        background: cfg.bg,
        borderLeft: `3px solid ${cfg.color}`,
        borderRadius: 4,
        padding: "10px 12px",
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
      }}
    >
      <div
        className="bg-darkBg1"
        style={{
          width: 24,
          height: 24,
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: cfg.color,
          fontSize: 14,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {cfg.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          className="text-primary2"
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {insight.title}
        </div>
        <div className="text-primary1" style={{ fontSize: 14, marginTop: 2, fontWeight: 500 }}>
          {insight.body}
        </div>
        <div
          style={{
            fontSize: 12,
            color: cfg.color,
            marginTop: 2,
            fontWeight: 600,
            fontFeatureSettings: '"tnum"',
          }}
        >
          {insight.stat}
        </div>
      </div>
    </div>
  );
};

interface Props {
  against: H2HAgainst;
}

const H2HInsightStack = ({ against }: Props) => {
  const koName = useChampionKoNames();
  const insights = buildInsights(against, koName);
  return (
    <SectionCard title="인사이트" subtitle="챔피언·라인·상대별 집계 요약">
      <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {insights.length > 0 ? (
          insights.map((ins, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <H2HInsightCard key={i} insight={ins} />
          ))
        ) : (
          <div className="text-primary2" style={{ padding: 24, textAlign: "center", fontSize: 13 }}>
            아직 인사이트가 없어요
          </div>
        )}
      </div>
    </SectionCard>
  );
};

export default H2HInsightStack;
