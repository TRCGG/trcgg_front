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
    <div className="w-full max-w-[1080px] mx-auto">
      <header className="flex justify-between mt-10 items-center gap-10 min-w-[1080px]">
        <div className="flex items-center gap-4 min-w-[450px]">
          <Image
            src={TextLogo}
            alt="logo"
            layout="intrinsic"
            width={113}
            height={30}
            className="cursor-pointer"
            onClick={() => router.push("/")}
          />
          <SearchSmall
            onSearch={(value: string) => handleRiotNameSearch(value, router)}
            placeholder="플레이어 이름#KR1"
          />
        </div>
        <div>
          <NavBar />
        </div>
      </header>

      <main className="mt-14 flex flex-col gap-3 min-w-[1080px]">
        <UserStatsOverview riotName={riotNameString} />
        <div className="flex gap-3">
          <Card title="Most Pick" className="w-[35%]">
            <MostPickRank />
          </Card>
          <Card title="Recent Matches" className="w-[65%]">
            <MatchItem />
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RiotProfilePage;
