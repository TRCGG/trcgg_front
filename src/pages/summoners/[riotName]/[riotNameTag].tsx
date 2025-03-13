import Image from "next/image";
import { useRouter } from "next/router";
import TextLogo from "@/assets/images/textLogo.png";
import NavBar from "@/components/layout/NavBar";
import SearchSmall from "@/components/form/SearchSmall";
import { handleRiotNameSearch } from "@/utils/parseRiotSearch";
import UserStatsOverview from "@/features/matchHistory/UserStatsOverview";
import Card from "@/components/ui/Card";
import MostPickRank from "@/features/matchHistory/MostPickRank";
import MatchItem from "@/features/matchHistory/MatchItem";

const RiotProfilePage = () => {
  const router = useRouter();
  const { riotName } = router.query;
  const riotNameString = Array.isArray(riotName) ? riotName[0] : riotName || "";

  return (
    <div className="w-full md:max-w-[1080px] mx-auto">
      <header className="flex flex-col md:flex-row justify-start md:justify-between mt-10 mx-[10px] md:mx-0 md:items-center md:gap-10 md:min-w-[1080px]">
        <div className="flex flex-col md:flex-row items-center gap-4 md:min-w-[450px]">
          {/* 로고 이미지 */}
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
          {/* 검색창 */}
          <SearchSmall
            onSearch={(value: string) => handleRiotNameSearch(value, router)}
            placeholder="플레이어 이름#KR1"
          />
        </div>
        <div>
          <NavBar />
        </div>
      </header>

      <main className="mt-14 flex flex-col gap-3 md:min-w-[1080px]">
        <UserStatsOverview riotName={riotNameString} />
        <div className="flex gap-3 flex-col md:flex-row">
          <Card title="Most Pick" className="md:w-[35%] w-full self-start">
            <MostPickRank />
          </Card>
          <Card title="Recent Matches" className="w-full md:w-[65%]">
            <div className="flex flex-1 flex-col gap-4">
              <MatchItem />
              <MatchItem />
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RiotProfilePage;
