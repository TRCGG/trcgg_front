import { H2HProfile, H2HRelation } from "@/data/types/h2h";
import colors from "@/styles/colors";
import LaneIcon from "./LaneIcon";

interface Props {
  me: H2HProfile;
  oppo: H2HProfile;
  relation: H2HRelation;
}

interface SideProps {
  p: H2HProfile;
  align: "left" | "right";
}

const Side = ({ p, align }: SideProps) => {
  const isLeft = align === "left";
  return (
    <div
      className={`flex flex-1 min-w-0 items-center gap-2 sm:gap-4 ${
        isLeft ? "flex-row" : "flex-row-reverse"
      }`}
    >
      <div className="bg-rankBg2 border border-border1 relative flex h-11 w-11 shrink-0 items-center justify-center overflow-visible rounded-md sm:h-16 sm:w-16">
        <span className="text-primary2 text-lg font-bold sm:text-[22px]">
          {p.riotName.slice(0, 1)}
        </span>
        <div className="bg-darkBg2 border border-border1 absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full sm:h-6 sm:w-6">
          <LaneIcon position={p.mostLane} size={14} />
        </div>
      </div>
      <div className={`min-w-0 ${isLeft ? "text-left" : "text-right"}`}>
        <div
          className="text-primary1 truncate text-sm font-bold sm:text-lg"
          title={`${p.riotName}#${p.riotNameTag}`}
        >
          {p.riotName}
          <span className="text-primary2 ml-1 font-normal">#{p.riotNameTag}</span>
        </div>
        <div
          className={`text-primary2 mt-1 flex flex-wrap items-center gap-1.5 text-[11px] sm:gap-2 sm:text-xs ${
            isLeft ? "flex-row" : "flex-row-reverse"
          }`}
        >
          {p.mmr != null ? (
            <span className="text-yellow" style={{ fontFeatureSettings: '"tnum"' }}>
              MMR {p.mmr}
            </span>
          ) : (
            <span className="text-primary2">MMR 집계 전</span>
          )}
          <span className="bg-border1 hidden h-2.5 w-px sm:inline-block" />
          <span className="whitespace-nowrap">내전 승률 {p.seasonWR ?? "-"}%</span>
        </div>
      </div>
    </div>
  );
};

const H2HVersusHero = ({ me, oppo, relation }: Props) => {
  const verbCfg =
    relation === "with"
      ? { label: "WITH", color: colors.blueText, bg: colors.blue }
      : { label: "VS", color: colors.redText, bg: colors.red };

  return (
    <div className="bg-darkBg2 border border-border2 flex items-center gap-2 rounded px-3 py-4 sm:gap-6 sm:px-6 sm:py-5">
      <Side p={me} align="left" />
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-sm font-extrabold sm:h-20 sm:w-20 sm:text-lg"
        style={{
          background: verbCfg.bg,
          border: `2px solid ${verbCfg.color}`,
          color: verbCfg.color,
          letterSpacing: "0.04em",
        }}
      >
        {verbCfg.label}
      </div>
      <Side p={oppo} align="right" />
    </div>
  );
};

export default H2HVersusHero;
