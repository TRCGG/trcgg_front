import Image from "next/image";
import LaneMidLogo from "@/assets/images/laneMid.png";

interface Props {
  riotName: string | null;
}

const userStatsOverview = ({ riotName }: Props) => {
  return (
    <div
      className="flex bg-darkBg2 text-primary1 p-4 rounded border border-border2 relative bg-no-repeat bg-right-top w-full md:min-w-[1080px] mx-auto"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0) 100%), url(https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jhin_0.jpg)`,
        backgroundPosition: "top right",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* 라인 로고 */}
      <div className="min-w-[160px] min-h-[160px]">
        <Image src={LaneMidLogo} alt="lane logo" width={160} height={160} />
      </div>

      {/* 유저 정보 */}
      <div className="flex flex-col p-4 text-md gap-3">
        <div className="text-4xl font-bold">{riotName}</div>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="rounded-lg bg-primary1 text-darkBg2 w-12 font-bold text-center">전체</div>
          <div>85전 50승 35패 (58.82%)</div>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="rounded-lg bg-primary1 text-darkBg2 w-12 font-bold">이번달</div>
          <div>10전 3승 7패 (30%)</div>
        </div>
      </div>
    </div>
  );
};
export default userStatsOverview;
