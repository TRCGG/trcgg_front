import { useRouter } from "next/router";
import useModal from "@/hooks/common/useModal";
import React, { useState } from "react";
import DiscordLoginModal from "@/features/discordLogin/DiscordLoginModal";
import useUserSearchController from "@/hooks/searchUserList/useUserSearchController";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/services/apiService";
import { MatchDashboardData, UserRecordResponse } from "@/data/types/record";
import { getAllRecords } from "@/services/record";
import EmptySearchResultCard from "@/features/summonerRecord/EmptySearchResultCard";
import UserRecordPanel from "@/features/summonerRecord/UserRecordPanel";
import SummonerPageHeader from "@/components/layout/SummonerPageHeader";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useGuildManagement from "@/hooks/auth/useGuildManagement";

const RiotProfilePage = () => {
  const router = useRouter();
  const { riotName, riotTag } = router.query;
  const riotNameString = Array.isArray(riotName) ? riotName[0] : riotName || "";
  const riotTagString = Array.isArray(riotTag) ? riotTag[0] : riotTag || "";
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, open, close } = useModal();

  const { guildId, guilds, isLoggedIn, username, handleGuildChange } = useGuildManagement();

  const {
    data: userSearchData,
    isLoading,
    isError,
    handleSearchButtonClick,
  } = useUserSearchController(searchTerm, guildId);

  const { data: userRecordData, isLoading: isLoadingUserRecord } = useQuery<
    ApiResponse<UserRecordResponse>
  >({
    queryKey: ["userRecords", riotNameString, riotTagString, guildId],
    queryFn: () => getAllRecords(riotNameString, riotTagString, guildId),
    staleTime: 3 * 60 * 1000,
    enabled: !!riotName && !!guildId,
  });

  // 타입 가드: MatchDashboardData인지 확인
  const isMatchDashboardData = (data: unknown): data is MatchDashboardData => {
    return !Array.isArray(data) && typeof data === "object" && data !== null && "summary" in data;
  };

  return (
    <div className="w-full md:max-w-[1080px] mx-auto">
      <SummonerPageHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearchButtonClick}
        isLoading={isLoading}
        isError={isError}
        users={userSearchData?.data}
        openDiscordModal={open}
        guilds={guilds}
        selectedGuildId={guildId}
        onGuildChange={handleGuildChange}
        username={username}
        isLoggedIn={isLoggedIn}
      />

      {/* 메인 콘텐츠 */}
      {(() => {
        if (isLoadingUserRecord) {
          return (
            <main>
              <LoadingSpinner />
            </main>
          );
        }

        const data = userRecordData?.data?.data;
        if (data && isMatchDashboardData(data)) {
          return <UserRecordPanel riotName={riotNameString} riotTag={riotTagString} data={data} />;
        }

        return <EmptySearchResultCard riotName={riotNameString} riotTag={riotTagString} />;
      })()}

      <DiscordLoginModal isOpen={isOpen} close={close} onSave={handleGuildChange} />
    </div>
  );
};

export default RiotProfilePage;
