import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import SummonerPageHeader from "@/components/layout/SummonerPageHeader";
import NoIndex from "@/components/layout/NoIndex";
import TextCard from "@/components/ui/TextCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useUserSearchController from "@/hooks/searchUserList/useUserSearchController";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import useCompetitionDetail from "@/hooks/competition/useCompetitionDetail";
import useCompetitionApplications from "@/hooks/competition/useCompetitionApplications";
import { canManageGuild } from "@/data/types/guildMember";
import { CompetitionApplicationStatus } from "@/data/types/competition";
import { decideApplications } from "@/services/competition";
import ApplicationTable from "@/features/competition/ApplicationTable";
import { APPLICATION_TABS } from "@/features/competition/competitionMeta";
import { competitionErrorMessage } from "@/features/competition/competitionErrors";
import useInvalidateCompetitions from "@/hooks/competition/useInvalidateCompetitions";

/** 백엔드 decideApplicationsSchema가 한 요청에 200건까지만 받는다. */
const DECIDE_CHUNK = 200;

interface BulkAction {
  label: string;
  /** null이면 상태 변경이 아니라 로스터 편성으로 이동한다. */
  to: CompetitionApplicationStatus | null;
}

const BULK_ACTIONS: Record<
  CompetitionApplicationStatus,
  { primary: BulkAction; secondary: BulkAction }
> = {
  PENDING: {
    primary: { label: "선택 승인", to: "APPROVED" },
    secondary: { label: "선택 거절", to: "REJECTED" },
  },
  APPROVED: {
    primary: { label: "로스터 편성으로", to: null },
    secondary: { label: "승인 취소", to: "PENDING" },
  },
  REJECTED: {
    primary: { label: "다시 승인", to: "APPROVED" },
    secondary: { label: "대기로 되돌리기", to: "PENDING" },
  },
};

