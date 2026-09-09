import { useRef, useState } from "react";
import useDebouncedRiotNameTag from "@/hooks/searchUserList/useDebouncedRiotNameTag";
import useUserSearchQuery from "@/hooks/searchUserList/useUserSearchQuery";
import useClickOutside from "@/hooks/common/useClickOutside";
import { PlayerInfo } from "@/data/types/user";

interface Props {
  guildId: string;
  /** 선택된 계정. 없으면 검색 입력만 보인다. */
  selected: PlayerInfo | null;
  onSelect: (player: PlayerInfo | null) => void;
  placeholder?: string;
  disabled?: boolean;
  /**
   * 부계정을 골랐을 때 아래에 띄울 안내. 미지정이면 표시하지 않는다.
   * 대회 신청은 저장 시 백엔드가 연결된 본계정으로 정규화하므로(toMainAccount)
   * 고른 계정과 기록될 계정이 달라진다 — 그 사실을 고른 자리에서 알리기 위한 것.
   */
  subAccountNotice?: string;
}

/**
 * 클랜 내 라이엇 계정을 검색해 고른다. 대회 신청은 playerCode를 body로 보내야 하는데
 * "내 계정" API가 없어 사용자가 직접 고르는 구조다.
 * clan/sub-accounts의 검색 미리보기와 같은 방식(디바운스 + 드롭다운)을 쓴다.
 */
const RiotAccountPicker = ({
  guildId,
  selected,
  onSelect,
  placeholder = "내 라이엇 ID 검색 (예: 닉네임#KR1)",
  disabled = false,
  subAccountNotice,
}: Props) => {
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, () => setFocused(false));

  const { debouncedTerm, isTyping } = useDebouncedRiotNameTag(draft);
  const { data } = useUserSearchQuery(
    isTyping ? { riotName: "", riotNameTag: "" } : debouncedTerm,
    guildId
  );
  const results = data?.data?.data ?? [];

  if (selected) {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex h-[38px] items-center gap-2 rounded border border-border2 bg-darkBg1 px-3">
          <span className="truncate text-sm text-primary1">
            {selected.riotName}
            <span className="text-primary3">#{selected.riotNameTag}</span>
          </span>
          <span
            className={`shrink-0 rounded px-[7px] py-0.5 text-[11px] ${
              selected.isMain ? "bg-neonGreen/10 text-neonGreen" : "bg-yellow/10 text-yellow"
            }`}
          >
            {selected.isMain ? "본계정" : "부계정"}
          </span>
          {!disabled && (
            <button
              type="button"
              onClick={() => {
                onSelect(null);
                setDraft("");
              }}
              className="ml-auto shrink-0 text-xs text-blueText hover:text-primary1"
            >
              계정 변경
            </button>
          )}
        </div>
        {!selected.isMain && subAccountNotice && (
          <p className="text-[11px] leading-relaxed text-yellow">{subAccountNotice}</p>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex h-[38px] items-center gap-2 rounded border border-border2 bg-darkBg1 px-3">
        <svg
          className="h-4 w-4 shrink-0 text-primary3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setFocused(true);
          }}
          onFocus={() => setFocused(true)}
          disabled={disabled}
          placeholder={placeholder}
          className="flex-1 border-none bg-transparent text-sm text-primary1 outline-none"
        />
      </div>

      {focused && draft.trim().length >= 2 && results.length > 0 && (
        <div className="absolute z-20 mt-1 max-h-[240px] w-full overflow-y-auto rounded border border-border2 bg-darkBg2 shadow-xl">
          {results.map((player) => (
            <button
              type="button"
              key={player.playerCode}
              onClick={() => {
                onSelect(player);
                setFocused(false);
              }}
              className="flex w-full items-center gap-2 border-b border-cardBorder px-3 py-2 text-left last:border-0 hover:bg-grayHover"
            >
              <span className="truncate text-sm text-primary1">{player.riotName}</span>
              <span className="text-xs text-primary3">#{player.riotNameTag}</span>
              <span
                className={`ml-auto shrink-0 rounded px-1.5 py-0.5 text-[10px] ${
                  player.isMain ? "bg-blueText/10 text-blueText" : "bg-yellow/10 text-yellow"
                }`}
              >
                {player.isMain ? "본계정" : "부계정"}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RiotAccountPicker;
