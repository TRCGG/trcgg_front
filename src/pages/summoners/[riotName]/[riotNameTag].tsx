import Image from "next/image";
import { useRouter } from "next/router";
import TextLogo from "@/assets/images/textLogo.png";
import NavBar from "@/components/layout/NavBar";
import SearchSmall from "@/components/form/SearchSmall";
import { handleRiotNameSearch } from "@/utils/parseRiotSearch";
import UserStatsOverview from "@/features/matchHistory/UserStatsOverview";
import Card from "@/components/ui/Card";

const RiotProfilePage = () => {
  const router = useRouter();
  const { riotName } = router.query;
  const riotNameString = Array.isArray(riotName) ? riotName[0] : riotName || "";

  return (
    <div className="min-w-[50rem] max-w-[70rem] mx-auto">
      <header className="flex justify-between mt-10 items-center">
        <div className="flex items-center gap-4">
          <Image
            src={TextLogo}
            alt="logo"
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
      <main className="mt-14 flex flex-col gap-3">
        <UserStatsOverview riotName={riotNameString} />
        <div className="flex gap-3">
          <Card title="Most Pick" className="w-[30%]">
            dddd
          </Card>
          <Card title="Recent Matches" className="w-[70%]">
            dddd
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RiotProfilePage;
