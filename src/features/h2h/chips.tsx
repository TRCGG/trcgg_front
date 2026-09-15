import { useEffect, useRef, useState } from "react";

interface SameLaneChipProps {
  active?: boolean;
  onChange?: (next: boolean) => void;
}

// 맞라인만 토글 칩 — 챔피언 매치업 / 최근 맞대결 공용
export const SameLaneChip = ({ active = false, onChange }: SameLaneChipProps) => (
  <button
    type="button"
    onClick={() => onChange?.(!active)}
    className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] transition-[background,border-color] duration-[120ms] ${
      active ? "border-blueText bg-blue text-blueText" : "border-border2 bg-rankBg2 text-primary1"
    }`}
  >
    <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-blueText" : "bg-primary2"}`} />
    맞라인만
  </button>
);

export interface SortOption<T extends string> {
  key: T;
  label: string;
}

interface SortChipProps<T extends string> {
  value: T;
  options: SortOption<T>[];
  onChange: (key: T) => void;
}

// 정렬 칩 — 클릭 시 정렬 옵션 드롭다운
export const SortChip = <T extends string>({ value, options, onChange }: SortChipProps<T>) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const current = options.find((o) => o.key === value) ?? options[0];

  useEffect(() => {
    if (!open) return undefined;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="bg-rankBg2 border border-border2 text-primary1 flex items-center gap-1 py-1 px-2.5 rounded-full text-[11px] cursor-pointer whitespace-nowrap"
      >
        {current.label}
        <svg
          width={10}
          height={10}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="transition-transform duration-[120ms]"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        >
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="bg-darkBg2 border border-border1 absolute right-0 rounded-md overflow-hidden min-w-[96px] top-[calc(100%+4px)] shadow-[0_8px_30px_rgba(0,0,0,0.5)] z-20">
          {options.map((o) => {
            const active = o.key === value;
            return (
              <button
                key={o.key}
                type="button"
                onClick={() => {
                  onChange(o.key);
                  setOpen(false);
                }}
                className={`hover:bg-rankBg2 block w-full cursor-pointer whitespace-nowrap border-none bg-transparent px-3 py-1.5 text-left text-[11px] ${
                  active ? "text-blueText" : "text-primary1"
                }`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
