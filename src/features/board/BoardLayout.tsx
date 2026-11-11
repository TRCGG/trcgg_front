import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import TextLogo from "@/assets/images/textLogo.png";
import Footer from "@/components/layout/Footer";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import { BoardToastProvider } from "@/features/board/BoardToast";

const navLinkClass = "text-[15px] text-landing-caption hover:text-primary1";

const BoardNav = () => {
  const router = useRouter();
  const { isSiteAdmin } = useGuildManagement();
  const inAdmin = router.pathname.startsWith("/board/admin");

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-landing-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-5 gap-y-4 px-7 py-3.5">
        <Link href="/">
          <a className="flex shrink-0 items-center">
            <Image src={TextLogo} alt="gmok" width={61} height={34} />
          </a>
        </Link>
        <div className="flex flex-wrap items-center gap-x-[26px] gap-y-3">
          <Link href="/about#features">
            <a className={navLinkClass}>키포인트</a>
          </Link>
          <Link href="/guide">
            <a className={navLinkClass}>이용방법</a>
          </Link>
          <Link href="/faq">
            <a className={navLinkClass}>FAQ</a>
          </Link>
          <Link href="/board">
            <a
              className={`text-[15px] ${
                inAdmin
                  ? "text-landing-caption hover:text-primary1"
                  : "font-bold text-landing-goldLight"
              }`}
            >
              게시판
            </a>
          </Link>
          {isSiteAdmin && (
            <Link href="/board/admin">
              <a
                className={`rounded border border-border2 bg-darkBg2 px-2.5 py-1.5 text-[13px] ${
                  inAdmin ? "text-landing-goldLight" : "text-landing-bodySecondary"
                }`}
              >
                관리
              </a>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const BoardLayout = ({ children }: { children: ReactNode }) => (
  <BoardToastProvider>
    <div className="min-h-screen w-full overflow-x-hidden bg-landing-bg leading-[1.6] text-landing-body">
      <BoardNav />
      <main className="w-full px-6 pb-24 pt-11">{children}</main>
      <Footer />
    </div>
  </BoardToastProvider>
);

/** 게시판 페이지끼리 같은 레이아웃 인스턴스를 공유하게 해 토스트가 이동 중에도 살아 있게 한다. */
export const getBoardLayout = (page: ReactNode) => <BoardLayout>{page}</BoardLayout>;

export default BoardLayout;
