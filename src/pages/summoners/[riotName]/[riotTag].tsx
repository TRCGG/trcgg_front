import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useUserSearchController from "@/hooks/searchUserList/useUserSearchController";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/services/apiService";
import { MatchDashboardData, MultiplePlayerInfo, UserRecordResponse } from "@/data/types/record";
import { getAllRecords } from "@/services/record";
import EmptySearchResultCard from "@/features/summonerRecord/EmptySearchResultCard";
import UserRecordPanel from "@/features/summonerRecord/UserRecordPanel";
import MultiplePlayersCard from "@/features/summonerRecord/MultiplePlayersCard";
import SummonerPageHeader from "@/components/layout/SummonerPageHeader";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import TextCard from "@/components/ui/TextCard";
import { addRecentSearch } from "@/utils/recentSearches";

const RiotProfilePage = () => {
  const router = useRouter();
  const { riotName, riotTag } = router.query;
  const riotNameString = Array.isArray(riotName) ? riotName[0] : riotName || "";
  const riotTagString = Array.isArray(riotTag) ? riotTag[0] : riotTag || "";
  const [searchTerm, setSearchTerm] = useState("");

  // 페이지 로드 시 최근 검색어에 저장
  useEffect(() => {
    if (riotNameString && riotTagString) {
      addRecentSearch({ riotName: riotNameString, riotTag: riotTagString });
    }
  }, [riotNameString, riotTagString]);

  const { guildId, guilds, isLoggedIn, username, handleGuildChange } = useGuildManagement();

  const {
    data: userSearchData,
    isLoading,
    isError,
    handleSearchButtonClick,
  } = useUserSearchController(searchTerm, guildId);

  const {
    data: userRecordData,
    isLoading: isLoadingUserRecord,
    refetch: refetchUserRecords,
  } = useQuery<ApiResponse<UserRecordResponse>>({
    queryKey: ["userRecords", riotNameString, riotTagString, guildId],
    queryFn: () => getAllRecords(riotNameString, riotTagString, guildId),
    staleTime: 3 * 60 * 1000,
    enabled: !!riotName && !!guildId,
  });

  // 타입 가드: MatchDashboardData인지 확인
  const isMatchDashboardData = (data: unknown): data is MatchDashboardData => {
    return (
      !Array.isArray(data) &&
      typeof data === "object" &&
      data !== null &&
      "member" in data &&
      "summary" in data
    );
  };

  // 유효한 매치 데이터가 있는지 확인
  const hasValidMatchData = (data: MatchDashboardData): boolean => {
    return (
      data.summary.totalCount > 0 ||
      data.lines.length > 0 ||
      data.mostPicks.length > 0 ||
      data.synergy.length > 0
    );
  };

  // 타입 가드: MultiplePlayerInfo[] 배열인지 확인
  const isMultiplePlayerInfo = (data: unknown): data is MultiplePlayerInfo[] => {
    return Array.isArray(data);
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
        guilds={guilds}
        selectedGuildId={guildId}
        onGuildChange={handleGuildChange}
        username={username}
        isLoggedIn={isLoggedIn}
      />

      {/* 메인 콘텐츠 */}
      {(() => {
        // 비로그인 상태
        if (!isLoggedIn) {
          return <TextCard text="로그인 후 이용해주세요" />;
        }

        // 소속 클랜 없음
        if (guilds.length === 0) {
          return <TextCard text="소속된 클랜이 없습니다" />;
        }

        if (!riotName || !guildId || isLoadingUserRecord) {
          return (
            <main>
              <LoadingSpinner />
            </main>
          );
        }

        const data = userRecordData?.data?.data;

        // 다중 검색 결과인 경우
        if (data && isMultiplePlayerInfo(data)) {
          return <MultiplePlayersCard riotName={riotNameString} players={data} />;
        }

        // 단일 검색 결과인 경우
        if (data && isMatchDashboardData(data) && hasValidMatchData(data)) {
          return (
            <UserRecordPanel
              key={`${riotNameString}-${riotTagString}`}
              riotName={riotNameString}
              riotTag={riotTagString}
              data={data}
              onRefreshRecords={refetchUserRecords}
            />
          );
        }

        return <EmptySearchResultCard riotName={riotNameString} riotTag={riotTagString} />;
      })()}
    </div>
  );
};

export default RiotProfilePage;
