import { ReactNode } from "react";
import Footer from "@/components/layout/Footer";
import SiteNav from "@/components/layout/SiteNav";
import { BoardToastProvider } from "@/features/board/BoardToast";

const BoardLayout = ({ children }: { children: ReactNode }) => (
  <BoardToastProvider>
    <div className="min-h-screen w-full overflow-x-hidden bg-landing-bg leading-[1.6] text-landing-body">
      <SiteNav />
      <main className="w-full px-4 pb-24 pt-7 sm:px-6 sm:pt-11">{children}</main>
      <Footer />
    </div>
  </BoardToastProvider>
);

/** 게시판 페이지끼리 같은 레이아웃 인스턴스를 공유하게 해 토스트가 이동 중에도 살아 있게 한다. */
export const getBoardLayout = (page: ReactNode) => <BoardLayout>{page}</BoardLayout>;

export default BoardLayout;
