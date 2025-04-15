import React, { useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import NavBar from "@/components/layout/NavBar";
import Search from "@/components/form/Search";
import MainLogo from "@/assets/images/mainLogo.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { handleRiotNameSearch } from "@/utils/parseRiotSearch";
import DiscordLoginButton from "@/components/ui/DiscordLoginButton";
import useModal from "@/hooks/useModal";
import DiscordLoginModal from "@/features/discordLogin/DiscordLoginModal";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/services/user";
import { ApiResponse } from "@/services/apiService";
import { UserSearchResult } from "@/data/types/user";
import { debounce } from "lodash";

const Home: NextPage = () => {
  const router = useRouter();
  const { isOpen, open, close } = useModal();
  const [searchTerm, setSearchTerm] = useState("");
  const [guildId, setGuildId] = useState<string>("");
  const [debouncedTerm, setDebouncedTerm] = useState<{
    riotName: string;
    riotNameTag: string;
  }>({ riotName: "", riotNameTag: "" });

  const { data, isLoading, isError } = useQuery<ApiResponse<UserSearchResult[]>>({
    queryKey: ["users", debouncedTerm, guildId],
    queryFn: () => getUsers(debouncedTerm.riotName, debouncedTerm.riotNameTag, guildId),
    enabled: !!debouncedTerm.riotName && !!guildId && debouncedTerm.riotName.length > 1,
    staleTime: 60 * 1000,
  });

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        const gid = localStorage.getItem("guildId");
        const [name, tag] = handleRiotNameSearch(value);

        setGuildId(gid || "");
        if (!name) return;
        setDebouncedTerm({ riotName: name, riotNameTag: tag || "" });
        console.log(data?.data);
      }, 500),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleSearch = async () => {
    if (!debouncedTerm.riotName) {
      console.error("No riot name found.");
      return;
    }
    if (!guildId) {
      console.error("No such guildId");
      return;
    }

    if (!data || isError) {
      window.alert("No user found.");
      return;
    }
    const users = data.data ?? [];
    if (users.length === 1) {
      router.push(`/summoners/${encodeURIComponent(users[0].riot_name)}`);
    } else if (users.length > 1) {
      window.alert("Many user found.");
    }
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <header className="flex flex-col w-full gap-32 justify-end">
        <div className="self-end m-3">
          <DiscordLoginButton onClick={open} />
        </div>
        <div className="flex w-64 h-64 mx-auto">
          <Image src={MainLogo} alt="메인 로고" />
        </div>
      </header>
      <main className="flex flex-col my-10 gap-2 w-full md:w-[40rem] max-w-[40rem] mt-16 mx-auto px-5">
        <NavBar />
        <Search
          value={searchTerm}
          onChange={handleInputChange}
          onSearch={handleSearch}
          placeholder="플레이어 이름#KR1"
        />
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="text-white text-md">
            {data?.data?.map((user) => <div key={user.puuid}>유저 : {user.riot_name}</div>)}
          </div>
        )}
        <div className="text-blueText text-md">최소 2글자 이상 작성해주세요.</div>
      </main>
      <DiscordLoginModal isOpen={isOpen} close={close} />
    </div>
  );
};

export default Home;
