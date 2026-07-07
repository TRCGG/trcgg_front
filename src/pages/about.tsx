import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import Link from "next/link";
import { FaDiscord } from "react-icons/fa";
import {
  MdCode,
  MdSportsEsports,
  MdCloudDone,
  MdBarChart,
  MdLeaderboard,
  MdTrendingUp,
  MdCompareArrows,
  MdImage,
  MdArrowForward,
} from "react-icons/md";
import NavBar from "@/components/layout/NavBar";
import Card from "@/components/ui/Card";
import MainLogo from "@/assets/images/mainLogo.png";
import FlowStartScrim from "@/assets/images/about/flow-start-scrim.png";
import FlowNextCode from "@/assets/images/about/flow-next-code.png";
import FlowClientJoin from "@/assets/images/about/flow-client-join.png";
import FlowAutoNextCode from "@/assets/images/about/flow-auto-next-code.png";
import FlowWebStats from "@/assets/images/about/flow-web-stats.png";

/**
 * 공개 서비스 소개 페이지 (/about)
 * Riot 프로덕션 키 심사용 — 심사관이 서비스 목적·유저 플로우를 검증할 수 있도록
 * 한국어 본문 + 영어 병기. 로그인 요구 요소 없음(완전 공개).
 * 계획: docs/plans/TRC-224-서비스-소개-페이지.md
 */

const RIOT_LEGAL =
  "gmok isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends.";

interface FlowStep {
  icon: React.ReactNode;
  ko: string;
  en: string;
  screenshot?: StaticImageData;
  screenshotAlt?: string;
}

const flowSteps: FlowStep[] = [
  {
    icon: <FaDiscord />,
    ko: "디스코드에서 내전 시작 (!내전시작)",
    en: "Start an in-house game on Discord (!내전시작 command)",
    screenshot: FlowStartScrim,
    screenshotAlt: "디스코드에서 !내전시작 명령을 입력하자 봇이 첫 토너먼트 코드를 게시한 화면",
  },
  {
    icon: <MdCode />,
    ko: "봇이 토너먼트 코드 게시",
    en: "The bot posts a tournament code",
    screenshot: FlowNextCode,
    screenshotAlt: "!다음코드 명령에 봇이 다음 판의 토너먼트 코드를 게시한 디스코드 화면",
  },
  {
    icon: <MdSportsEsports />,
    ko: "롤 클라이언트에서 코드로 입장",
    en: "Join the lobby with the code in the LoL client",
    screenshot: FlowClientJoin,
    screenshotAlt: "롤 클라이언트에서 토너먼트 코드를 입력해 로비에 입장하는 팝업 화면",
  },
  {
    icon: <MdCloudDone />,
    ko: "경기 종료 후 자동 기록",
    en: "Results are recorded automatically after the game",
    screenshot: FlowAutoNextCode,
    screenshotAlt: "판이 끝나면 봇이 자동으로 다음 판 코드를 게시한 디스코드 화면",
  },
  {
    icon: <MdBarChart />,
    ko: "웹에서 전적·통계 확인",
    en: "Check match history and stats on the web",
    screenshot: FlowWebStats,
    screenshotAlt: "웹에서 플레이어 요약·최근 전적·팀별 상세를 보여주는 전적 화면",
  },
];

interface Feature {
  icon: React.ReactNode;
  title: string;
  titleEn: string;
  desc: string;
  descEn: string;
}

const features: Feature[] = [
  {
    icon: <MdLeaderboard />,
    title: "전적 · 승률 · 랭킹",
    titleEn: "Match history, win rates & rankings",
    desc: "플레이어별 내전 전적과 승률, 커뮤니티 내 랭킹을 제공합니다.",
    descEn: "Per-player records, win rates, and community rankings.",
  },
  {
    icon: <MdTrendingUp />,
    title: "MMR 지표",
    titleEn: "MMR indicator",
    desc: "내전 결과를 바탕으로 한 실력 지표(MMR)로 밸런스를 파악합니다.",
    descEn: "A skill indicator (MMR) derived from in-house results.",
  },
  {
    icon: <MdCompareArrows />,
    title: "상대전적 (H2H)",
    titleEn: "Head-to-head (H2H)",
    desc: "특정 상대와의 맞대결 전적을 한눈에 비교합니다.",
    descEn: "Compare head-to-head records against a specific opponent.",
  },
];

/** 스크린샷 미제공 상태용 플레이스홀더 (이미지 부재로 빌드가 깨지지 않도록 import하지 않고 아이콘만 사용) */
const ScreenshotSlot = () => (
  <div className="flex h-28 w-full items-center justify-center rounded border border-border2 bg-rankBg3 text-primary2">
    <MdImage className="text-3xl" aria-hidden />
    <span className="ml-2 text-xs">스크린샷 준비 중 / Screenshot coming soon</span>
  </div>
);

