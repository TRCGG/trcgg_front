import { ChampionRecord } from "@/data/types/record";
import RankItem from "./RankItem";

interface Props {
  mostPickData: ChampionRecord[];
}

const MostPickRank = ({ mostPickData }: Props) => {
  const rankData = mostPickData.map((champRecord, index) => {
    return {
      rank: index + 1,
      user: champRecord.champ_name,
      kda: champRecord.kda,
      winRate: champRecord.win_rate,
      games: champRecord.total_count,
      championImg: `https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/champion/${champRecord.champ_name_eng}.png`,
    };
  });

  return (
    <div className="flex flex-col gap-3">
      {rankData.map((data) => (
        <RankItem key={data.rank} {...data} />
      ))}
    </div>
  );
};

export default MostPickRank;
