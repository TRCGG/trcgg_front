import Link from "next/link";
import { useRouter } from "next/router";

const NavBar = () => {
  const router = useRouter();

  const navList = [
    { href: "/summoners", label: "내전 전적 검색", realHref: "/" },
    { href: "/tournament", label: "미니 토너먼트" },
    { href: "/team", label: "팀원 구성" },
    { href: "/community", label: "난민★그램" },
  ];

  return (
    <nav className="flex items-center space-x-4 h-full">
      {navList.map(({ href, label, realHref }) => (
        <Link key={realHref || href} href={realHref || href}>
          <span
            className={`cursor-pointer text-base font-medium pb-1 whitespace-nowrap ${
              router.pathname === href ||
              (href === "/summoners" && router.pathname.startsWith("/summoners"))
                ? "text-primary1 border-b-3 border-primary1"
                : "text-primary2 border-b-3 border-transparent"
            }`}
          >
            {label}
          </span>
        </Link>
      ))}
    </nav>
  );
};

export default NavBar;
