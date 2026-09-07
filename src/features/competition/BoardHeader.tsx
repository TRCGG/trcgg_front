import { CompetitionDetail } from "@/data/types/competition";
import { competitionInitial, getCompetitionStatusMeta } from "./competitionMeta";

interface Props {
  competition: CompetitionDetail;
  isManager: boolean;
  onCloseApplications: () => void;
  onEnd: () => void;
  onReopen: () => void;
  onDelete: () => void;
  onRoster: () => void;
  onUpload: () => void;
  busy: boolean;
}

const formatDate = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
};

const BoardHeader = ({
  competition,
  isManager,
  onCloseApplications,
  onEnd,
  onReopen,
  onDelete,
  onRoster,
  onUpload,
  busy,
}: Props) => {
  const status = getCompetitionStatusMeta(competition.status);
  const isClosed = competition.status === "CLOSED";
  const isRecruiting = competition.status === "RECRUITING";

  return (
    <div className="flex flex-col gap-4 rounded border border-border2 bg-darkBg2 p-5 lg:flex-row lg:items-center lg:gap-5">
      <div
        className={`hidden h-16 w-16 shrink-0 items-center justify-center rounded text-[22px] font-bold sm:flex ${
          isClosed ? "bg-rankBg2 text-primary3" : "bg-blueText/10 text-blueText"
        }`}
      >
        {competitionInitial(competition.name)}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xl font-bold text-primary1">{competition.name}</span>
          <span
            className={`rounded px-2 py-0.5 text-[11px] font-bold ${status.textClass} ${status.bgClass}`}
          >
            {status.label}
          </span>
          {isClosed && (
            <span className="flex items-center gap-1 rounded bg-rankBg2 px-2 py-0.5 text-[11px] font-bold text-primary2">
              <svg
                className="h-[11px] w-[11px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                aria-hidden="true"
              >
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 018 0v4" />
              </svg>
              편집 잠김
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs text-primary2">
          <span>생성 {formatDate(competition.createDate)}</span>
          <span className="text-border2">|</span>
          <span>
            참가 <span className="text-primary1">{competition.participantCount}명</span> ·{" "}
            {competition.teamCount}팀
          </span>
          <span className="text-border2">|</span>
          <span>
            스크림 <span className="text-primary1">{competition.scrimCount}</span> · ★본경기{" "}
            <span className="text-primary1">{competition.mainCount}</span>
          </span>
          {competition.pendingCount > 0 && (
            <>
              <span className="text-border2">|</span>
              <span className="text-yellow">대기 신청 {competition.pendingCount}건</span>
            </>
          )}
        </div>
      </div>

      {isManager && (
        <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
          <button
            type="button"
            onClick={onUpload}
            className="flex h-[38px] items-center gap-1.5 rounded bg-bluePrimary px-4 text-sm text-white"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 15v3a2 2 0 002 2h14a2 2 0 002-2v-3" />
              <path d="M7 9l5-5 5 5" />
              <path d="M12 4v12" />
            </svg>
            리플레이 업로드
          </button>
          {isRecruiting && (
            <button
              type="button"
              onClick={onCloseApplications}
              disabled={busy}
              className="h-[38px] rounded border border-blueText bg-darkBg1 px-3.5 text-[13px] text-blueText disabled:opacity-40"
            >
              신청 마감하고 시작
            </button>
          )}
          {competition.status === "IN_PROGRESS" && (
            <button
              type="button"
              onClick={onEnd}
              disabled={busy}
              className="h-[38px] rounded border border-yellow/40 bg-darkBg1 px-3.5 text-[13px] text-yellow disabled:opacity-40"
            >
              대회 종료
            </button>
          )}
          {isClosed && (
            <button
              type="button"
              onClick={onReopen}
              disabled={busy}
              className="h-[38px] rounded border border-border2 bg-darkBg1 px-3.5 text-[13px] text-primary1 disabled:opacity-40"
            >
              진행중으로 되돌리기
            </button>
          )}
          <button
            type="button"
            onClick={onRoster}
            className="h-[38px] rounded border border-border2 bg-darkBg1 px-3.5 text-[13px] text-primary1"
          >
            로스터 편성
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            className="h-[38px] rounded border border-redLighten bg-darkBg1 px-3.5 text-[13px] text-redText disabled:opacity-40"
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default BoardHeader;
