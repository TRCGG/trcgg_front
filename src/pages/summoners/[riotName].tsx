import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import useUserSearchController from "@/hooks/searchUserList/useUserSearchController";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/services/apiService";
import { UserRecordResponse, MultiplePlayerInfo } from "@/data/types/record";
import { getAllRecords } from "@/services/record";
import SummonerPageHeader from "@/components/layout/SummonerPageHeader";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import EmptySearchResultCard from "@/features/summonerRecord/EmptySearchResultCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import MultiplePlayersCard from "@/features/summonerRecord/MultiplePlayersCard";
import TextCard from "@/components/ui/TextCard";

const RiotProfilePage = () => {
  const router = useRouter();
  const { riotName } = router.query;
  const riotNameString = Array.isArray(riotName) ? riotName[0] : riotName || "";
  const [searchTerm, setSearchTerm] = useState("");

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
    queryKey: ["userRecords", riotNameString, null, guildId],
    queryFn: () => getAllRecords(riotNameString, null, guildId),
    staleTime: 3 * 60 * 1000,
    enabled: !!riotName && !!guildId,
  });

  const data = userRecordData?.data?.data;

  // 타입 가드: data가 MultiplePlayerInfo[] 배열인지 확인
  const isPlayerInfoArray = (value: unknown): value is MultiplePlayerInfo[] => {
    return Array.isArray(value);
  };

  // 자동 리다이렉트
  useEffect(() => {
    if (!data) return;

    // 배열이고 1개 결과일 때
    if (isPlayerInfoArray(data) && data.length === 1) {
      router.push(
        `/summoners/${encodeURIComponent(data[0].riotName)}/${encodeURIComponent(data[0].riotNameTag)}`
      );
    }
    // 배열이 아니면 MatchDashboardData (단일 사용자 데이터)
    else if (!isPlayerInfoArray(data)) {
      router.push(
        `/summoners/${encodeURIComponent(data.member.riotName)}/${encodeURIComponent(data.member.riotNameTag)}`
      );
    }
  }, [router, data]);

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

        // 로딩 중
        if (isLoadingUserRecord) {
          return (
            <main>
              <LoadingSpinner />
            </main>
          );
        }

        // 단일 사용자 데이터인 경우 (자동 리다이렉트를 위해 로딩 표시)
        if (data && !isPlayerInfoArray(data)) {
          return (
            <main>
              <LoadingSpinner />
            </main>
          );
        }

        // 다중 검색 결과인 경우
        if (data && isPlayerInfoArray(data)) {
          // 1개 결과일 때는 자동 리다이렉트를 위해 로딩 표시
          if (data.length === 1) {
            return (
              <main>
                <LoadingSpinner />
              </main>
            );
          }

          // 2개 이상 결과일 때
          if (data.length > 1) {
            return <MultiplePlayersCard players={data} riotName={riotNameString} />;
          }
        }

        // 검색 결과 없음
        return <EmptySearchResultCard riotName={riotNameString} />;
      })()}
    </div>
  );
};

export default RiotProfilePage;
