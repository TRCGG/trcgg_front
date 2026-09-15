import { PlayerCompetitionItem } from "@/data/types/competition";
import { getCompetitionStatusMeta, positionLabel } from "./competitionMeta";

interface Props {
  item: PlayerCompetitionItem;
  onSelect: () => void;
}

// 팀마다 다른 색을 돌려 써 카드를 눈으로 구분한다.
const BADGES = [
  "bg-blueText/[0.14] text-blueText",
  "bg-neonGreen/[0.14] text-neonGreen",
  "bg-yellow/[0.14] text-yellow",
  "bg-redText/[0.14] text-redText",
];

/** 스크림·본경기 순위가 따로 잡히므로 본경기를 우선 보여준다. */
const teamRankLabel = (item: PlayerCompetitionItem): string => {
  if (item.teamRank.main !== null) return `${item.teamRank.main}위`;
  if (item.teamRank.scrim !== null) return `${item.teamRank.scrim}위`;
  return "-";
};

const PlayerCompetitionCard = ({ item, onSelect }: Props) => {
  const status = getCompetitionStatusMeta(item.status);
  const { record } = item;

  const stats = [
    { label: "전적", value: `${record.win}승 ${record.lose}패`, className: "text-primary1" },
    {
      label: "승률",
      value: `${record.winRate}%`,
      className: record.winRate > 50 ? "text-yellow" : "text-primary2",
    },
    { label: "KDA", value: String(record.kda), className: "text-primary1" },
    { label: "팀 순위", value: teamRankLabel(item), className: "text-primary1" },
  ];

  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex flex-col gap-3.5 rounded border border-border2 bg-darkBg2 p-4 text-left hover:border-blueText2"
    >
      <div className="flex w-full items-center gap-2">
        <span className="min-w-0 flex-1 truncate text-base font-bold text-primary1">
          {item.name}
        </span>
        <span
          className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-bold ${status.textClass} ${status.bgClass}`}
        >
          {status.label}
        </span>
      </div>

      <div className="flex w-full items-center gap-2">
        {item.team ? (
          <>
            <span
              className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded text-[11px] font-bold ${
                BADGES[item.team.id % BADGES.length]
              }`}
            >
              {item.team.name.charAt(0)}
            </span>
            <span className="truncate text-[13px] text-primary1">{item.team.name}</span>
            <span className="shrink-0 text-xs text-primary2">
              {positionLabel(item.team.position)}
              {item.team.isCaptain && " · 팀장"}
            </span>
          </>
        ) : (
          <span className="text-xs text-primary3">
            {item.applicationStatus === "PENDING"
              ? "승인 대기 중 — 아직 팀에 편성되지 않았습니다"
              : "로스터에 오르지 않았습니다"}
          </span>
        )}
      </div>

      <div className="h-px w-full bg-rankBg2" />

      <div className="flex w-full items-center">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-1 flex-col gap-0.5">
            <span className="text-[11px] text-primary2">{stat.label}</span>
            <span className={`text-[15px] font-bold tabular-nums ${stat.className}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex w-full items-center gap-1.5">
        <span className="mr-0.5 text-[11px] text-primary3">최근</span>
        {item.recent.length === 0 ? (
          <span className="text-[11px] text-primary3">기록 없음</span>
        ) : (
          item.recent.map((result, index) => (
            <span
              // 승패 문자열만 오는 고정 목록이라 인덱스 외에 쓸 키가 없다(재정렬 없음).
              // eslint-disable-next-line react/no-array-index-key
              key={`${result}-${index}`}
              className={`flex h-[22px] w-[22px] items-center justify-center rounded text-[11px] font-bold ${
                result === "승" ? "bg-blue text-blueText" : "bg-redDarken text-redText"
              }`}
            >
              {result}
            </span>
          ))
        )}
        <span className="ml-auto text-xs text-blueText">대회 전적 보기 →</span>
      </div>
    </button>
  );
};

export default PlayerCompetitionCard;
