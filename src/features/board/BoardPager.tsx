interface BoardPagerProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const WINDOW = 10;

const BoardPager = ({ page, totalPages, onChange }: BoardPagerProps) => {
  if (totalPages <= 1) return null;

  const end = Math.min(totalPages, Math.max(1, page - 4) + WINDOW - 1);
  const start = Math.max(1, end - WINDOW + 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  const arrowClass =
    "h-8 w-8 text-base text-landing-caption disabled:cursor-default disabled:opacity-30";

  return (
    <nav aria-label="페이지" className="mt-7 flex items-center justify-center gap-0.5">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className={arrowClass}
      >
        ‹
      </button>
      {pages.map((n) => {
        const current = n === page;
        return (
          <button
            key={n}
            type="button"
            aria-current={current ? "page" : undefined}
            onClick={() => onChange(n)}
            className={`h-8 min-w-[32px] px-1.5 text-sm tabular-nums underline-offset-[6px] ${
              current ? "font-bold text-landing-goldLight underline" : "text-landing-caption"
            }`}
          >
            {n}
          </button>
        );
      })}
      <button
        type="button"
        aria-label="다음 페이지"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className={arrowClass}
      >
        ›
      </button>
    </nav>
  );
};

export default BoardPager;
