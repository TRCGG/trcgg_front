import { useMemo, useState } from "react";
import { ClanActivity } from "@/data/types/leaderboard";

interface Props {
  activity: ClanActivity | undefined;
  isLoading: boolean;
  isError: boolean;
  /** buildRecentDays()의 결과 */
  days: string[];
}

const RECENT_DAYS = 30;

const toDateKey = (dt: Date) =>
  `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(
    dt.getDate()
  ).padStart(2, "0")}`;

// 백엔드의 recent는 NOW() - 30일이라 양 끝 날짜가 걸쳐 31개 날짜에 경기가 찍힐 수 있다.
export const buildRecentDays = (today: Date): string[] =>
  Array.from({ length: RECENT_DAYS + 1 }, (_, i) => {
    const dt = new Date(today.getFullYear(), today.getMonth(), today.getDate() - RECENT_DAYS + i);
    return toDateKey(dt);
  });

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const parseDay = (date: string) => {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const shortLabel = (date: string) => {
  const dt = parseDay(date);
  return `${dt.getMonth() + 1}/${dt.getDate()}`;
};
const longLabel = (date: string) => {
  const dt = parseDay(date);
  return `${dt.getMonth() + 1}월 ${dt.getDate()}일 (${WEEKDAYS[dt.getDay()]})`;
};

const ActivityHero = ({ activity, isLoading, isError, days }: Props) => {
  const [hovered, setHovered] = useState(-1);

  const chart = useMemo(() => {
    const byDate = new Map(activity?.dailyMatches.map((d) => [d.date, d.matchCount]) ?? []);
    const counts = days.map((date) => byDate.get(date) ?? 0);
    const max = Math.max(1, ...counts);
    const peakIndex = counts.indexOf(Math.max(...counts));
    const avg = (activity?.totalMatches ?? 0) / RECENT_DAYS;
    return { counts, max, peakIndex, avg };
  }, [activity, days]);

  const tickIndexes = [
    0,
    Math.round((days.length - 1) / 3),
    Math.round(((days.length - 1) * 2) / 3),
    days.length - 1,
  ];

  const barClass = (i: number, isPeak: boolean) => {
    if (hovered === i) return "bg-primary1";
    if (hovered >= 0) return isPeak ? "bg-leaderboard-barPeakDim" : "bg-leaderboard-barDim";
    return isPeak ? "bg-blueText" : "bg-blueButton";
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[220px] mt-4 bg-rankBg2 border border-border2 rounded-lg text-sm text-redText">
        내전 기록을 불러오지 못했습니다
      </div>
    );
  }

  const blue = activity?.sideWinRates.blue.winRate ?? 0;
  const red = activity?.sideWinRates.red.winRate ?? 0;

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-0 mt-4 p-6 md:py-0 md:pl-7 md:pr-6 md:h-[220px] bg-rankBg2 border border-border2 rounded-lg overflow-hidden">
      <div className="flex flex-col justify-between md:w-[332px] md:shrink-0 md:py-6">
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] text-primary2">최근 30일 총 경기</span>
          <span className="-ml-1 text-[64px] md:text-[80px] leading-[0.9] font-bold tracking-[-3px] text-white tabular-nums">
            {isLoading ? "-" : activity?.totalMatches.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-7 gap-y-1 mt-4 md:mt-0 text-[13px] text-primary2">
          <span>
            참여 멤버{" "}
            <b className="text-white">{isLoading ? "-" : `${activity?.totalPlayers}명`}</b>
          </span>
          <span>
            진영 승률 <b className="text-teamWin">블루 {blue.toFixed(1)}%</b>
            <span className="text-primary3"> · </span>
            <b className="text-teamLoss">레드 {red.toFixed(1)}%</b>
          </span>
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col md:pt-[22px] md:pb-5">
        <div className="flex items-baseline gap-3.5 text-xs text-primary2">
          <span className="mr-auto text-[13px] font-bold text-primary1">일별 경기 수</span>
          <span>
            평균 <b className="text-primary1">{chart.avg.toFixed(1)}경기</b>
          </span>
          {activity && activity.totalMatches > 0 && (
            <span>
              최다{" "}
              <b className="text-blueText">
                {chart.counts[chart.peakIndex]}경기 ({shortLabel(days[chart.peakIndex])})
              </b>
            </span>
          )}
        </div>

        <div className="relative flex-1 min-h-[120px] mt-4">
          <div
            className="absolute inset-x-0 border-t border-dashed border-primary1/25 pointer-events-none"
            style={{ bottom: `${(chart.avg / chart.max) * 100}%` }}
          />
          <div
            className="absolute inset-0 flex items-end gap-[3px] md:gap-[5px]"
            onMouseLeave={() => setHovered(-1)}
          >
            {days.map((date, i) => {
              const count = chart.counts[i];
              const ratio = count / chart.max;
              const height = `${Math.max(3, ratio * 100).toFixed(1)}%`;
              return (
                <div
                  key={date}
                  className="relative flex-1 h-full flex items-end"
                  onMouseEnter={() => setHovered(i)}
                >
                  <div
                    className={`w-full rounded-t-sm transition-colors ${barClass(i, ratio > 0.75)}`}
                    style={{ height }}
                  />
                  {hovered === i && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-0.5 px-2.5 py-1.5 bg-darkBg2 border border-blueText2 rounded whitespace-nowrap pointer-events-none"
                      style={{ bottom: `calc(${height} + 8px)` }}
                    >
                      <span className="text-[10px] text-primary2">{longLabel(date)}</span>
                      <span className="text-sm font-bold text-white">{count}경기</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-between mt-1.5 text-[10px] text-primary3">
          {tickIndexes.map((i) => (
            <span key={i}>{shortLabel(days[i])}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityHero;
