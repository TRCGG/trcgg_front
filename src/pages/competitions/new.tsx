import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import SummonerPageHeader from "@/components/layout/SummonerPageHeader";
import NoIndex from "@/components/layout/NoIndex";
import TextCard from "@/components/ui/TextCard";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import useUserSearchController from "@/hooks/searchUserList/useUserSearchController";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import { canManageGuild } from "@/data/types/guildMember";
import { CompetitionInitialStatus } from "@/data/types/competition";
import { createCompetition } from "@/services/competition";
import { competitionErrorMessage } from "@/features/competition/competitionErrors";
import useInvalidateCompetitions from "@/hooks/competition/useInvalidateCompetitions";

const NAME_MAX = 64;

// 백엔드 createSchema는 RECRUITING·IN_PROGRESS만 받는다(CLOSED로는 만들 수 없다).
const STATUS_OPTIONS: { value: CompetitionInitialStatus; label: string; desc: string }[] = [
  {
    value: "RECRUITING",
    label: "모집중",
    desc: "참가 신청을 받는 중. 로스터 편성 전",
  },
  {
    value: "IN_PROGRESS",
    label: "진행중",
    desc: "신청 마감 · 경기 업로드와 집계가 열립니다. 동시에 한 대회만 진행중일 수 있습니다",
  },
];

const Notice = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-2.5 rounded border border-border2 bg-darkBg1 px-3.5 py-3">
    <svg
      className="mt-0.5 h-[15px] w-[15px] shrink-0 text-blueText"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v.01M12 11v5" />
    </svg>
    <span className="text-xs leading-relaxed text-primary2">{children}</span>
  </div>
);

