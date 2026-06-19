import { FrequentOpponent } from "@/data/types/h2h";
import OpponentSearchInput from "./OpponentSearchInput";
import FrequentOpponentCardLarge from "./FrequentOpponentCardLarge";

interface Selected {
  riotName: string;
  riotNameTag?: string;
}

interface Props {
  frequent: FrequentOpponent[];
  isLoadingFrequent: boolean;
  guildId?: string;
  meName: string;
  meTag?: string;
  onSelect: (opponent: Selected) => void;
}

type FrequentContentProps = Pick<Props, "frequent" | "isLoadingFrequent" | "onSelect">;

const FrequentContent = ({ frequent, isLoadingFrequent, onSelect }: FrequentContentProps) => {
  if (isLoadingFrequent) {
    return (
      <div className="text-primary2" style={{ padding: 24, textAlign: "center", fontSize: 13 }}>
        불러오는 중...
      </div>
    );
  }
  if (frequent.length === 0) {
    return (
      <div
        className="text-primary2 bg-darkBg2 border border-border2"
        style={{
          padding: 24,
          textAlign: "center",
          fontSize: 13,
          borderRadius: 4,
        }}
      >
        아직 맞붙은 길드원이 없어요
      </div>
    );
  }
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 12,
      }}
    >
      {frequent.map((o) => (
        <FrequentOpponentCardLarge key={o.puuid} opponent={o} onSelect={onSelect} />
      ))}
    </div>
  );
};

const H2HEmptyState = ({
  frequent,
  isLoadingFrequent,
  guildId,
  meName,
  meTag,
  onSelect,
}: Props) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    {/* Section title row */}
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <div>
        <h2 className="text-primary1" style={{ margin: 0, fontSize: 22, fontWeight: 500 }}>
          상대전적
        </h2>
        <div className="text-primary2" style={{ fontSize: 13, marginTop: 4 }}>
          맞붙은 길드원과 직접 비교 · 같은 팀에서 함께한 기록도 확인할 수 있어요
        </div>
      </div>
      <div style={{ minWidth: 280, flex: "0 1 360px" }}>
        <OpponentSearchInput
          guildId={guildId}
          meName={meName}
          meTag={meTag}
          placeholder="맞상대 검색 (예: 구마유시#T1)"
          onSelect={onSelect}
        />
      </div>
    </div>

    {/* Invitation hero */}
    <div
      className="bg-darkBg2 border border-dashed border-border1"
      style={{
        borderRadius: 4,
        padding: "32px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        textAlign: "center",
      }}
    >
      <div
        className="bg-rankBg2 border border-border1 text-blueText2"
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        ⚔
      </div>
      <div style={{ textAlign: "left", maxWidth: 520 }}>
        <div className="text-primary1" style={{ fontSize: 18, fontWeight: 500 }}>
          맞상대를 선택해서 상대전적을 분석해 보세요
        </div>
        <div className="text-primary2" style={{ fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
          내전에서 만난 길드원과의 직접 비교 (맞붙은) / 같은 팀 시너지 (함께한)를 한 곳에서 확인할
          수 있어요. KDA·데미지·CS·시야 등 지표 비교, 5×5 라인 매트릭스, 챔피언 매치업까지 자동으로
          정리됩니다.
        </div>
      </div>
    </div>

    {/* Frequent opponents */}
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          padding: "0 4px 12px",
        }}
      >
        <div className="text-primary1" style={{ fontSize: 14, fontWeight: 600 }}>
          자주 만난 상대
        </div>
        <div className="text-primary2" style={{ fontSize: 11 }}>
          맞붙은 횟수 순
        </div>
      </div>
      <FrequentContent
        frequent={frequent}
        isLoadingFrequent={isLoadingFrequent}
        onSelect={onSelect}
      />
    </div>
  </div>
);

export default H2HEmptyState;
