import React from "react";
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
import process from "process";
import { ApiResponse, createApiService } from "@/services/apiService";
import { UserSearchResult } from "@/data/types/user";

const Home: NextPage = () => {
  const router = useRouter();
  const { isOpen, open, close } = useModal();
  const api = createApiService(process.env.NEXT_PUBLIC_API_BASE_URL);

  const getUsersMatchedByName = async (riotName: string, riotNameTag: string | null) => {
    const guildId = localStorage.getItem("guildId");
    if (!riotName) {
      console.error("No such riotName");
    } else if (!guildId) {
      console.error("No such guildId");
    }

    const params: Record<string, string> = {};
    if (riotNameTag) {
      params.riot_name_tag = riotNameTag;
    }

    const res: ApiResponse<UserSearchResult[]> = await api.get(
      `/account/search/${riotName}/${guildId}`,
      params
    );

    if (res.error) {
      console.error(res.error);
      return null;
    }
    console.log(res.data);
    return res.data;
  };

  const handleSearch = async (value: string) => {
    const [riotName, riotNameTag] = handleRiotNameSearch(value);
    if (!riotName) {
      console.error("No riot name found.");
      return;
    }

    const data = await getUsersMatchedByName(riotName, riotNameTag);

    if (!data) {
      window.alert("No user found.");
    } else if (data.length === 1) {
      router.push(`/summoners/${encodeURIComponent(data[0].riot_name)}`);
    } else if (data.length > 1) {
      window.alert("Many user found.");
    }
  };

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
        <Search placeholder="플레이어 이름#KR1" onSearch={handleSearch} />
      </main>
      <DiscordLoginModal isOpen={isOpen} close={close} />
    </div>
  );
};

export default Home;
