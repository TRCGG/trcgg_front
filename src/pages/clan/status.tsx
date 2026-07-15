import type { NextPage } from "next";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "@/services/apiService";
import { getGuildMembers, updateMemberStatus } from "@/services/guildMember";
import { GuildMemberRow, MemberListResponse, MemberStatus } from "@/data/types/guildMember";
import ClanManageLayout from "@/features/clanManage/ClanManageLayout";
import { withHash } from "@/features/clanManage/riot";
import { formatTimeAgo } from "@/utils/parseTime";

const PAGE_SIZE = 10;

const keyOf = (m: GuildMemberRow) => `${m.riotName}#${m.riotNameTag}`;

type SortDir = "none" | "desc" | "asc";

const SORT_ARROW: Record<SortDir, string> = { none: "↕", desc: "▼", asc: "▲" };

const CheckBox = ({ checked }: { checked: boolean }) => (
  <span
    className={`w-[18px] h-[18px] rounded grid place-items-center border cursor-pointer shrink-0 ${
      checked ? "bg-bluePrimary border-bluePrimary" : "border-border1"
    }`}
  >
    {checked && (
      <svg
        className="w-3 h-3 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    )}
  </span>
);

const MemberStatusContent = ({ guildId }: { guildId: string }) => {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"active" | "left">("active");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortDir>("none");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const membersQuery = useQuery<ApiResponse<MemberListResponse>>({
    queryKey: ["clanMembers", guildId, "all"],
    queryFn: () => getGuildMembers(guildId, { status: "all", limit: 1000 }),
    enabled: !!guildId,
    staleTime: 30 * 1000,
  });

  const all = useMemo(() => membersQuery.data?.data?.data ?? [], [membersQuery.data]);
  const activeCount = all.filter((m) => m.status === "1").length;
  const leftCount = all.filter((m) => m.status === "2").length;
  const isLeftTab = tab === "left";

  const visible = useMemo(() => {
    let list = all.filter((m) => (isLeftTab ? m.status === "2" : m.status === "1"));
    if (search) list = list.filter((m) => m.riotName.toLowerCase().includes(search.toLowerCase()));
    if (sort !== "none") {
      list = [...list].sort((a, b) => {
        const da = new Date(a.updateDate).getTime();
        const db = new Date(b.updateDate).getTime();
        return sort === "asc" ? da - db : db - da;
      });
    }
    return list;
  }, [all, isLeftTab, search, sort]);

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const paged = useMemo(
    () => visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [visible, page]
  );

  const selectedMembers = visible.filter((m) => selected[keyOf(m)]);
  const allChecked = visible.length > 0 && selectedMembers.length === visible.length;

  const changeTab = (next: "active" | "left") => {
    setTab(next);
    setSelected({});
    setPage(1);
  };

  const toggleSelect = (m: GuildMemberRow) =>
    setSelected((prev) => {
      const next = { ...prev };
      const k = keyOf(m);
      if (next[k]) delete next[k];
      else next[k] = true;
      return next;
    });

  const toggleAll = () =>
    setSelected(() => {
      if (allChecked) return {};
      const next: Record<string, boolean> = {};
      visible.forEach((m) => {
        next[keyOf(m)] = true;
      });
      return next;
    });

  const toggleSort = () =>
    setSort((prev) => {
      if (prev === "none") return "desc";
      if (prev === "desc") return "asc";
      return "none";
    });

  const applyStatus = async (targets: GuildMemberRow[], nextStatus: MemberStatus) => {
    if (busy || targets.length === 0) return;
    setBusy(true);
    setErrorMsg(null);
    const results = await Promise.all(
      targets.map((t) =>
        updateMemberStatus(guildId, {
          riotName: t.riotName,
          riotNameTag: t.riotNameTag,
          status: nextStatus,
        })
      )
    );
    if (results.some((r) => r.error)) {
      setErrorMsg("상태 변경 중 일부가 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
    setSelected({});
    await queryClient.invalidateQueries({ queryKey: ["clanMembers", guildId] });
    setBusy(false);
  };

  const sortArrow = SORT_ARROW[sort];

  const renderRows = () => {
    if (membersQuery.isLoading) {
      return <div className="py-10 text-center text-sm text-primary2">불러오는 중...</div>;
    }
    if (visible.length === 0) {
      return (
        <div className="py-10 text-center text-sm text-primary2">표시할 클랜원이 없습니다</div>
      );
    }
    return paged.map((m) => {
      const checked = !!selected[keyOf(m)];
      const left = m.status === "2";
      return (
        <div
          key={keyOf(m)}
          className={`grid grid-cols-[44px_1fr_140px_120px] gap-2 items-center px-4 py-2.5 border-b border-cardBorder last:border-0 ${
            checked ? "bg-blueText/[0.06]" : ""
          } ${left ? "opacity-60" : ""}`}
        >
          <button type="button" aria-label="선택" onClick={() => toggleSelect(m)}>
            <CheckBox checked={checked} />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <span className={`text-sm truncate ${left ? "text-primary2" : "text-primary1"}`}>
              {m.riotName}
            </span>
            <span className="text-xs text-primary3 shrink-0">{withHash(m.riotNameTag)}</span>
            {left && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded text-redText bg-redText/10 shrink-0">
                비활성
              </span>
            )}
          </div>
          <div className="text-center text-[13px] text-primary2">{formatTimeAgo(m.updateDate)}</div>
          <div className="flex justify-center">
            <button
              type="button"
              disabled={busy}
              onClick={() => applyStatus([m], left ? "1" : "2")}
              className={`text-xs rounded px-3.5 py-1.5 border transition-colors disabled:opacity-50 ${
                left
                  ? "text-blueText bg-darkBg1 border-border2 hover:border-blueText2"
                  : "text-redText bg-redText/[0.08] border-redLighten hover:bg-redText/[0.15]"
              }`}
            >
              {left ? "활성화" : "비활성화"}
            </button>
          </div>
        </div>
      );
    });
  };

  const tabClass = (activeTab: boolean) =>
    `flex items-center text-sm cursor-pointer border-b-2 pb-2 ${
      activeTab
        ? "font-bold text-blueText border-blueText"
        : "font-normal text-primary3 border-transparent"
    }`;

  return (
    <>
      {errorMsg && (
        <div className="rounded bg-redDarken border border-redLighten px-4 py-3 text-sm text-redText">
          {errorMsg}
        </div>
      )}

      <div className="bg-darkBg2 border border-border2 rounded p-5">
        {/* 탭 + 검색 */}
        <div className="flex items-center h-9 mb-3">
          <div className="flex gap-6 self-stretch">
            <button
              type="button"
              className={tabClass(!isLeftTab)}
              onClick={() => changeTab("active")}
            >
              활성 클랜원 <span className="text-xs text-primary3 ml-1.5">{activeCount}</span>
            </button>
            <button type="button" className={tabClass(isLeftTab)} onClick={() => changeTab("left")}>
              비활성 클랜원 <span className="text-xs text-primary3 ml-1.5">{leftCount}</span>
            </button>
          </div>
          <div className="ml-auto flex items-center bg-darkBg1 px-3 h-9 rounded border border-border2 w-[240px]">
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
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="닉네임 검색"
              className="bg-transparent border-none outline-none text-[13px] text-primary1 flex-1"
            />
          </div>
        </div>

        {/* 일괄 작업 바 */}
        {selectedMembers.length > 0 && (
          <div className="flex items-center gap-3 bg-blue border border-blueText/40 rounded px-3.5 py-2.5 mb-2.5">
            <span className="text-[13px] text-primary1">
              <span className="text-blueText font-bold">{selectedMembers.length}</span>명 선택됨
            </span>
            <button
              type="button"
              onClick={() => setSelected({})}
              className="text-xs text-primary3 hover:text-primary1"
            >
              선택 해제
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => applyStatus(selectedMembers, isLeftTab ? "1" : "2")}
              className={`ml-auto text-[13px] font-bold rounded px-4 py-2 border transition-colors disabled:opacity-50 ${
                isLeftTab
                  ? "text-blueText bg-blueText/[0.08] border-blueText/40 hover:bg-blueText/[0.15]"
                  : "text-redText bg-redText/10 border-redLighten hover:bg-redText/[0.18]"
              }`}
            >
              {isLeftTab ? "선택 활성화" : "선택 비활성화"}
            </button>
          </div>
        )}

        {/* 테이블 */}
        <div className="bg-darkBg1 border border-border2 rounded overflow-hidden">
          <div className="grid grid-cols-[44px_1fr_140px_120px] gap-2 items-center px-4 py-2.5 text-xs text-primary2 border-b border-border2">
            <button type="button" aria-label="전체 선택" onClick={toggleAll}>
              <CheckBox checked={allChecked} />
            </button>
            <span>클랜원</span>
            <button
              type="button"
              onClick={toggleSort}
              className={`flex items-center justify-center gap-1 select-none ${
                sort === "none" ? "text-primary2" : "text-blueText"
              }`}
            >
              상태 변경일 <span className="text-[10px]">{sortArrow}</span>
            </button>
            <span className="text-center">관리</span>
          </div>

          {renderRows()}

          <div className="flex items-center justify-end gap-1.5 px-4 py-2.5">
            <button
              type="button"
              aria-label="이전 페이지"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="w-7 h-7 rounded bg-darkBg1 border border-border2 text-primary2 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:text-primary1"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <span className="text-[13px] text-primary1 tabular-nums">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              aria-label="다음 페이지"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="w-7 h-7 rounded bg-darkBg1 border border-border2 text-primary1 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const ClanMemberStatus: NextPage = () => (
  <ClanManageLayout
    title="클랜원 상태 관리"
    description="비활성화하면 해당 클랜원은 전적 검색·유저 분석에서 노출되지 않습니다. 언제든 다시 활성화할 수 있습니다."
  >
    {(guildId) => <MemberStatusContent guildId={guildId} />}
  </ClanManageLayout>
);

export default ClanMemberStatus;
