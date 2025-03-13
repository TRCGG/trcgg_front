import React from "react";
import { FaDiscord } from "react-icons/fa";

interface DiscordLoginButtonProps {
  onClick?: () => void;
}

const DiscordLoginButton = ({ onClick }: DiscordLoginButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[40px] items-center justify-center gap-1 rounded p-2 text-white bg-[#5865F2] hover:bg-[#4752C4] transition whitespace-nowrap"
    >
      <FaDiscord className="w-[24px] h-[24px]" />
      로그인
    </button>
  );
};

export default DiscordLoginButton;
