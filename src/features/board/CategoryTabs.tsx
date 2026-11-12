import { BOARD_TABS, BoardTab } from "@/features/board/postMeta";

interface CategoryTabsProps {
  active: BoardTab;
  onSelect: (tab: BoardTab) => void;
}

const CategoryTabs = ({ active, onSelect }: CategoryTabsProps) => (
  <div
    role="tablist"
    aria-label="카테고리"
    className="mb-3 flex flex-wrap items-end gap-x-5 gap-y-2.5 sm:gap-x-[26px]"
  >
    {BOARD_TABS.map((tab) => {
      const selected = tab.key === active;
      return (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={selected}
          onClick={() => onSelect(tab.key)}
          className={`border-b-2 pb-[5px] text-base tracking-[-0.3px] sm:text-lg ${
            selected
              ? "border-white font-bold text-white"
              : "border-transparent font-normal text-board-meta hover:text-landing-body"
          }`}
        >
          {tab.label}
        </button>
      );
    })}
  </div>
);

export default CategoryTabs;
