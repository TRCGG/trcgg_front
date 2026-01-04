import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import { MdRefresh } from "react-icons/md";
import LaneTopLogo from "@/assets/images/laneTop.png";
import LaneJungleLogo from "@/assets/images/laneJungle.png";
import LaneMidLogo from "@/assets/images/laneMid.png";
import LaneSupportLogo from "@/assets/images/laneSupport.png";
import LaneBottomLogo from "@/assets/images/laneBottom.png";
import { SummaryStats } from "@/data/types/record";

interface Props {
  riotName: string;
  riotTag: string;
  monthData: SummaryStats;
  mostChampion: string;
  mostLane: string;
  totalData: { totalGameCount: number; winCount: number; loseCount: number; winRate: string };
  onRefresh?: () => Promise<void>;
}

const laneImageMap: Record<string, StaticImageData> = {
  MID: LaneMidLogo,
  TOP: LaneTopLogo,
  JUG: LaneJungleLogo,
  ADC: LaneBottomLogo,
  SUP: LaneSupportLogo,
};

const UserStatsOverview = ({
  riotName,
  riotTag,
  monthData,
  mostChampion,
  mostLane,
  totalData,
  onRefresh,
}: Props) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = async () => {
    if (!onRefresh || isRefreshing) return;

    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div
      className="flex flex-col sm:flex-row bg-darkBg2 text-primary1 p-4 rounded border border-border2 relative bg-no-repeat bg-right-top w-full md:min-w-[1080px] mx-auto"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0) 100%), url(https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${mostChampion}_0.jpg)`,
        backgroundPosition: "top right",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* 라인 로고 */}
      <div className="w-[130px] h-[130px] sm:w-[140px] sm:h-[140px]">
        <Image
          src={laneImageMap[mostLane] || LaneMidLogo}
          alt="lane logo"
          width={160}
          height={160}
          className="w-full h-full object-contain"
        />
      </div>

      {/* 유저 정보 */}
      <div className="flex flex-col p-4 gap-3 flex-1">
        <div className="text-3xl md:text-4xl font-bold text-white">
          {riotName} <span className="font-medium text-gray">#{riotTag}</span>
        </div>

        {totalData && (
          <div className="flex flex-row gap-2">
            <div className="flex items-center justify-center rounded-lg bg-primary1 text-darkBg2 w-12 h-6 font-bold">
              전체
            </div>
            <div className="flex items-center text-white">
              {totalData.totalGameCount}전 {totalData.winCount}승 {totalData.loseCount}패 (
              {totalData.winRate}
              %)
            </div>
          </div>
        )}

        {monthData && (
          <div className="flex flex-row gap-2">
            <div className="flex items-center justify-center rounded-lg bg-primary1 text-darkBg2 w-12 h-6 font-bold">
              이번달
            </div>
            <div className="flex items-center text-white">
              {monthData.totalCount}전 {monthData.win}승 {monthData.lose}패 ({monthData.winRate}%)
            </div>
          </div>
        )}
      </div>

      {/* 새로고침 버튼 */}
      {onRefresh && (
        <div className="flex items-center justify-center sm:justify-end p-4 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleRefreshClick}
            disabled={isRefreshing}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isRefreshing ? "bg-white text-darkBg2" : "bg-primary1 text-darkBg2 hover:bg-primary2"
            } disabled:cursor-not-allowed`}
          >
            <MdRefresh className={`text-xl ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="font-medium">{isRefreshing ? "갱신중" : "새로고침"}</span>
          </button>
        </div>
      )}
    </div>
  );
};
export default UserStatsOverview;
