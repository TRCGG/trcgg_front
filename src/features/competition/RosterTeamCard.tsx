import { COMPETITION_POSITIONS, CompetitionPosition } from "@/data/types/competition";
import { DraftTeam, RosterSlotMember } from "@/hooks/competition/useRosterDraft";
import { positionLabel } from "./competitionMeta";

interface Props {
  team: DraftTeam;
  index: number;
  /** 클릭 배치를 위해 선택된 칩이 있는지 */
  hasPicked: boolean;
  onRename: (name: string) => void;
  onRemoveTeam: () => void;
  onSlotClick: (position: CompetitionPosition) => void;
  onSlotDrop: (position: CompetitionPosition) => void;
  onSlotDragStart: (member: RosterSlotMember) => void;
  onSlotRemove: (position: CompetitionPosition) => void;
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
  onSlotClick,
  onSlotDrop,
  onSlotDragStart,
  onSlotRemove,
  onSetCaptain,
  disabled = false,
}: Props) => {
  const filled = Object.keys(team.members).length;
  const isFull = filled === COMPETITION_POSITIONS.length;

  return (
    <div
      className={`flex flex-col gap-2 rounded border bg-darkBg1 p-3 ${
        isFull ? "border-primaryLaneBorder" : "border-border2"
      }`}
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
        <span
          className={`whitespace-nowrap text-[11px] ${isFull ? "text-neonGreen" : "text-primary2"}`}
        >
          {filled}/5
        </span>
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
        {COMPETITION_POSITIONS.map((position) => {
          const member = team.members[position];
          const isCaptain = !!member && team.captainPlayerCode === member.playerCode;
          return (
            <div
              key={position}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onSlotDrop(position)}
              className={`flex h-8 items-center gap-2 rounded border px-2 ${
                member
                  ? "border-solid border-border2 bg-darkBg2"
                  : "border-dashed border-border1 bg-darkBg2/40"
              } ${hasPicked && !member ? "border-blueText2" : ""}`}
            >
              <span className="flex h-5 w-[22px] shrink-0 items-center justify-center rounded border border-border2 bg-darkBg2 text-[10px] text-primary2">
                {positionLabel(position)}
              </span>

              {member ? (
                <button
                  type="button"
                  draggable={!disabled}
                  onDragStart={() => onSlotDragStart(member)}
                  onClick={() => onSlotClick(position)}
                  disabled={disabled}
                  className="min-w-0 flex-1 truncate text-left text-[13px] text-primary1"
                >
                  {member.riotName}
                  <span className="text-primary3">#{member.riotNameTag}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onSlotClick(position)}
                  disabled={disabled}
                  className="min-w-0 flex-1 truncate text-left text-[13px] text-primary3"
                >
                  {hasPicked ? "여기에 배치" : "비어 있음"}
                </button>
              )}

              {isCaptain && (
                <span className="shrink-0 rounded bg-yellow/10 px-1.5 py-px text-[10px] font-bold text-yellow">
                  팀장
                </span>
              )}
              {member && !isCaptain && !disabled && (
                <button
                  type="button"
                  onClick={() => onSetCaptain(member.playerCode)}
                  className="shrink-0 rounded border border-dashed border-border1 px-1.5 py-px text-[10px] text-primary3 hover:text-yellow"
                >
                  팀장 지정
                </button>
              )}
              {member && !disabled && (
                <button
                  type="button"
                  onClick={() => onSlotRemove(position)}
                  aria-label={`${member.riotName} 배치 해제`}
                  className="shrink-0 px-0.5 text-sm text-primary3 hover:text-redText"
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RosterTeamCard;
