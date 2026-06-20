import { useEffect, useRef, useState } from "react";
import colors from "@/styles/colors";

interface SameLaneChipProps {
  active?: boolean;
  onChange?: (next: boolean) => void;
}

// 맞라인만 토글 칩 — 챔피언 매치업 / 최근 맞대결 공용
export const SameLaneChip = ({ active = false, onChange }: SameLaneChipProps) => (
  <button
    type="button"
    onClick={() => onChange?.(!active)}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "4px 10px",
      borderRadius: 999,
      fontSize: 11,
      border: `1px solid ${active ? colors.blueText : colors.border2}`,
      background: active ? colors.blue : colors.rankBg2,
      color: active ? colors.blueText : colors.primary1,
      cursor: "pointer",
      whiteSpace: "nowrap",
      transition: "background 120ms, border-color 120ms",
    }}
  >
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: active ? colors.blueText : colors.primary2,
      }}
    />
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
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="bg-rankBg2 border border-border2 text-primary1"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "4px 10px",
          borderRadius: 999,
          fontSize: 11,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        {current.label}
        <svg
          width={10}
          height={10}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 120ms" }}
        >
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div
          className="bg-darkBg2 border border-border1"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            borderRadius: 6,
            boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
            zIndex: 20,
            overflow: "hidden",
            minWidth: 96,
          }}
        >
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
                className={`hover:bg-rankBg2 ${active ? "text-blueText" : "text-primary1"}`}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "6px 12px",
                  fontSize: 11,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
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
