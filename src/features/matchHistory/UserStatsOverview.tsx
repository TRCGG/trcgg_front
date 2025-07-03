import Image from "next/image";
import LaneMidLogo from "@/assets/images/laneMid.png";
import { SummaryData } from "@/data/types/record";

interface Props {
  riotName: string | null;
  monthData: SummaryData | undefined;
}

const userStatsOverview = ({ riotName, monthData }: Props) => {
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
        {monthData && (
          <div className="flex flex-col md:flex-row gap-3">
            <div className="rounded-lg bg-primary1 text-darkBg2 w-12 font-bold text-center">
              전체
            </div>
            <div>
              {monthData.total_count}전 {monthData.win}승 {monthData.lose}패 ({monthData.win_rate}
              %)
            </div>
          </div>
        )}
        <div>
          {monthData && (
            <div className="flex flex-col md:flex-row gap-3">
              <div className="rounded-lg bg-primary1 text-darkBg2 w-12 font-bold text-center">
                이번달
              </div>
              <div>
                {monthData.total_count}전 {monthData.win}승 {monthData.lose}패 ({monthData.win_rate}
                %)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default userStatsOverview;
