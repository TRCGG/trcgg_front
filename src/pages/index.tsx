import React from "react";
import type { NextPage } from "next";
import NavBar from "@/components/layout/NavBar";
import Search from "@/components/form/Search";
import MainLogo from "@/assets/images/mainLogo.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { handleRiotNameSearch } from "@/utils/parseRiotSearch";

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center mt-32">
      <header className="flex items-center justify-center w-64 h-64">
        <Image src={MainLogo} alt="메인 로고" />
      </header>
      <main className="flex flex-col w-[40rem] mt-16">
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
