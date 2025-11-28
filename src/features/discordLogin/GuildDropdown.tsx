import React, { useState, useRef, useMemo } from "react";
import useClickOutside from "@/hooks/common/useClickOutside";
import { GuildInfo } from "@/data/types/guild";

interface GuildDropdownProps {
  guilds: GuildInfo[];
  selectedGuildId: string;
  onGuildChange: (encodedGuildId: string) => void;
}

const GuildDropdown = ({ guilds, selectedGuildId, onGuildChange }: GuildDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const selectedGuild = useMemo(() => {
    if (!selectedGuildId || guilds.length === 0) return null;
    return guilds.find((g) => g.id === selectedGuildId) || null;
  }, [selectedGuildId, guilds]);

  const handleSelectGuild = (guild: GuildInfo) => {
    onGuildChange(guild.id);
    setIsOpen(false);
  };

  if (guilds.length === 0) {
    return (
      <div className="bg-darkBg2 text-white py-2 px-4 rounded flex items-center gap-2 w-[180px] border border-border2">
        <span className="flex-1 text-left">가입된 길드 없음</span>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-darkBg2 text-white py-2 px-4 rounded flex items-center gap-2 w-[180px] border border-border2"
      >
        <span className="flex-1 text-left truncate">
          {selectedGuild ? selectedGuild.name : "길드 선택"}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full w-full bg-darkBg2 rounded-b shadow-lg z-10 overflow-hidden divide-y divide-border2">
          {guilds.map((guild, index) => {
            const isSelected = selectedGuild?.id === guild.id;
            const isLast = index === guilds.length - 1;

            return (
              <button
                key={guild.id}
                type="button"
                onClick={() => handleSelectGuild(guild)}
                className={`w-full text-left px-4 py-2 text-white hover:bg-grayHover transition-colors flex items-center justify-between bg-darkBg2
                ${isLast ? "rounded-b" : ""}`}
              >
                <span className="truncate">{guild.name}</span>
                {isSelected && <span className="ml-2 flex-shrink-0 text-xl">⏺</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GuildDropdown;
