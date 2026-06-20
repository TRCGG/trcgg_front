import { H2HAgainst, H2HRelation, H2HTogether } from "@/data/types/h2h";
import colors from "@/styles/colors";
import { formatFullDate } from "./h2hHelpers";
import H2HStreakDots from "./H2HStreakDots";
import TogetherAgainstDonut from "./TogetherAgainstDonut";

interface Props {
  relation: H2HRelation;
  firstMet: string | null;
  lastMet: string | null;
  against: H2HAgainst;
  together: H2HTogether;
}

const H2HSummaryBanner = ({ relation, firstMet, lastMet, against, together }: Props) => {
  const isWith = relation === "with";
  const block = isWith ? together : against;
  const { games, wins, losses, winRate, streak } = block;
  const label = isWith ? "같은 팀 승률" : "직접 대결 승률";
  const primaryColor = isWith ? colors.blueText : colors.yellow;

  return (
    <div className="bg-darkBg2 border border-border2 grid grid-cols-1 items-center gap-5 rounded px-4 py-4 sm:grid-cols-[auto_1fr_auto] sm:gap-8 sm:px-7 sm:py-5">
      {/* Big number */}
      <div className="min-w-0">
        <div className="text-primary2" style={{ fontSize: 12, letterSpacing: "0.08em" }}>
          {label.toUpperCase()}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 4 }}>
          <span
            className="text-[40px] sm:text-5xl"
            style={{
              fontWeight: 700,
              color: primaryColor,
              lineHeight: 1,
              fontFeatureSettings: '"tnum"',
            }}
          >
            {Math.round(winRate)}
            <span className="text-primary2" style={{ fontSize: 22, marginLeft: 2 }}>
              %
            </span>
          </span>
          <span className="text-primary1" style={{ fontSize: 18 }}>
            <b className="text-blueText">{wins}</b>승 <b className="text-redText">{losses}</b>패
          </span>
        </div>
        <div className="text-primary2 mt-1 text-[11px]">
          총 {games}전 · 첫 만남 {formatFullDate(firstMet)} · 마지막 {formatFullDate(lastMet)}
        </div>
      </div>

      {/* Streak */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div className="text-primary2" style={{ fontSize: 11, letterSpacing: "0.08em" }}>
          최근 {streak.length}전 ({isWith ? "함께" : "맞붙은"}, 우→최신)
        </div>
        <H2HStreakDots streak={streak} />
      </div>

      {/* Together vs Against donut */}
      <TogetherAgainstDonut withGames={together.games} againstGames={against.games} />
    </div>
  );
};

export default H2HSummaryBanner;
