import Link from "next/link";
import { useRouter } from "next/router";

const NavBar = () => {
  const router = useRouter();

  const navList = [
    { href: "/summoners", label: "내전 전적", href2: "/" },
    { href: "/champion", label: "챔피언 분석" },
    { href: "/user", label: "유저 분석" },
  ];

  return (
    <nav className="flex items-center space-x-4 h-full">
      {navList.map(({ href, label, href2 }) => (
        <Link key={href2 || href} href={href2 || href}>
          <span
            className={`cursor-pointer text-sm sm:text-base font-medium pb-1 whitespace-nowrap ${
              router.pathname === href ||
              router.pathname === href2 ||
              (href === "/summoners" && router.pathname.startsWith("/summoners"))
                ? "text-primary1 border-b-3 border-primary1 px-3"
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
