import Link from "next/link";
import Image from "next/image";
import TextLogo from "@/assets/images/textLogo.png";
import DiscordIcon from "@/components/ui/DiscordIcon";
import { DISCORD_INVITE_URL } from "@/constants/links";

export interface AnchorNavItem {
  id: string;
  label: string;
}

// 앵커가 6개까지 늘어나 좁은 화면에서는 목록만 가로 스크롤시킨다.
const AnchorNav = ({ items }: { items: AnchorNavItem[] }) => (
  <nav className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#0a0b0d]/70 backdrop-blur-md">
    <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-5 px-7 py-3.5">
      <Link href="/">
        <span className="flex shrink-0 cursor-pointer items-center gap-2.5">
          <Image src={TextLogo} alt="gmok" width={61} height={34} />
        </span>
      </Link>
      <div className="flex min-w-0 items-center gap-5 sm:gap-7">
        <div className="flex min-w-0 items-center gap-5 overflow-x-auto whitespace-nowrap [scrollbar-width:none] sm:gap-7 [&::-webkit-scrollbar]:hidden">
          {items.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="shrink-0 text-[15px] text-[#8A929C] hover:text-primary1"
            >
              {label}
            </a>
          ))}
        </div>
        <a
          href={DISCORD_INVITE_URL}
          target="_blank"
          rel="noreferrer"
          className="flex shrink-0 items-center gap-2 rounded-[9px] bg-[#5865F2] px-[18px] py-2.5 text-sm font-bold text-white shadow-[0_6px_18px_rgba(88,101,242,0.35)] hover:bg-[#4954da]"
        >
          <DiscordIcon size={18} />
          디스코드
        </a>
      </div>
    </div>
  </nav>
);

export default AnchorNav;
