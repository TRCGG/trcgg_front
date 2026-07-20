import Link from "next/link";
import TextLogo from "@/assets/images/textLogo.png";

const DISCORD_INVITE = "https://discord.gg/kahrPQc89p";

const Footer = () => (
  <footer className="mt-16 w-full border-t border-white/[0.06] bg-[#08090B] px-6 pb-11 pt-14 md:mt-24">
    <div className="mx-auto flex max-w-[1160px] flex-wrap justify-between gap-10">
      <div className="max-w-[440px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={TextLogo.src} alt="GMOK" className="mb-3.5 h-[30px] w-auto" />
        <div className="mb-1.5 text-sm font-bold text-[#C8D0DA]">Game Metrics Of Korea</div>
        <p className="m-0 text-[13px] leading-relaxed text-[#5E656E]">
          League of Legends Tournament &amp; Match Management Platform
        </p>
      </div>
      <div>
        <div className="mb-3.5 text-[13px] font-bold tracking-wide text-[#8A929C]">Links</div>
        <div className="flex flex-col gap-2.5">
          <Link href="/">
            <span className="cursor-pointer text-sm text-[#8A929C] hover:text-primary1">홈</span>
          </Link>
          <Link href="/about">
            <span className="cursor-pointer text-sm text-[#8A929C] hover:text-primary1">
              서비스 소개
            </span>
          </Link>
          <a
            href={DISCORD_INVITE}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-[#8A929C] hover:text-primary1"
          >
            Discord
          </a>
        </div>
      </div>
    </div>
    <div className="mx-auto mt-10 max-w-[1160px] border-t border-white/[0.06] pt-6 text-xs leading-7 text-[#4E545C]">
      <p className="m-0">© 2026 GMOK. All rights reserved.</p>
      <p className="m-0 mt-1.5">
        League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc.
      </p>
      <p className="m-0 mt-1.5">
        GMOK is an independent community service and is not endorsed by or affiliated with Riot
        Games.
      </p>
    </div>
  </footer>
);

export default Footer;