const About: NextPage = () => {
  return (
    <>
      <Head>
        <title>서비스 소개 | gmok</title>
        <meta
          name="description"
          content="gmok은 리그 오브 레전드 길드 내전의 전적·통계를 제공하는 무료 서비스입니다. gmok is a free match-history and statistics service for League of Legends guild in-house custom games."
        />
        <meta property="og:title" content="서비스 소개 | gmok" />
        <meta
          property="og:description"
          content="길드 내전 전적·통계 서비스 (무료) — Free match-history & stats service for LoL guild in-house custom games."
        />
      </Head>

      <div className="flex w-full flex-col items-center px-4 pb-20 text-primary1">
        <div className="w-full max-w-3xl">
          <div className="mb-2 mt-4">
            <NavBar />
          </div>

          {/* 1. Hero */}
          <section className="flex flex-col items-center py-10 text-center sm:py-16">
            <div className="flex h-32 w-32 sm:h-40 sm:w-40">
              <Image src={MainLogo} alt="gmok 로고" width={160} height={160} priority />
            </div>
            <h1 className="mt-6 text-xl font-bold leading-snug sm:text-3xl">
              길드 내전 전적·통계 서비스 — 무료
            </h1>
            <p className="mt-2 text-sm text-primary2 sm:text-base">
              Free match-history &amp; stats service for LoL guild in-house custom games
            </p>
            <Link href="/">
              <span className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded bg-blueButton px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blueHover sm:text-base">
                전적 검색하러 가기
                <MdArrowForward aria-hidden />
              </span>
            </Link>
          </section>

          {/* 2. 유저 플로우 */}
          <section className="py-10">
            <h2 className="text-lg font-bold sm:text-2xl">
              이용 방법 <span className="text-primary2">/ How it works</span>
            </h2>
            <p className="mt-1 text-sm text-primary2">
              토너먼트 코드로 내전 결과를 자동 기록합니다.
              <br className="hidden sm:block" />
              In-house results are collected automatically via tournament codes.
            </p>

            <ol className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {flowSteps.map((step, idx) => (
                <li key={step.en}>
                  <Card className="flex h-full flex-col gap-3 p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blueButton text-sm font-bold text-white">
                        {idx + 1}
                      </span>
                      <span className="text-2xl text-blueText" aria-hidden>
                        {step.icon}
                      </span>
                    </div>
                    {step.screenshot ? (
                      <a
                        href={step.screenshot.src}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full"
                      >
                        <div className="w-full cursor-zoom-in overflow-hidden rounded border border-border2">
                          <Image
                            src={step.screenshot}
                            alt={step.screenshotAlt || step.ko}
                            layout="responsive"
                          />
                        </div>
                        <p className="mt-1 text-right text-xs text-primary2">
                          클릭해서 크게 보기 / Click to enlarge
                        </p>
                      </a>
                    ) : (
                      <ScreenshotSlot />
                    )}
                    <div>
                      <p className="text-sm font-medium text-primary1">{step.ko}</p>
                      <p className="mt-1 text-xs text-primary2">{step.en}</p>
                    </div>
                  </Card>
                </li>
              ))}
            </ol>

            <p className="mt-5 text-xs leading-relaxed text-primary2 sm:text-sm">
              현재는 경기 종료 후 리플레이 파일(.rofl)을 업로드하는 방식도 병행 운영합니다. 토너먼트
              코드 방식은 밴픽·정확한 경기 시각까지 자동으로 수집해 기록 누락을 줄여줍니다.
              <br />
              We also support the current flow of uploading replay (.rofl) files after a game. The
              tournament-code flow additionally captures ban/pick and exact timestamps
              automatically, reducing missing records.
            </p>
          </section>

          {/* 3. 주요 기능 */}
          <section className="py-10">
            <h2 className="text-lg font-bold sm:text-2xl">
              주요 기능 <span className="text-primary2">/ Key features</span>
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {features.map((f) => (
                <Card key={f.titleEn} className="flex h-full flex-col gap-2 p-5">
                  <span className="text-3xl text-blueText" aria-hidden>
                    {f.icon}
                  </span>
                  <h3 className="mt-1 text-base font-bold text-primary1">{f.title}</h3>
                  <p className="text-xs text-primary2">{f.titleEn}</p>
                  <p className="mt-2 text-sm text-primary1">{f.desc}</p>
                  <p className="text-xs text-primary2">{f.descEn}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* 4. 운영 정보 */}
          <section className="py-10">
            <h2 className="text-lg font-bold sm:text-2xl">
              운영 정보 <span className="text-primary2">/ About the service</span>
            </h2>
            <Card className="mt-6 flex flex-col gap-4 p-5">
              <div>
                <p className="text-sm text-primary1">
                  gmok은 무료·비상업 서비스입니다. 상금, 참가비, 도박 요소가 없습니다.
                </p>
                <p className="mt-1 text-xs text-primary2">
                  gmok is a free, non-commercial service. There are no prize pools, no entry fees,
                  and no gambling elements.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <FaDiscord className="text-xl text-blueText" aria-hidden />
                <p className="text-sm text-primary1">
                  문의는 디스코드로 받습니다.
                  <span className="ml-1 text-xs text-primary2">Contact us on Discord.</span>
                </p>
              </div>
              <hr className="border-t border-border2" />
              <p className="text-xs leading-relaxed text-primary2">{RIOT_LEGAL}</p>
            </Card>
          </section>
        </div>
      </div>
    </>
  );
};

export default About;
