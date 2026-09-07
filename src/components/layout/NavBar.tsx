import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import useGuildManagement from "@/hooks/auth/useGuildManagement";

interface NavLeaf {
  href: string;
  label: string;
  /** 활성 판정용 경로. 생략 시 href로 판정한다. */
  matchPath?: string;
}

const ANALYSIS_ITEMS: NavLeaf[] = [
  { href: "/user", label: "유저 분석" },
  { href: "/champion", label: "챔피언 분석" },
];

const baseItemClass = "text-sm pb-1 whitespace-nowrap px-3 border-b-3 transition-colors";
const activeClass = "text-primary1 font-bold border-blueText";
const idleClass = "text-primary2 font-normal border-transparent hover:text-primary1";

const NavBar = () => {
  const router = useRouter();
  const { canUploadReplay } = useGuildManagement();
  const [analysisOpen, setAnalysisOpen] = useState(false);
  // 마우스가 트리거와 메뉴 사이를 지날 때 깜빡이며 닫히지 않도록 닫기를 살짝 늦춘다.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openAnalysis = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setAnalysisOpen(true);
  };
  const closeAnalysis = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setAnalysisOpen(false), 120);
  };

  // 항목을 눌러 이동한 뒤 메뉴가 열린 채로 남지 않게 한다.
  useEffect(() => {
    setAnalysisOpen(false);
  }, [router.asPath]);

  const isAnalysisActive = ANALYSIS_ITEMS.some((item) => router.pathname === item.href);
  const isRecordActive = router.pathname === "/" || router.pathname.startsWith("/summoners");
  const isCompetitionActive = router.pathname.startsWith("/competitions");

  return (
    <nav className="flex h-full items-center">
      <Link href="/">
        <a className={`${baseItemClass} ${isRecordActive ? activeClass : idleClass}`}>내전 전적</a>
      </Link>

      <div
        className="relative flex h-full items-center"
        onMouseEnter={openAnalysis}
        onMouseLeave={closeAnalysis}
      >
        <button
          type="button"
          // 키보드·터치에서도 열 수 있어야 한다(호버만으로는 접근할 수 없다).
          onClick={() => setAnalysisOpen((prev) => !prev)}
          onFocus={openAnalysis}
          aria-expanded={analysisOpen}
          aria-haspopup="true"
          className={`flex items-center gap-1 ${baseItemClass} ${
            isAnalysisActive ? activeClass : idleClass
          }`}
        >
          분석
          <svg
            className={`h-3 w-3 transition-transform ${analysisOpen ? "rotate-180" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {analysisOpen && (
          <div className="absolute left-0 top-full z-30 min-w-[132px] rounded border border-border2 bg-darkBg2 py-1 shadow-xl">
            {ANALYSIS_ITEMS.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={`block whitespace-nowrap px-3 py-2 text-sm hover:bg-grayHover ${
                    router.pathname === item.href
                      ? "font-bold text-primary1"
                      : "text-primary2 hover:text-primary1"
                  }`}
                >
                  {item.label}
                </a>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Link href="/competitions">
        <a className={`${baseItemClass} ${isCompetitionActive ? activeClass : idleClass}`}>대회</a>
      </Link>

      {canUploadReplay && (
        <Link href="/replay">
          <a
            className={`${baseItemClass} ${
              router.pathname === "/replay" ? activeClass : idleClass
            }`}
          >
            리플레이 업로드
          </a>
        </Link>
      )}
    </nav>
  );
};

export default NavBar;
