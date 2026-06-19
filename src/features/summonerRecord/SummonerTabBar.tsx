export type SummonerTab = "overview" | "champion" | "h2h";

interface Props {
  activeTab: SummonerTab;
  onTabChange: (tab: SummonerTab) => void;
}

const TABS: { key: SummonerTab; label: string }[] = [
  { key: "overview", label: "종합" },
  { key: "champion", label: "챔피언" },
  { key: "h2h", label: "상대전적" },
];

const SummonerTabBar = ({ activeTab, onTabChange }: Props) => (
  <div
    className="flex border border-border2 rounded px-1"
    style={{ backgroundColor: "rgba(12, 13, 15, 0.5)" }}
  >
    {TABS.map(({ key, label }) => (
      <button
        key={key}
        type="button"
        onClick={() => onTabChange(key)}
        className={`px-7 py-3.5 text-base border-b-3 -mb-px transition-colors ${
          activeTab === key
            ? "text-primary1 font-bold border-blueText"
            : "text-primary2 font-medium border-transparent hover:text-primary1"
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);

export default SummonerTabBar;
