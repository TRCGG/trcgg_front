import Link from "next/link";
import { CLAN_MENUS } from "./clanMenus";

interface Props {
  activePath: string;
}

const ClanSidebar = ({ activePath }: Props) => (
  <aside className="hidden md:block w-[220px] shrink-0 bg-darkBg2 border border-border2 rounded p-4">
    <div className="flex items-center gap-2 px-2 pb-2.5">
      <svg
        className="w-[18px] h-[18px] text-blueText"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
      <span className="text-[15px] font-bold text-primary1">클랜 관리</span>
      <span className="text-xs font-bold text-blueText bg-blueText/10 px-2 py-0.5 rounded">
        매니저
      </span>
    </div>
    <div className="h-px bg-border2 mx-0.5 mb-1.5" />

    <div className="text-[11px] font-bold tracking-wider text-primary2 px-2.5 pt-2 pb-1.5">
      구성원
    </div>
    {CLAN_MENUS.map((menu) => {
      const active = activePath === menu.href;
      return (
        <Link key={menu.href} href={menu.href}>
          <div
            className={`flex items-center gap-2.5 px-2.5 py-2.5 rounded text-sm border-l-2 mt-0.5 cursor-pointer transition-colors ${
              active
                ? "bg-blue border-blueText text-primary1"
                : "border-transparent text-primary1 hover:bg-grayHover"
            }`}
          >
            {menu.label}
          </div>
        </Link>
      );
    })}

    <div className="text-[11px] font-bold tracking-wider text-primary2 px-2.5 pt-3.5 pb-1.5">
      설정
    </div>
    <div className="flex items-center gap-2.5 px-2.5 py-2.5 rounded text-sm border-l-2 border-transparent text-primary3 cursor-not-allowed">
      <span>클랜 설정</span>
      <span className="ml-auto text-[10px] text-primary2 bg-rankBg2 border border-border2 rounded px-1.5 py-px whitespace-nowrap">
        준비중
      </span>
    </div>
  </aside>
);

export default ClanSidebar;
