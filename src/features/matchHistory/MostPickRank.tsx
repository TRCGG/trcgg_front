import { MostPickStats } from "@/data/types/record";
import RankItem from "./RankItem";

interface Props {
  mostPickData: MostPickStats[];
}

const MostPickRank = ({ mostPickData }: Props) => {
  const rankData = mostPickData.map((champRecord, index) => {
    return {
      rank: index + 1,
      championName: champRecord.champName,
      kda: champRecord.kda,
      winRate: champRecord.winRate,
      games: champRecord.totalCount,
      championImg: `https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/champion/${champRecord.champName}.png`,
    };
  });

  return (
    <div className="flex flex-col gap-2 sm:gap-4">
      {rankData.map((data) => (
        <RankItem key={data.rank} {...data} />
      ))}
    </div>
  );
};

export default MostPickRank;
