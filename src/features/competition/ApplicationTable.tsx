import { CompetitionApplicationItem } from "@/data/types/competition";
import ClampedText from "@/components/ui/ClampedText";
import { positionLabel, practiceLevelLabel, subPositionLabel } from "./competitionMeta";

interface Props {
  applications: CompetitionApplicationItem[];
  checkedIds: Set<number>;
  onToggle: (id: number) => void;
  emptyLabel: string;
}

// 헤더와 행이 같은 그리드를 써야 열이 어긋나지 않는다.
// 상태는 탭이 이미 나누고 있어 열로 두지 않는다. 가능 시간대·한마디는 자유 입력이라 넓게 준다.
const GRID = "grid-cols-[34px_1fr_168px_0.9fr_56px_68px_1.3fr_1.6fr]";

const ApplicationTable = ({ applications, checkedIds, onToggle, emptyLabel }: Props) => (
  <div className="overflow-x-auto">
    <div className="min-w-[1100px]">
      <div
        className={`grid ${GRID} gap-2.5 border-b border-border2 px-4 py-2.5 text-xs text-primary2`}
      >
        <span />
        <span>롤 아이디</span>
        <span>포지션</span>
        <span>주 챔피언</span>
        <span className="text-center">팀장</span>
        <span className="text-center">연습량</span>
        <span>가능 시간대</span>
        <span>한마디</span>
      </div>

      {applications.length === 0 ? (
        <div className="px-4 py-11 text-center text-[13px] text-primary3">{emptyLabel}</div>
      ) : (
        applications.map((application) => {
          const checked = checkedIds.has(application.id);
          return (
            <button
              key={application.id}
              type="button"
              onClick={() => onToggle(application.id)}
              aria-pressed={checked}
              className={`grid ${GRID} w-full items-center gap-2.5 border-b border-cardBorder px-4 py-2.5 text-left last:border-0 ${
                checked ? "bg-bluePrimary/[0.06]" : "bg-transparent"
              }`}
            >
              <span
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
              </span>

              <span className="min-w-0 truncate text-[13px] text-primary1">
                {application.riotName}
                <span className="text-primary3">#{application.riotNameTag}</span>
              </span>

              <span className="flex min-w-0 gap-1">
                <span className="shrink-0 rounded border border-border2 bg-rankBg2 px-1.5 py-0.5 text-[11px] text-primary1">
                  {positionLabel(application.mainPosition)}
                </span>
                <span className="truncate rounded border border-border2 bg-darkBg1 px-1.5 py-0.5 text-[11px] text-primary3">
                  {subPositionLabel(application.subPositions)}
                </span>
              </span>

              <span className="truncate text-xs text-primary2">
                {application.champions.length > 0
                  ? application.champions.map((champion) => champion.champName).join(" · ")
                  : "-"}
              </span>

              <span
                className={`text-center text-xs font-bold ${
                  application.captainAvailable ? "text-yellow" : "text-primary3"
                }`}
              >
                {application.captainAvailable ? "O" : "X"}
              </span>

              <span className="text-center text-xs text-primary2">
                {practiceLevelLabel(application.practiceLevel)}
              </span>

              <span className="min-w-0 text-xs text-primary2">
                <ClampedText text={application.availableTime} />
              </span>

              <span className="min-w-0 text-xs text-primary2">
                <ClampedText text={application.comment} />
              </span>
            </button>
          );
        })
      )}
    </div>
  </div>
);

export default ApplicationTable;
