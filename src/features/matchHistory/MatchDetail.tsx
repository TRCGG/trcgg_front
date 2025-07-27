import { GameParticipant } from "@/data/types/record";
import MatchDetailTable from "@/features/matchHistory/MatchDetailTable";

interface Props {
  participantData: GameParticipant[];
}
const MatchDetail = ({ participantData }: Props) => {
  const mapParticipantData = (participants: GameParticipant[]) => {
    const totalTeamKills = participants.reduce((sum, p) => sum + p.kill, 0);
    return participants.map((participant) => ({
      name: participant.riot_name,
      tag: participant.riot_name_tag,
      championImage: `https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/champion/${participant.champ_name_eng}.png`,
      kda: `${participant.kill} / ${participant.death} / ${participant.assist}`,
      kdaRate: (participant.kill + participant.assist) / participant.death,
      damage: participant.total_damage_champions,
      damageTaken: participant.total_damage_taken,
      visionScore: participant.vision_score,
      wards: participant.vision_bought,
      items: [
        participant.item0,
        participant.item1,
        participant.item2,
        participant.item3,
        participant.item4,
        participant.item5,
        // matchData.item6, // Trinket(와드 토템, 예언자의 렌즈, 파란 정찰 와드 등을 통칭
      ],
      spells: [participant.summoner_spell_1, participant.summoner_spell_2],
      keystone: participant.keystone_id,
      perk: participant.perk_sub_style,
      killParticipation: totalTeamKills
        ? Number((((participant.kill + participant.assist) / totalTeamKills) * 100).toFixed(2))
        : 0,
    }));
  };

  const winParticipants = mapParticipantData(
    participantData.filter((participant) => participant.game_result === "승")
  );

  const loseParticipants = mapParticipantData(
    participantData.filter((participant) => participant.game_result === "패")
  );

  return (
    <div className="flex flex-col">
      {/* 승리 팀 상세 정보 */}
      <MatchDetailTable players={winParticipants} isWin />

      {/* 패배 팀 상세 정보 */}
      <MatchDetailTable players={loseParticipants} isWin={false} />
    </div>
  );
};

export default MatchDetail;
