import React, { useState } from "react";
import { DatePreset } from "@/services/statistics";

const now = new Date();
const CURRENT_YEAR = now.getFullYear();
const START_YEAR = 2024;
const SEASON_OPTIONS = Array.from({ length: CURRENT_YEAR - START_YEAR + 1 }, (_, i) =>
  String(START_YEAR + i)
);

const SELECT_CLASS =
  "appearance-none bg-rankBg2 border border-border1 hover:border-blueText2 rounded-lg pl-3 pr-8 py-1.5 text-sm text-primary1 cursor-pointer focus:outline-none focus:border-blueText2 transition-colors duration-150";

// 최근 / 시즌 전적만 제공 (기간 선택 제외)
type DateMode = "recent" | "season";

const DATE_LABELS: Record<DateMode, string> = {
  recent: "최근",
  season: "시즌 전적",
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
  const [dateMode, setDateMode] = useState<DateMode>("recent");
  const [selectedSeason, setSelectedSeason] = useState(String(CURRENT_YEAR));

  const handleModeChange = (mode: DateMode) => {
    setDateMode(mode);
    if (mode === "recent") onChange({ datePreset: "recent" });
    else onChange({ datePreset: "season", season: selectedSeason });
  };

  const handleSeasonChange = (season: string) => {
    setSelectedSeason(season);
    onChange({ datePreset: "season", season });
  };

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className || ""}`}>
      {/* 최근 / 시즌 토글 */}
      <div className="flex p-0.5 rounded-lg bg-rankBg1 border border-border1">
        {(["recent", "season"] as DateMode[]).map((mode) => (
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
    </div>
  );
};

export default DateRangeFilter;
