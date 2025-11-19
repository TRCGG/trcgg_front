import React, { useState, useEffect, useRef } from "react";
import useClickOutside from "@/hooks/common/useClickOutside";

interface Guild {
  name: string;
  id: string;
}

const mockGuilds: Guild[] = [
  { name: "코드 클랜", id: "1234" },
  { name: "난민 클랜", id: "5678" },
];

const encodeGuildId = (id: string): string => btoa(id);
const decodeGuildId = (encodedId: string): string | null => {
  try {
    return atob(encodedId);
  } catch {
    return null;
  }
};

const GuildDropdown = () => {
  const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  // Load saved guild from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEncodedId = localStorage.getItem("guildId");
      if (savedEncodedId) {
        const decodedId = decodeGuildId(savedEncodedId);
        if (decodedId) {
          const guild = mockGuilds.find((g) => g.id === decodedId);
          if (guild) {
            setSelectedGuild(guild);
          }
        }
      }
    }
  }, []);

  const handleSelectGuild = (guild: Guild) => {
    const encodedId = encodeGuildId(guild.id);
    localStorage.setItem("guildId", encodedId);
    setSelectedGuild(guild);
    setIsOpen(false);
  };

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
          {mockGuilds.map((guild, index) => {
            const isSelected = selectedGuild?.id === guild.id;
            const isLast = index === mockGuilds.length - 1;

            return (
              <button
                key={guild.id}
                type="button"
                onClick={() => handleSelectGuild(guild)}
                className={`w-full text-left px-4 py-2 text-white hover:bg-grayHover transition-colors flex items-center justify-between bg-darkBg2
                ${isLast ? "rounded-b" : ""}`}
              >
                <span className="truncate">{guild.name}</span>
                {isSelected && <span className="ml-2 flex-shrink-0">⏺</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GuildDropdown;
