import Link from "next/link";
import TextLogo from "@/assets/images/textLogo.png";
import { DISCORD_INVITE_URL } from "@/constants/links";

// 자식은 반드시 <a>여야 한다. Next 12의 next/link는 자식이 <span>이면 href를 렌더하지
// 않아, 푸터가 유일한 전역 내부 링크인데도 크롤러가 콘텐츠 페이지로 이동할 수 없게 된다.
const linkClass = "cursor-pointer text-sm text-[#8A929C] hover:text-primary1";

const Footer = () => (
  <footer className="mt-16 w-full border-t border-white/[0.06] bg-[#08090B] px-6 pb-11 pt-14 md:mt-24">
    <div className="mx-auto flex max-w-[1160px] flex-wrap justify-between gap-10">
      <div className="max-w-[620px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={TextLogo.src} alt="GMOK" className="mb-3.5 h-[30px] w-auto" />
        <p className="mb-3.5 text-sm leading-relaxed text-[#8A929C]">
          리그 오브 레전드 길드 내전 전적 검색 · 디스코드 내전 봇 서비스를 제공하는 GMOK입니다.
        </p>
        <div className="mb-1.5 text-sm font-bold text-[#C8D0DA]">Game Metrics Of Korea</div>
        <p className="m-0 text-[13px] leading-relaxed text-[#5E656E]">
          League of Legends Tournament &amp; Match Management Platform
        </p>
      </div>
      <div className="flex gap-x-16 gap-y-10">
        <div>
          <div className="mb-3.5 text-[13px] font-bold tracking-wide text-[#8A929C]">서비스</div>
          <div className="flex flex-col gap-2.5">
            <Link href="/">
              <a className={linkClass}>홈</a>
            </Link>
            <Link href="/about">
              <a className={linkClass}>서비스 소개</a>
            </Link>
            <Link href="/guide">
              <a className={linkClass}>이용방법</a>
            </Link>
            <Link href="/faq">
              <a className={linkClass}>자주 묻는 질문</a>
            </Link>
          </div>
        </div>
        <div>
          <div className="mb-3.5 text-[13px] font-bold tracking-wide text-[#8A929C]">지원</div>
          <div className="flex flex-col gap-2.5">
            <a href={DISCORD_INVITE_URL} target="_blank" rel="noreferrer" className={linkClass}>
              Discord
            </a>
            <Link href="/privacy">
              <a className={linkClass}>개인정보처리방침</a>
            </Link>
            <Link href="/terms">
              <a className={linkClass}>이용약관</a>
            </Link>
          </div>
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
