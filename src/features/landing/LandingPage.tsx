import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import DiscordIcon from "@/components/ui/DiscordIcon";
import DiscordSupportButton from "@/components/ui/DiscordSupportButton";
import SiteNav from "@/components/layout/SiteNav";
import Footer from "@/components/layout/Footer";
import { DISCORD_BOT_INSTALL_URL } from "@/constants/links";
import dashboard from "@/assets/aboutImages/dashboard.png";
import featureMatchDetail from "@/assets/aboutImages/feature-match-detail.png";
import featureChampStats from "@/assets/aboutImages/feature-champ-stats.png";
import featureH2h from "@/assets/aboutImages/feature-h2h.png";
import featureCompetitions from "@/assets/aboutImages/competitions.png";
import colors from "@/styles/colors";
import { withAlpha } from "@/utils/color";
import useDemo from "@/hooks/demo/useDemo";
import SiteLiveTag from "@/features/statistics/SiteLiveTag";
import { LandingContent, REPLAY_LANDING } from "@/features/landing/landingContent";

const HERO_TILT_DEG = 18;
const HERO_TILT_SCALE = 0.06;
// 진행선이 이 높이(뷰포트 비율)를 지날 때 단계가 켜진다.
const FLOW_ACTIVATE_AT = 0.55;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

const moveSpotlight = (e: MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
};

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
    className="about-shot block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-white/[0.08] bg-landing-bgElevated text-left"
  >
    {browserBar && (
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-3.5 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-landing-dotRed" />
        <span className="h-2.5 w-2.5 rounded-full bg-landing-dotAmber" />
        <span className="h-2.5 w-2.5 rounded-full bg-landing-dotGreen" />
        <span className="ml-2.5 font-mono text-[11px] text-landing-micro">{browserBar}</span>
      </div>
    )}
    <Image src={src} alt={alt} sizes="(max-width: 900px) 100vw, 560px" className="h-auto w-full" />
  </button>
);

const FEATURES = [
  {
    img: featureMatchDetail,
    alt: "경기 상세 — 팀 스코어보드",
    tag: "경기 상세",
    tagColor: colors.blueText,
    tagBg: withAlpha(colors.blueText, 0.1),
    tagBorder: withAlpha(colors.blueText, 0.3),
    title: "경기 하나하나를 완벽하게",
    body: (
      <>
        팀 스코어보드부터{" "}
        <b style={{ color: colors.blueText }}>빌드·KDA·관여율·가한/받은 피해·시야</b>
        까지, 리플레이 기반의 풀 데이터로 경기를 낱낱이 복기할 수 있습니다.
      </>
    ),
    reverse: false,
  },
  {
    img: featureChampStats,
    alt: "챔피언 통계 — 챔피언별 KDA·승률 랭킹",
    tag: "챔피언 통계",
    tagColor: colors.landing.gold,
    tagBg: withAlpha(colors.landing.gold, 0.1),
    tagBorder: withAlpha(colors.landing.gold, 0.3),
    title: "챔피언별 성적을 깊이 있게",
    body: (
      <>
        시즌·기간별로 챔피언마다 <b style={{ color: colors.landing.gold }}>KDA·판수·승률</b>을
        정렬해 보고, 포지션 필터로 내 주력 챔피언과 숙련도를 한눈에 파악하세요.
      </>
    ),
    reverse: true,
  },
  {
    img: featureH2h,
    alt: "상대전적 H2H — 라이벌 분석",
    tag: "상대전적 (H2H)",
    tagColor: colors.landing.periwinkle,
    tagBg: withAlpha(colors.landing.discord, 0.12),
    tagBorder: withAlpha(colors.landing.discord, 0.3),
    title: "라이벌과의 모든 대결을 한눈에",
    body: (
      <>
        직접 대결 승률과 라이벌 히스토리,{" "}
        <b style={{ color: colors.landing.periwinkle }}>평균 지표 비교·라인 매트릭스·인사이트</b>
        까지. 누가 우위에 있는지 데이터로 결판냅니다.
      </>
    ),
    reverse: false,
  },
  {
    img: featureCompetitions,
    alt: "클랜 대회 — 팀 로스터와 대회 결과",
    tag: "클랜 대회",
    tagColor: colors.redPopular,
    tagBg: withAlpha(colors.redPopular, 0.1),
    tagBorder: withAlpha(colors.redPopular, 0.3),
    title: "클랜 대회도 GMOK에서",
    body: (
      <>
        참가 신청과 팀 편성부터{" "}
        <b style={{ color: colors.redPopular }}>경기 결과·팀 순위표·대회 통계</b>
        까지. 우리 클랜만의 대회를 열고, 우승 기록을 전적처럼 남겨 보세요.
      </>
    ),
    reverse: true,
  },
];

