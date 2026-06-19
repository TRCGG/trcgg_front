import React, { useState } from "react";
import { DatePreset } from "@/services/statistics";

const now = new Date();
const CURRENT_YEAR = now.getFullYear();
const CURRENT_MONTH = now.getMonth() + 1;
const START_YEAR = 2024;
const SEASON_OPTIONS = Array.from({ length: CURRENT_YEAR - START_YEAR + 1 }, (_, i) =>
  String(START_YEAR + i)
);
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

const SELECT_CLASS =
  "appearance-none bg-rankBg2 border border-border1 hover:border-blueText2 rounded-lg pl-3 pr-8 py-1.5 text-sm text-primary1 cursor-pointer focus:outline-none focus:border-blueText2 transition-colors duration-150";

const DATE_LABELS: Record<DatePreset, string> = {
  recent: "최근",
  season: "시즌 전적",
  range: "기간 선택",
};

export interface DateRangeValue {
  datePreset: DatePreset;
  season?: string;
  fromMonth?: number;
  toMonth?: number;
}

interface Props {
  onChange: (value: DateRangeValue) => void;
  className?: string;
}

const ChevronDown = () => (
  <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center">
    <svg
      className="w-3 h-3 text-primary2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
);

const DateRangeFilter = ({ onChange, className }: Props) => {
  const [dateMode, setDateMode] = useState<DatePreset>("recent");
  const [selectedSeason, setSelectedSeason] = useState(String(CURRENT_YEAR));
  const [draftRangeSeason, setDraftRangeSeason] = useState(String(CURRENT_YEAR));
  const [draftFromMonth, setDraftFromMonth] = useState(1);
  const [draftToMonth, setDraftToMonth] = useState(CURRENT_MONTH);

  const handleModeChange = (mode: DatePreset) => {
    setDateMode(mode);
    if (mode === "recent") onChange({ datePreset: "recent" });
    else if (mode === "season") onChange({ datePreset: "season", season: selectedSeason });
    // range: "적용" 버튼을 눌러야 반영
  };

  const handleSeasonChange = (season: string) => {
    setSelectedSeason(season);
    onChange({ datePreset: "season", season });
  };

  const handleApplyRange = () => {
    const from = Math.min(draftFromMonth, draftToMonth);
    const to = Math.max(draftFromMonth, draftToMonth);
    setDraftFromMonth(from);
    setDraftToMonth(to);
    onChange({ datePreset: "range", season: draftRangeSeason, fromMonth: from, toMonth: to });
  };

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className || ""}`}>
      {/* 3-way 토글 */}
      <div className="flex p-0.5 rounded-lg bg-rankBg1 border border-border1">
        {(["recent", "season", "range"] as DatePreset[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => handleModeChange(mode)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              dateMode === mode
                ? "bg-primary1 text-darkBg2 shadow"
                : "text-primary2 hover:text-primary1"
            }`}
          >
            {DATE_LABELS[mode]}
          </button>
        ))}
      </div>

      {/* 시즌 전적 - 시즌 선택 */}
      {dateMode === "season" && (
        <>
          <div className="hidden sm:block h-5 w-px bg-border1" />
          <div className="relative">
            <select
              value={selectedSeason}
              onChange={(e) => handleSeasonChange(e.target.value)}
              className={SELECT_CLASS}
            >
              {SEASON_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s} 시즌
                </option>
              ))}
            </select>
            <ChevronDown />
          </div>
        </>
      )}

      {/* 기간 선택 - 시즌 + 시작 월 + 끝 월 + 적용 */}
      {dateMode === "range" && (
        <>
          <div className="hidden sm:block h-5 w-px bg-border1" />
          <div className="relative">
            <select
              value={draftRangeSeason}
              onChange={(e) => setDraftRangeSeason(e.target.value)}
              className={SELECT_CLASS}
            >
              {SEASON_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s} 시즌
                </option>
              ))}
            </select>
            <ChevronDown />
          </div>
          <div className="relative">
            <select
              value={draftFromMonth}
              onChange={(e) => setDraftFromMonth(Number(e.target.value))}
              className={SELECT_CLASS}
            >
              {MONTH_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}월
                </option>
              ))}
            </select>
            <ChevronDown />
          </div>
          <span className="text-primary2 text-sm">~</span>
          <div className="relative">
            <select
              value={draftToMonth}
              onChange={(e) => setDraftToMonth(Number(e.target.value))}
              className={SELECT_CLASS}
            >
              {MONTH_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}월
                </option>
              ))}
            </select>
            <ChevronDown />
          </div>
          <button
            type="button"
            onClick={handleApplyRange}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blueButton hover:bg-blueText2 text-white transition-colors duration-150"
          >
            적용
          </button>
        </>
      )}
    </div>
  );
};

export default DateRangeFilter;
