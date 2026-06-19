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
      style={{
        flex: 1,
        display: "flex",
        flexDirection: isLeft ? "row" : "row-reverse",
        alignItems: "center",
        gap: 16,
        minWidth: 0,
      }}
    >
      <div
        className="bg-rankBg2 border border-border1"
        style={{
          position: "relative",
          width: 64,
          height: 64,
          borderRadius: 6,
          overflow: "hidden",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span className="text-primary2" style={{ fontWeight: 700, fontSize: 22 }}>
          {p.riotName.slice(0, 1)}
        </span>
        <div
          className="bg-darkBg2 border border-border1"
          style={{
            position: "absolute",
            right: -4,
            bottom: -4,
            width: 24,
            height: 24,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LaneIcon position={p.mostLane} size={16} />
        </div>
      </div>
      <div style={{ minWidth: 0, textAlign: isLeft ? "left" : "right" }}>
        <div
          className="text-primary1"
          style={{
            fontSize: 18,
            fontWeight: 700,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {p.riotName}
          <span className="text-primary2" style={{ fontWeight: 400, marginLeft: 4 }}>
            #{p.riotNameTag}
          </span>
        </div>
        <div
          className="text-primary2"
          style={{
            fontSize: 12,
            marginTop: 4,
            display: "flex",
            flexDirection: isLeft ? "row" : "row-reverse",
            gap: 8,
            alignItems: "center",
          }}
        >
          {p.mmr != null ? (
            <span className="text-yellow" style={{ fontFeatureSettings: '"tnum"' }}>
              MMR {p.mmr}
            </span>
          ) : (
            <span className="text-primary2">MMR 집계 전</span>
          )}
          <span className="bg-border1" style={{ width: 1, height: 10 }} />
          <span>내전 승률 {p.seasonWR ?? "-"}%</span>
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
    <div
      className="bg-darkBg2 border border-border2"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "20px 24px",
        borderRadius: 4,
      }}
    >
      <Side p={me} align="left" />
      <div
        style={{
          flexShrink: 0,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: verbCfg.bg,
          border: `2px solid ${verbCfg.color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: verbCfg.color,
          fontSize: 18,
          fontWeight: 800,
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
