import type { NextPage } from "next";
import Head from "next/head";
import NoIndex from "@/components/layout/NoIndex";
import LandingPage from "@/features/landing/LandingPage";
import { TOURNAMENT_LANDING } from "@/features/landing/landingContent";

// 메뉴에 노출하지 않는 숨김 페이지. 링크를 아는 사람만 들어온다.
const TournamentLanding: NextPage = () => (
  <>
    <Head>
      <title>토너먼트 코드로 내전하기 - GMOK</title>
    </Head>
    <NoIndex />
    <LandingPage content={TOURNAMENT_LANDING} />
  </>
);

export default TournamentLanding;
