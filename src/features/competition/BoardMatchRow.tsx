import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/services/apiService";
import { GameRecordResponse } from "@/data/types/record";
import { getGameRecords } from "@/services/record";
import { CompetitionMatchTeamItem } from "@/data/types/competition";
import MatchDetail from "@/features/matchHistory/MatchDetail";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatTimeAgo } from "@/utils/parseTime";

interface Props {
  match: CompetitionMatchTeamItem;
  guildId: string;
  editable: boolean;
  checked: boolean;
  onToggleCheck: () => void;
  onAssign?: () => void;
  onDelete?: () => void;
  deleting: boolean;
}

const formatLength = (seconds: number | null): string => {
  if (seconds === null) return "-";
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

/** 이긴 진영이 팀에 귀속돼 있을 때만 승패를 말할 수 있다 (용병전·미배정·승자 미상은 null). */
const sideResult = (match: CompetitionMatchTeamItem, side: "blue" | "red") => {
  const teamId = side === "blue" ? match.blueTeamId : match.redTeamId;
  if (match.winnerTeamId === null || teamId === null) {
    return { label: "-", className: "bg-rankBg2 text-primary3" };
  }
  return match.winnerTeamId === teamId
    ? { label: "승", className: "bg-blueText/10 text-blueText" }
    : { label: "패", className: "bg-redDarken text-redText" };
};

const BoardMatchRow = ({
  match,
  guildId,
  editable,
  checked,
  onToggleCheck,
  onAssign,
  onDelete,
  deleting,
}: Props) => {
  const [isOpen, setOpen] = useState(false);
  const toggleOpen = () => setOpen((prev) => !prev);

  const { data, isLoading } = useQuery<ApiResponse<GameRecordResponse>>({
    queryKey: ["gameData", match.customMatchId, guildId],
    queryFn: () => getGameRecords(match.customMatchId, guildId),
    staleTime: 3 * 60 * 1000,
    enabled: isOpen && !!guildId,
  });

  const detail = data?.data?.data;
  const showDetail = isOpen && !isLoading && !!detail;
  const isMain = match.gameType === "3";
  const blue = sideResult(match, "blue");
  const red = sideResult(match, "red");

  // 행 전체가 펼치기라, 안쪽 조작은 전파를 끊어야 같이 펼쳐지지 않는다.
  const stop = (run: () => void) => (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    run();
  };

  return (
    <div className="flex flex-col">
      <div
        role="button"
        tabIndex={0}
        onClick={toggleOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") toggleOpen();
        }}
        className={`flex w-full cursor-pointer rounded-lg border transition-opacity hover:opacity-90 ${
          checked ? "border-bluePrimary bg-bluePrimary/[0.06]" : "border-border2 bg-darkBg2"
        }`}
      >
        {editable && (
          <div className="flex shrink-0 items-center pl-3">
            <button
              type="button"
              onClick={stop(onToggleCheck)}
              aria-label={`${match.customMatchId} 선택`}
              aria-pressed={checked}
              className={`flex h-[18px] w-[18px] items-center justify-center rounded border ${
                checked ? "border-bluePrimary bg-bluePrimary" : "border-border1 bg-darkBg1"
              }`}
            >
              {checked && (
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth={3.2}
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </button>
          </div>
        )}

        {/* 좌측 - 경기 유형 + 길이 + 경과 시간 */}
        <div className="flex w-[74px] shrink-0 flex-col items-center justify-center gap-1 border-r border-border2 py-3 sm:w-[86px]">
          <span
            className={`rounded px-1.5 text-[11px] font-bold leading-5 ${
              isMain ? "bg-yellow/10 text-yellow" : "bg-rankBg2 text-primary2"
            }`}
          >
            {isMain ? "★본경기" : "스크림"}
          </span>
          <span className="text-xs tabular-nums text-primary2">
            {formatLength(match.gameLength)}
          </span>
          <span className="whitespace-nowrap text-[11px] text-primary3">
            {formatTimeAgo(match.date)}
          </span>
        </div>

        {/* 본문 - BLUE vs RED */}
        <div className="flex min-w-0 flex-1 items-center gap-2 px-2.5 py-3 sm:gap-3 sm:px-4">
          <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
            <span
              className={`truncate text-[13px] sm:text-sm ${
                match.blueTeamName ? "text-primary1" : "text-primary3"
              }`}
            >
              {match.blueTeamName ?? "미배정"}
            </span>
            <span className="h-[22px] w-[3px] shrink-0 rounded-sm bg-bluePrimary" />
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${blue.className}`}>
              {blue.label}
            </span>
            <span className="text-[11px] text-primary3">vs</span>
            <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${red.className}`}>
              {red.label}
            </span>
          </div>

          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="h-[22px] w-[3px] shrink-0 rounded-sm bg-teamLoss" />
            <span
              className={`truncate text-[13px] sm:text-sm ${
                match.redTeamName ? "text-primary1" : "text-primary3"
              }`}
            >
              {match.redTeamName ?? "미배정"}
            </span>
          </div>
        </div>

        {editable && (
          <div className="flex shrink-0 items-center gap-2.5 pr-2 sm:pr-3">
            {editable && onAssign && (
              <button
                type="button"
                onClick={stop(onAssign)}
                className={`whitespace-nowrap text-xs ${
                  match.blueTeamId === null && match.redTeamId === null
                    ? "font-bold text-yellow"
                    : "text-blueText"
                }`}
              >
                팀 배정
              </button>
            )}
            {editable && onDelete && (
              <button
                type="button"
                onClick={stop(onDelete)}
                disabled={deleting}
                className="whitespace-nowrap text-xs text-redText disabled:opacity-40"
              >
                {deleting ? "삭제 중..." : "삭제"}
              </button>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={stop(toggleOpen)}
          className="flex w-8 shrink-0 items-center justify-center rounded-r-lg bg-rankBg2 hover:bg-border1 sm:w-10"
        >
          <span className="sr-only">펼치기</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`h-5 w-5 text-primary2 transition-transform duration-150 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      {isOpen && isLoading && (
        <div className="flex justify-center pt-1.5">
          <LoadingSpinner />
        </div>
      )}

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          showDetail ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pt-1.5">
            {detail && (
              <div className="flex w-full min-w-0 flex-col">
                <MatchDetail participantData={detail} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardMatchRow;
