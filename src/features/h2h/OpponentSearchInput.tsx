import React, { useState } from "react";

interface Props {
  value?: string;
  placeholder?: string;
  showClear?: boolean;
  onSearch?: (value: string) => void;
  onClear?: () => void;
}

const OpponentSearchInput = ({
  value = "",
  placeholder = "맞상대 검색",
  showClear = false,
  onSearch,
  onClear,
}: Props) => {
  const [input, setInput] = useState(value);

  const submit = () => {
    const trimmed = input.trim();
    if (trimmed) onSearch?.(trimmed);
  };

  return (
    <div
      className="bg-rankBg2 border border-border1"
      style={{
        display: "flex",
        alignItems: "center",
        borderRadius: 6,
        padding: "6px 10px",
        gap: 8,
      }}
    >
      <svg className="fill-primary2" viewBox="0 0 24 24" width={16} height={16} aria-hidden="true">
        <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zM10 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
      </svg>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        placeholder={placeholder}
        className="text-white"
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          fontSize: 14,
          fontFamily: "inherit",
          minWidth: 0,
        }}
      />
      {showClear && (
        <button
          type="button"
          aria-label="지우기"
          onClick={() => {
            setInput("");
            onClear?.();
          }}
          className="text-primary2"
          style={{
            background: "transparent",
            border: "none",
            display: "flex",
            alignItems: "center",
            padding: 0,
          }}
        >
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default OpponentSearchInput;
