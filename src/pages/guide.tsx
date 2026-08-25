import type { ReactNode } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import InfoPageNav from "@/components/layout/InfoPageNav";
import DiscordIcon from "@/components/ui/DiscordIcon";
import Footer from "@/components/layout/Footer";
import { DISCORD_INVITE_URL } from "@/constants/links";

const Code = ({ children }: { children: ReactNode }) => (
  <span className="rounded-[5px] bg-white/[0.06] px-[7px] py-0.5 font-mono text-[13.5px] text-[#C8D0DA]">
    {children}
  </span>
);

const Menu = ({ children }: { children: ReactNode }) => (
  <b className="text-[#C8D0DA]">{children}</b>
);

const Highlight = ({ children }: { children: ReactNode }) => (
  <b className="text-[#E8D6A8]">{children}</b>
);

const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`rounded-[14px] border border-white/[0.07] bg-[#121418] ${className}`}>
    {children}
  </div>
);

/** 안내 박스. tone 으로 강조색을 바꾼다(discord: 문의 유도, gold: 부가 설명). */
const Note = ({ tone, children }: { tone: "discord" | "gold"; children: ReactNode }) => (
  <div
    className={`rounded-[14px] border px-[26px] py-5 ${
      tone === "discord"
        ? "border-[#5865F2]/25 bg-[#5865F2]/[0.07]"
        : "border-[#C8AA6E]/[0.22] bg-[#C8AA6E]/[0.06]"
    }`}
  >
    <p className="m-0 text-[14.5px] leading-[1.8] text-[#A9B2BD]">{children}</p>
  </div>
);

interface SectionProps {
  id: string;
  step: number;
  title: string;
  /** 제목 옆 보조 라벨(예: 운영진 전용 표시). */
  badge?: string;
  children: ReactNode;
}

const Section = ({ id, step, title, badge, children }: SectionProps) => (
  <section id={id} className="scroll-mt-[90px]">
    <div className="mb-[22px] flex items-center gap-3.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border border-[#C8AA6E]/30 bg-[#C8AA6E]/[0.14] text-[15px] font-bold text-[#E8D6A8]">
        {step}
      </span>
      <h2
        className="m-0 font-bold tracking-[-0.4px] text-[#EAF0F6]"
        style={{ fontSize: "clamp(21px,2.5vw,26px)" }}
      >
        {title}
        {badge && <span className="ml-2 text-sm font-normal text-[#8A929C]">{badge}</span>}
      </h2>
      <span className="h-px flex-1 bg-gradient-to-r from-[#C8AA6E]/[0.35] to-transparent" />
    </div>
    {children}
  </section>
);

const TOC = [
  { id: "s1", label: "GMOK이란" },
  { id: "s2", label: "시작하기" },
  { id: "s3", label: "리플레이 업로드" },
  { id: "s4", label: "전적 보기" },
  { id: "s5", label: "클랜 통계" },
  { id: "s6", label: "클랜 관리" },
];

const START_STEPS = [
  {
    title: "디스코드로 로그인",
    body: "메인 화면의 로그인 버튼을 누르면 디스코드 인증으로 연결됩니다.",
  },
  {
    title: "클랜 선택",
    body: "소속된 클랜(디스코드 서버)이 GMOK에 등록되어 있으면 자동으로 목록에 나타납니다. 여러 클랜에 소속돼 있다면 상단 드롭다운으로 전환할 수 있습니다.",
  },
  {
    title: "소환사 검색",
    body: (
      <>
        검색창에 <Code>닉네임#태그</Code> 형식으로 검색하면 해당 소환사의 내전 전적을 볼 수
        있습니다.
      </>
    ),
  },
];

const RECORD_TABS = [
  {
    tab: "TAB 01",
    tabColor: "text-[#C8AA6E]",
    title: "종합",
    body: "요약 통계, 포지션별 성적, 모스트 픽, 팀워크 통계, 최근 경기 목록. 경기를 펼치면 10인 스코어보드(아이템·룬·스펠 포함)를 볼 수 있습니다.",
  },
  {
    tab: "TAB 02",
    tabColor: "text-[#6BB8FF]",
    title: "챔피언",
    body: "챔피언별 판수·승률·KDA. 포지션·기간 필터를 지원합니다.",
  },
  {
    tab: "TAB 03",
    tabColor: "text-[#8AA0FF]",
    title: "상대전적",
    body: "특정 상대와의 맞대결 기록, 라인별 매치업, 듀오 조합 승률, 연승·연패 흐름.",
  },
];

