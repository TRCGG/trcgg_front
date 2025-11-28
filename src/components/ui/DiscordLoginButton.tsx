import React, { useState, useRef } from "react";
import { FaDiscord } from "react-icons/fa";
import useClickOutside from "@/hooks/common/useClickOutside";

interface DiscordLoginButtonProps {
  onClick?: () => void;
  username?: string;
}

const DiscordLoginButton = ({ onClick, username }: DiscordLoginButtonProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const handleLogout = () => {
    // 쿠키 삭제
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });

    window.location.reload();
  };

  const handleClick = () => {
    // 로그인 상태가 아닐 때만 onClick 실행
    if (!username && onClick) {
      onClick();
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => username && setIsDropdownOpen(true)}
        className="flex h-[40px] items-center justify-center gap-1 rounded p-2 text-white bg-[#5865F2] hover:bg-[#4752C4] transition whitespace-nowrap"
      >
        {!username && <FaDiscord className="w-[24px] h-[24px]" />}
        {username || "로그인"}
      </button>

      {username && isDropdownOpen && (
        <div
          className="absolute top-full w-full bg-darkBg2 rounded-b shadow-lg z-10 overflow-hidden divide-y divide-border2"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-white hover:bg-grayHover transition-colors bg-darkBg2 rounded-b text-sm"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
};

export default DiscordLoginButton;
