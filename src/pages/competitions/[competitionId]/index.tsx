import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, useQueries } from "@tanstack/react-query";
import SummonerPageHeader from "@/components/layout/SummonerPageHeader";
import NoIndex from "@/components/layout/NoIndex";
import TextCard from "@/components/ui/TextCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Modal from "@/components/modal/Modal";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import useUserSearchController from "@/hooks/searchUserList/useUserSearchController";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import useCompetitionDetail from "@/hooks/competition/useCompetitionDetail";
import { canManageGuild } from "@/data/types/guildMember";
import {
  changeCompetitionStatus,
  closeCompetitionApplications,
  getCompetitionChampionStatistics,
  getCompetitionMatches,
  getCompetitionUserStatistics,
  getStandings,
  getTeams,
  removeCompetition,
  updateCompetition,
} from "@/services/competition";
import { deleteReplay } from "@/services/replay";
import BoardHeader from "@/features/competition/BoardHeader";
import BoardRosterTab from "@/features/competition/BoardRosterTab";
import BoardMatchesTab from "@/features/competition/BoardMatchesTab";
import BoardStandingsTab from "@/features/competition/BoardStandingsTab";
import BoardStatsTab from "@/features/competition/BoardStatsTab";
import { competitionErrorMessage } from "@/features/competition/competitionErrors";

const BOARD_TABS = [
  { key: "roster", label: "팀 로스터" },
  { key: "matches", label: "경기 결과" },
  { key: "standing", label: "팀 순위표" },
  { key: "stats", label: "대회 통계" },
] as const;

type BoardTab = (typeof BOARD_TABS)[number]["key"];

const isBoardTab = (value: unknown): value is BoardTab =>
  BOARD_TABS.some((tab) => tab.key === value);