const ApplicationApprovalPage: NextPage = () => {
  const router = useRouter();
  const rawId = router.query.competitionId;
  const competitionId = typeof rawId === "string" ? Number(rawId) : null;
  const validId = competitionId !== null && Number.isFinite(competitionId) ? competitionId : null;

  const [searchTerm, setSearchTerm] = useState("");
  const [tab, setTab] = useState<CompetitionApplicationStatus>("PENDING");
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const invalidateCompetitions = useInvalidateCompetitions();
  const { guildId, guilds, isLoggedIn, username, currentRole, handleGuildChange, isLoadingGuilds } =
    useGuildManagement();
  const isManager = canManageGuild(currentRole);

  const {
    data: userSearchData,
    isLoading,
    isError,
    handleSearchButtonClick,
  } = useUserSearchController(searchTerm, guildId);

  const { competition } = useCompetitionDetail(guildId, validId);
  const {
    applications,
    error: listError,
    isLoading: isLoadingApplications,
  } = useCompetitionApplications(guildId, validId);

  const counts = useMemo(() => {
    const base: Record<CompetitionApplicationStatus, number> = {
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
    };
    applications.forEach((application) => {
      base[application.status] += 1;
    });
    return base;
  }, [applications]);

  const tabRows = useMemo(
    () => applications.filter((application) => application.status === tab),
    [applications, tab]
  );

  // 탭을 옮기면 다른 상태의 선택이 남아 잘못 처리되는 것을 막는다.
  const changeTab = (next: CompetitionApplicationStatus) => {
    setTab(next);
    setCheckedIds(new Set());
    setErrorMsg(null);
  };

  const toggle = (id: number) =>
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () =>
    setCheckedIds((prev) =>
      prev.size > 0 ? new Set() : new Set(tabRows.map((application) => application.id))
    );

  const decideMutation = useMutation({
    mutationFn: async (status: CompetitionApplicationStatus) => {
      const ids = Array.from(checkedIds);
      // 200건 제한이 있어 나눠 보낸다. 한 덩어리라도 실패하면 그 결과를 그대로 올린다.
      for (let i = 0; i < ids.length; i += DECIDE_CHUNK) {
        const chunk = ids.slice(i, i + DECIDE_CHUNK);
        // eslint-disable-next-line no-await-in-loop
        const res = await decideApplications(guildId, validId as number, {
          applicationIds: chunk,
          status,
        });
        if (res.error) return res;
      }
      return null;
    },
    onSuccess: async (failed) => {
      if (failed) {
        setErrorMsg(competitionErrorMessage(failed));
        return;
      }
      setErrorMsg(null);
      setCheckedIds(new Set());
      await invalidateCompetitions();
    },
    onError: () => setErrorMsg("요청에 실패했습니다. 잠시 후 다시 시도해주세요."),
  });

  const runBulk = (action: BulkAction) => {
    if (action.to === null) {
      router.push(`/competitions/${validId}/roster`);
      return;
    }
    if (checkedIds.size === 0 || decideMutation.isPending) return;
    decideMutation.mutate(action.to);
  };

  const actions = BULK_ACTIONS[tab];
  const anyChecked = checkedIds.size > 0;
  const isMoveAction = actions.primary.to === null;

  const renderBody = () => {
    if (!isLoggedIn) return <TextCard text="로그인 후 이용해주세요" />;
    if (isLoadingGuilds) return <TextCard text="불러오는 중..." />;
    if (guilds.length === 0) return <TextCard text="소속된 클랜이 없습니다" />;
    if (!isManager) return <TextCard text="운영진 전용 화면입니다. 접근 권한이 없습니다." />;
    if (validId === null) return <TextCard text="잘못된 대회 주소입니다" />;
    if (isLoadingApplications) return <LoadingSpinner />;
    if (listError) return <TextCard text="신청 목록을 불러오지 못했습니다" />;

    return (
      <>
        <div className="flex items-center gap-0.5 overflow-x-auto border-b border-border2">
          {APPLICATION_TABS.map((item) => {
            const active = item.status === tab;
            return (
              <button
                key={item.status}
                type="button"
                onClick={() => changeTab(item.status)}
                className={`-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm ${
                  active
                    ? "border-blueText text-primary1"
                    : "border-transparent text-primary3 hover:text-primary2"
                }`}
              >
                {item.label} {counts[item.status]}
              </button>
            );
          })}
        </div>

        <div
          className={`flex flex-wrap items-center gap-3 rounded border bg-darkBg2 px-4 py-3 ${
            anyChecked ? "border-blueText2" : "border-border2"
          }`}
        >
          <button
            type="button"
            onClick={toggleAll}
            aria-label={anyChecked ? "선택 해제" : "전체 선택"}
            className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border ${
              anyChecked ? "border-bluePrimary bg-bluePrimary" : "border-border1 bg-darkBg1"
            }`}
          >
            {anyChecked && (
              <svg
                className="h-3 w-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth={3.2}
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
          </button>
          <span className="text-[13px] text-primary1">
            {anyChecked ? `${checkedIds.size}건 선택됨` : "전체 선택"}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => runBulk(actions.secondary)}
              disabled={!anyChecked || decideMutation.isPending}
              className="h-[34px] rounded border border-border2 bg-darkBg1 px-3.5 text-[13px] text-primary2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {actions.secondary.label}
            </button>
            <button
              type="button"
              onClick={() => runBulk(actions.primary)}
              disabled={!isMoveAction && (!anyChecked || decideMutation.isPending)}
              className={`h-[34px] rounded px-4 text-[13px] disabled:cursor-not-allowed disabled:opacity-40 ${
                isMoveAction
                  ? "border border-border2 bg-darkBg1 text-primary1"
                  : "bg-bluePrimary text-white"
              }`}
            >
              {decideMutation.isPending ? "처리 중..." : actions.primary.label}
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="rounded border border-redLighten bg-redDarken px-3.5 py-3 text-sm text-redText">
            {errorMsg}
          </div>
        )}

        <div className="overflow-hidden rounded border border-border2 bg-darkBg2">
          <ApplicationTable
            applications={tabRows}
            checkedIds={checkedIds}
            onToggle={toggle}
            emptyLabel={`${
              APPLICATION_TABS.find((item) => item.status === tab)?.label ?? ""
            } 상태인 신청서가 없습니다`}
          />
          <p className="px-4 py-2.5 text-xs leading-relaxed text-primary2">
            승인된 신청자 명단은 <span className="text-primary1">전체 공개</span>되며 로스터 편성
            화면의 신청자 풀에 나타납니다. 거절된 신청자는 대기열에 남아 재승인할 수 있습니다.
          </p>
        </div>
      </>
    );
  };

  return (
    <>
      <NoIndex />
      <Head>
        <title>참가 신청 승인 - GMOK</title>
      </Head>
      <div className="mx-auto w-full md:max-w-[1080px]">
        <SummonerPageHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={handleSearchButtonClick}
          isLoading={isLoading}
          isError={isError}
          users={userSearchData?.data}
          guilds={guilds}
          selectedGuildId={guildId}
          onGuildChange={handleGuildChange}
          username={username}
          isLoggedIn={isLoggedIn}
        />

        <main className="mb-10 mt-7 flex flex-col gap-4 px-4 md:px-0">
          <Link href="/competitions">
            <a className="self-start text-[13px] text-primary2 hover:text-primary1">← 대회 목록</a>
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-[22px] font-light text-primary1">참가 신청 승인</h1>
              <p className="mt-1 text-xs text-primary2">
                {competition ? `${competition.name} · ` : ""}대기 {counts.PENDING}건 · 체크한
                신청서를 한 번에 처리합니다.
              </p>
            </div>
            {validId !== null && isManager && (
              <button
                type="button"
                onClick={() => router.push(`/competitions/${validId}/roster`)}
                className="h-[38px] shrink-0 rounded border border-border2 bg-darkBg1 px-4 text-[13px] text-primary1"
              >
                로스터 편성으로
              </button>
            )}
          </div>
          {renderBody()}
        </main>
      </div>
    </>
  );
};

export default ApplicationApprovalPage;
