import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CLAN_MENUS } from "./clanMenus";

interface Props {
  activePath: string;
}

// 모바일: 사이드바 대신 상단 가로 스크롤 메뉴로 표시.
// 스크롤 여지가 있으면 좌/우 페이드와 화살표로 스크롤 가능함을 표시한다.
const ClanMobileMenu = ({ activePath }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    const update = () => {
      setCanScrollLeft(el.scrollLeft > 1);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <nav className="md:hidden border-b border-border2 pb-3">
      <div className="relative">
        <div ref={scrollRef} className="overflow-x-auto">
          <div className="flex gap-2 w-max">
            {CLAN_MENUS.map((menu) => {
              const active = activePath === menu.href;
              return (
                <Link key={menu.href} href={menu.href}>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded border px-3 py-2 text-sm whitespace-nowrap cursor-pointer ${
                      active
                        ? "bg-blue border-blueText text-primary1"
                        : "border-border2 text-primary3"
                    }`}
                  >
                    {menu.label}
                  </span>
                </Link>
              );
            })}
            <span className="inline-flex items-center gap-1.5 rounded border border-border2 px-3 py-2 text-sm whitespace-nowrap text-primary3">
              클랜 설정
              <span className="text-[10px] text-primary2 bg-rankBg2 border border-border2 rounded px-1.5 py-px">
                준비중
              </span>
            </span>
          </div>
        </div>

        {canScrollLeft && (
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-darkBg1 to-transparent" />
        )}
        {canScrollRight && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex w-10 items-center justify-end bg-gradient-to-l from-darkBg1 to-transparent">
            <svg
              className="w-4 h-4 text-primary2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ClanMobileMenu;
