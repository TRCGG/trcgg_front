import type { NextPage } from "next";
import NavBar from "@/components/layout/NavBar";
import Search from "@/components/form/Search";
import MainLogo from "@/assets/images/mainLogo.png";
import Image from "next/image";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();

  const handleSearch = (value: string) => {
    // 공백을 포함한 riotName, riotNameTag 분리 정규표현식
    const regex = /^([\S].*[\S])\s*#\s*([\S]+)$/;
    const match = value.match(regex);

    if (match) {
      const riotName = match[1];
      const riotNameTag = match[2];
      router.push(`/summoners/${encodeURIComponent(riotName)}/${encodeURIComponent(riotNameTag)}`);
    } else {
      alert("게임 이름과 태그를 올바른 형식으로 입력해 주세요.");
    }
  };
  return (
    <div className="flex flex-col justify-center items-center mt-32">
      <header className="flex items-center justify-center w-64 h-64">
        <Image src={MainLogo} alt="메인 로고" />
      </header>
      <main className="flex flex-col w-[40rem] mt-16">
        <NavBar />
        <Search placeholder="플레이어 이름#KR1" onSearch={handleSearch} />
      </main>
    </div>
  );
};

export default Home;