const CompetitionBoardPage: NextPage = () => {
  const router = useRouter();
  const rawId = router.query.competitionId;
  const parsed = typeof rawId === "string" ? Number(rawId) : NaN;
  const validId = Number.isFinite(parsed) ? parsed : null;

  // 탭을 URL 쿼리로 승격 — 딥링크·새로고침·뒤로가기 대응. 잘못된 값은 roster로 폴백.
  const activeTab: BoardTab = isBoardTab(router.query.tab) ? router.query.tab : "roster";

  const [searchTerm, setSearchTerm] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [endModalOpen, setEndModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editApproval, setEditApproval] = useState(true);
  const [confirmName, setConfirmName] = useState("");
  const [deletingMatchId, setDeletingMatchId] = useState<string | null>(null);

  const { guildId, guilds, isLoggedIn, username, currentRole, handleGuildChange, isLoadingGuilds } =
    useGuildManagement();
  const isManager = canManageGuild(currentRole);

  const {
    data: userSearchData,
    isLoading,
    isError,
    handleSearchButtonClick,
  } = useUserSearchController(searchTerm, guildId);

  const {
    competition,
    isLoading: isLoadingDetail,
    refetch: refetchDetail,
  } = useCompetitionDetail(guildId, validId);

  const enabled = !!guildId && validId !== null;
  // 탭을 옮길 때마다 다시 받지 않도록 네 소스를 함께 캐싱한다.
  const [teamsQuery, matchesQuery, standingsQuery, userStatsQuery, championStatsQuery] = useQueries(
    {
      queries: [
        {
          queryKey: ["competitionTeams", guildId, validId],
          queryFn: () => getTeams(guildId, validId as number),
          enabled,
          staleTime: 30 * 1000,
        },
        {
          queryKey: ["competitionMatches", guildId, validId],
          queryFn: () => getCompetitionMatches(guildId, validId as number),
          enabled,
          staleTime: 30 * 1000,
        },
        {
          queryKey: ["competitionStandings", guildId, validId],
          queryFn: () => getStandings(guildId, validId as number),
          enabled,
          staleTime: 30 * 1000,
        },
        {
          queryKey: ["competitionUserStats", guildId, validId],
          queryFn: () => getCompetitionUserStatistics(guildId, validId as number, { limit: 500 }),
          enabled: enabled && activeTab === "stats",
          staleTime: 60 * 1000,
        },
        {
          queryKey: ["competitionChampionStats", guildId, validId],
          queryFn: () =>
            getCompetitionChampionStatistics(guildId, validId as number, { limit: 500 }),
          enabled: enabled && activeTab === "stats",
          staleTime: 60 * 1000,
        },
      ],
    }
  );

  const teams = teamsQuery.data?.data?.data ?? [];
  const matches = matchesQuery.data?.data?.data ?? [];
  const standings = standingsQuery.data?.data?.data ?? null;
  const userStats = userStatsQuery.data?.data?.data ?? [];
  const championStats = championStatsQuery.data?.data?.data ?? [];

  const changeTab = (tab: BoardTab) => {
    router.push({ pathname: router.pathname, query: { ...router.query, tab } }, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  const refreshAll = async () => {
    await Promise.all([
      refetchDetail(),
      teamsQuery.refetch(),
      matchesQuery.refetch(),
      standingsQuery.refetch(),
    ]);
  };

  const lifecycleMutation = useMutation({
    mutationFn: (action: "close" | "end" | "reopen") => {
      if (action === "close") return closeCompetitionApplications(guildId, validId as number);
      return changeCompetitionStatus(
        guildId,
        validId as number,
        action === "end" ? "CLOSED" : "IN_PROGRESS"
      );
    },
    onSuccess: async (res) => {
      if (res.error) {
        setErrorMsg(competitionErrorMessage(res));
        return;
      }
      setErrorMsg(null);
      setEndModalOpen(false);
      await refreshAll();
    },
    onError: () => setErrorMsg("요청에 실패했습니다. 잠시 후 다시 시도해주세요."),
  });

  const editMutation = useMutation({
    // zod refine이 name·approvalRequired 중 하나를 요구하는데 둘 다 보내면 항상 만족한다.
    mutationFn: () =>
      updateCompetition(guildId, validId as number, {
        name: editName.trim(),
        approvalRequired: editApproval,
      }),
    onSuccess: async (res) => {
      if (res.error) {
        setErrorMsg(competitionErrorMessage(res));
        return;
      }
      setErrorMsg(null);
      setEditModalOpen(false);
      await refetchDetail();
    },
    onError: () => setErrorMsg("요청에 실패했습니다. 잠시 후 다시 시도해주세요."),
  });

  const deleteMutation = useMutation({
    mutationFn: () => removeCompetition(guildId, validId as number, confirmName.trim()),
    onSuccess: (res) => {
      if (res.error) {
        setErrorMsg(competitionErrorMessage(res));
        return;
      }
      setDeleteModalOpen(false);
      router.push("/competitions");
    },
    onError: () => setErrorMsg("요청에 실패했습니다. 잠시 후 다시 시도해주세요."),
  });

  const deleteMatchMutation = useMutation({
    mutationFn: (customMatchId: string) => deleteReplay(guildId, customMatchId),
    onSuccess: async (res) => {
      setDeletingMatchId(null);
      if (res.error) {
        setErrorMsg("경기 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
        return;
      }
      setErrorMsg(null);
      await refreshAll();
    },
    onError: () => {
      setDeletingMatchId(null);
      setErrorMsg("경기 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });

  const busy = lifecycleMutation.isPending || deleteMutation.isPending || editMutation.isPending;

  const renderTab = () => {
    switch (activeTab) {
      case "matches":
        return (
          <BoardMatchesTab
            matches={matches}
            isManager={isManager}
            deletingId={deletingMatchId}
            onDelete={(customMatchId) => {
              setDeletingMatchId(customMatchId);
              deleteMatchMutation.mutate(customMatchId);
            }}
          />
        );
      case "standing":
        return <BoardStandingsTab standings={standings} />;
      case "stats":
        if (userStatsQuery.isLoading || championStatsQuery.isLoading) return <LoadingSpinner />;
        return <BoardStatsTab users={userStats} champions={championStats} />;
      default:
        return <BoardRosterTab teams={teams} />;
    }
  };

  const renderBody = () => {
    if (!isLoggedIn) return <TextCard text="로그인 후 이용해주세요" />;
    if (isLoadingGuilds) return <TextCard text="불러오는 중..." />;
    if (guilds.length === 0) return <TextCard text="소속된 클랜이 없습니다" />;
    if (validId === null) return <TextCard text="잘못된 대회 주소입니다" />;
    if (isLoadingDetail) return <LoadingSpinner />;
    if (!competition) return <TextCard text="대회를 찾을 수 없습니다" />;

    return (
      <>
        <BoardHeader
          competition={competition}
          isManager={isManager}
          busy={busy}
          onUpload={() => router.push("/replay")}
          onCloseApplications={() => lifecycleMutation.mutate("close")}
          onEnd={() => setEndModalOpen(true)}
          onReopen={() => lifecycleMutation.mutate("reopen")}
          onRoster={() => router.push(`/competitions/${validId}/roster`)}
          onEdit={() => {
            setEditName(competition.name);
            setEditApproval(competition.approvalRequired);
            setEditModalOpen(true);
          }}
          onDelete={() => {
            setConfirmName("");
            setDeleteModalOpen(true);
          }}
        />

        {competition.status === "CLOSED" && (
          <div className="rounded border border-border2 bg-darkBg2 px-4 py-3 text-xs leading-relaxed text-primary2">
            이 대회는 종료되어 최종 순위가 확정되었습니다. 편집은 운영진이 진행중으로 되돌린 뒤에만
            가능합니다.
          </div>
        )}

        {errorMsg && (
          <div className="rounded border border-redLighten bg-redDarken px-3.5 py-3 text-sm text-redText">
            {errorMsg}
          </div>
        )}

        <div className="flex items-center gap-0.5 overflow-x-auto border-b border-border2">
          {BOARD_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => changeTab(tab.key)}
              className={`-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm ${
                activeTab === tab.key
                  ? "border-blueText text-primary1"
                  : "border-transparent text-primary3 hover:text-primary2"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {renderTab()}
      </>
    );
  };

  return (
    <>
      <NoIndex />
      <Head>
        <title>{competition ? `${competition.name} - GMOK` : "대회 현황판 - GMOK"}</title>
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
          {renderBody()}
        </main>
      </div>

      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <div className="flex w-[300px] flex-col gap-3 text-left sm:w-[380px]">
          <h2 className="text-base font-bold text-primary1">대회 수정</h2>
          <label className="flex flex-col gap-1.5" htmlFor="edit-competition-name">
            <span className="text-xs text-primary2">대회 제목</span>
            <input
              id="edit-competition-name"
              value={editName}
              onChange={(e) => setEditName(e.target.value.slice(0, 64))}
              className="h-10 rounded border border-border2 bg-darkBg2 px-3 text-sm text-primary1 outline-none focus:border-blueText2"
            />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <ToggleSwitch
              checked={editApproval}
              onChange={() => setEditApproval((prev) => !prev)}
              ariaLabel="참가 신청 승인 필요"
            />
            <span className="text-sm text-primary1">참가 신청 승인 필요</span>
          </div>
          <p className="text-xs leading-relaxed text-primary2">
            {editApproval
              ? "신청은 대기 상태로 접수되고, 운영진이 승인한 신청자만 로스터에 편성됩니다."
              : "신청이 즉시 확정됩니다. 이미 대기 중인 신청은 그대로 남습니다."}
          </p>
          <p className="text-xs leading-relaxed text-primary3">
            대회 상태(모집중·진행중·종료)는 현황판 상단의 버튼으로 바꿉니다.
          </p>
          <div className="mt-1 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="h-9 flex-1 rounded border border-border2 bg-darkBg2 text-[13px] text-primary2"
            >
              취소
            </button>
            <button
              type="button"
              onClick={() => editMutation.mutate()}
              disabled={busy || editName.trim().length === 0}
              className="h-9 flex-1 rounded bg-bluePrimary text-[13px] text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {editMutation.isPending ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={endModalOpen} onClose={() => setEndModalOpen(false)}>
        <div className="flex w-[300px] flex-col gap-3 text-left sm:w-[380px]">
          <h2 className="text-base font-bold text-primary1">대회를 종료할까요?</h2>
          <p className="text-[13px] leading-relaxed text-primary2">
            최종 순위가 확정되고 로스터·경기 편집이 잠깁니다. 운영진이 진행중으로 되돌리면 다시
            편집할 수 있습니다.
          </p>
          <div className="mt-1 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEndModalOpen(false)}
              className="h-9 flex-1 rounded border border-border2 bg-darkBg2 text-[13px] text-primary2"
            >
              취소
            </button>
            <button
              type="button"
              onClick={() => lifecycleMutation.mutate("end")}
              disabled={busy}
              className="h-9 flex-1 rounded bg-bluePrimary text-[13px] text-white disabled:opacity-50"
            >
              {lifecycleMutation.isPending ? "처리 중..." : "대회 종료"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <div className="flex w-[300px] flex-col gap-3 text-left sm:w-[380px]">
          <h2 className="text-base font-bold text-redText">대회를 삭제할까요?</h2>
          <p className="text-[13px] leading-relaxed text-primary2">
            대회에 속한 경기까지 함께 삭제됩니다. 되돌릴 수 없습니다. 확인을 위해 대회명{" "}
            <span className="text-primary1">{competition?.name}</span>을 그대로 입력해 주세요.
          </p>
          <input
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            placeholder={competition?.name ?? ""}
            className="h-10 rounded border border-border2 bg-darkBg2 px-3 text-sm text-primary1 outline-none focus:border-redLighten"
          />
          <div className="mt-1 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="h-9 flex-1 rounded border border-border2 bg-darkBg2 text-[13px] text-primary2"
            >
              취소
            </button>
            <button
              type="button"
              onClick={() => deleteMutation.mutate()}
              disabled={busy || confirmName.trim() !== competition?.name}
              className="h-9 flex-1 rounded bg-redButton text-[13px] text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {deleteMutation.isPending ? "삭제 중..." : "삭제"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CompetitionBoardPage;
