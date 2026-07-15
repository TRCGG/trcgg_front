import type { NextPage } from "next";
import Image from "next/image";
import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { ApiResponse } from "@/services/apiService";
import {
  getGuildDiscordMembers,
  getGuildById,
  updateMemberRole,
  setAllowAllUploads,
} from "@/services/guildMember";
import {
  GuildMembersResponse,
  GuildResponse,
  DiscordMemberRoleItem,
  AssignableRole,
  Role,
  ROLE_HIERARCHY,
  hasMinRole,
  getRoleMeta,
} from "@/data/types/guildMember";
import ClanManageLayout from "@/features/clanManage/ClanManageLayout";

const PAGE_SIZE = 10;
const FETCH_LIMIT = 1000;

const roleErrorMessage = (status: number): string => {
  if (status === 403) return "이 멤버의 권한은 변경할 수 없습니다 (매니저 이상).";
  if (status === 404) return "웹 로그인 이력이 없는 멤버입니다. 먼저 웹 로그인하도록 안내하세요.";
  if (status === 409) return "알 수 없는 역할이라 변경할 수 없습니다.";
  return "권한 변경에 실패했습니다. 잠시 후 다시 시도해주세요.";
};

const UploadPermissionContent = ({ guildId }: { guildId: string }) => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [allowAll, setAllowAll] = useState<boolean | null>(null);

  // 전체 멤버를 한 번에 불러오고(정렬·페이지네이션은 프론트에서 처리), role 변경 시 재조회하지 않는다.
  const membersQuery = useQuery<ApiResponse<GuildMembersResponse>>({
    queryKey: ["guildMembers", guildId],
    queryFn: () => getGuildDiscordMembers(guildId, { limit: FETCH_LIMIT }),
    enabled: !!guildId,
    staleTime: 30 * 1000,
  });

  const guildQuery = useQuery<ApiResponse<GuildResponse>>({
    queryKey: ["guild", guildId],
    queryFn: () => getGuildById(guildId),
    enabled: !!guildId,
    staleTime: 30 * 1000,
  });

  useEffect(() => {
    const value = guildQuery.data?.data?.data?.allowAllUploads;
    if (typeof value === "boolean") setAllowAll(value);
  }, [guildQuery.data]);

  const rawMembers = useMemo(() => membersQuery.data?.data?.data ?? [], [membersQuery.data]);

  // 멤버 구성(추가·삭제·길드 변경)이 바뀔 때만 매니저 > 업로더 > 일반 순으로 정렬한다.
  // role만 바뀐 경우엔 재정렬하지 않아 화면상 순서가 유지된다(새로고침 시 다시 정렬).
  const [orderedMembers, setOrderedMembers] = useState<DiscordMemberRoleItem[]>([]);
  const memberSetKey = useMemo(
    () =>
      rawMembers
        .map((m) => m.memberId)
        .sort()
        .join(","),
    [rawMembers]
  );
  useEffect(() => {
    const rank = (r: string) => ROLE_HIERARCHY[r as Role] ?? -1;
    setOrderedMembers(
      [...rawMembers].sort(
        (a, b) => rank(b.role) - rank(a.role) || a.displayName.localeCompare(b.displayName)
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberSetKey]);

  const filteredMembers = useMemo(
    () =>
      search
        ? orderedMembers.filter((m) => m.displayName.toLowerCase().includes(search.toLowerCase()))
        : orderedMembers,
    [orderedMembers, search]
  );
  const totalCount = orderedMembers.length;
  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / PAGE_SIZE));
  const pagedMembers = useMemo(
    () => filteredMembers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredMembers, page]
  );

  const roleMutation = useMutation({
    mutationFn: ({ memberId, role }: { memberId: string; role: AssignableRole }) =>
      updateMemberRole(guildId, memberId, role),
    onSuccess: (res) => {
      if (res.error || !res.data?.data) {
        setErrorMsg(roleErrorMessage(res.status));
        return;
      }
      setErrorMsg(null);
      // 재조회 없이 해당 멤버의 role만 제자리 갱신 → 화면상 순서 유지
      const { memberId, role } = res.data.data;
      setOrderedMembers((prev) => prev.map((m) => (m.memberId === memberId ? { ...m, role } : m)));
    },
    onError: () => setErrorMsg(roleErrorMessage(0)),
  });

  const allowAllMutation = useMutation({
    mutationFn: (next: boolean) => setAllowAllUploads(guildId, next),
    onSuccess: (res) => {
      if (res.error || !res.data?.data) {
        setErrorMsg("전체 업로드 설정 변경에 실패했습니다.");
        return;
      }
      setErrorMsg(null);
      setAllowAll(res.data.data.allowAllUploads);
    },
    onError: () => setErrorMsg("전체 업로드 설정 변경에 실패했습니다."),
  });

  const handleToggleUploader = (member: DiscordMemberRoleItem) => {
    if (roleMutation.isPending) return;
    const next: AssignableRole = member.role === "userUploader" ? "userNormal" : "userUploader";
    roleMutation.mutate({ memberId: member.memberId, role: next });
  };

  const handleToggleAll = () => {
    if (allowAll === null || allowAllMutation.isPending) return;
    allowAllMutation.mutate(!allowAll);
  };

  const renderTableBody = () => {
    if (membersQuery.isLoading) {
      return <div className="py-10 text-center text-sm text-primary2">불러오는 중...</div>;
    }
    if (filteredMembers.length === 0) {
      return <div className="py-10 text-center text-sm text-primary2">표시할 멤버가 없습니다</div>;
    }
    return pagedMembers.map((member) => {
      const meta = getRoleMeta(member.role);
      const locked = hasMinRole(member.role, "guildManager");
      const isUploader = member.role === "userUploader";
      const pending =
        roleMutation.isPending && roleMutation.variables?.memberId === member.memberId;
      return (
        <div
          key={member.memberId}
          className="grid grid-cols-[1fr_90px_132px] gap-2 items-center px-4 py-2.5 border-b border-cardBorder last:border-0"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {member.avatarUrl ? (
              <Image
                src={member.avatarUrl}
                alt={member.displayName}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover border border-border1 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-rankBg2 border border-border1 flex items-center justify-center text-sm text-primary1 shrink-0">
                {member.displayName.charAt(0)}
              </div>
            )}
            <span className="text-sm text-primary1 truncate">{member.displayName}</span>
          </div>
          <div className="text-center">
            <span
              className={`text-xs font-bold px-2.5 py-[3px] rounded ${meta.textClass} ${meta.bgClass}`}
            >
              {meta.label}
            </span>
          </div>
          <div className="flex justify-center">
            {locked ? (
              <div className="flex items-center gap-1.5 text-primary2 text-xs">
                <svg
                  className="w-[13px] h-[13px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <rect x="4" y="11" width="16" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 018 0v4" />
                </svg>
                고정
              </div>
            ) : (
              <ToggleSwitch
                checked={isUploader}
                onChange={() => handleToggleUploader(member)}
                disabled={pending}
                ariaLabel={`${member.displayName} 업로더 권한`}
              />
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <>
      {errorMsg && (
        <div className="flex items-center gap-2 bg-redDarken border border-redLighten rounded px-4 py-3 text-sm text-redText">
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          {errorMsg}
        </div>
      )}

      {/* 전체 업로드 허용 배너 */}
      <div className="bg-darkBg2 border border-border2 rounded p-4 flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-lg bg-blueText/10 flex items-center justify-center shrink-0">
          <svg
            className="w-5 h-5 text-blueText"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 15v3a2 2 0 002 2h14a2 2 0 002-2v-3" />
            <path d="M7 9l5-5 5 5" />
            <path d="M12 4v12" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-bold text-primary1">전체 업로드 허용</div>
          <div className="text-xs text-primary2 mt-0.5">
            {allowAll ? (
              <>
                끄면 <span className="text-neonGreen">업로더 권한</span>이 있는 멤버만 리플레이를
                업로드할 수 있습니다.
              </>
            ) : (
              <>
                켜면 역할과 관계없이 <span className="text-primary1">모든 멤버</span>가 리플레이를
                업로드할 수 있습니다.
              </>
            )}
          </div>
        </div>
        <ToggleSwitch
          checked={!!allowAll}
          onChange={handleToggleAll}
          disabled={allowAll === null || allowAllMutation.isPending}
          ariaLabel="전체 업로드 허용"
        />
      </div>

      {/* 검색 + 총원 */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-darkBg2 border border-border2 rounded px-3 h-10 flex-1">
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
            placeholder="멤버 이름 검색"
            className="bg-transparent border-none outline-none text-sm text-primary1 flex-1"
          />
        </div>
        <span className="text-[13px] text-primary2 whitespace-nowrap">
          총 <span className="text-primary1 tabular-nums">{totalCount}</span>명
        </span>
      </div>

      {/* 멤버 테이블 */}
      <div className="bg-darkBg2 border border-border2 rounded overflow-hidden">
        <div className="grid grid-cols-[1fr_90px_132px] gap-2 px-4 py-2.5 text-xs text-primary2 border-b border-border2">
          <span>멤버</span>
          <span className="text-center">역할</span>
          <span className="text-center">업로더 권한</span>
        </div>

        {renderTableBody()}

        <div className="flex items-center justify-between px-4 py-2.5">
          <span className="text-xs text-primary2">웹 로그인 이력이 있는 멤버만 표시됩니다</span>
          <div className="flex items-center gap-1.5">
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

const ClanUpload: NextPage = () => (
  <ClanManageLayout
    title="업로드 권한 관리"
    description="Discord 멤버에게 리플레이 업로더 권한을 부여·회수합니다."
  >
    {(guildId) => <UploadPermissionContent guildId={guildId} />}
  </ClanManageLayout>
);

export default ClanUpload;
