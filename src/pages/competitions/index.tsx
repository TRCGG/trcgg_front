import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import SummonerPageHeader from "@/components/layout/SummonerPageHeader";
import NoIndex from "@/components/layout/NoIndex";
import TextCard from "@/components/ui/TextCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useUserSearchController from "@/hooks/searchUserList/useUserSearchController";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import useCompetitions from "@/hooks/competition/useCompetitions";
import { canManageGuild } from "@/data/types/guildMember";
import { CompetitionStatus } from "@/data/types/competition";
import CompetitionCard from "@/features/competition/CompetitionCard";
import CompetitionStatusFilter from "@/features/competition/CompetitionStatusFilter";

const CompetitionListPage: NextPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<CompetitionStatus | undefined>(undefined);

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
    competitions,
    error,
    isLoading: isLoadingCompetitions,
  } = useCompetitions(guildId, statusFilter);

  const renderBody = () => {
    if (!isLoggedIn) return <TextCard text="로그인 후 이용해주세요" />;
    if (isLoadingGuilds) return <TextCard text="불러오는 중..." />;
    if (guilds.length === 0) return <TextCard text="소속된 클랜이 없습니다" />;
    if (isLoadingCompetitions) return <LoadingSpinner />;
    if (error) return <TextCard text="대회 목록을 불러오지 못했습니다" />;

    return (
      <div className="flex flex-col gap-4">
        <CompetitionStatusFilter
          selected={statusFilter}
          onSelect={setStatusFilter}
          totalCount={competitions.length}
        />
        {competitions.length === 0 ? (
          <div className="rounded border border-border2 bg-darkBg2 py-10 text-center text-sm text-primary2">
            표시할 대회가 없습니다
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {competitions.map((competition) => (
              <CompetitionCard
                key={competition.id}
                competition={competition}
                isManager={isManager}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const clanName = guilds.find((guild) => guild.id === guildId)?.name ?? "클랜";

  return (
    <>
      <NoIndex />
      <Head>
        <title>대회 - GMOK</title>
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
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-[22px] font-light text-primary1">대회</h1>
              <p className="mt-1 text-xs text-primary2">
                {clanName} 클랜에서 열린 대회를 관리하고 참가 신청합니다. 스크림과 본경기는 대회
                안에서 함께 집계됩니다.
              </p>
            </div>
            {isManager && isLoggedIn && guilds.length > 0 && (
              <button
                type="button"
                onClick={() => router.push("/competitions/new")}
                className="flex h-[38px] shrink-0 items-center gap-1.5 rounded bg-bluePrimary px-4 text-sm text-white"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                대회 생성
              </button>
            )}
          </div>

          {renderBody()}
        </main>
      </div>
    </>
  );
};

export default CompetitionListPage;
