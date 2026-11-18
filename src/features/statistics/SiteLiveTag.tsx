import CountUp from "@/components/ui/CountUp";
import useSiteOverview from "@/hooks/statistics/useSiteOverview";

interface SiteLiveTagProps {
  className?: string;
}

/** 사이트 전체 이용 현황을 한 줄로 보여주는 태그. */
const SiteLiveTag = ({ className = "" }: SiteLiveTagProps) => {
  const { data } = useSiteOverview();
  if (!data || data.clanCount === 0) return null;

  const stats = [
    { label: "클랜", value: data.clanCount },
    { label: "경기", value: data.matchCount },
    { label: "소환사", value: data.playerCount },
  ];

  return (
    <div
      title={`최근 30일 ${data.recentMatchCount.toLocaleString("ko-KR")}경기 · 매일 낮 12시 갱신`}
      className={`inline-flex h-8 shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-3 text-xs text-primary2 ${className}`}
    >
      <span className="flex items-center gap-1.5 font-bold tracking-[1px] text-liveRed">
        <span
          className="h-2 w-2 rounded-full bg-liveRed motion-safe:animate-livePulse"
          aria-hidden
        />
        LIVE
      </span>
      {stats.map((stat) => (
        <span key={stat.label} className="flex items-baseline gap-1">
          {stat.label}
          <b className="font-bold text-primary1">
            <CountUp value={stat.value} durationMs={900} />
          </b>
        </span>
      ))}
    </div>
  );
};

export default SiteLiveTag;
