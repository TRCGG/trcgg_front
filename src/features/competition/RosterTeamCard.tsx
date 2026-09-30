import { DraftTeam, RosterSlotMember } from "@/hooks/competition/useRosterDraft";
import { positionLabel } from "./competitionMeta";

interface Props {
  team: DraftTeam;
  index: number;
  /** 클릭 배치를 위해 선택된 칩이 있는지 */
  hasPicked: boolean;
  onRename: (name: string) => void;
  onRemoveTeam: () => void;
  /** 팀 카드 빈 곳(추가 칸)을 클릭 */
  onAddClick: () => void;
  onDrop: () => void;
  onMemberClick: (member: RosterSlotMember) => void;
  onMemberDragStart: (member: RosterSlotMember) => void;
  onMemberRemove: (playerCode: string) => void;
  onSetCaptain: (playerCode: string) => void;
  disabled?: boolean;
}

// 팀마다 다른 색을 돌려 써 카드를 눈으로 구분한다.
const BADGES = [
  "bg-blueText/[0.14] text-blueText",
  "bg-neonGreen/[0.14] text-neonGreen",
  "bg-yellow/[0.14] text-yellow",
  "bg-redText/[0.14] text-redText",
  "bg-tierBrown/[0.14] text-tierBrown",
  "bg-primary2/[0.18] text-primary2",
];

const RosterTeamCard = ({
  team,
  index,
  hasPicked,
  onRename,
  onRemoveTeam,
  onAddClick,
  onDrop,
  onMemberClick,
  onMemberDragStart,
  onMemberRemove,
  onSetCaptain,
  disabled = false,
}: Props) => (
  <div
    onDragOver={(e) => e.preventDefault()}
    onDrop={onDrop}
    className="flex flex-col gap-2 rounded border border-border2 bg-darkBg1 p-3"
  >
    <div className="flex items-center gap-2">
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px] font-bold ${
          BADGES[index % BADGES.length]
        }`}
      >
        {index + 1}
      </span>
      <input
        value={team.name}
        onChange={(e) => onRename(e.target.value.slice(0, 64))}
        placeholder="팀명 입력"
        disabled={disabled}
        className="h-[30px] min-w-0 flex-1 rounded border border-border2 bg-darkBg2 px-2 text-[13px] text-primary1 outline-none focus:border-blueText2"
      />
      <span className="whitespace-nowrap text-[11px] text-primary2">{team.members.length}명</span>
      {!disabled && (
        <button
          type="button"
          onClick={onRemoveTeam}
          title="팀 삭제"
          aria-label={`${team.name} 팀 삭제`}
          className="shrink-0 px-0.5 text-sm text-primary3 hover:text-redText"
        >
          ×
        </button>
      )}
    </div>

    <div className="flex flex-col gap-1.5">
      {team.members.map((member) => {
        const isCaptain = team.captainPlayerCode === member.playerCode;
        return (
          <div
            key={member.playerCode}
            className="flex h-8 items-center gap-2 rounded border border-solid border-border2 bg-darkBg2 px-2"
          >
            <span
              title="주 라인"
              className="flex h-5 w-[26px] shrink-0 items-center justify-center rounded border border-border2 bg-darkBg2 text-[10px] text-primary2"
            >
              {positionLabel(member.position)}
            </span>
            <button
              type="button"
              draggable={!disabled}
              onDragStart={() => onMemberDragStart(member)}
              onClick={() => onMemberClick(member)}
              disabled={disabled}
              className="min-w-0 flex-1 truncate text-left text-[13px] text-primary1"
            >
              {member.riotName}
              <span className="text-primary3">#{member.riotNameTag}</span>
            </button>

            {isCaptain && (
              <span className="shrink-0 rounded bg-yellow/10 px-1.5 py-px text-[10px] font-bold text-yellow">
                팀장
              </span>
            )}
            {!isCaptain && !disabled && (
              <button
                type="button"
                onClick={() => onSetCaptain(member.playerCode)}
                className="shrink-0 rounded border border-dashed border-border1 px-1.5 py-px text-[10px] text-primary3 hover:text-yellow"
              >
                팀장 지정
              </button>
            )}
            {!disabled && (
              <button
                type="button"
                onClick={() => onMemberRemove(member.playerCode)}
                aria-label={`${member.riotName} 배치 해제`}
                className="shrink-0 px-0.5 text-sm text-primary3 hover:text-redText"
              >
                ×
              </button>
            )}
          </div>
        );
      })}

      {!disabled && (
        <button
          type="button"
          onClick={onAddClick}
          className={`flex h-8 items-center justify-center rounded border border-dashed bg-darkBg2/40 text-[13px] ${
            hasPicked ? "border-blueText2 text-primary1" : "border-border1 text-primary3"
          }`}
        >
          {hasPicked ? "여기에 배치" : "칩을 끌어다 놓아 추가"}
        </button>
      )}
      {disabled && team.members.length === 0 && (
        <span className="py-2 text-center text-xs text-primary3">로스터 미배정</span>
      )}
    </div>
  </div>
);

export default RosterTeamCard;
