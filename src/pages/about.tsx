import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image, { StaticImageData } from "next/image";
import AnchorNav from "@/components/layout/AnchorNav";
import DiscordIcon from "@/components/ui/DiscordIcon";
import MainLogo from "@/assets/images/mainLogo.png";
import Footer from "@/components/layout/Footer";
import { DISCORD_INVITE_URL } from "@/constants/links";
import dashboard from "@/assets/aboutImages/dashboard.png";
import replayDownload from "@/assets/aboutImages/download.png";
import replayUpload from "@/assets/aboutImages/upload.png";
import featureMatchDetail from "@/assets/aboutImages/feature-match-detail.png";
import featureChampStats from "@/assets/aboutImages/feature-champ-stats.png";
import featureH2h from "@/assets/aboutImages/feature-h2h.png";

interface ShotProps {
  src: StaticImageData;
  alt: string;
  onOpen: (src: string) => void;
  browserBar?: string;
}

const Shot = ({ src, alt, onOpen, browserBar }: ShotProps) => (
  <button
    type="button"
    onClick={() => onOpen(src.src)}
    className="about-shot block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-white/[0.08] bg-[#15171B] text-left"
  >
    {browserBar && (
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-3.5 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2.5 font-mono text-[11px] text-[#6C727A]">{browserBar}</span>
      </div>
    )}
    <Image src={src} alt={alt} sizes="(max-width: 900px) 100vw, 560px" className="h-auto w-full" />
  </button>
);

const SECTIONS = [
  { id: "features", label: "키포인트" },
  { id: "flow", label: "사용법" },
];

const FEATURES = [
  {
    img: featureMatchDetail,
    alt: "경기 상세 — 팀 스코어보드",
    tag: "경기 상세",
    tagColor: "#6BB8FF",
    tagBg: "rgba(107,184,255,0.1)",
    tagBorder: "rgba(107,184,255,0.3)",
    title: "경기 하나하나를 완벽하게",
    body: (
      <>
        팀 스코어보드부터 <b style={{ color: "#6BB8FF" }}>빌드·KDA·관여율·가한/받은 피해·시야</b>
        까지, 리플레이 기반의 풀 데이터로 경기를 낱낱이 복기할 수 있습니다.
      </>
    ),
    reverse: false,
  },
  {
    img: featureChampStats,
    alt: "챔피언 통계 — 챔피언별 KDA·승률 랭킹",
    tag: "챔피언 통계",
    tagColor: "#C8AA6E",
    tagBg: "rgba(200,170,110,0.1)",
    tagBorder: "rgba(200,170,110,0.3)",
    title: "챔피언별 성적을 깊이 있게",
    body: (
      <>
        시즌·기간별로 챔피언마다 <b style={{ color: "#C8AA6E" }}>KDA·판수·승률</b>을 정렬해 보고,
        포지션 필터로 내 주력 챔피언과 숙련도를 한눈에 파악하세요.
      </>
    ),
    reverse: true,
  },
  {
    img: featureH2h,
    alt: "상대전적 H2H — 라이벌 분석",
    tag: "상대전적 (H2H)",
    tagColor: "#8AA0FF",
    tagBg: "rgba(88,101,242,0.12)",
    tagBorder: "rgba(88,101,242,0.3)",
    title: "라이벌과의 모든 대결을 한눈에",
    body: (
      <>
        직접 대결 승률과 라이벌 히스토리,{" "}
        <b style={{ color: "#8AA0FF" }}>평균 지표 비교·라인 매트릭스·인사이트</b>까지. 누가 우위에
        있는지 데이터로 결판냅니다.
      </>
    ),
    reverse: false,
  },
];

const About: NextPage = () => {
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const prime = (el: HTMLElement) => {
      el.style.setProperty("opacity", "0");
      el.style.setProperty("transform", "translateY(28px)");
      el.style.setProperty(
        "transition",
        "opacity .7s cubic-bezier(.16,.84,.44,1), transform .7s cubic-bezier(.16,.84,.44,1)"
      );
    };
    const reveal = (el: HTMLElement) => {
      el.style.setProperty("transition-delay", `${el.dataset.delay || 0}ms`);
      el.style.setProperty("opacity", "1");
      el.style.setProperty("transform", "none");
    };
    els.forEach(prime);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            reveal(e.target as HTMLElement);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="about-root w-full bg-[#0a0b0d] text-[#C4CBD4]">
      <Head>
        <title>서비스 소개 | GMOK</title>
        <meta
          name="description"
          content="게임의 모든 순간을 클랜과 함께. 리플레이 업로드로 전적·통계·랭킹이 쌓이는 우리 클랜만의 전적 사이트."
        />
      </Head>

      <AnchorNav items={SECTIONS} />

      <div className="overflow-x-hidden">
        {/* HERO */}
        <header
          id="top"
          className="relative w-full overflow-hidden px-6 pb-24 pt-20 md:pb-28 md:pt-28"
        >
          <div className="about-glow-a pointer-events-none absolute left-1/2 top-[-160px] h-[600px] w-[900px] max-w-full -translate-x-1/2" />
          <div className="about-glow-b pointer-events-none absolute right-[-80px] top-[60px] h-[520px] w-[520px]" />
          <div className="relative mx-auto max-w-[1000px] text-center">
            <div
              data-reveal
              className="mb-7 inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5"
              style={{
                borderColor: "rgba(200,170,110,0.35)",
                background: "rgba(200,170,110,0.08)",
              }}
            >
              <span
                className="h-[7px] w-[7px] rounded-full"
                style={{ background: "#C8AA6E", boxShadow: "0 0 10px #C8AA6E" }}
              />
              <span className="text-[13px] font-bold tracking-wide text-[#E8D6A8]">
                우리 클랜만을 위한 전적 사이트
              </span>
            </div>
            <h1
              data-reveal
              data-delay="60"
              className="m-0 mb-5 font-bold text-[#F5F8FC]"
              style={{
                fontSize: "clamp(38px,6.4vw,76px)",
                lineHeight: 1.08,
                letterSpacing: "-1.5px",
              }}
            >
              게임의 모든 순간을
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(120deg, rgb(232,214,168) 0%, rgb(200,170,110) 45%, rgb(107,184,255) 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                클랜과 함께
              </span>
            </h1>
            <p
              data-reveal
              data-delay="120"
              className="mx-auto mb-9 max-w-[640px] text-[#9BA3AD]"
              style={{ fontSize: "clamp(16px,2vw,19px)", lineHeight: 1.7 }}
            >
              게임이 끝나면 사라지는 순간들, 이제 리플레이 업로드로 남겨두세요.
              <br />
              전적·통계·랭킹이 두고두고 쌓이는 우리 클랜만의 전적 사이트.
            </p>
            <div
              data-reveal
              data-delay="180"
              className="mb-4 flex flex-wrap justify-center gap-3.5"
            >
              <a
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 rounded-xl bg-[#5865F2] px-7 py-3.5 text-base font-bold text-white shadow-[0_10px_30px_rgba(88,101,242,0.4)] transition hover:-translate-y-0.5"
              >
                <DiscordIcon />
                디스코드로 시작하기
              </a>
              <a
                href="#flow"
                className="inline-flex items-center gap-2 rounded-xl border px-6 py-3.5 text-base font-bold text-[#E8EDF3]"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(200,170,110,0.4)",
                }}
              >
                사용법 살펴보기
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>
            <p data-reveal data-delay="220" className="m-0 text-[13px] text-[#5E656E]">
              클라이언트 설치 불필요 · 기본 전적 검색 무료 · 디스코드로 바로 시작
            </p>

            <div
              data-reveal
              data-delay="120"
              className="relative mx-auto mt-12 max-w-[1000px] md:mt-16"
            >
              <button
                type="button"
                onClick={() => setLightbox(dashboard.src)}
                className="block w-full cursor-zoom-in overflow-hidden rounded-t-2xl border border-b-0 border-white/[0.08] text-left shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
              >
                <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-[#15171B] px-4 py-3">
                  <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
                  <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
                  <span className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
                  <span className="ml-3.5 font-mono text-xs text-[#6C727A]">gmok.kr</span>
                </div>
                <Image
                  src={dashboard}
                  alt="GMOK 전적 화면"
                  sizes="100vw"
                  className="h-auto w-full"
                  priority
                />
              </button>
            </div>
          </div>
        </header>

        {/* KPI */}
        <section className="w-full border-y border-white/[0.05] bg-[#0C0D10] px-6 py-14 md:py-16">
          <div
            className="mx-auto grid max-w-[1160px] gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))" }}
          >
            {[
              {
                big: "무료",
                bigColor: "#C8AA6E",
                t: "기본 전적 검색",
                d: "고급 기능은 추후 유료화 예정",
              },
              {
                big: "디스코드",
                bigColor: "#6BB8FF",
                t: "로그인 한 번",
                d: "별도 회원가입 없음",
              },
              { big: "클랜", bigColor: "#C8AA6E", t: "커뮤니티 통계", d: "랭킹 · 상대전적" },
              {
                big: "부캐",
                bigColor: "#6BB8FF",
                t: "계정 통합 집계",
                d: "본캐에 전적 합산",
              },
            ].map((k, i) => (
              <div
                key={k.t}
                data-reveal
                data-delay={i * 80}
                className="rounded-2xl border border-white/[0.06] p-6"
                style={{ background: "linear-gradient(160deg,#15181D,#101216)" }}
              >
                <div
                  className="font-bold"
                  style={{
                    fontSize: "clamp(30px,3.4vw,40px)",
                    color: k.bigColor,
                    letterSpacing: "-1px",
                  }}
                >
                  {k.big}
                </div>
                <div className="mt-1.5 text-[15px] font-bold text-[#E8EDF3]">{k.t}</div>
                <div className="mt-1 text-[13px] text-[#8A929C]">{k.d}</div>
              </div>
            ))}
          </div>
        </section>

        {/* KEY FEATURES */}
        <section id="features" className="w-full px-6 py-20 md:py-28">
          <div className="mx-auto max-w-[1160px]">
            <div data-reveal className="mb-12 text-center md:mb-16">
              <div className="mb-5 text-sm font-bold tracking-[1.5px] text-[#C8AA6E]">
                KEY POINTS
              </div>
              <h2
                className="m-0 mb-6 font-bold text-[#F1F5FA]"
                style={{ fontSize: "clamp(28px,4.2vw,46px)", letterSpacing: "-1px" }}
              >
                우리 전적 사이트가 보여주는 것들
              </h2>
              <p className="mx-auto max-w-[600px] text-[17px] text-[#8A929C]">
                경기 상세부터 챔피언 통계·상대전적까지, 실제 화면 그대로.
              </p>
            </div>
            <div className="flex flex-col gap-16 md:gap-24">
              {FEATURES.map((f) => {
                const text = (
                  <div className={`max-w-[460px] ${f.reverse ? "md:justify-self-end" : ""}`}>
                    <span
                      className="mb-4 inline-block rounded-full border px-3 py-1.5 text-xs font-bold"
                      style={{ color: f.tagColor, background: f.tagBg, borderColor: f.tagBorder }}
                    >
                      {f.tag}
                    </span>
                    <h3
                      className="m-0 mb-3 font-bold text-[#F1F5FA]"
                      style={{ fontSize: "clamp(22px,2.6vw,28px)", letterSpacing: "-0.5px" }}
                    >
                      {f.title}
                    </h3>
                    <p className="m-0 text-base leading-[1.75] text-[#9BA3AD]">{f.body}</p>
                  </div>
                );
                const shot = <Shot src={f.img} alt={f.alt} onOpen={setLightbox} />;
                return (
                  <div
                    key={f.title}
                    data-reveal
                    className="grid items-center gap-8 md:gap-14"
                    style={{ gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))" }}
                  >
                    {f.reverse ? (
                      <>
                        {shot}
                        {text}
                      </>
                    ) : (
                      <>
                        {text}
                        {shot}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FLOW */}
        <section
          id="flow"
          className="w-full border-t border-white/[0.06] bg-[#0C0D10] px-6 py-20 md:py-28"
        >
          <div className="mx-auto max-w-[1200px]">
            <div data-reveal className="mb-12 text-center md:mb-16">
              <div className="mb-5 text-sm font-bold tracking-[1.5px] text-[#C8AA6E]">
                HOW IT WORKS
              </div>
              <h2
                className="m-0 mb-6 font-bold text-[#F1F5FA]"
                style={{ fontSize: "clamp(28px,4.2vw,46px)", letterSpacing: "-1px" }}
              >
                클라이언트에서 웹까지
              </h2>
              <p className="mx-auto max-w-[600px] text-[17px] text-[#8A929C]">
                세 단계면 충분합니다. 리플레이 다운로드부터 전적 집계까지 GMOK이 알아서 이어줍니다.
              </p>
            </div>

            <div className="flex flex-col gap-14 md:gap-24">
              {[
                {
                  n: "01",
                  grad: "linear-gradient(135deg,#E8D6A8,#C8AA6E)",
                  badge: "CLIENT",
                  badgeColor: "#D9BE85",
                  badgeBg: "rgba(200,170,110,0.12)",
                  badgeBorder: "rgba(200,170,110,0.3)",
                  title: "리플레이 파일 다운로드",
                  body: (
                    <>
                      경기가 끝나면 롤 클라이언트 <b style={{ color: "#E8EDF3" }}>대전 기록</b>에서
                      내전 경기의 <b style={{ color: "#E8EDF3" }}>다운로드 버튼(↓)</b>을 눌러{" "}
                      <b style={{ color: "#E8EDF3" }}>.rofl</b> 파일을 받아 둡니다. 리플레이는 현재
                      패치의 경기만 받을 수 있습니다.
                    </>
                  ),
                  img: replayDownload,
                  alt: "리플레이 파일 다운로드 — 클라이언트 대전 기록",
                  bar: "League of Legends · 대전 기록",
                  reverse: false,
                },
                {
                  n: "02",
                  grad: "linear-gradient(135deg,#E8D6A8,#C8AA6E)",
                  badge: "WEB",
                  badgeColor: "#D9BE85",
                  badgeBg: "rgba(200,170,110,0.12)",
                  badgeBorder: "rgba(200,170,110,0.3)",
                  title: "리플레이 파일 업로드",
                  body: (
                    <>
                      상단 메뉴의 <b style={{ color: "#E8EDF3" }}>리플레이 업로드</b>에 받은{" "}
                      <b style={{ color: "#E8EDF3" }}>.rofl</b> 파일을 드래그&amp;드롭하면 끝. 한
                      번에 최대 10개까지 올릴 수 있고, 이미 등록된 경기는 중복으로 쌓이지 않습니다.
                    </>
                  ),
                  img: replayUpload,
                  alt: "리플레이 파일 업로드 — gmok.kr 리플레이 업로드",
                  bar: "gmok.kr · 리플레이 업로드",
                  reverse: true,
                },
                {
                  n: "03",
                  grad: "linear-gradient(135deg,#E8D6A8,#C8AA6E)",
                  badge: "WEB",
                  badgeColor: "#D9BE85",
                  badgeBg: "rgba(200,170,110,0.12)",
                  badgeBorder: "rgba(200,170,110,0.3)",
                  title: "전적 확인",
                  body: (
                    <>
                      업로드가 끝나면{" "}
                      <span style={{ color: "#C8AA6E" }} className="font-mono">
                        gmok.kr
                      </span>
                      에서 모스트 픽·포지션 승률·KDA·랭킹이 자동으로 집계되어 한눈에 확인됩니다.
                    </>
                  ),
                  img: dashboard,
                  alt: "전적 확인 — gmok.kr 대시보드",
                  bar: "gmok.kr",
                  reverse: false,
                },
              ].map((s) => {
                const text = (
                  <div className={`max-w-[460px] ${s.reverse ? "md:justify-self-end" : ""}`}>
                    <div
                      className="mb-4.5 inline-flex items-center gap-3"
                      style={{ marginBottom: 18 }}
                    >
                      <span
                        className="font-bold"
                        style={{
                          fontSize: "clamp(52px,6vw,72px)",
                          background: s.grad,
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          color: "transparent",
                          lineHeight: 0.9,
                        }}
                      >
                        {s.n}
                      </span>
                      <span
                        className="rounded-full border px-3 py-1.5 text-xs font-bold tracking-wide"
                        style={{
                          color: s.badgeColor,
                          background: s.badgeBg,
                          borderColor: s.badgeBorder,
                        }}
                      >
                        {s.badge}
                      </span>
                    </div>
                    <h3
                      className="m-0 mb-3.5 font-bold text-[#F1F5FA]"
                      style={{ fontSize: "clamp(24px,3vw,32px)", letterSpacing: "-0.5px" }}
                    >
                      {s.title}
                    </h3>
                    <p className="m-0 text-base leading-[1.75] text-[#9BA3AD]">{s.body}</p>
                  </div>
                );
                const shot = (
                  <Shot src={s.img} alt={s.alt} onOpen={setLightbox} browserBar={s.bar} />
                );
                return (
                  <div
                    key={s.n}
                    data-reveal
                    className="grid items-center gap-8 md:gap-16"
                    style={{ gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))" }}
                  >
                    {s.reverse ? (
                      <>
                        {shot}
                        {text}
                      </>
                    ) : (
                      <>
                        {text}
                        {shot}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="start" className="relative w-full overflow-hidden px-6 py-20 md:py-28">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[900px] max-w-full -translate-x-1/2 -translate-y-1/2"
            style={{
              background: "radial-gradient(closest-side,rgba(88,101,242,0.22),transparent 70%)",
            }}
          />
          <div
            data-reveal
            className="relative mx-auto max-w-[760px] rounded-3xl border border-white/[0.08] px-8 py-12 text-center shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)] md:py-16"
            style={{ background: "linear-gradient(180deg,#15181D,#0D0F13)" }}
          >
            <Image
              src={MainLogo}
              alt="gmok"
              width={120}
              height={120}
              className="about-float mx-auto mb-4.5 h-[120px] w-[120px] object-contain"
              style={{ marginBottom: 18 }}
            />
            <h2
              className="m-0 mb-3.5 font-bold text-[#F5F8FC]"
              style={{ fontSize: "clamp(28px,4.4vw,44px)", letterSpacing: "-1px" }}
            >
              지금 바로 내전을 시작하세요
            </h2>
            <p className="mx-auto mb-8 max-w-[480px] text-[17px] text-[#9BA3AD]">
              디스코드에 봇을 초대하고 결과를 <b style={{ color: "#E8EDF3" }}>업로드</b>하면 끝.
            </p>
            <div className="flex flex-wrap justify-center gap-3.5">
              <a
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 rounded-xl bg-[#5865F2] px-7 py-3.5 text-base font-bold text-white shadow-[0_10px_30px_rgba(88,101,242,0.4)] transition hover:-translate-y-0.5"
              >
                <DiscordIcon />
                디스코드로 시작하기
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      {lightbox && (
        <button
          type="button"
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-[#050608]/90 p-8 backdrop-blur-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="확대 이미지"
            className="max-h-[90%] max-w-[94%] rounded-xl border border-white/[0.12] shadow-[0_40px_120px_rgba(0,0,0,0.8)]"
          />
          <span className="fixed right-7 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.15] bg-white/[0.08] text-2xl text-white">
            ✕
          </span>
        </button>
      )}

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        .about-glow-a {
          background: radial-gradient(closest-side, rgba(43, 111, 219, 0.3), transparent 70%);
          animation: gmokGlow 7s ease-in-out infinite;
        }
        .about-glow-b {
          background: radial-gradient(closest-side, rgba(200, 170, 110, 0.16), transparent 70%);
          animation: gmokGlow 9s ease-in-out infinite;
        }
        .about-float {
          animation: gmokFloat 6s ease-in-out infinite;
        }
        .about-shot img {
          transition: transform 0.6s ease;
        }
        .about-shot:hover img {
          transform: scale(1.03);
        }
        @keyframes gmokFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-14px);
          }
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
};

export default About;
