import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import TextLogo from "@/assets/images/textLogo.png";
import DiscordLoginButton from "@/components/ui/DiscordLoginButton";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import { DISCORD_BOT_INSTALL_URL } from "@/constants/links";
import startDiscordLogin from "@/utils/discordLogin";
import LoginHintBubble from "@/components/ui/LoginHintBubble";

const LINKS = [
  { href: "/about", label: "서비스 소개" },
  { href: "/guide", label: "이용방법" },
  { href: "/faq", label: "자주 묻는 질문" },
  { href: "/board", label: "게시판" },
];

const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

/** 서비스 소개·이용방법·FAQ·게시판이 함께 쓰는 상단 내비게이션. */
const SiteNav = () => {
  const { pathname } = useRouter();
  const { username, isAuthPending } = useGuildManagement();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-landing-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-5 px-7 py-3.5">
        <Link href="/">
          <a className="flex shrink-0 items-center">
            <Image src={TextLogo} alt="gmok" width={61} height={34} />
          </a>
        </Link>
        <div className="flex min-w-0 items-center gap-5 sm:gap-7">
          {/* 좁은 화면에서는 링크 목록만 가로 스크롤시키고, 오른쪽을 흐려 뒤에 더 있음을 알린다. */}
          <div className="flex min-w-0 items-center gap-5 overflow-x-auto whitespace-nowrap pr-6 [mask-image:linear-gradient(to_right,black_80%,transparent)] [scrollbar-width:none] sm:gap-7 sm:pr-0 sm:[mask-image:none] [&::-webkit-scrollbar]:hidden">
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
            <a
              href={DISCORD_BOT_INSTALL_URL}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 text-[15px] font-bold text-landing-gold hover:text-landing-goldLight"
            >
              클랜 등록 ↗
            </a>
          </div>
          <div className="relative shrink-0">
            <DiscordLoginButton onClick={startDiscordLogin} username={username} />
            {!isAuthPending && !username && <LoginHintBubble />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SiteNav;
