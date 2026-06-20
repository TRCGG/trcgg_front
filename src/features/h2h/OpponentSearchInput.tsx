import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/services/apiService";
import { FrequentOpponent, FrequentOpponentsResponse } from "@/data/types/h2h";
import { getFrequentOpponents } from "@/services/h2h";
import colors from "@/styles/colors";
import LaneIcon from "./LaneIcon";

interface Selected {
  riotName: string;
  riotNameTag?: string;
}

interface Props {
  /** 기준 유저(나) */
  guildId?: string;
  meName: string;
  meTag?: string;
  /** 현재 선택된 상대 표시값 */
  value?: string;
  placeholder?: string;
  showClear?: boolean;
  onSelect: (opponent: Selected) => void;
  onClear?: () => void;
}

const parseInput = (value: string): Selected | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const [name, tag] = trimmed.split("#");
  if (!name.trim()) return null;
  return { riotName: name.trim(), riotNameTag: tag?.trim() || undefined };
};

const OpponentSearchInput = ({
  guildId,
  meName,
  meTag,
  value = "",
  placeholder = "맞상대 검색",
  showClear = false,
  onSelect,
  onClear,
}: Props) => {
  const [input, setInput] = useState(value);
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);

  // 선택된 상대(value)가 바뀌면 입력값 동기화
  useEffect(() => {
    setInput(value);
  }, [value]);

  // 입력 디바운스
  useEffect(() => {
    const t = setTimeout(() => setDebounced(input.trim()), 250);
    return () => clearTimeout(t);
  }, [input]);

  const { data, isFetching } = useQuery<ApiResponse<FrequentOpponentsResponse>>({
    queryKey: ["h2hAutocomplete", guildId, meName, meTag, debounced],
    queryFn: () =>
      getFrequentOpponents(guildId!, meName, { riotNameTag: meTag, q: debounced, limit: 8 }),
    enabled: open && !!guildId && !!meName && debounced.length >= 1,
    staleTime: 60 * 1000,
  });

  const results: FrequentOpponent[] = data?.data?.data ?? [];
  const showDropdown = open && debounced.length >= 1;

  const choose = (opponent: Selected) => {
    onSelect(opponent);
    setInput(`${opponent.riotName}${opponent.riotNameTag ? `#${opponent.riotNameTag}` : ""}`);
    setOpen(false);
  };

  const handleEnter = () => {
    if (results.length > 0) {
      const o = results[0];
      choose({ riotName: o.riotName, riotNameTag: o.riotNameTag });
      return;
    }
    const parsed = parseInput(input);
    if (parsed) {
      onSelect(parsed);
      setOpen(false);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div className="bg-rankBg2 border border-border1 flex items-center gap-2 rounded-md px-2.5 py-1.5">
        <svg
          viewBox="0 0 24 24"
          width={16}
          height={16}
          className="fill-primary2 shrink-0"
          aria-hidden="true"
        >
          <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zM10 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
        </svg>
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          // 드롭다운 항목은 onMouseDown에서 preventDefault로 포커스를 유지하므로
          // 항목 클릭 시엔 blur가 발생하지 않는다. 바깥 클릭이면 닫는다.
          onBlur={() => setOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleEnter();
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder={placeholder}
          className="text-white min-w-0 flex-1 border-none bg-transparent text-sm outline-none"
          style={{ fontFamily: "inherit" }}
        />
        {showClear && (
          <button
            type="button"
            aria-label="지우기"
            className="text-primary2 flex items-center border-none bg-transparent p-0"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setInput("");
              setDebounced("");
              setOpen(false);
              onClear?.();
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

      {showDropdown && (
        <div
          className="bg-darkBg2 border border-border1"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            borderRadius: 6,
            boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
            zIndex: 20,
            overflow: "hidden",
            maxHeight: 320,
            overflowY: "auto",
          }}
        >
          {results.length > 0 ? (
            results.map((o) => (
              <button
                key={o.puuid}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose({ riotName: o.riotName, riotNameTag: o.riotNameTag })}
                className="hover:bg-rankBg2 flex w-full items-center gap-2 border-none bg-transparent px-3 py-2 text-left"
                style={{ borderTop: `1px solid ${colors.rankBg1}` }}
              >
                <LaneIcon position={o.mainLane} size={16} />
                <span className="text-white flex-1 truncate text-sm">
                  <b>{o.riotName}</b>
                  <span className="text-gray ml-1">#{o.riotNameTag}</span>
                </span>
                <span className="text-primary2 shrink-0 text-xs">{o.matchups}판</span>
              </button>
            ))
          ) : (
            <div className="text-primary2 px-3 py-3 text-center text-xs">
              {isFetching ? "검색 중..." : "맞붙은 기록이 있는 상대가 없어요"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OpponentSearchInput;
