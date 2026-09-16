export type SummonerTab = "overview" | "champion" | "h2h" | "competition";

interface Props {
  activeTab: SummonerTab;
  onTabChange: (tab: SummonerTab) => void;
}

const TABS: { key: SummonerTab; label: string }[] = [
  { key: "overview", label: "종합" },
  { key: "champion", label: "챔피언" },
  { key: "h2h", label: "상대전적" },
  { key: "competition", label: "대회" },
];

const SummonerTabBar = ({ activeTab, onTabChange }: Props) => (
  // 탭 4개가 모바일 폭에 다 들어가지 않는다. 줄바꿈으로 찌그러뜨리는 대신 가로 스크롤한다
  // (대회 상세 탭 바와 같은 방식). 스크롤바는 탭 높이를 흔들어서 숨긴다.
  // 활성 탭 밑줄에 -mb-px를 주지 않는 이유: overflow-x가 auto면 overflow-y도 auto가 되어
  // 1px이 세로 스크롤 가능 영역이 되고, 가로로 쓸 때 세로로 미세하게 흔들린다.
  <div className="flex overflow-x-auto rounded border border-border2 bg-[rgba(12,13,15,0.5)] px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    {TABS.map(({ key, label }) => (
      <button
        key={key}
        type="button"
        onClick={() => onTabChange(key)}
        className={`shrink-0 whitespace-nowrap border-b-3 px-7 py-3.5 text-base transition-colors ${
          activeTab === key
            ? "text-primary1 font-bold border-blueText"
            : "text-primary2 font-normal border-transparent hover:text-primary1"
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);

export default SummonerTabBar;
