import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import SummonerPageHeader from "@/components/layout/SummonerPageHeader";
import NoIndex from "@/components/layout/NoIndex";
import TextCard from "@/components/ui/TextCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useUserSearchController from "@/hooks/searchUserList/useUserSearchController";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import useCompetitionDetail from "@/hooks/competition/useCompetitionDetail";
import useCompetitionApplications from "@/hooks/competition/useCompetitionApplications";
import useRosterDraft, {
  RosterSlotMember,
  approvedApplicants,
} from "@/hooks/competition/useRosterDraft";
import { ApiResponse } from "@/services/apiService";
import { canManageGuild } from "@/data/types/guildMember";
import {
  CompetitionApplicationItem,
  CompetitionPosition,
  TeamListResponse,
} from "@/data/types/competition";
import { getTeams, saveRoster } from "@/services/competition";
import RosterPool from "@/features/competition/RosterPool";
import RosterTeamCard from "@/features/competition/RosterTeamCard";
import { competitionErrorMessage } from "@/features/competition/competitionErrors";
import useInvalidateCompetitions from "@/hooks/competition/useInvalidateCompetitions";

const toSlotMember = (applicant: CompetitionApplicationItem): RosterSlotMember => ({
  playerCode: applicant.playerCode,
  riotName: applicant.riotName,
  riotNameTag: applicant.riotNameTag,
});