const CompetitionCreatePage: NextPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [name, setName] = useState("");
  const [approvalRequired, setApprovalRequired] = useState(true);
  const [status, setStatus] = useState<CompetitionInitialStatus>("RECRUITING");
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

  const createMutation = useMutation({
    mutationFn: () => createCompetition(guildId, { name: name.trim(), status, approvalRequired }),
    onSuccess: async (res) => {
      if (res.error || !res.data?.data) {
        setErrorMsg(competitionErrorMessage(res));
        return;
      }
      setErrorMsg(null);
      await invalidateCompetitions();
      router.push(`/competitions/${res.data.data.id}`);
    },
    onError: () => setErrorMsg("요청에 실패했습니다. 잠시 후 다시 시도해주세요."),
  });

  const trimmedName = name.trim();
  const canSubmit = trimmedName.length > 0 && !createMutation.isPending;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setErrorMsg(null);
    createMutation.mutate();
  };

  const renderForm = () => (
    <div className="flex flex-col gap-4 rounded border border-border2 bg-darkBg2 p-5">
      <h2 className="text-[15px] font-bold text-primary1">기본 정보</h2>

      <label className="flex flex-col gap-1.5" htmlFor="competition-name">
        <span className="text-xs text-primary2">대회 제목</span>
        <input
          id="competition-name"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, NAME_MAX))}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="예) GMOK 윈터 오픈"
          className="h-10 rounded border border-border2 bg-darkBg1 px-3 text-[15px] text-primary1 outline-none focus:border-blueText2"
        />
        <span className="text-[11px] text-primary3">
          {trimmedName.length}/{NAME_MAX}자
        </span>
      </label>

      <div className="flex flex-col gap-1.5 pt-0.5">
        <div className="flex flex-wrap items-center gap-3">
          <ToggleSwitch
            checked={approvalRequired}
            onChange={() => setApprovalRequired((prev) => !prev)}
            ariaLabel="참가 신청 승인 필요"
          />
          <span className="text-sm text-primary1">참가 신청 승인 필요</span>
          <span
            className={`whitespace-nowrap rounded px-[7px] py-0.5 text-[11px] font-bold ${
              approvalRequired ? "bg-blueText/10 text-blueText" : "bg-rankBg2 text-primary2"
            }`}
          >
            {approvalRequired ? "켬 · 운영진 검토" : "끔 · 전원 자동 승인"}
          </span>
        </div>
        <p className="ml-[54px] border-l-2 border-rankBg2 pl-[11px] text-xs leading-relaxed text-primary2">
          {approvalRequired
            ? "신청은 대기 상태로 접수되고, 운영진이 승인한 신청자만 로스터에 편성됩니다."
            : "신청이 즉시 확정됩니다. 정원 제한이 없어 신청자 전원이 참가자 명단에 들어갑니다."}
        </p>
      </div>

      <div className="flex flex-col gap-[7px]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-primary2">대회 상태</span>
          <span className="text-[11px] text-primary3">
            보통 모집중으로 시작합니다 · 이후 현황판에서 변경할 수 있습니다
          </span>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {STATUS_OPTIONS.map((option) => {
            const active = option.value === status;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatus(option.value)}
                className={`flex flex-1 flex-col gap-1 rounded border px-3 py-2.5 text-left ${
                  active ? "border-blueText bg-blue" : "border-border2 bg-darkBg1"
                }`}
              >
                <span className="flex items-center gap-[7px]">
                  <span
                    className={`h-[13px] w-[13px] shrink-0 rounded-full border ${
                      active ? "border-blueText bg-blueText" : "border-primary3"
                    }`}
                  />
                  <span
                    className={`text-[13px] font-bold ${active ? "text-primary1" : "text-primary2"}`}
                  >
                    {option.label}
                  </span>
                </span>
                <span className="text-[11px] leading-relaxed text-primary2">{option.desc}</span>
              </button>
            );
          })}
        </div>
        {status === "IN_PROGRESS" && (
          <div className="rounded border border-yellow/30 bg-yellow/[0.08] px-3 py-2.5">
            <span className="text-xs leading-relaxed text-yellow">
              진행중으로 만들면 참가 신청을 받지 않습니다. 이미 진행중인 대회가 있으면 생성에
              실패합니다.
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-[7px]">
        <Notice>
          대회는 <span className="text-primary1">한 번에 하나만 진행</span>할 수 있습니다. 진행 중인
          대회가 끝나면 <span className="text-primary1">현황판에서 상태를 종료로 변경</span>해야
          다음 대회를 진행할 수 있습니다.
        </Notice>
        <Notice>
          대회를 만들면 참가 신청이 열립니다. 신청을 마감한 뒤 현황판에서{" "}
          <span className="text-primary1">로스터 편성</span>을 시작하세요.
        </Notice>
      </div>

      {errorMsg && (
        <div className="rounded border border-redLighten bg-redDarken px-3.5 py-3 text-sm text-redText">
          {errorMsg}
        </div>
      )}

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => router.push("/competitions")}
          className="h-[38px] rounded border border-border2 bg-darkBg1 px-4 text-sm text-primary2"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="ml-auto h-[38px] rounded bg-bluePrimary px-5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createMutation.isPending ? "생성 중..." : "대회 생성"}
        </button>
      </div>
    </div>
  );

  const renderBody = () => {
    if (!isLoggedIn) return <TextCard text="로그인 후 이용해주세요" />;
    if (isLoadingGuilds) return <TextCard text="불러오는 중..." />;
    if (guilds.length === 0) return <TextCard text="소속된 클랜이 없습니다" />;
    if (!isManager) return <TextCard text="운영진만 대회를 만들 수 있습니다" />;
    return renderForm();
  };

  return (
    <>
      <NoIndex />
      <Head>
        <title>대회 생성 - GMOK</title>
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
          <div>
            <h1 className="text-[22px] font-light text-primary1">대회 생성</h1>
            <p className="mt-1 text-xs text-primary2">
              기본 정보만 입력해 대회를 만듭니다. 팀 편성은 참가 신청이 마감된 뒤{" "}
              <span className="text-primary1">로스터 편성</span> 화면에서 진행합니다.
            </p>
          </div>
          {renderBody()}
        </main>
      </div>
    </>
  );
};

export default CompetitionCreatePage;
