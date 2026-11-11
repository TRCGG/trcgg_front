import { ReactNode } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import NoIndex from "@/components/layout/NoIndex";
import useGuildManagement from "@/hooks/auth/useGuildManagement";

const Notice = ({ text }: { text: string }) => (
  <div className="mx-auto max-w-[960px] border-b border-t border-b-board-rowLine border-t-border2 py-20 text-center text-sm text-board-meta">
    {text}
  </div>
);

/** 화면만 가린다. 실제 권한 검사는 백엔드(/api/admin/posts, adminNormal 이상)가 한다. */
const AdminGate = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn, isSiteAdmin, isLoadingGuilds } = useGuildManagement();

  const body = (() => {
    if (isLoadingGuilds) return <LoadingSpinner />;
    if (isSiteAdmin) return children;
    if (!isLoggedIn) return <Notice text="로그인 후 이용해 주세요." />;
    return <Notice text="게시판 관리 권한이 없습니다." />;
  })();

  return (
    <>
      <NoIndex />
      {body}
    </>
  );
};

export default AdminGate;
