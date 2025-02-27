import Link from "next/link";
import { useRouter } from "next/router";

const NavBar = () => {
  const router = useRouter();

  const navList = [
    { href: "/", label: "내전 전적 검색" },
    { href: "/tournament", label: "미니 토너먼트" },
    { href: "/team", label: "팀원 구성" },
    { href: "/community", label: "난민★그램" },
  ];

  return (
    <nav className="flex items-center space-x-4 py-4 h-full">
      {navList.map(({ href, label }) => (
        <Link key={href} href={href}>
          <span
            className={`cursor-pointer text-base font-medium pb-1 whitespace-nowrap ${
              router.pathname === href
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
