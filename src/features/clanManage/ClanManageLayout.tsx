import { ReactNode, useState } from "react";
import { useRouter } from "next/router";
import SummonerPageHeader from "@/components/layout/SummonerPageHeader";
import TextCard from "@/components/ui/TextCard";
import useUserSearchController from "@/hooks/searchUserList/useUserSearchController";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import { canManageGuild } from "@/data/types/guildMember";
import ClanSidebar from "./ClanSidebar";
import ClanMobileMenu from "./ClanMobileMenu";
import ClanGuildContext from "./ClanGuildContext";

interface Props {
  title: string;
  description: string;
  children: ReactNode;
}

const ClanManageLayout = ({ title, description, children }: Props) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const { guildId, guilds, isLoggedIn, username, currentRole, handleGuildChange, isLoadingGuilds } =
    useGuildManagement();
  const {
    data: userSearchData,
    isLoading,
    isError,
    handleSearchButtonClick,
  } = useUserSearchController(searchTerm, guildId);
  const canManage = canManageGuild(currentRole);

  const renderBody = () => {
    if (!isLoggedIn) return <TextCard text="로그인 후 이용해주세요" />;
    if (isLoadingGuilds) return <TextCard text="불러오는 중..." />;
    if (guilds.length === 0) return <TextCard text="소속된 클랜이 없습니다" />;
    if (!canManage) return <TextCard text="매니저 전용 화면입니다. 접근 권한이 없습니다." />;

    return (
      <div className="flex gap-4 items-start">
        <ClanSidebar activePath={router.pathname} />
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <ClanMobileMenu activePath={router.pathname} />
          <div>
            <h1 className="text-[22px] font-light text-primary1 mt-1">{title}</h1>
            <p className="text-xs text-primary2 mt-1">{description}</p>
          </div>
          <ClanGuildContext.Provider value={guildId}>{children}</ClanGuildContext.Provider>
        </div>
      </div>
    );
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
      <div className="mt-5 mb-10 px-4 md:px-0">{renderBody()}</div>
    </div>
  );
};

export default ClanManageLayout;
