import { useRouter } from "next/router";
import { SynergyStats } from "@/data/types/record";

interface Props {
  synergyData: SynergyStats[];
}

const TeamworkStats = ({ synergyData }: Props) => {
  const router = useRouter();

  const handleClick = (riotName: string, riotTag: string) => {
    router.push(`/summoners/${encodeURIComponent(riotName)}/${encodeURIComponent(riotTag)}`);
  };

  return (
    <div className="flex flex-col gap-1 sm:gap-4">
      {synergyData.map((synergy) => (
        <button
          key={`${synergy.riotName}-${synergy.riotNameTag}`}
          type="button"
          onClick={() => handleClick(synergy.riotName, synergy.riotNameTag)}
          className="bg-darkBg1 rounded border border-border2 p-2 sm:p-3 flex items-center gap-2 sm:gap-4 hover:bg-grayHover transition-colors text-left w-full"
        >
          {/* 닉네임 */}
          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm text-primary1 truncate hover:text-primary2">
              {synergy.riotName}
            </div>
            <div className="text-xs text-primary2">#{synergy.riotNameTag}</div>
          </div>

          {/* 전적과 승률 */}
          <div className="text-right">
            <div className="text-xs sm:text-sm text-primary1">
              {synergy.totalCount}전 {synergy.win}승 {synergy.lose}패
            </div>
            <div className="text-xs text-primary2 mt-0.5 sm:mt-1">승률 {synergy.winRate}%</div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default TeamworkStats;
