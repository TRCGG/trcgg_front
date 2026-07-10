import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import { FaDiscord } from "react-icons/fa";
import useClickOutside from "@/hooks/common/useClickOutside";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import { canManageGuild } from "@/data/types/guildMember";
import { logout } from "@/services/auth";

interface DiscordLoginButtonProps {
  onClick?: () => void;
  username?: string;
}

const DiscordLoginButton = ({ onClick, username }: DiscordLoginButtonProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { currentRole } = useGuildManagement();
  const canManage = canManageGuild(currentRole);

  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const handleLogout = async () => {
    // 백엔드 로그아웃 API 호출
    await logout();

    // 페이지 새로고침하여 상태 초기화
    window.location.href = "/";
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
        className="flex h-[40px] min-w-[96px] items-center justify-center gap-1 rounded p-2 text-white bg-[#5865F2] hover:bg-[#4752C4] transition whitespace-nowrap text-sm"
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
          {canManage && (
            <button
              type="button"
              onClick={() => router.push("/clan")}
              className="w-full text-left px-4 py-2 text-white hover:bg-grayHover transition-colors bg-darkBg2 text-sm cursor-pointer"
            >
              클랜 관리
            </button>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-white hover:bg-grayHover transition-colors bg-darkBg2 rounded-b text-sm cursor-pointer"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
};

export default DiscordLoginButton;