const CLAN_STATS = [
  {
    title: "챔피언 분석",
    body: "클랜 내전에서 플레이된 챔피언별 판수·승률·KDA 랭킹. 우리 내전에서 어떤 챔피언이 강한지 한눈에 확인할 수 있습니다.",
  },
  {
    title: "유저 분석",
    body: "클랜원별 판수·승률·KDA 랭킹. 클랜 내 순위를 확인할 수 있습니다.",
  },
];

const CLAN_ADMIN = [
  {
    title: "업로드 권한 관리",
    body: "멤버에게 리플레이 업로드 권한을 부여·회수하거나, 전체 업로드 허용을 켤 수 있습니다.",
  },
  {
    title: "클랜원 상태 관리",
    body: "탈퇴한 멤버를 비활성화하면 전적 검색·유저 분석에서 제외됩니다.",
  },
  {
    title: "부캐 관리",
    body: "부계정을 본계정에 연결하면 부캐 전적이 본캐에 합산됩니다.",
  },
];

const Guide: NextPage = () => (
  <div className="w-full bg-[#0a0b0d] text-[#C4CBD4]">
    <Head>
      <title>이용방법 | GMOK</title>
      <meta
        name="description"
        content="GMOK 이용방법 — 리그 오브 레전드 내전 전적 기록 사용법. 로그인·클랜 선택, 리플레이(.rofl) 업로드, 전적·통계 조회, 클랜 관리 안내."
      />
    </Head>

    <InfoPageNav active="guide" />

    <div className="overflow-x-hidden">
      {/* HERO */}
      <header
        id="top"
        className="relative w-full overflow-hidden px-6 pb-10 pt-14 md:pb-14 md:pt-24"
      >
        <div className="guide-glow pointer-events-none absolute left-1/2 top-[-200px] h-[520px] w-[900px] max-w-full -translate-x-1/2" />
        <div className="relative mx-auto max-w-[860px] text-center">
          <div className="mb-3.5 text-sm font-bold tracking-[1.5px] text-[#C8AA6E]">GUIDE</div>
          <h1
            className="m-0 mb-4 font-bold text-[#F5F8FC]"
            style={{ fontSize: "clamp(32px,5vw,54px)", lineHeight: 1.15, letterSpacing: "-1.2px" }}
          >
            이용방법
          </h1>
          <p className="mx-auto max-w-[620px] text-[17px] leading-[1.7] text-[#8A929C]">
            로그인부터 리플레이 업로드, 전적·통계 조회, 클랜 관리까지 — GMOK 사용법을 순서대로
            안내합니다.
          </p>
        </div>
      </header>

      {/* 목차 */}
      <div className="w-full px-6 pb-11 md:pb-16">
        <div className="mx-auto flex max-w-[860px] flex-wrap justify-center gap-2.5">
          {TOC.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="rounded-full border border-white/[0.08] bg-[#14161B] px-[18px] py-2.5 text-[13.5px] font-bold text-[#C4CBD4] hover:border-[#C8AA6E]/50 hover:text-[#E8D6A8]"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* 본문 */}
      <main className="w-full px-6 pb-16 md:pb-28">
        <div className="mx-auto flex max-w-[860px] flex-col gap-[52px] md:gap-20">
          <Section id="s1" step={1} title="GMOK이란">
            <Card className="flex flex-col gap-4 px-[30px] py-7">
              <p className="m-0 text-[15.5px] leading-[1.85] text-[#9BA3AD]">
                GMOK은 리그 오브 레전드{" "}
                <Highlight>내전(커스텀 게임) 전적 기록·통계 서비스</Highlight>
                입니다. 내전이 끝난 뒤 리플레이 파일(.rofl)을 업로드하면 경기 결과가 자동으로
                분석되어, 클랜(디스코드 서버) 단위의 전적·통계·랭킹을 웹에서 확인할 수 있습니다.
              </p>
              <p className="m-0 text-[15.5px] leading-[1.85] text-[#9BA3AD]">
                솔로랭크·일반 게임 전적은 다루지 않습니다. GMOK이 기록하는 것은 여러분의 클랜이 직접
                치른 내전 경기입니다 — 일반 전적 사이트에서는 볼 수 없는 기록입니다.
              </p>
              <p className="m-0 border-t border-white/[0.06] pt-4 text-[14.5px] leading-[1.8] text-[#8A929C]">
                로그인과 클랜 식별에는 디스코드 계정을 사용합니다. 별도 회원가입은 없습니다.
              </p>
            </Card>
          </Section>

          <Section id="s2" step={2} title="시작하기">
            <div className="flex flex-col gap-3">
              {START_STEPS.map((step, i) => (
                <Card key={step.title} className="flex gap-[18px] px-7 py-6">
                  <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[#5865F2]/[0.14] text-[13px] font-bold text-[#5865F2]">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="m-0 mb-1.5 text-[16.5px] font-bold text-[#EAF0F6]">
                      {step.title}
                    </h3>
                    <p className="m-0 text-[15px] leading-[1.8] text-[#9BA3AD]">{step.body}</p>
                  </div>
                </Card>
              ))}
              <Note tone="discord">
                아직 클랜이 등록돼 있지 않다면{" "}
                <a
                  href={DISCORD_INVITE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-[#8AA0FF] hover:text-[#B0BEFF]"
                >
                  디스코드 지원 서버
                </a>
                로 문의해 주세요.
              </Note>
            </div>
          </Section>

          <Section id="s3" step={3} title="전적 기록하기 — 리플레이 업로드">
            <div className="flex flex-col gap-3">
              <Card className="px-[30px] py-7">
                <p className="m-0 mb-4 text-[15.5px] leading-[1.85] text-[#9BA3AD]">
                  상단 메뉴의 <Highlight>리플레이 업로드</Highlight>에서 <Code>.rofl</Code> 파일을
                  드래그&amp;드롭하면 경기가 자동으로 전적에 반영됩니다.
                </p>
                <ul className="m-0 list-disc pl-5 text-[15px] leading-[1.95] text-[#9BA3AD]">
                  <li>파일당 최대 50MB, 한 번에 최대 10개까지 올릴 수 있습니다.</li>
                  <li>이미 등록된 경기는 중복 등록되지 않습니다.</li>
                  <li>
                    업로드는 클랜 운영진에게 권한을 받은 멤버가 할 수 있습니다. (클랜 설정에 따라
                    전원 허용일 수 있음)
                  </li>
                </ul>
              </Card>
              <Card className="px-[30px] py-7">
                <h3 className="m-0 mb-4 text-[16.5px] font-bold text-[#EAF0F6]">
                  리플레이 파일 받는 법
                </h3>
                <ol className="m-0 mb-[18px] list-decimal pl-5 text-[15px] leading-[1.95] text-[#9BA3AD]">
                  <li>
                    롤 클라이언트에서 <Menu>대전 기록</Menu>을 엽니다.
                  </li>
                  <li>
                    내전 경기를 선택하고 <Menu>다운로드 버튼(↓)</Menu>을 누릅니다.
                  </li>
                  <li>
                    파일은 <Code>문서\League of Legends\Replays</Code> 폴더에 저장됩니다.
                  </li>
                </ol>
                <p className="m-0 border-t border-white/[0.06] pt-4 text-[14.5px] leading-[1.8] text-[#C8AA6E]">
                  리플레이는 현재 패치의 경기만 다운로드할 수 있으니, 내전이 끝나면 바로 받아 두는
                  것을 권장합니다.
                </p>
              </Card>
            </div>
          </Section>

          <Section id="s4" step={4} title="전적 보기">
            <p className="m-0 mb-4 text-[15.5px] leading-[1.8] text-[#8A929C]">
              소환사를 검색하면 세 개의 탭으로 전적을 보여줍니다.
            </p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
              {RECORD_TABS.map((tab) => (
                <Card key={tab.tab} className="px-[26px] py-6">
                  <div className={`mb-2 text-xs font-bold tracking-[0.5px] ${tab.tabColor}`}>
                    {tab.tab}
                  </div>
                  <h3 className="m-0 mb-2 text-[16.5px] font-bold text-[#EAF0F6]">{tab.title}</h3>
                  <p className="m-0 text-[14.5px] leading-[1.8] text-[#9BA3AD]">{tab.body}</p>
                </Card>
              ))}
            </div>
          </Section>

          <Section id="s5" step={5} title="클랜 통계 보기">
            <p className="m-0 mb-4 text-[15.5px] leading-[1.8] text-[#8A929C]">
              개인 전적과 별개로, 상단 메뉴의 <Menu>챔피언 분석</Menu>과 <Menu>유저 분석</Menu>에서
              클랜 전체 단위의 통계를 볼 수 있습니다.
            </p>
            <div className="mb-3 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3">
              {CLAN_STATS.map((item) => (
                <Card key={item.title} className="px-[26px] py-6">
                  <h3 className="m-0 mb-2 text-[16.5px] font-bold text-[#EAF0F6]">{item.title}</h3>
                  <p className="m-0 text-[14.5px] leading-[1.8] text-[#9BA3AD]">{item.body}</p>
                </Card>
              ))}
            </div>
            <Note tone="gold">
              두 화면 모두 포지션 필터, 기간 필터(최근·시즌·월 범위), 판수·승률·KDA 기준 정렬을
              지원합니다.
            </Note>
          </Section>

          <Section id="s6" step={6} title="클랜 관리" badge="운영진">
            <div className="flex flex-col gap-3">
              <Card className="px-[30px] py-7">
                <h3 className="m-0 mb-3.5 text-[16.5px] font-bold text-[#EAF0F6]">들어가는 방법</h3>
                <ol className="m-0 list-decimal pl-5 text-[15px] leading-[1.95] text-[#9BA3AD]">
                  <li>디스코드로 로그인합니다.</li>
                  <li>화면 상단의 프로필 메뉴를 엽니다.</li>
                  <li>
                    <Menu>클랜 관리</Menu>를 선택합니다. 디스코드 운영진 권한이 있는 계정만 접근할
                    수 있습니다.
                  </li>
                </ol>
              </Card>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
                {CLAN_ADMIN.map((item) => (
                  <Card key={item.title} className="px-[26px] py-6">
                    <h3 className="m-0 mb-2 text-base font-bold text-[#EAF0F6]">{item.title}</h3>
                    <p className="m-0 text-[14.5px] leading-[1.8] text-[#9BA3AD]">{item.body}</p>
                  </Card>
                ))}
              </div>
            </div>
          </Section>

          {/* CTA */}
          <section className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#5865F2]/[0.55] via-[#C8AA6E]/[0.25] to-transparent p-px">
            <div className="rounded-[19px] bg-gradient-to-b from-[#14161B] to-[#0D0F13] px-6 py-8 text-center md:px-11 md:py-12">
              <h2
                className="m-0 mb-2.5 font-bold tracking-[-0.6px] text-[#F1F5FA]"
                style={{ fontSize: "clamp(22px,2.8vw,30px)" }}
              >
                더 궁금한 점이 있으신가요?
              </h2>
              <p className="m-0 mb-6 text-[15.5px] leading-[1.7] text-[#8A929C]">
                자주 묻는 질문에서 답을 찾거나, 디스코드로 직접 문의해 주세요.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/faq">
                  <span className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#C8AA6E]/40 bg-white/[0.05] px-7 py-[15px] text-base font-bold text-[#E8EDF3] hover:bg-[#C8AA6E]/10">
                    자주 묻는 질문
                  </span>
                </Link>
                <a
                  href={DISCORD_INVITE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-xl bg-[#5865F2] px-[30px] py-[15px] text-base font-bold text-white shadow-[0_14px_34px_-10px_rgba(88,101,242,0.6)] hover:bg-[#4954da]"
                >
                  <DiscordIcon size={20} />
                  디스코드 문의
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>

    <style jsx global>{`
      html {
        scroll-behavior: smooth;
      }
      .guide-glow {
        background: radial-gradient(closest-side, rgba(43, 111, 219, 0.22), transparent 70%);
        animation: gmokGlow 8s ease-in-out infinite;
      }
      @keyframes gmokGlow {
        0%,
        100% {
          opacity: 0.55;
        }
        50% {
          opacity: 0.9;
        }
      }
    `}</style>
  </div>
);

export default Guide;
