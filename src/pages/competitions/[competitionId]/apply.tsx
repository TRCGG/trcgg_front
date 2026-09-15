import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import SummonerPageHeader from "@/components/layout/SummonerPageHeader";
import NoIndex from "@/components/layout/NoIndex";
import TextCard from "@/components/ui/TextCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useUserSearchController from "@/hooks/searchUserList/useUserSearchController";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import useCompetitionDetail from "@/hooks/competition/useCompetitionDetail";
import useChampions from "@/hooks/competition/useChampions";
import { ApiResponse } from "@/services/apiService";
import {
  ApplicationResponse,
  COMPETITION_POSITIONS,
  CompetitionPosition,
  CompetitionSubPosition,
  PracticeLevel,
} from "@/data/types/competition";
import { PlayerInfo } from "@/data/types/user";
import {
  applyToCompetition,
  cancelMyApplication,
  getMyApplication,
  updateMyApplication,
} from "@/services/competition";
import RiotAccountPicker from "@/features/competition/RiotAccountPicker";
import ChampionPicker from "@/features/competition/ChampionPicker";
import {
  PRACTICE_LEVEL_OPTIONS,
  applicationStatusHint,
  getApplicationStatusMeta,
  positionLabel,
} from "@/features/competition/competitionMeta";
import { competitionErrorMessage } from "@/features/competition/competitionErrors";
import useInvalidateCompetitions from "@/hooks/competition/useInvalidateCompetitions";

const COMMENT_MAX = 100;
const TIME_MAX = 128;
/** 백엔드 zod: 부포지션은 주포지션을 뺀 4개까지. */
const SUB_MAX = COMPETITION_POSITIONS.length - 1;

const Pill = ({
  active,
  disabled,
  onClick,
  children,
  className = "",
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`rounded border text-[13px] transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
      active
        ? "border-blueText bg-blueText/10 text-primary1"
        : "border-border2 bg-darkBg1 text-primary2 hover:text-primary1"
    } ${className}`}
  >
    {children}
  </button>
);

