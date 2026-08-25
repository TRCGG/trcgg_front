import Link from "next/link";
import Image from "next/image";
import TextLogo from "@/assets/images/textLogo.png";
import DiscordIcon from "@/components/ui/DiscordIcon";
import { DISCORD_INVITE_URL } from "@/constants/links";

export type InfoPageKey = "about" | "guide" | "faq";

const TABS: { key: InfoPageKey; href: string; label: string }[] = [
  { key: "about", href: "/about", label: "서비스 소개" },
  { key: "guide", href: "/guide", label: "이용방법" },
  { key: "faq", href: "/faq", label: "FAQ" },
];

const InfoPageNav = ({ active }: { active: InfoPageKey }) => (
  <nav className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#0a0b0d]/70 backdrop-blur-md">
    <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-5 px-7 py-3.5">
      <Link href="/">
        <span className="flex cursor-pointer items-center gap-2.5">
          <Image src={TextLogo} alt="gmok" width={61} height={34} />
        </span>
      </Link>
      <div className="flex items-center gap-5 sm:gap-7">
        {TABS.map(({ key, href, label }) =>
          key === active ? (
            <a key={key} href="#top" className="text-[15px] font-bold text-[#E8D6A8]">
              {label}
            </a>
          ) : (
            <Link key={key} href={href}>
              <span className="cursor-pointer text-[15px] text-[#8A929C] hover:text-primary1">
                {label}
              </span>
            </Link>
          )
        )}
        <a
          href={DISCORD_INVITE_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-[9px] bg-[#5865F2] px-[18px] py-2.5 text-sm font-bold text-white shadow-[0_6px_18px_rgba(88,101,242,0.35)] hover:bg-[#4954da]"
        >
          <DiscordIcon size={18} />
          디스코드
        </a>
      </div>
    </div>
  </nav>
);

export default InfoPageNav;
