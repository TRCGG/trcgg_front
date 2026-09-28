import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MultiplePlayerInfo, MatchDashboardData } from "@/data/types/record";
import { getAllRecords } from "@/services/record";
import SummonerPageHeader from "@/components/layout/SummonerPageHeader";
import usePageHeader from "@/hooks/common/usePageHeader";
import EmptySearchResultCard from "@/features/summonerRecord/EmptySearchResultCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import MultiplePlayersCard from "@/features/summonerRecord/MultiplePlayersCard";
import TextCard from "@/components/ui/TextCard";

const RiotProfilePage = () => {
  const router = useRouter();
  const { riotName } = router.query;
  const riotNameString = Array.isArray(riotName) ? riotName[0] : riotName || "";

  const { headerProps, guildId, guilds, isLoggedIn, isLoadingGuilds } = usePageHeader();

  const { data: userRecordData, isLoading: isLoadingUserRecord } = useQuery<
    MatchDashboardData | MultiplePlayerInfo[]
  >({
    queryKey: ["userRecords", riotNameString, null, guildId],
    queryFn: () => getAllRecords(riotNameString, null, guildId),
    staleTime: 3 * 60 * 1000,
    enabled: !!riotName && !!guildId,
  });

  const data = userRecordData;

  // 타입 가드: data가 MultiplePlayerInfo[] 배열인지 확인
  const isPlayerInfoArray = (value: unknown): value is MultiplePlayerInfo[] => {
    return Array.isArray(value);
  };

  // 타입 가드: MatchDashboardData인지 확인
  const isMatchDashboardData = (value: unknown): value is MatchDashboardData => {
    return (
      !Array.isArray(value) &&
      typeof value === "object" &&
      value !== null &&
      "member" in value &&
      "summary" in value
    );
  };

  // 유효한 매치 데이터가 있는지 확인
  const hasValidMatchData = (value: MatchDashboardData): boolean => {
    return (
      value.summary.totalCount > 0 ||
      value.lines.length > 0 ||
      value.mostPicks.length > 0 ||
      value.synergy.length > 0
    );
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
    else if (isMatchDashboardData(data) && hasValidMatchData(data)) {
      router.push(
        `/summoners/${encodeURIComponent(data.member.riotName)}/${encodeURIComponent(data.member.riotNameTag)}`
      );
    }
  }, [router, data]);

  return (
    <div className="w-full md:max-w-[1080px] mx-auto">
      <SummonerPageHeader {...headerProps} />

      {/* 메인 콘텐츠 */}
      {(() => {
        // 공개 길드가 있으면 비로그인도 볼 수 있어, 볼 수 있는 길드가 없을 때만 막는다
        if (!isLoadingGuilds && guilds.length === 0) {
          return (
            <TextCard text={isLoggedIn ? "소속된 클랜이 없습니다" : "로그인 후 이용해주세요"} />
          );
        }

        // 로딩 중
        if (isLoadingGuilds || isLoadingUserRecord) {
          return (
            <main>
              <LoadingSpinner />
            </main>
          );
        }

        // 단일 사용자 데이터인 경우
        if (data && isMatchDashboardData(data)) {
          // 유효한 매치 데이터가 있으면 리다이렉트를 위해 로딩 표시
          if (hasValidMatchData(data)) {
            return (
              <main>
                <LoadingSpinner />
              </main>
            );
          }
          // 빈 데이터면 EmptySearchResultCard 표시
          return <EmptySearchResultCard riotName={riotNameString} />;
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

          // 빈 배열인 경우
          return <EmptySearchResultCard riotName={riotNameString} />;
        }

        // 검색 결과 없음
        return <EmptySearchResultCard riotName={riotNameString} />;
      })()}
    </div>
  );
};

export default RiotProfilePage;
