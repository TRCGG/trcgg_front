import { useEffect, useRef, useState } from "react";

export interface OverflowMenuItem {
  label: string;
  onSelect: () => void;
  disabled?: boolean;
  /** 되돌릴 수 없는 항목. 빨간 글씨로, 구분선 아래에 모인다. */
  danger?: boolean;
}

interface Props {
  items: OverflowMenuItem[];
  label?: string;
}

const OverflowMenu = ({ items, label = "더보기" }: Props) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (items.length === 0) return null;

  const normal = items.filter((item) => !item.danger);
  const danger = items.filter((item) => item.danger);

  const renderItem = (item: OverflowMenuItem) => (
    <button
      key={item.label}
      type="button"
      disabled={item.disabled}
      onClick={() => {
        setOpen(false);
        item.onSelect();
      }}
      className={`block w-full whitespace-nowrap px-3.5 py-2 text-left text-[13px] hover:bg-grayHover disabled:cursor-not-allowed disabled:opacity-40 ${
        item.danger ? "text-redText" : "text-primary1"
      }`}
    >
      {item.label}
    </button>
  );

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-[38px] w-[38px] items-center justify-center rounded border bg-darkBg1 ${
          open ? "border-blueText2 text-primary1" : "border-border2 text-primary2"
        } hover:text-primary1`}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="5" cy="12" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="19" cy="12" r="1.8" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-30 mt-1 min-w-[156px] rounded border border-border2 bg-darkBg2 py-1 shadow-xl"
        >
          {normal.map(renderItem)}
          {normal.length > 0 && danger.length > 0 && (
            <div className="my-1 h-px bg-border2" aria-hidden="true" />
          )}
          {danger.map(renderItem)}
        </div>
      )}
    </div>
  );
};

export default OverflowMenu;
