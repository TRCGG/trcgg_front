import { ReactNode } from "react";
import { useRouter } from "next/router";
import SummonerPageHeader from "@/components/layout/SummonerPageHeader";
import NoIndex from "@/components/layout/NoIndex";
import TextCard from "@/components/ui/TextCard";
import usePageHeader from "@/hooks/common/usePageHeader";
import { canManageGuild } from "@/data/types/guildMember";
import ClanSidebar from "./ClanSidebar";
import ClanMobileMenu from "./ClanMobileMenu";

interface Props {
  title: string;
  description: string;
  children: ReactNode;
}

const ClanManageLayout = ({ title, description, children }: Props) => {
  const router = useRouter();
  const { headerProps, isLoggedIn, hasOwnGuild, currentRole, isLoadingGuilds } = usePageHeader();
  const canManage = canManageGuild(currentRole);

  const renderBody = () => {
    if (!isLoggedIn) return <TextCard text="로그인 후 이용해주세요" />;
    if (isLoadingGuilds) return <TextCard text="불러오는 중..." />;
    if (!hasOwnGuild) return <TextCard text="소속된 클랜이 없습니다" />;
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
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full md:max-w-[1080px] mx-auto">
      <NoIndex />
      <SummonerPageHeader {...headerProps} />
      <div className="mt-5 mb-10 px-4 md:px-0">{renderBody()}</div>
    </div>
  );
};

export default ClanManageLayout;
