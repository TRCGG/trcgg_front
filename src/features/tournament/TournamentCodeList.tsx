import { useMemo, useState } from "react";
import { TournamentCode, TournamentCodeStatus } from "@/data/types/tournament";
import {
  SPECTATOR_LABEL,
  STATUS_LABEL,
  TournamentCodeRow,
  findNextCode,
  formatIssuedTime,
  groupIntoSeries,
} from "@/features/tournament/tournamentMeta";

const STATUS_CLASS: Record<TournamentCodeStatus, string> = {
  PENDING: "text-blueText bg-blueText/10 border-blueText/25",
  COMPLETED: "text-neonGreen bg-neonGreen/10 border-neonGreen/25",
  INVALID: "text-primary3 bg-rankBg1 border-border1",
};

const CopyIcon = ({ copied }: { copied: boolean }) =>
  copied ? (
    <svg
      className="w-3.5 h-3.5 text-neonGreen"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  ) : (
    <svg
      className="w-[13px] h-[13px]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 012-2h10" />
    </svg>
  );

interface NextCodeCardProps {
  next: TournamentCodeRow | undefined;
  copied: boolean;
  onCopy: (code: string) => void;
}

const NextCodeCard = ({ next, copied, onCopy }: NextCodeCardProps) => {
  if (!next) {
    return (
      <div className="rounded-lg border border-dashed border-border1 px-4 py-5 text-center text-sm text-primary2">
        대기 중인 코드가 없습니다. 새 코드를 발급해주세요.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-blueText2/40 bg-blueText/[0.06] px-4 py-3.5 flex flex-col gap-2">
      <span className="text-xs text-primary2">
        <b className="text-blueText">다음 판</b> · {next.seriesLabel} · {next.setNumber}세트 · 관전{" "}
        {SPECTATOR_LABEL[next.spectatorType]} · 참가자에게 이 코드를 공유하세요
      </span>
      <div className="flex items-center gap-2">
        <code className="flex-1 min-w-0 break-all font-mono text-sm text-primary1">
          {next.code}
        </code>
        <button
          type="button"
          onClick={() => onCopy(next.code)}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-md border border-border1 px-2.5 py-1.5 text-xs font-bold text-primary2 hover:text-blueText hover:border-blueText2 transition-colors"
        >
          <CopyIcon copied={copied} />
          {copied ? "복사됨" : "코드 복사"}
        </button>
      </div>
    </div>
  );
};

interface TournamentCodeListProps {
  codes: TournamentCode[];
  isLoading: boolean;
  isError: boolean;
}

const TournamentCodeList = ({ codes, isLoading, isError }: TournamentCodeListProps) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const rows = useMemo(() => groupIntoSeries(codes), [codes]);
  const next = useMemo(() => findNextCode(rows), [rows]);

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode((prev) => (prev === code ? null : prev)), 1500);
    } catch {
      setCopiedCode(null);
    }
  };

  if (isLoading) {
    return <div className="py-10 text-center text-sm text-primary2">데이터를 불러오는 중...</div>;
  }
  if (isError) {
    return (
      <div className="py-10 text-center text-sm text-redText">
        코드 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <NextCodeCard
        next={next}
        copied={next !== undefined && copiedCode === next.code}
        onCopy={handleCopy}
      />

      {rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-[13px]">
            <thead>
              <tr className="text-left text-xs text-primary3 border-b border-border2">
                <th className="py-2 pr-2 font-normal">세트</th>
                <th className="py-2 pr-2 font-normal">방식</th>
                <th className="py-2 pr-2 font-normal">코드</th>
                <th className="py-2 pr-2 font-normal">관전</th>
                <th className="py-2 pr-2 font-normal">발급</th>
                <th className="py-2 font-normal">상태</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.code} className="border-b border-rankBg3 last:border-0">
                  <td className="py-2.5 pr-2 text-primary1 tabular-nums">{row.setNumber}</td>
                  <td className="py-2.5 pr-2 text-primary2">{row.seriesLabel}</td>
                  <td className="py-2.5 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="max-w-[150px] truncate font-mono text-blueText2">
                        {row.code}
                      </span>
                      <button
                        type="button"
                        aria-label="토너먼트 코드 복사"
                        onClick={() => handleCopy(row.code)}
                        className="shrink-0 w-[26px] h-[26px] rounded-md grid place-items-center border border-border1 text-primary3 hover:text-blueText hover:border-blueText2 transition-colors"
                      >
                        <CopyIcon copied={copiedCode === row.code} />
                      </button>
                    </div>
                  </td>
                  <td className="py-2.5 pr-2 text-primary2">
                    {SPECTATOR_LABEL[row.spectatorType]}
                  </td>
                  <td className="py-2.5 pr-2 text-primary2 tabular-nums whitespace-nowrap">
                    {formatIssuedTime(row.issuedDate)}
                  </td>
                  <td className="py-2.5">
                    <span
                      className={`inline-block whitespace-nowrap rounded-[5px] border px-1.5 py-0.5 text-[11px] font-bold ${
                        STATUS_CLASS[row.status]
                      }`}
                    >
                      {STATUS_LABEL[row.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TournamentCodeList;
