import { useRouter } from "next/router";
// import useModal from "@/hooks/common/useModal";
import React, { useEffect, useState } from "react";
// import DiscordLoginModal from "@/features/discordLogin/DiscordLoginModal";
import useUserSearchController from "@/hooks/searchUserList/useUserSearchController";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/services/apiService";
import { UserRecordResponse } from "@/data/types/record";
import { getAllRecords } from "@/services/record";
import SummonerSearchResult from "@/features/summonerRecord/SummonerSearchResult";
import SummonerPageHeader from "@/components/layout/SummonerPageHeader";

const RiotProfilePage = () => {
  const router = useRouter();
  const { riotName } = router.query;
  const riotNameString = Array.isArray(riotName) ? riotName[0] : riotName || "";
  const [searchTerm, setSearchTerm] = useState("");
  // const { isOpen, open, close } = useModal();
  const [guildId, setGuildId] = useState<string>("");
  // const onGuildIdSaved = (newGuildId: string) => setGuildId(newGuildId);
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
    queryKey: ["userRecords", riotNameString, null, guildId],
    queryFn: () => getAllRecords(riotNameString, null, guildId),
    staleTime: 3 * 60 * 1000,
    enabled: !!riotName && !!guildId,
  });

  const handleDiscordLogin = async () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`;
  };

  useEffect(() => {
    if (userRecordData?.data?.data && userRecordData?.data?.data.player.length === 1) {
      router.push(
        `/summoners/${userRecordData?.data?.data.player[0].riot_name}/${userRecordData?.data?.data.player[0].riot_name_tag}`
      );
    }
  }, [router, userRecordData?.data?.data]);

  return (
    <div className="w-full md:max-w-[1080px] mx-auto">
      <SummonerPageHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearchButtonClick}
        isLoading={isLoading}
        isError={isError}
        users={userSearchData?.data}
        openDiscordModal={handleDiscordLogin}
      />

      <SummonerSearchResult
        riotNameString={riotNameString}
        userRecordData={userRecordData?.data ?? null}
        isLoading={isLoadingUserRecord}
      />
      {/* <DiscordLoginModal isOpen={isOpen} close={close} onSave={onGuildIdSaved} /> */}
    </div>
  );
};

export default RiotProfilePage;
