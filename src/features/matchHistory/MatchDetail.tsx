import MatchLoserDetail from "@/features/matchHistory/MatchLoserDetail";
import MatchWinnerDetail from "@/features/matchHistory/MatchWinnerDetail";
import { GameParticipant } from "@/data/types/record";

interface Props {
  participantData: GameParticipant[];
}
const MatchDetail = ({ participantData }: Props) => {
  const winParticipants = participantData
    .filter((participant) => participant.game_result === "승")
    .map((participant) => ({
      name: participant.riot_name,
      championImage: `https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/champion/${participant.champ_name_eng}.png`,
      kda: `${participant.kill} / ${participant.death} / ${participant.assist}`,
      damage: participant.total_damage_champions,
      wards: participant.vision_bought,
    }));

  const loseParticipants = participantData
    .filter((participant) => participant.game_result === "패")
    .map((participant) => ({
      name: participant.riot_name,
      championImage: `https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/champion/${participant.champ_name_eng}.png`,
      kda: `${participant.kill} / ${participant.death} / ${participant.assist}`,
      damage: participant.total_damage_champions,
      wards: participant.vision_bought,
    }));

  return (
    <div className="flex flex-col">
      {/* 승리 팀 상세 정보 */}
      <MatchWinnerDetail players={winParticipants} />

      {/* 패배 팀 상세 정보 */}
      <MatchLoserDetail players={loseParticipants} />
    </div>
  );
};

export default MatchDetail;
