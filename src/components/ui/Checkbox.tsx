import { InputHTMLAttributes } from "react";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "className">;

const Checkbox = (props: CheckboxProps) => (
  <span className="relative inline-flex h-4 w-4 shrink-0 align-middle">
    {/* 브라우저 기본 체크박스는 배경색을 바꿀 수 없어 appearance-none으로 직접 그린다. */}
    <input
      type="checkbox"
      className="peer m-0 h-4 w-4 cursor-pointer appearance-none rounded-[4px] border border-board-meta/60 bg-landing-bgElevated transition-colors hover:border-landing-goldMuted checked:border-landing-gold checked:bg-landing-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-landing-gold disabled:cursor-not-allowed disabled:opacity-40"
      {...props}
    />
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="pointer-events-none absolute inset-0 hidden h-4 w-4 text-board-onGold peer-checked:block"
    >
      <path
        d="M4 8.2l2.6 2.6L12 5.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

export default Checkbox;
