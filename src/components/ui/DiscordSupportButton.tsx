import DiscordIcon from "@/components/ui/DiscordIcon";
import { DISCORD_SUPPORT_URL } from "@/constants/links";

const DiscordSupportButton = () => (
  <a
    href={DISCORD_SUPPORT_URL}
    target="_blank"
    rel="noreferrer"
    aria-label="디스코드로 문의하기"
    className="group fixed bottom-5 right-5 z-[80] flex h-14 items-center rounded-full bg-landing-discord pl-4 pr-4 text-white shadow-[0_14px_34px_-8px_theme(colors.landing.discord/0.65)] ring-1 ring-white/10 transition-[background-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:bg-landing-discordHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95 motion-safe:animate-fadeUp md:bottom-7 md:right-7"
  >
    <DiscordIcon size={24} />
    <span className="max-w-0 overflow-hidden whitespace-nowrap text-[15px] font-bold opacity-0 transition-[max-width,opacity,margin] duration-300 ease-out group-hover:ml-2.5 group-hover:max-w-[120px] group-hover:opacity-100 group-focus-visible:ml-2.5 group-focus-visible:max-w-[120px] group-focus-visible:opacity-100">
      디스코드 문의
    </span>
  </a>
);

export default DiscordSupportButton;
