import { H2HInsight } from "@/data/types/h2h";
import colors from "@/styles/colors";
import { v2InsightCopy } from "./h2hHelpers";
import SectionCard from "./SectionCard";

interface CardProps {
  insight: H2HInsight;
}

const KIND_CFG: Record<string, { color: string; bg: string; icon: string }> = {
  best: { color: colors.neonGreen, bg: "rgba(113,255,151,0.06)", icon: "▲" },
  worst: { color: colors.redText, bg: "rgba(255,107,139,0.06)", icon: "▼" },
  lane: { color: colors.blueText, bg: "rgba(107,184,255,0.06)", icon: "◆" },
  synergy: { color: colors.blueText, bg: "rgba(107,184,255,0.06)", icon: "⚭" },
  counter: { color: colors.yellow, bg: "rgba(255,200,0,0.06)", icon: "✕" },
  info: { color: colors.primary1, bg: colors.darkBg1, icon: "·" },
};

const H2HInsightCard = ({ insight }: CardProps) => {
  const copy = v2InsightCopy(insight);
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
          {copy.title}
        </div>
        <div className="text-primary1" style={{ fontSize: 14, marginTop: 2, fontWeight: 500 }}>
          {copy.body}
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
          {copy.stat}
        </div>
      </div>
    </div>
  );
};

interface Props {
  insights: H2HInsight[];
}

const H2HInsightStack = ({ insights }: Props) => (
  <SectionCard title="인사이트" subtitle="맞붙을 때의 상성·카운터">
    <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
      {insights.length > 0 ? (
        insights.slice(0, 4).map((ins, i) => (
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

export default H2HInsightStack;
