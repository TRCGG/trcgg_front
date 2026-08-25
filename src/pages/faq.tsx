import type { ReactNode } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import AnchorNav from "@/components/layout/AnchorNav";
import DiscordIcon from "@/components/ui/DiscordIcon";
import Footer from "@/components/layout/Footer";
import { DISCORD_INVITE_URL } from "@/constants/links";

const Code = ({ children }: { children: ReactNode }) => (
  <span className="rounded-[5px] bg-white/[0.06] px-[7px] py-0.5 font-mono text-[13.5px] text-[#C8D0DA]">
    {children}
  </span>
);

const DiscordLink = ({ children }: { children: ReactNode }) => (
  <a
    href={DISCORD_INVITE_URL}
    target="_blank"
    rel="noreferrer"
    className="font-bold text-[#8AA0FF] hover:text-[#B0BEFF]"
  >
    {children}
  </a>
);

const Menu = ({ children }: { children: ReactNode }) => (
  <b className="text-[#C8D0DA]">{children}</b>
);

interface FaqItem {
  q: string;
  a: ReactNode;
  /** 정책성 안내 등 특히 눈에 띄어야 하는 항목은 골드 테두리로 강조한다. */
  highlight?: boolean;
}

interface FaqCategory {
  id: string;
  label: string;
  items: FaqItem[];
}

const CATEGORIES: FaqCategory[] = [
  {
    id: "cat-start",
    label: "시작하기",
    items: [
      {
        q: "GMOK은 어떤 서비스인가요?",
        a: "리그 오브 레전드 내전(커스텀 게임) 전적을 기록하고 통계를 제공하는 서비스입니다. 클랜이 치른 내전의 리플레이 파일을 업로드하면 전적·랭킹·상대전적을 웹에서 확인할 수 있습니다.",
      },
      {
        q: "우리 클랜도 사용할 수 있나요?",
        a: (
          <>
            네. <DiscordLink>디스코드 지원 서버</DiscordLink>로 문의해 주시면 클랜 등록을 안내해
            드립니다.
          </>
        ),
      },
      {
        q: "로그인했는데 “소속된 클랜이 없습니다”라고 나와요.",
        a: (
          <>
            GMOK에 등록된 클랜(디스코드 서버)에 소속된 계정만 서비스를 이용할 수 있습니다. 소속
            클랜이 아직 등록되지 않았다면 <DiscordLink>디스코드 지원 서버</DiscordLink>로 문의해
            주세요.
          </>
        ),
      },
      {
        q: "이용 요금이 있나요?",
        a: "전적 기록·조회 등 핵심 기능은 무료이며, 서비스는 광고 수익으로 운영됩니다. 추후 광고 제거 등 부가 기능을 제공하는 유료 멤버십이 추가될 수 있습니다.",
      },
    ],
  },
  {
    id: "cat-record",
    label: "전적 기록",
    items: [
      {
        q: "리플레이 파일은 어디서 받나요?",
        a: (
          <>
            롤 클라이언트의 대전 기록에서 경기를 선택해 다운로드하면{" "}
            <Code>문서\League of Legends\Replays</Code> 폴더에 저장됩니다. 현재 패치의 경기만 받을
            수 있으니 내전 직후 받아 두는 것을 권장합니다.
          </>
        ),
      },
      {
        q: "업로드가 실패해요.",
        a: (
          <>
            <p className="m-0 mb-3 text-[15px] leading-[1.85] text-[#9BA3AD]">
              다음을 확인해 주세요.
            </p>
            <ul className="m-0 list-disc pl-5 text-[15px] leading-[1.9] text-[#9BA3AD]">
              <li>
                확장자가 <Code>.rofl</Code>인지 (다른 파일은 처리되지 않습니다)
              </li>
              <li>이미 등록된 경기인지 (같은 경기는 중복 등록되지 않습니다)</li>
              <li>파일당 50MB, 한 번에 10개 이하인지</li>
            </ul>
          </>
        ),
      },
      {
        q: "리플레이 업로드 메뉴가 안 보여요.",
        a: "업로드는 클랜 운영진에게 권한을 받은 멤버만 할 수 있습니다. 클랜 운영진에게 권한을 요청해 주세요.",
      },
      {
        q: "솔로랭크나 일반 게임 전적도 보이나요?",
        a: "아니요. GMOK은 내전(커스텀 게임) 전적만 기록합니다.",
      },
      {
        q: "예전 내전 기록도 등록할 수 있나요?",
        a: "네. 리플레이 파일만 있다면 언제 치른 경기든 업로드해 등록할 수 있습니다.",
      },
    ],
  },
  {
    id: "cat-view",
    label: "전적 조회",
    items: [
      {
        q: "왜 로그인해야 전적을 볼 수 있나요?",
        a: "전적은 해당 경기가 기록된 클랜에 소속된 이용자에게만 공개됩니다. 로그인하지 않은 방문자에게는 경기 데이터를 제공하지 않으며, 검색엔진에도 색인되지 않습니다. 클랜 내부 기록을 외부에 노출하지 않기 위한 정책입니다.",
        highlight: true,
      },
      {
        q: "부캐 전적을 본캐로 합칠 수 있나요?",
        a: (
          <>
            네. 클랜 운영진이 <Menu>클랜 관리 › 부캐 관리</Menu>에서 부계정을 본계정에 연결하면
            전적이 합산됩니다.
          </>
        ),
      },
      {
        q: "업로드한 경기는 언제 반영되나요?",
        a: "업로드가 완료되면 바로 전적에 반영됩니다.",
      },
    ],
  },
  {
    id: "cat-account",
    label: "계정 · 개인정보",
    items: [
      {
        q: "제 전적을 비공개하거나 삭제하고 싶어요.",
        a: (
          <>
            비공개(조회 미노출)는 클랜 운영진에게 요청해 주세요. 운영진이{" "}
            <Menu>클랜 관리 › 클랜원 상태 관리</Menu>에서 계정을 비활성화하면 전적 검색·유저 분석에
            노출되지 않습니다. 기록 자체의 삭제를 원하시면{" "}
            <DiscordLink>디스코드 지원 서버</DiscordLink>로 요청해 주세요.
          </>
        ),
      },
      {
        q: "GMOK이 수집하는 정보는 무엇인가요?",
        a: (
          <>
            디스코드 계정 기본 정보와 리플레이 파일에 포함된 경기 데이터입니다. 자세한 항목은{" "}
            <Link href="/privacy">
              <span className="cursor-pointer font-bold text-[#8AA0FF] hover:text-[#B0BEFF]">
                개인정보처리방침
              </span>
            </Link>
            에서 확인할 수 있습니다.
          </>
        ),
      },
      {
        q: "Riot Games 공식 서비스인가요?",
        a: "아니요. GMOK은 독립적인 커뮤니티 서비스이며 Riot Games와 제휴·보증 관계가 없습니다.",
      },
    ],
  },
];

