import { useRouter } from "next/router";
import useModal from "@/hooks/common/useModal";
import React, { useEffect, useState } from "react";
import DiscordLoginModal from "@/features/discordLogin/DiscordLoginModal";
import useUserSearchController from "@/hooks/searchUserList/useUserSearchController";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/services/apiService";
import { MultiplePlayers, PlayerStatsData, UserRecordResponse } from "@/data/types/record";
import { getAllRecords } from "@/services/record";
import EmptySearchResultCard from "@/features/summonerRecord/EmptySearchResultCard";
import UserRecordPanel from "@/features/summonerRecord/UserRecordPanel";
import SummonerPageHeader from "@/components/layout/SummonerPageHeader";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const RiotProfilePage = () => {
  const router = useRouter();
  const { riotName, riotTag } = router.query;
  const riotNameString = Array.isArray(riotName) ? riotName[0] : riotName || "";
  const riotTagString = Array.isArray(riotTag) ? riotTag[0] : riotTag || "";
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, open, close } = useModal();
  const [guildId, setGuildId] = useState<string>("");
  const onGuildIdSaved = (newGuildId: string) => setGuildId(newGuildId);
  const {
    data: userSearchData,
    isLoading,
    isError,
    handleSearchButtonClick,
  } = useUserSearchController(searchTerm, guildId);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setGuildId(localStorage.getItem("guildId") || "");
    }
  }, []);

  const { data: userRecordData, isLoading: isLoadingUserRecord } = useQuery<
    ApiResponse<UserRecordResponse>
  >({
    queryKey: ["userRecords", riotNameString, riotTagString, guildId],
    queryFn: () => getAllRecords(riotNameString, riotTagString, guildId),
    staleTime: 3 * 60 * 1000,
    enabled: !!riotName && !!guildId,
  });

  const isPlayerStatsData = (data: PlayerStatsData | MultiplePlayers): data is PlayerStatsData => {
    return "month_data" in data; // 타입 좁히기
  };

  return (
    <div className="w-full md:max-w-[1080px] mx-auto px-2">
      <SummonerPageHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearchButtonClick}
        isLoading={isLoading}
        isError={isError}
        users={userSearchData?.data}
        openDiscordModal={open}
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

        if (userRecordData?.data?.data && isPlayerStatsData(userRecordData.data.data)) {
          return (
            <UserRecordPanel
              riotName={riotNameString}
              riotTag={riotTagString}
              data={userRecordData.data.data}
            />
          );
        }

        return <EmptySearchResultCard riotName={riotNameString} riotTag={riotTagString} />;
      })()}

      <DiscordLoginModal isOpen={isOpen} close={close} onSave={onGuildIdSaved} />
    </div>
  );
};

export default RiotProfilePage;
