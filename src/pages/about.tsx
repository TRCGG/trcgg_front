import type { NextPage } from "next";
import Head from "next/head";
import LandingPage from "@/features/landing/LandingPage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gmok.kr";

const About: NextPage = () => (
  <>
    <Head>
      <title>서비스 소개 - GMOK</title>
      {/* 비로그인 `/`와 같은 화면이라 검색엔진에는 `/` 하나로 모은다. */}
      <link rel="canonical" href={`${SITE_URL}/`} />
    </Head>
    <LandingPage />
  </>
);

export default About;
