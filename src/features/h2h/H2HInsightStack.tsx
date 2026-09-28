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
      className="border border-border2 rounded py-2.5 px-3 flex gap-2.5 items-start"
      style={{ background: cfg.bg, borderLeft: `3px solid ${cfg.color}` }}
    >
      <div
        className="bg-darkBg1 w-6 h-6 rounded flex items-center justify-center text-sm font-bold shrink-0"
        style={{ color: cfg.color }}
      >
        {cfg.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-primary2 text-[11px] uppercase tracking-[0.06em]">{insight.title}</div>
        <div className="text-primary1 text-sm mt-0.5 font-normal">{insight.body}</div>
        <div className="text-xs mt-0.5 font-bold tabular-nums" style={{ color: cfg.color }}>
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
      <div className="p-3 flex flex-col gap-2">
        {insights.length > 0 ? (
          insights.map((ins, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <H2HInsightCard key={i} insight={ins} />
          ))
        ) : (
          <div className="text-primary2 p-6 text-center text-[13px]">아직 인사이트가 없어요</div>
        )}
      </div>
    </SectionCard>
  );
};

export default H2HInsightStack;
