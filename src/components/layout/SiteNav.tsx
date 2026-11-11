import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import TextLogo from "@/assets/images/textLogo.png";
import DiscordIcon from "@/components/ui/DiscordIcon";
import { DISCORD_INVITE_URL } from "@/constants/links";

const LINKS = [
  { href: "/about", label: "서비스 소개" },
  { href: "/guide", label: "이용방법" },
  { href: "/faq", label: "자주 묻는 질문" },
  { href: "/board", label: "게시판" },
];

const isActive = (pathname: string, href: string) =>
  href === "/board"
    ? pathname.startsWith("/board") && !pathname.startsWith("/board/admin")
    : pathname === href;

/** 서비스 소개·이용방법·FAQ·게시판이 함께 쓰는 상단 내비게이션. `extra`는 링크 뒤에 붙는다. */
const SiteNav = ({ extra }: { extra?: ReactNode }) => {
  const { pathname } = useRouter();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-landing-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-5 px-7 py-3.5">
        <Link href="/">
          <a className="flex shrink-0 items-center">
            <Image src={TextLogo} alt="gmok" width={61} height={34} />
          </a>
        </Link>
        <div className="flex min-w-0 items-center gap-5 sm:gap-7">
          {/* 좁은 화면에서는 링크 목록만 가로 스크롤시킨다. */}
          <div className="flex min-w-0 items-center gap-5 overflow-x-auto whitespace-nowrap [scrollbar-width:none] sm:gap-7 [&::-webkit-scrollbar]:hidden">
            {LINKS.map(({ href, label }) => (
              <Link key={href} href={href}>
                <a
                  aria-current={isActive(pathname, href) ? "page" : undefined}
                  className={`shrink-0 text-[15px] ${
                    isActive(pathname, href)
                      ? "font-bold text-landing-goldLight"
                      : "text-landing-caption hover:text-primary1"
                  }`}
                >
                  {label}
                </a>
              </Link>
            ))}
          </div>
          {extra}
          <a
            href={DISCORD_INVITE_URL}
            target="_blank"
            rel="noreferrer"
            className="flex shrink-0 items-center gap-2 rounded-[9px] bg-landing-discord px-[18px] py-2.5 text-sm font-bold text-white shadow-[0_6px_18px_theme(colors.landing.discord/0.35)] hover:bg-landing-discordHover"
          >
            <DiscordIcon size={18} />
            <span className="hidden sm:inline">디스코드</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default SiteNav;