const RosterPage: NextPage = () => {
  const router = useRouter();
  const rawId = router.query.competitionId;
  const parsed = typeof rawId === "string" ? Number(rawId) : NaN;
  const validId = Number.isFinite(parsed) ? parsed : null;

  const [searchTerm, setSearchTerm] = useState("");
  const [picked, setPicked] = useState<CompetitionApplicationItem | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  // 드래그 중인 대상. HTML5 dataTransfer에 객체를 담을 수 없어 ref로 들고 간다.
  const draggingRef = useRef<RosterSlotMember | null>(null);

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

  const { competition, isLoading: isLoadingDetail } = useCompetitionDetail(guildId, validId);
  const { applications, isLoading: isLoadingApplications } = useCompetitionApplications(
    guildId,
    validId
  );

  const enabled = !!guildId && validId !== null;
  const { data: teamsRes, isLoading: isLoadingTeams } = useQuery<ApiResponse<TeamListResponse>>({
    queryKey: ["competitionTeams", guildId, validId],
    queryFn: () => getTeams(guildId, validId as number),
    enabled,
    staleTime: 30 * 1000,
  });
  const serverTeams = teamsRes?.data?.data ?? [];

  const draft = useRosterDraft(serverTeams, !isLoadingTeams && enabled);
  const applicants = approvedApplicants(applications);
  // 종료된 대회는 편집이 잠긴다.
  const locked = competition?.status === "CLOSED";

  const saveMutation = useMutation({
    mutationFn: () => saveRoster(guildId, validId as number, draft.toPayload()),
    onSuccess: async (res) => {
      if (res.error) {
        setErrorMsg(competitionErrorMessage(res));
        return;
      }
      setErrorMsg(null);
      setSavedAt(new Date().toLocaleTimeString("ko-KR"));
      await invalidateCompetitions();
    },
    onError: () => setErrorMsg("저장에 실패했습니다. 잠시 후 다시 시도해주세요."),
  });

  const handleSave = () => {
    const invalid = draft.validate();
    if (invalid) {
      setErrorMsg(invalid);
      return;
    }
    setErrorMsg(null);
    saveMutation.mutate();
  };

  const placeMember = (
    member: RosterSlotMember,
    teamIndex: number,
    position: CompetitionPosition
  ) => {
    draft.place(member, teamIndex, position);
    setPicked(null);
    draggingRef.current = null;
  };

  const renderEditor = () => (
    <div className="flex flex-col gap-3.5 rounded border border-border2 bg-darkBg2 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[15px] font-bold text-primary1">팀 편성</span>
        <span className="text-xs text-primary2">
          배치 {draft.placedCount} / {draft.slotTotal}
        </span>
        <span className="ml-auto text-xs text-primary3">
          칩을 끌어다 놓거나, 칩을 클릭한 뒤 슬롯을 클릭해 배치 · 팀당 팀장 1명 지정
        </span>
      </div>

      <RosterPool
        applicants={applicants}
        placedCodes={draft.placedCodes}
        picked={picked}
        onPick={setPicked}
        onDragStart={(applicant) => {
          draggingRef.current = toSlotMember(applicant);
        }}
        onDropToPool={() => {
          draggingRef.current = null;
        }}
        disabled={locked}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {draft.teams.map((team, index) => (
          <RosterTeamCard
            // 신규 팀은 서버 id가 없어 인덱스를 함께 쓴다.
            key={team.id ?? `new-${index}`}
            team={team}
            index={index}
            hasPicked={picked !== null}
            disabled={locked}
            onRename={(name) => draft.renameTeam(index, name)}
            onRemoveTeam={() => draft.removeTeam(index)}
            onSetCaptain={(playerCode) => draft.setCaptain(index, playerCode)}
            onSlotRemove={(position) => draft.removeAt(index, position)}
            onSlotDragStart={(member) => {
              draggingRef.current = member;
            }}
            onSlotDrop={(position) => {
              if (draggingRef.current) placeMember(draggingRef.current, index, position);
            }}
            onSlotClick={(position) => {
              if (locked) return;
              if (picked) {
                placeMember(toSlotMember(picked), index, position);
                return;
              }
              // 선택된 칩이 없으면 슬롯의 사람을 집어 다른 곳으로 옮기게 한다.
              const member = team.members[position];
              if (member) {
                const source = applicants.find((a) => a.playerCode === member.playerCode);
                if (source) setPicked(source);
              }
            }}
          />
        ))}
        {!locked && (
          <button
            type="button"
            onClick={draft.addTeam}
            className="flex min-h-[112px] items-center justify-center gap-2 rounded border border-dashed border-border2 bg-rankBg3 text-[13px] text-primary3 hover:text-primary1"
          >
            <svg
              className="h-[15px] w-[15px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            팀 추가
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="rounded border border-redLighten bg-redDarken px-3.5 py-3 text-sm text-redText">
          {errorMsg}
        </div>
      )}
      {savedAt && !errorMsg && (
        <div className="rounded border border-border2 bg-darkBg1 px-3.5 py-3 text-sm text-neonGreen">
          {savedAt}에 저장했습니다.
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => router.push(`/competitions/${validId}`)}
          className="h-[38px] rounded border border-border2 bg-darkBg1 px-4 text-sm text-primary2"
        >
          취소
        </button>
        <button
          type="button"
          onClick={draft.clearAll}
          disabled={locked}
          className="h-[38px] rounded border border-border2 bg-darkBg1 px-4 text-sm text-primary1 disabled:opacity-40"
        >
          전체 비우기
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={locked || saveMutation.isPending}
          className="ml-auto h-[38px] rounded bg-bluePrimary px-5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saveMutation.isPending ? "저장 중..." : "로스터 확정"}
        </button>
      </div>
    </div>
  );

  const renderBody = () => {
    if (!isLoggedIn) return <TextCard text="로그인 후 이용해주세요" />;
    if (isLoadingGuilds) return <TextCard text="불러오는 중..." />;
    if (guilds.length === 0) return <TextCard text="소속된 클랜이 없습니다" />;
    if (!isManager) return <TextCard text="운영진 전용 화면입니다. 접근 권한이 없습니다." />;
    if (validId === null) return <TextCard text="잘못된 대회 주소입니다" />;
    if (isLoadingDetail || isLoadingTeams || isLoadingApplications) return <LoadingSpinner />;

    return (
      <>
        {locked && (
          <div className="flex items-center gap-2.5 rounded border border-border2 bg-darkBg2 px-4 py-3">
            <svg
              className="h-4 w-4 shrink-0 text-primary2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 018 0v4" />
            </svg>
            <span className="text-xs leading-relaxed text-primary2">
              종료된 대회입니다 — 로스터가 잠겨 있습니다. 현황판에서 진행중으로 되돌린 뒤 수정할 수
              있습니다.
            </span>
          </div>
        )}
        {renderEditor()}
      </>
    );
  };

  return (
    <>
      <NoIndex />
      <Head>
        <title>로스터 편성 - GMOK</title>
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
          <Link href={validId === null ? "/competitions" : `/competitions/${validId}`}>
            <a className="self-start text-[13px] text-primary2 hover:text-primary1">
              ← 대회 현황판
            </a>
          </Link>
          <div>
            <h1 className="text-[22px] font-light text-primary1">
              {competition ? `${competition.name} · ` : ""}로스터 편성
            </h1>
            <p className="mt-1 text-xs text-primary2">
              승인된 참가자 명단으로 팀을 편성합니다. 저장하면 화면의 구성이 그대로 반영되고, 빠진
              팀은 삭제됩니다.
            </p>
          </div>
          {renderBody()}
        </main>
      </div>
    </>
  );
};

export default RosterPage;
