import { useRouter } from "next/router";
import { CompetitionSummary } from "@/data/types/competition";
import {
  competitionInitial,
  formatGameSummary,
  formatParticipants,
  getCompetitionStatusMeta,
} from "./competitionMeta";

interface Props {
  competition: CompetitionSummary;
  /** 운영진(guildManager 이상)이면 승인 버튼, 아니면 참가 신청 버튼을 보여준다. */
  isManager: boolean;
}

const CompetitionCard = ({ competition, isManager }: Props) => {
  const router = useRouter();
  const status = getCompetitionStatusMeta(competition.status);
  const isClosed = competition.status === "CLOSED";
  const showApply = !isManager && competition.status === "RECRUITING";
  const showApproval = isManager && competition.pendingCount > 0;

  const go = (path: string) => () => router.push(`/competitions/${competition.id}${path}`);

  return (
    <div className="flex items-center gap-4 rounded border border-border2 bg-darkBg2 px-4 py-4 sm:gap-5 sm:px-5">
      <div
        className={`hidden h-14 w-14 shrink-0 items-center justify-center rounded text-xl font-bold sm:flex ${
          isClosed ? "bg-rankBg2 text-primary3" : "bg-blueText/10 text-blueText"
        }`}
      >
        {competitionInitial(competition.name)}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-[7px]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[17px] font-bold text-primary1">{competition.name}</span>
          <span
            className={`rounded px-2 py-0.5 text-[11px] font-bold ${status.textClass} ${status.bgClass}`}
          >
            {status.label}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs text-primary2">
          <span>
            참가 <span className="text-primary1">{formatParticipants(competition)}</span>
          </span>
          <span className="text-border2">|</span>
          <span>{formatGameSummary(competition)}</span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        {showApply && (
          <button
            type="button"
            onClick={go("/apply")}
            className="h-9 rounded bg-bluePrimary px-3.5 text-[13px] text-white"
          >
            참가 신청
          </button>
        )}
        {showApproval && (
          <button
            type="button"
            onClick={go("/applications")}
            className="h-9 whitespace-nowrap rounded border border-blueText bg-darkBg1 px-3.5 text-[13px] text-blueText"
          >
            신청 {competition.pendingCount}건 승인
          </button>
        )}
        <button
          type="button"
          onClick={go("")}
          className="h-9 rounded border border-border2 bg-darkBg1 px-3.5 text-[13px] text-primary1"
        >
          현황판
        </button>
      </div>
    </div>
  );
};

export default CompetitionCard;
