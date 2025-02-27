import Image from "next/image";
import { useRouter } from "next/router";
import TextLogo from "@/assets/images/textLogo.png";
import NavBar from "@/components/layout/NavBar";
import SearchSmall from "@/components/form/SearchSmall";
import { handleRiotNameSearch } from "@/utils/parseRiotSearch";

const RiotProfilePage = () => {
  const router = useRouter();
  const { riotName, riotNameTag } = router.query;

  return (
    <div className="min-w-[50rem] max-w-[70rem] mx-auto">
      <header className="flex justify-between mt-10 items-center">
        <div className="flex items-center gap-4">
          <Image src={TextLogo} alt="logo" width={113} height={30} />
          <SearchSmall
            onSearch={(value: string) => handleRiotNameSearch(value, router)}
            placeholder="플레이어 이름#KR1"
          />
        </div>
        <div>
          <NavBar />
        </div>
      </header>
      <h1>
        {riotName}의 프로필 (서버: {riotNameTag})
      </h1>
    </div>
  );
};

export default RiotProfilePage;
