import Link from "next/link";
import { HighlightCategory, Highlights } from "@/data/types/leaderboard";

interface Props {
  highlights: Highlights | undefined;
  isLoading: boolean;
  isError: boolean;
}

const CATEGORIES: { key: HighlightCategory; label: string }[] = [
  { key: "kills", label: "최다 킬" },
  { key: "assists", label: "최다 어시스트" },
  { key: "championDamage", label: "챔피언 피해량" },
  { key: "visionScore", label: "시야 점수" },
  { key: "damageTaken", label: "받은 피해량" },
  { key: "buildingDamage", label: "건물 피해량" },
];

const GRID_CLASS = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-3.5";

const splashUrl = (champNameEng: string) =>
  `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champNameEng}_0.jpg`;

const shortDate = (date: string) => {
  const [, m, d] = date.split("-").map(Number);
  return `${m}월 ${d}일`;
};

const HighlightCards = ({ highlights, isLoading, isError }: Props) => {
  if (isError) {
    return <p className="mt-3.5 py-8 text-center text-sm text-redText">불러오지 못했습니다</p>;
  }
  if (isLoading || !highlights) {
    return (
      <div className={GRID_CLASS}>
        {CATEGORIES.map(({ key }) => (
          <div key={key} className="h-[250px] rounded-md bg-rankBg2 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className={GRID_CLASS}>
      {CATEGORIES.map(({ key, label }) => {
        const { value, entries } = highlights[key];
        const [top] = entries;
        return (
          <div
            key={key}
            className="relative h-[250px] rounded-md overflow-hidden bg-darkBg2 border border-border2"
          >
            {top && (
              <div
                className="absolute inset-0 bg-cover bg-top"
                style={{ backgroundImage: `url(${splashUrl(top.champion.champNameEng)})` }}
              />
            )}
            <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-darkBg2 from-35% to-transparent" />
            <div className="absolute inset-x-2.5 bottom-2.5 flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-yellow">{label}</span>
              <span className="text-2xl font-bold leading-tight text-white tabular-nums">
                {value === null ? "-" : value.toLocaleString()}
              </span>
              {top ? (
                <>
                  <div className="flex items-baseline gap-1 min-w-0 whitespace-nowrap">
                    <Link
                      href={`/summoners/${encodeURIComponent(top.riotName)}/${encodeURIComponent(
                        top.riotNameTag
                      )}`}
                      passHref
                    >
                      <a
                        title={`${top.riotName}#${top.riotNameTag} 전적 보기`}
                        className="min-w-0 truncate text-xs font-bold text-white hover:text-blueText transition-colors"
                      >
                        {top.riotName}
                      </a>
                    </Link>
                    {entries.length > 1 && (
                      <span className="shrink-0 text-[10px] text-primary2">
                        외 {entries.length - 1}명
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-primary2 truncate">
                    {top.champion.champName} · {shortDate(top.registeredDate)}
                  </span>
                </>
              ) : (
                <span className="text-[10px] text-primary2">기록 없음</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HighlightCards;
