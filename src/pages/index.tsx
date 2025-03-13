import React from "react";
import type { NextPage } from "next";
import NavBar from "@/components/layout/NavBar";
import Search from "@/components/form/Search";
import MainLogo from "@/assets/images/mainLogo.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { handleRiotNameSearch } from "@/utils/parseRiotSearch";
import DiscordLoginButton from "@/components/ui/DiscordLoginButton";

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center">
      <header className="flex flex-col w-full gap-32 justify-end">
        <div className="self-end m-3">
          <DiscordLoginButton /> {/* TODO : 추후 디코 로그인 기능 추가 필요 */}
        </div>
        <div className="flex w-64 h-64 mx-auto">
          <Image src={MainLogo} alt="메인 로고" />
        </div>
      </header>
      <main className="flex flex-col my-10 gap-2 w-full md:w-[40rem] max-w-[40rem] mt-16 mx-auto px-5">
        <NavBar />
        <Search
          placeholder="플레이어 이름#KR1"
          onSearch={(value: string) => handleRiotNameSearch(value, router)}
        />
      </main>
    </div>
  );
};

export default Home;