interface LandingPageProps {
  content?: LandingContent;
}

/** 서비스 소개 화면. `/about`·비로그인 `/`가 기본 내용으로, `/tournament`가 토너먼트 내용으로 쓴다. */
const LandingPage = ({ content = REPLAY_LANDING }: LandingPageProps) => {
  const { hero, cta } = content;
  const [lightbox, setLightbox] = useState<string | null>(null);
  const { enterDemo } = useDemo();
  const heroShotRef = useRef<HTMLButtonElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const flowTrackRef = useRef<HTMLDivElement>(null);
  const flowFillRef = useRef<HTMLDivElement>(null);

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
    const heroShot = heroShotRef.current;
    const flow = flowRef.current;
    const track = flowTrackRef.current;
    const fill = flowFillRef.current;
    if (!heroShot || !flow || !track || !fill) return undefined;

    const steps = Array.from(flow.querySelectorAll<HTMLElement>(".flow-step"));
    const stepCenter = (el: HTMLElement) => el.offsetTop + el.offsetHeight / 2;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      heroShot.style.transform = "none";
      steps.forEach((el) => el.setAttribute("data-active", "true"));
      fill.style.transform = "scaleY(1)";
      return undefined;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;

      const heroTop = heroShot.getBoundingClientRect().top;
      const tilt = clamp01((vh - heroTop) / (vh * 0.9));
      heroShot.style.transform = `rotateX(${(1 - tilt) * HERO_TILT_DEG}deg) scale(${
        1 - (1 - tilt) * HERO_TILT_SCALE
      })`;

      if (steps.length === 0) return;
      // offsetTop 기준이라 data-reveal의 translateY와 무관하게 위치가 고정된다.
      const lineTop = stepCenter(steps[0]);
      const lineHeight = stepCenter(steps[steps.length - 1]) - lineTop;
      track.style.top = `${lineTop}px`;
      track.style.height = `${lineHeight}px`;

      const reach = vh * FLOW_ACTIVATE_AT - flow.getBoundingClientRect().top;
      fill.style.transform = `scaleY(${lineHeight > 0 ? clamp01((reach - lineTop) / lineHeight) : 0})`;
      steps.forEach((el) => el.setAttribute("data-active", String(reach >= stepCenter(el))));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="about-root w-full bg-landing-bg text-landing-body">
      <SiteNav />

      <div className="overflow-x-hidden">
        {/* HERO */}
        <header id="top" className="relative w-full overflow-hidden px-6 pt-20 md:pt-28">
          <div className="about-glow-a pointer-events-none absolute left-1/2 top-[-160px] h-[600px] w-[900px] max-w-full -translate-x-1/2" />
          <div className="about-glow-b pointer-events-none absolute left-1/2 top-[300px] h-[360px] w-[640px] max-w-full -translate-x-1/2 md:top-[380px]" />
          <div className="relative mx-auto max-w-[1000px] text-center">
            {/* 집계가 늦게 도착해도 헤드라인이 밀리지 않게 자리를 미리 잡아 둔다. */}
            <div className="mb-6 flex h-8 justify-center md:mb-8">
              <SiteLiveTag className="motion-safe:animate-fadeUp" />
            </div>
            <h1
              data-reveal
              data-delay="60"
              className="m-0 mb-6 font-bold text-landing-heading md:mb-7"
              style={{
                fontSize: "clamp(38px,6.4vw,76px)",
                lineHeight: 1.08,
                letterSpacing: "-1.5px",
              }}
            >
              {hero.lead}
              <br />
              <span
                className="hero-gradient"
                style={{
                  background: `linear-gradient(120deg, ${colors.landing.goldLight} 0%, ${colors.landing.gold} 22%, ${colors.blueText} 50%, ${colors.landing.gold} 78%, ${colors.landing.goldLight} 100%)`,
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {hero.highlight}
              </span>
            </h1>
            <p
              data-reveal
              data-delay="120"
              className="mx-auto mb-11 max-w-[640px] text-landing-bodySecondary md:mb-14"
              style={{ fontSize: "clamp(16px,2vw,19px)", lineHeight: 1.7 }}
            >
              {hero.description}
            </p>
            <div
              data-reveal
              data-delay="180"
              className="mb-5 flex flex-wrap justify-center gap-3.5"
            >
              <button
                type="button"
                onClick={enterDemo}
                className="inline-flex h-[52px] w-full max-w-[340px] items-center justify-center gap-2.5 rounded-2xl px-6 text-[17px] font-bold transition duration-300 ease-out will-change-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-gold focus-visible:ring-offset-2 focus-visible:ring-offset-landing-bg sm:w-[230px] demo-cta relative overflow-hidden bg-landing-gold text-board-onGold hover:bg-landing-goldLight"
                style={{ boxShadow: `0 12px 32px ${withAlpha(colors.landing.gold, 0.25)}` }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                데모로 체험하기
              </button>
              <a
                href={DISCORD_BOT_INSTALL_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-[52px] w-full max-w-[340px] items-center justify-center gap-2.5 rounded-2xl px-6 text-[17px] font-bold transition duration-300 ease-out will-change-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-gold focus-visible:ring-offset-2 focus-visible:ring-offset-landing-bg sm:w-[230px] border border-white/20 text-landing-heading hover:border-white/40 hover:bg-white/5"
              >
                <DiscordIcon size={20} />
                우리 클랜 등록하기
              </a>
              {hero.issueCodeHref && (
                <Link href={hero.issueCodeHref}>
                  <a className="inline-flex h-[52px] w-full max-w-[340px] items-center justify-center gap-2.5 rounded-2xl px-6 text-[17px] font-bold transition duration-300 ease-out will-change-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-gold focus-visible:ring-offset-2 focus-visible:ring-offset-landing-bg whitespace-nowrap sm:w-auto border border-landing-gold/50 text-landing-goldLight hover:border-landing-gold hover:bg-landing-gold/10">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M3 9a2 2 0 0 0 0 6v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3a2 2 0 0 0 0-6V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1z" />
                      <path d="M13 5v2M13 11v2M13 17v2" />
                    </svg>
                    토너먼트 코드 발급받기
                  </a>
                </Link>
              )}
            </div>
            <ul
              data-reveal
              data-delay="220"
              className="m-0 flex list-none flex-wrap justify-center gap-x-5 gap-y-2 whitespace-nowrap p-0 text-sm text-landing-caption sm:flex-nowrap"
            >
              {hero.points.map((point) => (
                <li key={point} className="flex items-center gap-1.5">
                  <svg
                    className="h-4 w-4 text-landing-gold"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                  {point}
                </li>
              ))}
            </ul>

            <div
              data-reveal
              data-delay="120"
              className="relative mx-auto mt-16 max-w-[1000px] md:mt-24"
              style={{ perspective: 1600 }}
            >
              <button
                ref={heroShotRef}
                type="button"
                onClick={() => setLightbox(dashboard.src)}
                className="block w-full origin-bottom cursor-zoom-in overflow-hidden rounded-t-2xl border border-b-0 border-white/[0.08] text-left shadow-[0_40px_120px_-30px_theme(colors.black/0.9)] will-change-transform"
                style={{
                  transform: `rotateX(${HERO_TILT_DEG}deg) scale(${1 - HERO_TILT_SCALE})`,
                }}
              >
                <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-landing-bgElevated px-4 py-3">
                  <span className="h-[11px] w-[11px] rounded-full bg-landing-dotRed" />
                  <span className="h-[11px] w-[11px] rounded-full bg-landing-dotAmber" />
                  <span className="h-[11px] w-[11px] rounded-full bg-landing-dotGreen" />
                  <span className="ml-3.5 font-mono text-xs text-landing-micro">gmok.kr</span>
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
        <section className="w-full border-y border-white/[0.05] bg-landing-bgSection px-6 py-14 md:py-16">
          <div
            className="mx-auto grid max-w-[1160px] gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))" }}
          >
            {[
              {
                big: "0원",
                bigColor: colors.landing.goldLight,
                t: "모든 기능 무료",
                d: "전적 · 통계 · 랭킹 · 대회 전부",
                highlight: true,
              },
              {
                big: "디스코드",
                bigColor: colors.blueText,
                t: "로그인 한 번",
                d: "별도 회원가입 없음",
              },
              {
                big: "클랜",
                bigColor: colors.landing.gold,
                t: "커뮤니티 통계",
                d: "랭킹 · 상대전적",
              },
              {
                big: "부캐",
                bigColor: colors.blueText,
                t: "계정 통합 집계",
                d: "본캐에 전적 합산",
              },
            ].map((k, i) => (
              <div
                key={k.t}
                data-reveal
                data-delay={i * 80}
                onMouseMove={moveSpotlight}
                className={`kpi-card relative overflow-hidden rounded-2xl border p-6 [&>*]:relative ${
                  "highlight" in k ? "border-landing-gold/40" : "border-white/[0.06]"
                }`}
                style={
                  {
                    "--spot-color":
                      "highlight" in k
                        ? withAlpha(colors.landing.gold, 0.3)
                        : withAlpha(colors.white, 0.13),
                    background:
                      "highlight" in k
                        ? `linear-gradient(160deg,${withAlpha(colors.landing.gold, 0.16)},${colors.landing.gradBottom})`
                        : `linear-gradient(160deg,${colors.landing.bgElevated},${colors.landing.gradBottom})`,
                  } as CSSProperties
                }
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
                <div className="mt-1.5 text-[15px] font-bold text-landing-headingSm">{k.t}</div>
                <div className="mt-1 text-[13px] text-landing-caption">{k.d}</div>
              </div>
            ))}
          </div>
        </section>

        {/* KEY FEATURES */}
        <section id="features" className="w-full px-6 py-20 md:py-28">
          <div className="mx-auto max-w-[1160px]">
            <div data-reveal className="mb-12 text-center md:mb-16">
              <div className="mb-5 text-sm font-bold tracking-[1.5px] text-landing-gold">
                KEY POINTS
              </div>
              <h2
                className="m-0 mb-6 font-bold text-landing-heading"
                style={{ fontSize: "clamp(28px,4.2vw,46px)", letterSpacing: "-1px" }}
              >
                우리 전적 사이트가 보여주는 것들
              </h2>
              <p className="mx-auto max-w-[600px] text-[17px] text-landing-caption">
                경기 상세부터 챔피언 통계·상대전적·클랜 대회까지, 실제 화면 그대로.
              </p>
            </div>
            <div className="flex flex-col gap-16 md:gap-24">
              {FEATURES.map((f) => {
                const text = (
                  <div
                    data-reveal
                    className={`max-w-[460px] ${f.reverse ? "md:justify-self-end" : ""}`}
                  >
                    <span
                      className="mb-4 inline-block rounded-full border px-3 py-1.5 text-xs font-bold"
                      style={{ color: f.tagColor, background: f.tagBg, borderColor: f.tagBorder }}
                    >
                      {f.tag}
                    </span>
                    <h3
                      className="m-0 mb-3 font-bold text-landing-heading"
                      style={{ fontSize: "clamp(22px,2.6vw,28px)", letterSpacing: "-0.5px" }}
                    >
                      {f.title}
                    </h3>
                    <p className="m-0 text-base leading-[1.75] text-landing-bodySecondary">
                      {f.body}
                    </p>
                  </div>
                );
                const shot = (
                  <div data-reveal data-delay="140">
                    <Shot src={f.img} alt={f.alt} onOpen={setLightbox} />
                  </div>
                );
                return (
                  <div
                    key={f.title}
                    className="grid items-center gap-8 md:gap-16"
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
          className="w-full border-t border-white/[0.06] bg-landing-bgSection px-6 py-20 md:py-28"
        >
          <div className="mx-auto max-w-[1200px]">
            <div data-reveal className="mb-12 text-center md:mb-16">
              <div className="mb-5 text-sm font-bold tracking-[1.5px] text-landing-gold">
                HOW IT WORKS
              </div>
              <h2
                className="m-0 mb-6 font-bold text-landing-heading"
                style={{ fontSize: "clamp(28px,4.2vw,46px)", letterSpacing: "-1px" }}
              >
                {content.flow.title}
              </h2>
              <p className="mx-auto max-w-[600px] text-[17px] text-landing-caption">
                {content.flow.description}
              </p>
            </div>

            <div ref={flowRef} className="relative flex flex-col gap-14 md:gap-24">
              <div
                ref={flowTrackRef}
                aria-hidden
                className="pointer-events-none absolute left-1/2 hidden w-0.5 -translate-x-1/2 overflow-hidden rounded-full bg-white/[0.07] md:block"
              >
                <div
                  ref={flowFillRef}
                  className="h-full w-full origin-top"
                  style={{
                    transform: "scaleY(0)",
                    background: `linear-gradient(180deg,${colors.landing.discord},${colors.landing.gold} 35%,${colors.landing.goldLight})`,
                  }}
                />
              </div>
              {content.flow.steps.map((step, index) => {
                const n = String(index + 1).padStart(2, "0");
                const reverse = index % 2 === 1;
                const text = (
                  <div className={`max-w-[460px] ${reverse ? "md:justify-self-end" : ""}`}>
                    <div
                      className="mb-4.5 inline-flex items-center gap-3"
                      style={{ marginBottom: 18 }}
                    >
                      <span
                        className="flow-num font-bold"
                        style={{
                          fontSize: "clamp(52px,6vw,72px)",
                          background: step.theme.grad,
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          color: "transparent",
                          lineHeight: 0.9,
                        }}
                      >
                        {n}
                      </span>
                      <span
                        className="rounded-full border px-3 py-1.5 text-xs font-bold tracking-wide"
                        style={{
                          color: step.theme.badgeColor,
                          background: step.theme.badgeBg,
                          borderColor: step.theme.badgeBorder,
                        }}
                      >
                        {step.badge}
                      </span>
                    </div>
                    <h3
                      className="m-0 mb-3.5 font-bold text-landing-heading"
                      style={{ fontSize: "clamp(24px,3vw,32px)", letterSpacing: "-0.5px" }}
                    >
                      {step.title}
                    </h3>
                    <p className="m-0 text-base leading-[1.75] text-landing-bodySecondary">
                      {step.body}
                    </p>
                  </div>
                );
                const shot = step.shot ? (
                  <Shot
                    src={step.shot.img}
                    alt={step.shot.alt}
                    onOpen={setLightbox}
                    browserBar={step.shot.bar}
                  />
                ) : (
                  <div aria-hidden />
                );
                return (
                  <div
                    key={step.title}
                    data-reveal
                    className="flow-step relative grid items-center gap-8 md:gap-16"
                    style={
                      {
                        gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
                        "--flow-glow": step.theme.glow,
                      } as CSSProperties
                    }
                  >
                    <span
                      aria-hidden
                      className="flow-node pointer-events-none absolute left-1/2 top-1/2 hidden h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 md:block"
                    />
                    {reverse ? (
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
        <section id="start" className="relative w-full px-6 pt-20 md:pt-24">
          <div
            data-reveal
            className="relative mx-auto max-w-[880px] overflow-hidden rounded-[28px] border border-white/[0.08] bg-landing-bgElevated px-6 py-14 text-center shadow-[0_50px_120px_-50px_theme(colors.black/0.95)] md:px-12 md:py-16"
          >
            <div
              className="pointer-events-none absolute -left-40 -top-48 h-[440px] w-[560px]"
              style={{
                background: `radial-gradient(closest-side,${withAlpha(colors.landing.discord, 0.24)},transparent 70%)`,
              }}
            />
            <div
              className="pointer-events-none absolute -bottom-48 -right-40 h-[420px] w-[540px]"
              style={{
                background: `radial-gradient(closest-side,${withAlpha(colors.landing.gold, 0.14)},transparent 70%)`,
              }}
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

            <div className="relative">
              <div className="mb-4 text-sm font-bold tracking-[1.5px] text-landing-gold">
                START NOW
              </div>
              <h2
                className="m-0 mb-4 font-bold text-landing-heading"
                style={{
                  fontSize: "clamp(28px,4.4vw,46px)",
                  lineHeight: 1.2,
                  letterSpacing: "-1px",
                }}
              >
                지금 바로 내전을 시작하세요
              </h2>
              <p className="mx-auto mb-10 max-w-[480px] text-[17px] leading-[1.7] text-landing-bodySecondary">
                {cta.description}
              </p>

              <a
                href={DISCORD_BOT_INSTALL_URL}
                target="_blank"
                rel="noreferrer"
                className="mx-auto flex h-14 w-full max-w-[300px] items-center justify-center gap-2.5 rounded-xl bg-landing-discord px-6 text-base font-bold text-white shadow-[inset_0_1px_0_theme(colors.white/0.18),0_8px_20px_-8px_theme(colors.landing.discord/0.55)] transition-[background-color,box-shadow] duration-150 ease-out hover:bg-landing-discordHover hover:shadow-[inset_0_1px_0_theme(colors.white/0.18),0_10px_28px_-8px_theme(colors.landing.discord/0.75)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-landing-bgElevated active:bg-landing-discordHover"
              >
                <DiscordIcon size={20} />
                우리 클랜 등록하기
              </a>
              <Link href="/guide">
                <a className="mt-5 inline-block text-[15px] font-bold text-landing-bodySecondary underline-offset-4 transition-colors hover:text-landing-heading hover:underline">
                  이용 방법 보기 →
                </a>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      <DiscordSupportButton />

      {lightbox && (
        <button
          type="button"
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-landing-bgOverlay/90 p-8 backdrop-blur-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="확대 이미지"
            className="max-h-[90%] max-w-[94%] rounded-xl border border-white/[0.12] shadow-[0_40px_120px_theme(colors.black/0.8)]"
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
          background: radial-gradient(
            closest-side,
            ${withAlpha(colors.landing.glowBlue, 0.3)},
            transparent 70%
          );
          animation: gmokGlow 7s ease-in-out infinite;
        }
        .about-glow-b {
          background: radial-gradient(
            closest-side,
            ${withAlpha(colors.landing.gold, 0.16)},
            transparent 70%
          );
          animation: gmokGlow 9s ease-in-out infinite;
        }
        .about-shot img {
          transition: transform 0.6s ease;
        }
        .about-shot:hover img {
          transform: scale(1.03);
        }
        /* 데모로 체험하기 버튼: 몇 초마다 빛이 한 번 훑고 지나간다. */
        .demo-cta::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            110deg,
            transparent 30%,
            ${withAlpha(colors.white, 0.55)} 50%,
            transparent 70%
          );
          transform: translateX(-120%);
          animation: demoShine 3.6s ease-in-out 1.2s infinite;
          pointer-events: none;
        }
        @keyframes demoShine {
          0% {
            transform: translateX(-120%);
          }
          35%,
          100% {
            transform: translateX(120%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .demo-cta::after,
          .hero-gradient {
            animation: none;
          }
        }
        .hero-gradient {
          animation: heroGradient 8s ease-in-out infinite alternate;
        }
        @keyframes heroGradient {
          from {
            background-position: 0% 50%;
          }
          to {
            background-position: 100% 50%;
          }
        }
        .kpi-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            260px circle at var(--spot-x, 50%) var(--spot-y, 50%),
            var(--spot-color),
            transparent 70%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        @media (hover: hover) {
          .kpi-card:hover::before {
            opacity: 1;
          }
        }
        /* HOW IT WORKS: 진행선이 닿은 단계의 숫자와 점이 켜진다. */
        .flow-num {
          opacity: 0.35;
          transition:
            opacity 0.5s ease,
            filter 0.5s ease;
        }
        .flow-step[data-active="true"] .flow-num {
          opacity: 1;
          filter: drop-shadow(0 0 18px var(--flow-glow));
        }
        .flow-node {
          border-color: ${withAlpha(colors.white, 0.2)};
          background: ${colors.landing.bgSection};
          transition:
            background-color 0.4s ease,
            border-color 0.4s ease,
            box-shadow 0.4s ease,
            transform 0.4s ease;
        }
        .flow-step[data-active="true"] .flow-node {
          border-color: var(--flow-glow);
          background: var(--flow-glow);
          box-shadow:
            0 0 0 6px ${withAlpha(colors.landing.gold, 0.12)},
            0 0 18px var(--flow-glow);
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

export default LandingPage;