const Field = ({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-xs text-primary2">
      {label} {required && <span className="text-redText">*</span>}
      {hint && <span className="text-primary3"> {hint}</span>}
    </span>
    {children}
  </div>
);

const CompetitionApplyPage: NextPage = () => {
  const router = useRouter();
  const rawId = router.query.competitionId;
  const competitionId = typeof rawId === "string" ? Number(rawId) : null;
  const validId = competitionId !== null && Number.isFinite(competitionId) ? competitionId : null;

  const [searchTerm, setSearchTerm] = useState("");
  const [account, setAccount] = useState<PlayerInfo | null>(null);
  const [mainPosition, setMainPosition] = useState<CompetitionPosition | null>(null);
  const [subPositions, setSubPositions] = useState<CompetitionSubPosition[]>([]);
  // 신청 API는 champNameEng(영문명)을 받는다. 내부 id를 보내면 400 champion-not-found.
  const [championNames, setChampionNames] = useState<string[]>([]);
  const [availableTime, setAvailableTime] = useState("");
  const [captainAvailable, setCaptainAvailable] = useState<boolean | null>(null);
  const [practiceLevel, setPracticeLevel] = useState<PracticeLevel | null>(null);
  const [comment, setComment] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const invalidateCompetitions = useInvalidateCompetitions();
  const { guildId, guilds, isLoggedIn, username, handleGuildChange, isLoadingGuilds } =
    useGuildManagement();

  const {
    data: userSearchData,
    isLoading,
    isError,
    handleSearchButtonClick,
  } = useUserSearchController(searchTerm, guildId);

  const { competition } = useCompetitionDetail(guildId, validId);
  const { champions } = useChampions(!!guildId);

  const { data: myApplicationRes, isLoading: isLoadingMine } = useQuery<
    ApiResponse<ApplicationResponse>
  >({
    queryKey: ["myCompetitionApplication", guildId, validId],
    queryFn: () => getMyApplication(guildId, validId as number),
    enabled: !!guildId && validId !== null,
    staleTime: 15 * 1000,
  });
  const mine = myApplicationRes?.data?.data ?? null;
  const isEditing = mine !== null;

  // 기존 신청서를 폼에 채운다. 사용자가 편집을 시작한 뒤 덮어쓰지 않도록 id가 바뀔 때만 동작한다.
  useEffect(() => {
    if (!mine) return;
    setMainPosition(mine.mainPosition);
    setSubPositions(mine.subPositions);
    setChampionNames(mine.champions.map((champion) => champion.champNameEng));
    setAvailableTime(mine.availableTime ?? "");
    setCaptainAvailable(mine.captainAvailable);
    setPracticeLevel(mine.practiceLevel);
    setComment(mine.comment ?? "");
    setAccount({
      playerCode: mine.playerCode,
      riotName: mine.riotName,
      riotNameTag: mine.riotNameTag,
      isMain: true,
      guildId: "",
      createDate: "",
      updateDate: "",
      isDeleted: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mine?.id]);

  const toggleSub = (position: CompetitionSubPosition) => {
    setSubPositions((prev) => {
      if (prev.includes(position)) return prev.filter((item) => item !== position);
      // 전체 가능은 다른 선택과 함께 둘 이유가 없다.
      if (position === "ALL") return ["ALL"];
      const withoutAll = prev.filter((item) => item !== "ALL");
      if (withoutAll.length >= SUB_MAX) return withoutAll;
      return [...withoutAll, position];
    });
  };

  const pickMain = (position: CompetitionPosition) => {
    setMainPosition(position);
    setSubPositions((prev) => prev.filter((item) => item !== position));
  };

  // 백엔드 assertMainAccount가 부계정 신청을 400 sub-account-not-allowed로 막는다.
  // 화면에서 먼저 걸러 헛된 요청을 보내지 않는다.
  const canSubmit =
    account !== null &&
    account.isMain &&
    mainPosition !== null &&
    captainAvailable !== null &&
    practiceLevel !== null;

  const submitMutation = useMutation({
    mutationFn: () => {
      const payload = {
        playerCode: (account as PlayerInfo).playerCode,
        mainPosition: mainPosition as CompetitionPosition,
        subPositions,
        champions: championNames,
        availableTime: availableTime.trim() || null,
        captainAvailable: captainAvailable as boolean,
        practiceLevel: practiceLevel as PracticeLevel,
        comment: comment.trim() || null,
      };
      return isEditing
        ? updateMyApplication(guildId, validId as number, payload)
        : applyToCompetition(guildId, validId as number, payload);
    },
    onSuccess: async (res) => {
      if (res.error) {
        setErrorMsg(competitionErrorMessage(res));
        return;
      }
      setErrorMsg(null);
      await invalidateCompetitions();
      router.push("/competitions");
    },
    onError: () => setErrorMsg("요청에 실패했습니다. 잠시 후 다시 시도해주세요."),
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelMyApplication(guildId, validId as number),
    onSuccess: async (res) => {
      if (res.error) {
        setErrorMsg(competitionErrorMessage(res));
        return;
      }
      setErrorMsg(null);
      await invalidateCompetitions();
      router.push("/competitions");
    },
    onError: () => setErrorMsg("요청에 실패했습니다. 잠시 후 다시 시도해주세요."),
  });

  // 백엔드 updateMyApplication·deleteMyApplication에 assertRecruiting이 걸려 있어
  // 모집중이 아닌 대회에서는 수정·취소가 409다. 폼을 읽기 전용으로 둔다.
  const readOnly = !!competition && competition.status !== "RECRUITING";
  // 승인은 특정 계정에 대한 판단이다. 계정을 바꾸면 신청서와 로스터의 playerCode가
  // 어긋나므로(로스터는 옛 계정을 들고 있다) 승인 후에는 계정을 잠그고 재신청으로 돌린다.
  const accountLocked = readOnly || mine?.status === "APPROVED";
  const busy = submitMutation.isPending || cancelMutation.isPending;
  const inputsLocked = busy || readOnly;
  const submitLabel = (() => {
    if (submitMutation.isPending) return "저장 중...";
    return isEditing ? "신청서 수정 저장" : "참가 신청";
  })();

  const renderForm = () => (
    <div className="flex flex-col items-start gap-3.5 lg:flex-row">
      <div className="flex w-full min-w-0 flex-col gap-[18px] rounded border border-border2 bg-darkBg2 p-5">
        <Field label="신청자 롤 아이디" required>
          <RiotAccountPicker
            guildId={guildId}
            selected={account}
            onSelect={setAccount}
            disabled={accountLocked}
            subAccountNotice="부계정으로는 신청할 수 없습니다. 본계정을 골라주세요."
          />
          {accountLocked && (
            <p className="text-[11px] leading-relaxed text-primary3">
              {readOnly
                ? "신청이 마감되어 계정을 바꿀 수 없습니다."
                : "승인된 신청서는 계정을 바꿀 수 없습니다. 다른 계정으로 참가하려면 신청을 취소한 뒤 다시 신청해주세요."}
            </p>
          )}
        </Field>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <Field label="주 포지션" required>
            <div className="flex gap-1.5">
              {COMPETITION_POSITIONS.map((position) => (
                <Pill
                  key={position}
                  active={mainPosition === position}
                  onClick={() => pickMain(position)}
                  disabled={inputsLocked}
                  className="flex-1 py-2 text-center text-xs"
                >
                  {positionLabel(position)}
                </Pill>
              ))}
            </div>
          </Field>
          <Field label="부 포지션" hint="복수 선택 가능">
            <div className="flex gap-1.5">
              {(["ALL", ...COMPETITION_POSITIONS] as CompetitionSubPosition[]).map((position) => (
                <Pill
                  key={position}
                  active={subPositions.includes(position)}
                  onClick={() => toggleSub(position)}
                  disabled={inputsLocked || position === mainPosition}
                  className="flex-1 py-2 text-center text-xs"
                >
                  {position === "ALL" ? "전체" : positionLabel(position as CompetitionPosition)}
                </Pill>
              ))}
            </div>
          </Field>
        </div>

        <Field label={`주 챔피언 ${championNames.length}/3`} hint="선택">
          <ChampionPicker
            champions={champions}
            value={championNames}
            onChange={setChampionNames}
            disabled={inputsLocked}
          />
        </Field>

        <Field label="가능 시간대">
          <input
            value={availableTime}
            onChange={(e) => setAvailableTime(e.target.value.slice(0, TIME_MAX))}
            placeholder="예: 평일 8~12시, 주말 프리 / 화요일만 불가"
            disabled={inputsLocked}
            className="h-[38px] rounded border border-border2 bg-darkBg1 px-3 text-[13px] text-primary1 outline-none focus:border-blueText2"
          />
        </Field>

        <Field label="팀장 가능 여부" required>
          <div className="flex gap-2">
            {[
              { value: true, label: "가능" },
              { value: false, label: "불가" },
            ].map((option) => (
              <Pill
                key={option.label}
                active={captainAvailable === option.value}
                onClick={() => setCaptainAvailable(option.value)}
                disabled={inputsLocked}
                className="px-6 py-2"
              >
                {option.label}
              </Pill>
            ))}
          </div>
        </Field>

        <Field label="연습 희망 정도" required>
          <div className="flex flex-wrap gap-2">
            {PRACTICE_LEVEL_OPTIONS.map((option) => (
              <Pill
                key={option.value}
                active={practiceLevel === option.value}
                onClick={() => setPracticeLevel(option.value)}
                disabled={inputsLocked}
                className="whitespace-nowrap px-4 py-2"
              >
                {option.label}
              </Pill>
            ))}
          </div>
        </Field>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-primary2">각오 한 마디</span>
            <span
              className={`ml-auto text-[11px] ${
                comment.length >= COMMENT_MAX ? "text-yellow" : "text-primary3"
              }`}
            >
              {comment.length} / {COMMENT_MAX}
            </span>
          </div>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, COMMENT_MAX))}
            placeholder="현황판과 팀 편성 화면에 함께 표시됩니다 (최대 100자)"
            disabled={inputsLocked}
            className="resize-none rounded border border-border2 bg-darkBg1 px-3 py-2.5 text-[13px] text-primary1 outline-none focus:border-blueText2"
          />
        </div>

        {errorMsg && (
          <div className="rounded border border-redLighten bg-redDarken px-3.5 py-3 text-sm text-redText">
            {errorMsg}
          </div>
        )}

        {readOnly && (
          <div className="rounded border border-border2 bg-darkBg1 px-3.5 py-3 text-xs leading-relaxed text-primary2">
            참가 신청이 마감되어 신청서를 수정하거나 취소할 수 없습니다. 내용 변경이 필요하면
            운영진에게 문의해주세요.
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => router.push("/competitions")}
            className="h-10 rounded border border-border2 bg-darkBg1 px-4 text-sm text-primary2"
          >
            돌아가기
          </button>
          {isEditing && !readOnly && (
            <button
              type="button"
              onClick={() => cancelMutation.mutate()}
              disabled={inputsLocked}
              className="ml-auto h-10 rounded border border-redLighten bg-darkBg1 px-4 text-sm text-redText disabled:opacity-40"
            >
              {cancelMutation.isPending ? "취소 중..." : "신청 취소"}
            </button>
          )}
          {!readOnly && (
            <button
              type="button"
              onClick={() => submitMutation.mutate()}
              disabled={!canSubmit || inputsLocked}
              className={`h-10 rounded bg-bluePrimary px-5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                isEditing ? "" : "ml-auto"
              }`}
            >
              {submitLabel}
            </button>
          )}
        </div>
      </div>

      <div className="flex w-full shrink-0 flex-col gap-3 lg:w-[300px]">
        <div className="flex flex-col gap-3 rounded border border-border2 bg-darkBg2 p-4">
          <h2 className="text-[13px] font-bold text-primary1">신청 현황</h2>
          <div className="flex items-end gap-1.5">
            <span className="text-[28px] font-bold leading-none text-blueText">
              {competition?.applicationCount ?? 0}
            </span>
            <span className="text-[13px] text-primary2">명 신청</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded border border-border2 bg-darkBg2 p-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[13px] font-bold text-primary1">내 신청서</h2>
            {mine ? (
              <span
                className={`rounded px-2 py-0.5 text-[11px] font-bold ${
                  getApplicationStatusMeta(mine.status).textClass
                } ${getApplicationStatusMeta(mine.status).bgClass}`}
              >
                {getApplicationStatusMeta(mine.status).label}
              </span>
            ) : (
              <span className="rounded bg-rankBg2 px-2 py-0.5 text-[11px] font-bold text-primary2">
                미신청
              </span>
            )}
          </div>
          <p className="text-xs leading-relaxed text-primary2">
            {mine
              ? applicationStatusHint(mine.status)
              : "아직 신청하지 않았습니다. 폼을 채워 신청하면 운영진 승인 후 로스터에 편성됩니다."}
          </p>
        </div>
      </div>
    </div>
  );

  const renderBody = () => {
    if (!isLoggedIn) return <TextCard text="로그인 후 이용해주세요" />;
    if (isLoadingGuilds) return <TextCard text="불러오는 중..." />;
    if (guilds.length === 0) return <TextCard text="소속된 클랜이 없습니다" />;
    if (validId === null) return <TextCard text="잘못된 대회 주소입니다" />;
    if (isLoadingMine) return <LoadingSpinner />;
    if (competition && competition.status === "CLOSED")
      return <TextCard text="종료된 대회입니다" />;
    if (competition && competition.status === "IN_PROGRESS" && !mine)
      return <TextCard text="참가 신청이 마감된 대회입니다" />;
    return renderForm();
  };

  return (
    <>
      <NoIndex />
      <Head>
        <title>참가 신청 - GMOK</title>
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
            <h1 className="text-[22px] font-light text-primary1">
              {competition ? `${competition.name} · ` : ""}참가 신청
            </h1>
            <p className="mt-1 text-xs text-primary2">
              {competition?.approvalRequired === false
                ? "승인 없이 즉시 확정되는 대회입니다."
                : "운영진 승인 후 로스터에 편성됩니다."}
            </p>
          </div>
          {renderBody()}
        </main>
      </div>
    </>
  );
};

export default CompetitionApplyPage;