const FaqCard = ({ item }: { item: FaqItem }) => (
  <div
    className={`rounded-[14px] border bg-[#121418] px-7 py-6 ${
      item.highlight ? "border-[#C8AA6E]/[0.26]" : "border-white/[0.07]"
    }`}
  >
    <h3 className="m-0 mb-2.5 text-[17px] font-bold leading-[1.5] text-[#EAF0F6]">{item.q}</h3>
    {typeof item.a === "string" ? (
      <p className="m-0 text-[15px] leading-[1.85] text-[#9BA3AD]">{item.a}</p>
    ) : (
      <div className="text-[15px] leading-[1.85] text-[#9BA3AD]">{item.a}</div>
    )}
  </div>
);

const Faq: NextPage = () => (
  <div className="w-full bg-[#0a0b0d] text-[#C4CBD4]">
    <Head>
      <title>자주 묻는 질문 | GMOK</title>
      <meta
        name="description"
        content="GMOK 자주 묻는 질문 — 리그 오브 레전드 내전 전적 기록, 리플레이(.rofl) 업로드, 전적 조회 권한, 계정·개인정보에 대한 안내."
      />
    </Head>

    <AnchorNav items={CATEGORIES} />

    <div className="overflow-x-hidden">
      {/* HERO */}
      <header
        id="top"
        className="relative w-full overflow-hidden px-6 pb-10 pt-14 md:pb-14 md:pt-24"
      >
        <div className="faq-glow pointer-events-none absolute left-1/2 top-[-200px] h-[520px] w-[900px] max-w-full -translate-x-1/2" />
        <div className="relative mx-auto max-w-[860px] text-center">
          <div className="mb-3.5 text-sm font-bold tracking-[1.5px] text-[#C8AA6E]">FAQ</div>
          <h1
            className="m-0 mb-4 font-bold text-[#F5F8FC]"
            style={{ fontSize: "clamp(32px,5vw,54px)", lineHeight: 1.15, letterSpacing: "-1.2px" }}
          >
            자주 묻는 질문
          </h1>
          <p className="mx-auto max-w-[600px] text-[17px] leading-[1.7] text-[#8A929C]">
            GMOK 이용 중 궁금한 점을 모았습니다. 찾는 답이 없다면 디스코드로 문의해 주세요.
          </p>
        </div>
      </header>

      {/* FAQ 본문 */}
      <main className="w-full px-6 pb-16 pt-11 md:pb-28 md:pt-16">
        <div className="mx-auto flex max-w-[860px] flex-col gap-12 md:gap-[72px]">
          {CATEGORIES.map((cat) => (
            <section key={cat.id} id={cat.id} className="scroll-mt-[90px]">
              <div className="mb-[22px] flex items-center gap-3.5">
                <h2
                  className="m-0 font-bold tracking-[-0.4px] text-[#EAF0F6]"
                  style={{ fontSize: "clamp(20px,2.4vw,25px)" }}
                >
                  {cat.label}
                </h2>
                <span className="h-px flex-1 bg-gradient-to-r from-[#C8AA6E]/[0.35] to-transparent" />
              </div>
              <div className="flex flex-col gap-3.5">
                {cat.items.map((item) => (
                  <FaqCard key={item.q} item={item} />
                ))}
              </div>
            </section>
          ))}

          {/* 문의 CTA */}
          <section className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#5865F2]/[0.55] via-[#C8AA6E]/[0.25] to-transparent p-px">
            <div className="rounded-[19px] bg-gradient-to-b from-[#14161B] to-[#0D0F13] px-6 py-8 text-center md:px-11 md:py-12">
              <h2
                className="m-0 mb-2.5 font-bold tracking-[-0.6px] text-[#F1F5FA]"
                style={{ fontSize: "clamp(22px,2.8vw,30px)" }}
              >
                찾는 답이 없으신가요?
              </h2>
              <p className="m-0 mb-6 text-[15.5px] leading-[1.7] text-[#8A929C]">
                클랜 등록 문의, 오류 신고, 기록 삭제 요청 모두 디스코드에서 받고 있습니다.
              </p>
              <a
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 rounded-xl bg-[#5865F2] px-[30px] py-[15px] text-base font-bold text-white shadow-[0_14px_34px_-10px_rgba(88,101,242,0.6)] hover:bg-[#4954da]"
              >
                <DiscordIcon size={20} />
                디스코드 지원 서버 가기
              </a>
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
      .faq-glow {
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

export default Faq;
