import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
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
  const { currentRole, avatar } = useGuildManagement();
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
        className="flex h-[40px] min-w-[96px] items-center justify-center gap-1.5 rounded p-2 text-white bg-[#5865F2] hover:bg-[#4752C4] transition whitespace-nowrap text-sm"
      >
        {username ? (
          avatar && (
            <Image
              src={avatar}
              alt="프로필"
              width={24}
              height={24}
              className="w-6 h-6 rounded-full object-cover shrink-0"
            />
          )
        ) : (
          <FaDiscord className="w-[24px] h-[24px]" />
        )}
        {username || "로그인"}
      </button>

      {username && isDropdownOpen && (
        <div
          className="absolute top-full right-0 min-w-[172px] bg-darkBg2 rounded-b shadow-lg z-10 overflow-hidden divide-y divide-border2"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          {canManage && (
            <button
              type="button"
              onClick={() => router.push("/clan/upload")}
              className="flex items-center gap-2 w-full text-left px-4 py-2 text-white hover:bg-grayHover transition-colors bg-darkBg2 text-sm whitespace-nowrap cursor-pointer"
            >
              <svg
                className="w-4 h-4 shrink-0 text-blueText"
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
              클랜 관리
            </button>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-left px-4 py-2 text-white hover:bg-grayHover transition-colors bg-darkBg2 rounded-b text-sm whitespace-nowrap cursor-pointer"
          >
            <svg
              className="w-4 h-4 shrink-0 text-primary2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
};

export default DiscordLoginButton;
