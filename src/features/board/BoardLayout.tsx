import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Footer from "@/components/layout/Footer";
import SiteNav from "@/components/layout/SiteNav";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import { BoardToastProvider } from "@/features/board/BoardToast";

const AdminLink = () => {
  const { pathname } = useRouter();
  const { isSiteAdmin } = useGuildManagement();
  if (!isSiteAdmin) return null;
  return (
    <Link href="/board/admin">
      <a
        className={`shrink-0 rounded border border-border2 bg-darkBg2 px-2.5 py-1.5 text-[13px] ${
          pathname.startsWith("/board/admin")
            ? "text-landing-goldLight"
            : "text-landing-bodySecondary"
        }`}
      >
        관리
      </a>
    </Link>
  );
};

const BoardLayout = ({ children }: { children: ReactNode }) => (
  <BoardToastProvider>
    <div className="min-h-screen w-full overflow-x-hidden bg-landing-bg leading-[1.6] text-landing-body">
      <SiteNav extra={<AdminLink />} />
      <main className="w-full px-6 pb-24 pt-11">{children}</main>
      <Footer />
    </div>
  </BoardToastProvider>
);

/** 게시판 페이지끼리 같은 레이아웃 인스턴스를 공유하게 해 토스트가 이동 중에도 살아 있게 한다. */
export const getBoardLayout = (page: ReactNode) => <BoardLayout>{page}</BoardLayout>;

export default BoardLayout;
