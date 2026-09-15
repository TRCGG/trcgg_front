import { useMemo, useRef, useState } from "react";
import { ChampionItem } from "@/data/types/champion";
import useClickOutside from "@/hooks/common/useClickOutside";
import { MAX_APPLICATION_CHAMPIONS } from "@/data/types/competition";

interface Props {
  champions: ChampionItem[];
  /**
   * 선택된 챔피언의 champNameEng 목록 (최대 3개).
   * 신청 API가 내부 id가 아니라 영문명을 받는다(inArray(champion.champNameEng, ...)).
   */
  value: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
}

const SLOTS = Array.from({ length: MAX_APPLICATION_CHAMPIONS }, (_, i) => i);

/** 3칸을 눌러 챔피언을 검색해 채운다. 같은 챔피언을 두 칸에 넣을 수는 없다. */
const ChampionPicker = ({ champions, value, onChange, disabled = false }: Props) => {
  const [openSlot, setOpenSlot] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, () => setOpenSlot(null));

  const byNameEng = useMemo(() => {
    const map = new Map<string, ChampionItem>();
    champions.forEach((champion) => map.set(champion.champNameEng, champion));
    return map;
  }, [champions]);

  const candidates = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return champions
      .filter((champion) => !value.includes(champion.champNameEng))
      .filter(
        (champion) =>
          !keyword ||
          champion.champName.toLowerCase().includes(keyword) ||
          champion.champNameEng.toLowerCase().includes(keyword)
      )
      .slice(0, 50);
  }, [champions, value, query]);

  const setSlot = (slot: number, nameEng: string | null) => {
    const next = [...value];
    if (nameEng === null) next.splice(slot, 1);
    else if (slot < next.length) next[slot] = nameEng;
    else next.push(nameEng);
    onChange(next);
    setOpenSlot(null);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {SLOTS.map((slot) => {
          const nameEng = value[slot];
          const champion = nameEng ? byNameEng.get(nameEng) : undefined;
          const isOpen = openSlot === slot;
          return (
            <div key={slot} className="flex items-center gap-1">
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  setOpenSlot(isOpen ? null : slot);
                  setQuery("");
                }}
                className={`flex h-10 min-w-0 flex-1 items-center gap-2 rounded border bg-darkBg1 px-2.5 text-left ${
                  isOpen ? "border-blueText" : "border-border2"
                }`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-dashed border-border2 bg-darkBg2">
                  {!champion && (
                    <svg
                      className="h-3 w-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  )}
                </span>
                <span
                  className={`truncate text-[13px] ${champion ? "text-primary1" : "text-primary3"}`}
                >
                  {champion ? champion.champName : "챔피언 선택"}
                </span>
              </button>
              {champion && !disabled && (
                <button
                  type="button"
                  onClick={() => setSlot(slot, null)}
                  aria-label={`${champion.champName} 지우기`}
                  className="shrink-0 px-1 text-primary3 hover:text-redText"
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>

      {openSlot !== null && (
        <div className="absolute z-20 mt-1 w-full rounded border border-border2 bg-darkBg2 shadow-xl">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="챔피언 이름 검색"
            className="w-full border-b border-border2 bg-transparent px-3 py-2 text-sm text-primary1 outline-none"
          />
          <div className="max-h-[240px] overflow-y-auto">
            {candidates.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-primary3">
                검색 결과가 없습니다
              </div>
            ) : (
              candidates.map((champion) => (
                <button
                  type="button"
                  key={champion.id}
                  onClick={() => setSlot(openSlot, champion.champNameEng)}
                  className="flex w-full items-center gap-2 border-b border-cardBorder px-3 py-2 text-left last:border-0 hover:bg-grayHover"
                >
                  <span className="truncate text-[13px] text-primary1">{champion.champName}</span>
                  <span className="ml-auto shrink-0 text-[11px] text-primary3">
                    {champion.champNameEng}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChampionPicker;
