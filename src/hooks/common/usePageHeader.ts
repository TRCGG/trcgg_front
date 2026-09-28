import { useState } from "react";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import useUserSearchController from "@/hooks/searchUserList/useUserSearchController";
import type { SummonerPageHeaderProps } from "@/components/layout/SummonerPageHeader";

/**
 * SummonerPageHeader에 넘길 값을 한곳에서 만든다. 화면 12곳이 검색어 상태와
 * 훅 두 개를 똑같이 반복하고 있었다.
 *
 * headerProps 외에 useGuildManagement의 반환값을 그대로 펼쳐 주므로, 본문에서
 * guildId·currentRole 같은 값이 필요한 화면은 훅을 다시 부르지 않아도 된다.
 */
const usePageHeader = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const guild = useGuildManagement();
  const { users, isLoading, isError, handleSearchButtonClick } = useUserSearchController(
    searchTerm,
    guild.guildId
  );

  const headerProps: SummonerPageHeaderProps = {
    searchTerm,
    setSearchTerm,
    onSearch: handleSearchButtonClick,
    isLoading,
    isError,
    users,
    guilds: guild.guilds,
    selectedGuildId: guild.guildId,
    onGuildChange: guild.handleGuildChange,
    username: guild.username,
    isLoggedIn: guild.isLoggedIn,
  };

  return { headerProps, ...guild };
};

export default usePageHeader;
