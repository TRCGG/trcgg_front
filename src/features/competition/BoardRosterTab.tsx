import { CompetitionTeamWithRoster } from "@/data/types/competition";
import { positionLabel } from "./competitionMeta";

interface Props {
  teams: CompetitionTeamWithRoster[];
}

/** 스크림·본경기를 합친 팀 전적 요약. 순위표는 둘을 나눠 보여준다. */
const totalRecord = (team: CompetitionTeamWithRoster): string => {
  const win = team.records.scrim.win + team.records.main.win;
  const lose = team.records.scrim.lose + team.records.main.lose;
  if (win + lose === 0) return "경기 전";
  return `${win}승 ${lose}패`;
};

const BoardRosterTab = ({ teams }: Props) => {
  if (teams.length === 0) {
    return (
      <div className="rounded border border-border2 bg-darkBg2 py-11 text-center text-[13px] text-primary3">
        아직 편성된 팀이 없습니다. 로스터 편성에서 팀을 만들어 주세요.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {teams.map((team, index) => (
        <div
          key={team.id}
          className="flex flex-col gap-2.5 rounded border border-border2 bg-darkBg2 p-3.5"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded bg-blueText/10 text-[11px] font-bold text-blueText">
              {index + 1}
            </span>
            <span className="truncate text-[15px] font-bold text-primary1">{team.name}</span>
            <span className="ml-auto whitespace-nowrap text-xs text-primary2">
              {totalRecord(team)}
            </span>
          </div>
          <div className="h-px bg-rankBg2" />
          <div className="flex flex-col gap-[7px]">
            {team.roster.length === 0 ? (
              <span className="py-2 text-center text-xs text-primary3">로스터 미배정</span>
            ) : (
              team.roster.map((member) => (
                <div key={member.playerCode} className="flex items-center gap-2">
                  <span className="flex h-5 w-6 shrink-0 items-center justify-center rounded border border-border2 bg-darkBg1 text-[10px] text-primary2">
                    {positionLabel(member.position)}
                  </span>
                  <span className="flex-1 truncate text-[13px] text-primary1">
                    {member.riotName}
                    <span className="text-primary3">#{member.riotNameTag}</span>
                  </span>
                  {team.captainPlayerCode === member.playerCode && (
                    <span className="shrink-0 rounded bg-yellow/10 px-1.5 py-px text-[10px] font-bold text-yellow">
                      팀장
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BoardRosterTab;
