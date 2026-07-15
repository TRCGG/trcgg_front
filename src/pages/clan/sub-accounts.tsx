import type { NextPage } from "next";
import React, { useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "@/services/apiService";
import {
  getGuildMembers,
  getSubAccounts,
  linkSubAccount,
  removeSubAccount,
} from "@/services/guildMember";
import {
  MemberListResponse,
  SubAccountLink,
  SubAccountListResponse,
} from "@/data/types/guildMember";
import useClickOutside from "@/hooks/common/useClickOutside";
import useDebouncedRiotNameTag from "@/hooks/searchUserList/useDebouncedRiotNameTag";
import useUserSearchQuery from "@/hooks/searchUserList/useUserSearchQuery";
import ClanManageLayout from "@/features/clanManage/ClanManageLayout";
import { withHash, parseRiotId } from "@/features/clanManage/riot";

const mainKey = (riotName: string, riotNameTag: string) => `${riotName}#${riotNameTag}`;

const SubAccountContent = ({ guildId }: { guildId: string }) => {
  const queryClient = useQueryClient();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [mainSearch, setMainSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // 부계정 입력창 검색 미리보기 (헤더 검색과 동일한 길드 멤버 검색 재사용)
  const draftRef = useRef<HTMLDivElement>(null);
  const [draftFocused, setDraftFocused] = useState(false);
  useClickOutside(draftRef, () => setDraftFocused(false));
  const { debouncedTerm, isTyping } = useDebouncedRiotNameTag(draft);
  const { data: previewData } = useUserSearchQuery(
    isTyping ? { riotName: "", riotNameTag: "" } : debouncedTerm,
    guildId
  );
  const previewResults = previewData?.data?.data ?? [];

  const membersQuery = useQuery<ApiResponse<MemberListResponse>>({
    queryKey: ["clanMembers", guildId, "active"],
    queryFn: () => getGuildMembers(guildId, { status: "1", limit: 1000 }),
    enabled: !!guildId,
    staleTime: 30 * 1000,
  });
  const subAccountsQuery = useQuery<ApiResponse<SubAccountListResponse>>({
    queryKey: ["subAccounts", guildId],
    queryFn: () => getSubAccounts(guildId),
    enabled: !!guildId,
    staleTime: 30 * 1000,
  });

  const mains = useMemo(() => membersQuery.data?.data?.data ?? [], [membersQuery.data]);
  const links = useMemo(() => subAccountsQuery.data?.data?.data ?? [], [subAccountsQuery.data]);

  // 본계정 key → 부계정 목록
  const altsByMain = useMemo(() => {
    const map: Record<string, SubAccountLink[]> = {};
    links.forEach((l) => {
      if (!l.mainRiotName || !l.mainRiotNameTag) return;
      const k = mainKey(l.mainRiotName, l.mainRiotNameTag);
      (map[k] = map[k] || []).push(l);
    });
    return map;
  }, [links]);

  const filteredMains = useMemo(
    () =>
      mainSearch
        ? mains.filter((m) => m.riotName.toLowerCase().includes(mainSearch.toLowerCase()))
        : mains,
    [mains, mainSearch]
  );

  const selKey =
    selectedKey ?? (mains[0] ? mainKey(mains[0].riotName, mains[0].riotNameTag) : null);
  const selected = mains.find((m) => mainKey(m.riotName, m.riotNameTag) === selKey) ?? null;
  const selectedAlts = selKey ? (altsByMain[selKey] ?? []) : [];

  const refetchAll = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["subAccounts", guildId] }),
      queryClient.invalidateQueries({ queryKey: ["clanMembers", guildId] }),
    ]);
  };

  const handleAdd = async () => {
    if (busy || !selected) return;
    const { name, tag } = parseRiotId(draft);
    if (!name || !tag) {
      setErrorMsg("부계정 라이엇 ID를 '닉네임#태그' 형식으로 입력하세요. (예: 부계정닉#KR2)");
      return;
    }
    setBusy(true);
    setErrorMsg(null);
    const res = await linkSubAccount(guildId, {
      subRiotName: name,
      subRiotTag: tag,
      mainRiotName: selected.riotName,
      mainRiotTag: selected.riotNameTag,
    });
    if (res.error) {
      setErrorMsg(res.error || "부계정 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } else {
      setDraft("");
      await refetchAll();
    }
    setBusy(false);
  };

  const handleRemove = async (alt: SubAccountLink) => {
    if (busy) return;
    setBusy(true);
    setErrorMsg(null);
    const res = await removeSubAccount(guildId, {
      riotName: alt.subRiotName,
      riotNameTag: alt.subRiotNameTag,
    });
    if (res.error) {
      setErrorMsg(res.error || "부계정 연결 해제에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } else {
      await refetchAll();
    }
    setBusy(false);
  };

  const renderMainList = () => {
    if (membersQuery.isLoading) {
      return <div className="py-10 text-center text-sm text-primary2">불러오는 중...</div>;
    }
    if (filteredMains.length === 0) {
      return <div className="py-10 text-center text-sm text-primary2">본계정이 없습니다</div>;
    }
    return filteredMains.map((m) => {
      const k = mainKey(m.riotName, m.riotNameTag);
      const active = k === selKey;
      const count = (altsByMain[k] ?? []).length;
      return (
        <button
          type="button"
          key={k}
          onClick={() => setSelectedKey(k)}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 border-b border-cardBorder text-left transition-colors ${
            active ? "bg-blue border-l-2 border-l-blueText" : "hover:bg-grayHover"
          }`}
        >
          <span className="flex-1 min-w-0 truncate">
            <span className="text-sm text-primary1">{m.riotName}</span>
            <span className="text-xs text-primary3 ml-1">{withHash(m.riotNameTag)}</span>
          </span>
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
              count > 0 ? "text-blueText bg-blueText/10" : "text-primary3 bg-darkBg1"
            }`}
          >
            부계정 {count}
          </span>
        </button>
      );
    });
  };

  return (
    <>
      {errorMsg && (
        <div className="rounded bg-redDarken border border-redLighten px-4 py-3 text-sm text-redText">
          {errorMsg}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        {/* 본계정 목록 */}
        <div className="w-full md:w-[320px] shrink-0 bg-darkBg2 border border-border2 rounded overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-3.5 pt-3 pb-2">
            <span className="text-[13px] font-bold text-primary1">본계정</span>
            <span className="text-xs text-primary2">{mains.length}명</span>
          </div>
          <div className="flex items-center bg-darkBg1 border-y border-border2 px-3 py-2">
            <svg
              className="w-4 h-4 text-primary3 mr-2 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={mainSearch}
              onChange={(e) => setMainSearch(e.target.value)}
              placeholder="본계정 닉네임 검색"
              className="bg-transparent border-none outline-none text-[13px] text-primary1 flex-1"
            />
          </div>
          <div className="flex-1 md:max-h-[520px] overflow-y-auto">{renderMainList()}</div>
        </div>

        {/* 선택된 본계정 상세 */}
        <div className="flex-1 min-w-0 bg-darkBg2 border border-border2 rounded p-5">
          {!selected ? (
            <div className="py-16 text-center text-sm text-primary2">
              왼쪽에서 본계정을 선택하세요.
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary1">{selected.riotName}</span>
                <span className="text-sm text-primary3">{withHash(selected.riotNameTag)}</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded text-blueText bg-blueText/10">
                  본계정
                </span>
              </div>

              <div className="h-px bg-cardBorder my-5" />

              {/* 부계정 추가 */}
              <div className="text-sm font-bold text-primary1 mb-2">부계정 추가</div>
              <div className="flex gap-2 mb-1.5">
                <div ref={draftRef} className="relative flex-1">
                  <div className="flex items-center bg-darkBg1 border border-border2 rounded px-3 h-[42px]">
                    <svg
                      className="w-4 h-4 text-primary3 mr-2 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      value={draft}
                      onChange={(e) => {
                        setDraft(e.target.value);
                        setDraftFocused(true);
                      }}
                      onFocusCapture={() => setDraftFocused(true)}
                      onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                      placeholder="부계정 라이엇 ID 입력 (예: 부계정닉#KR2)"
                      className="bg-transparent border-none outline-none text-sm text-primary1 flex-1"
                    />
                  </div>

                  {draftFocused && draft.trim().length >= 2 && previewResults.length > 0 && (
                    <div className="absolute z-20 mt-1 w-full bg-darkBg2 border border-border2 rounded shadow-xl max-h-[240px] overflow-y-auto">
                      {previewResults.map((p) => (
                        <button
                          type="button"
                          key={p.playerCode}
                          onClick={() => {
                            setDraft(`${p.riotName}#${p.riotNameTag}`);
                            setDraftFocused(false);
                          }}
                          className="flex items-center gap-2 w-full text-left px-3 py-2 border-b border-cardBorder last:border-0 hover:bg-grayHover"
                        >
                          <span className="text-sm text-primary1 truncate">{p.riotName}</span>
                          <span className="text-xs text-primary3">{withHash(p.riotNameTag)}</span>
                          {p.isMain && (
                            <span className="ml-auto shrink-0 text-[10px] text-blueText bg-blueText/10 rounded px-1.5 py-0.5">
                              본계정
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleAdd}
                  className="flex items-center gap-1.5 text-sm font-bold text-white bg-bluePrimary rounded px-5 h-[42px] shrink-0 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <svg
                    className="w-[15px] h-[15px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.6}
                    strokeLinecap="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  연결
                </button>
              </div>
              <div className="text-[11px] text-primary3">
                본계정과 동일인이 사용하는 계정만 연결하세요. 연결 시 부계정 전적이 본계정에
                합산됩니다.
              </div>

              <div className="h-px bg-cardBorder my-5" />

              {/* 연결된 부계정 */}
              <div className="text-sm font-bold text-primary1 mb-2.5">
                연결된 부계정 <span className="text-blueText">{selectedAlts.length}</span>
              </div>

              {selectedAlts.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {selectedAlts.map((alt) => (
                    <div
                      key={`${alt.subRiotName}#${alt.subRiotNameTag}`}
                      className="flex items-center gap-3 bg-darkBg1 border border-cardBorder rounded px-3.5 py-3"
                    >
                      <span className="flex-1 min-w-0 truncate">
                        <span className="text-sm text-primary1">{alt.subRiotName}</span>
                        <span className="text-xs text-primary3 ml-1">
                          {withHash(alt.subRiotNameTag)}
                        </span>
                      </span>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleRemove(alt)}
                        className="text-xs text-redText bg-redText/[0.08] border border-redLighten rounded px-3 py-1.5 shrink-0 hover:bg-redText/[0.15] transition-colors disabled:opacity-50"
                      >
                        연결 해지
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-darkBg1 border border-dashed border-border2 rounded px-6 py-7 text-center">
                  <div className="text-[13px] text-primary2">아직 연결된 부계정이 없습니다.</div>
                  <div className="text-xs text-primary3 mt-1">
                    위 입력창에 라이엇 ID를 넣어 부계정을 연결하세요.
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

const ClanSubAccounts: NextPage = () => (
  <ClanManageLayout
    title="부계정 연결 관리"
    description="클랜원의 본계정에 부계정을 연결합니다. 연결된 부계정의 전적은 본계정 전적에 함께 반영됩니다."
  >
    {(guildId) => <SubAccountContent guildId={guildId} />}
  </ClanManageLayout>
);

export default ClanSubAccounts;
