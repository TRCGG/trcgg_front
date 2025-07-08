// components/layout/SummonerPageHeader.tsx
import Image from "next/image";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import TextLogo from "@/assets/images/textLogo.png";
import NavBar from "@/components/layout/NavBar";
import SearchBarSmall from "@/components/form/SearchBarSmall";
import SearchBarResultList from "@/features/search/SearchBarResultList";
import DiscordLoginButton from "@/components/ui/DiscordLoginButton";
import useClickOutside from "@/hooks/common/useClickOutside";
import { PlayerInfo } from "@/data/types/user";

interface Props {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  isError: boolean;
  users: PlayerInfo[] | undefined;
  openDiscordModal: () => void;
}

const SummonerPageHeader = ({
  searchTerm,
  setSearchTerm,
  onSearch,
  isLoading,
  isError,
  users,
  openDiscordModal,
}: Props) => {
  const router = useRouter();
  const searchContainerRef = useRef(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useClickOutside(searchContainerRef, () => setIsSearchFocused(false));

  return (
    <header className="flex flex-col md:flex-row justify-start md:justify-between mt-2 md:mt-10 md:items-center md:gap-10 md:min-w-[1080px]">
      <div className="flex flex-col md:flex-row items-center gap-4 md:min-w-[450px]">
        <div className="block md:hidden self-end">
          <DiscordLoginButton onClick={openDiscordModal} />
        </div>
        <div className="w-[113px] h-[30px] justify-start">
          <Image
            src={TextLogo}
            alt="logo"
            width={113}
            height={30}
            className="cursor-pointer"
            onClick={() => router.push("/")}
          />
        </div>
        <div ref={searchContainerRef} className="w-full md:w-[400px] z-10">
          <SearchBarSmall
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={onSearch}
            placeholder="플레이어 이름#KR1"
            onFocus={() => setIsSearchFocused(true)}
          />
          <SearchBarResultList
            isLoading={isLoading}
            isError={isError}
            users={users}
            enable={isSearchFocused}
            searchTerm={searchTerm}
          />
        </div>
      </div>
      <div className="flex items-center justify-start md:justify-end gap-4 mt-3 md:mt-0">
        <NavBar />
        <div className="hidden md:block">
          <DiscordLoginButton onClick={openDiscordModal} />
        </div>
      </div>
    </header>
  );
};

export default SummonerPageHeader;
