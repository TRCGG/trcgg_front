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
    return <div className="text-primary2 p-6 text-center text-[13px]">불러오는 중...</div>;
  }
  if (frequent.length === 0) {
    return (
      <div className="text-primary2 bg-darkBg2 border border-border2 p-6 text-center text-[13px] rounded">
        아직 맞붙은 길드원이 없어요
      </div>
    );
  }
  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))] gap-3">
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
  <div className="flex flex-col gap-5">
    {/* Section title row */}
    <div className="flex items-baseline justify-between flex-wrap gap-3">
      <div>
        <h2 className="text-primary1 m-0 text-[22px] font-normal">상대전적</h2>
        <div className="text-primary2 text-[13px] mt-1">
          맞붙은 길드원과 직접 비교 · 같은 팀에서 함께한 기록도 확인할 수 있어요
        </div>
      </div>
      <div className="min-w-[280px] flex-[0_1_360px]">
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
    <div className="bg-darkBg2 border border-dashed border-border1 rounded py-8 px-6 flex items-center justify-center gap-6 text-center">
      <div className="bg-rankBg2 border border-border1 text-blueText2 w-16 h-16 rounded-full flex items-center justify-center text-[28px] font-bold shrink-0">
        ⚔
      </div>
      <div className="text-left max-w-[520px]">
        <div className="text-primary1 text-lg font-normal">
          맞상대를 선택해서 상대전적을 분석해 보세요
        </div>
        <div className="text-primary2 text-[13px] mt-1.5 leading-normal">
          내전에서 만난 길드원과의 직접 비교 (맞붙은) / 같은 팀 시너지 (함께한)를 한 곳에서 확인할
          수 있어요. KDA·데미지·CS·시야 등 지표 비교, 5×5 라인 매트릭스, 챔피언 매치업까지 자동으로
          정리됩니다.
        </div>
      </div>
    </div>

    {/* Frequent opponents */}
    <div>
      <div className="flex justify-between items-baseline pt-0 px-1 pb-3">
        <div className="text-primary1 text-sm font-bold">자주 만난 상대</div>
        <div className="text-primary2 text-[11px]">맞붙은 횟수 순</div>
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
