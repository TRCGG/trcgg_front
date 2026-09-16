import { useEffect, useRef, useState } from "react";

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

/**
 * 스크롤 여지를 알리는 가장자리 페이드 + 화살표. 클랜관리 모바일 메뉴와 같은 방식이다.
 */
const ScrollHint = ({ side }: { side: "left" | "right" }) => (
  <div
    aria-hidden
    className={`pointer-events-none absolute inset-y-0 flex w-10 items-center ${
      side === "left"
        ? "left-0 justify-start bg-gradient-to-r from-rankBg3 to-transparent"
        : "right-0 justify-end bg-gradient-to-l from-rankBg3 to-transparent"
    }`}
  >
    <svg
      className="h-4 w-4 text-primary2"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={side === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
    </svg>
  </div>
);

const SummonerTabBar = ({ activeTab, onTabChange }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    const update = () => {
      setCanScrollLeft(el.scrollLeft > 1);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded border border-border2 bg-[rgba(12,13,15,0.5)]">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onTabChange(key)}
            // -mb-px 금지: overflow-x가 auto면 overflow-y도 auto가 되어 1px이 세로로 흔들린다.
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

      {canScrollLeft && <ScrollHint side="left" />}
      {canScrollRight && <ScrollHint side="right" />}
    </div>
  );
};

export default SummonerTabBar;
