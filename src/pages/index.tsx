import { useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import LandingPage from "@/features/landing/LandingPage";
import SearchHome from "@/features/home/SearchHome";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import { AUTH_HINT_ATTR, AUTH_HINT_KEY } from "@/constants/authHint";
import useDemo from "@/hooks/demo/useDemo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gmok.kr";

const Home: NextPage = () => {
  const { isLoggedIn, isAuthPending } = useGuildManagement();
  const { isDemo } = useDemo();

  useEffect(() => {
    if (isAuthPending || isDemo) return;
    try {
      if (isLoggedIn) localStorage.setItem(AUTH_HINT_KEY, "1");
      else localStorage.removeItem(AUTH_HINT_KEY);
    } catch {
      // 저장소가 막힌 환경이면 소개 화면이 잠깐 비칠 뿐이다.
    }
    document.documentElement.removeAttribute(AUTH_HINT_ATTR);
  }, [isAuthPending, isLoggedIn, isDemo]);

  return (
    <>
      <Head>
        <title>GMOK - 롤 내전 전적·통계</title>
        <link rel="canonical" href={`${SITE_URL}/`} />
      </Head>
      {isLoggedIn ? (
        <SearchHome />
      ) : (
        <div className="landing-gate">
          <LandingPage />
        </div>
      )}
    </>
  );
};

export default Home;
