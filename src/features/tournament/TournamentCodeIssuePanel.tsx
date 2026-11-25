import { useState } from "react";
import { TournamentCode, TournamentSpectatorType } from "@/data/types/tournament";
import { toApiError } from "@/services/apiError";
import { useIssueTournamentCodes } from "@/hooks/tournament/useTournamentCodes";
import {
  ROOM_SETTINGS,
  SERIES_OPTIONS,
  SPECTATOR_LABEL,
  SPECTATOR_OPTIONS,
  SeriesOption,
} from "@/features/tournament/tournamentMeta";

interface SegmentedProps<T> {
  label: string;
  options: readonly { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}

const Segmented = <T extends string | number>({
  label,
  options,
  value,
  onChange,
}: SegmentedProps<T>) => (
  <div className="flex flex-col gap-2">
    <span className="text-xs font-bold text-primary2">{label}</span>
    <div className="grid grid-flow-col auto-cols-fr gap-1 rounded-lg bg-rankBg2 border border-border1 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={option.value === value}
          className={`rounded-md py-2 text-sm font-bold transition-colors ${
            option.value === value
              ? "bg-bluePrimary text-white"
              : "text-primary2 hover:text-primary1 hover:bg-rankBg3"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

const issueErrorMessage = (error: unknown): string => {
  const { status } = toApiError(error);
  if (status === 403) return "코드 발급은 클랜 운영진만 할 수 있습니다.";
  if (status >= 500) return "라이엇 서버에서 코드를 받지 못했습니다. 잠시 후 다시 시도해주세요.";
  return "코드를 발급하지 못했습니다. 잠시 후 다시 시도해주세요.";
};

const SERIES_SEGMENTS = SERIES_OPTIONS.map((option) => ({
  label: option.label,
  value: option.count,
}));

interface TournamentCodeIssuePanelProps {
  guildId: string;
  onIssued?: (codes: TournamentCode[]) => void;
}

const TournamentCodeIssuePanel = ({ guildId, onIssued }: TournamentCodeIssuePanelProps) => {
  const [series, setSeries] = useState<SeriesOption>(SERIES_OPTIONS[0]);
  const [spectatorType, setSpectatorType] = useState<TournamentSpectatorType>("ALL");
  const issue = useIssueTournamentCodes(guildId);

  const handleSeriesChange = (count: number) => {
    const next = SERIES_OPTIONS.find((option) => option.count === count);
    if (next) setSeries(next);
  };

  const handleIssue = () => {
    if (issue.isPending) return;
    issue.mutate({ count: series.count, spectatorType }, { onSuccess: onIssued });
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <Segmented
        label="경기 방식"
        options={SERIES_SEGMENTS}
        value={series.count}
        onChange={handleSeriesChange}
      />
      <Segmented
        label="관전"
        options={SPECTATOR_OPTIONS}
        value={spectatorType}
        onChange={setSpectatorType}
      />

      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-primary2">방 설정 (고정)</span>
        <dl className="flex flex-col gap-1.5 rounded-lg bg-rankBg2 border border-border1 px-3 py-2.5 text-[13px]">
          {ROOM_SETTINGS.map((setting) => (
            <div key={setting.label} className="flex items-center justify-between">
              <dt className="text-primary3">{setting.label}</dt>
              <dd className="m-0 text-primary1">{setting.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <button
        type="button"
        onClick={handleIssue}
        disabled={issue.isPending}
        className={`rounded-lg px-4 py-3 text-sm font-bold transition-opacity ${
          issue.isPending
            ? "bg-rankBg1 text-primary2 cursor-not-allowed opacity-50"
            : "bg-bluePrimary text-white hover:opacity-90"
        }`}
      >
        {issue.isPending
          ? "발급 중..."
          : `${series.label} 코드 ${series.count}개 발급 (관전 ${SPECTATOR_LABEL[spectatorType]})`}
      </button>

      {issue.isError && (
        <p className="m-0 rounded-md bg-redDarken border border-redLighten px-3 py-2 text-xs text-redText">
          {issueErrorMessage(issue.error)}
        </p>
      )}

      <p className="m-0 text-xs text-primary3">쓰지 않은 코드는 발급 3시간 뒤 만료됩니다.</p>
    </div>
  );
};

export default TournamentCodeIssuePanel;
