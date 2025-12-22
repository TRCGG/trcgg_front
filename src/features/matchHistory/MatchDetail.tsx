import { GameParticipant } from "@/data/types/record";
import MatchDetailTable from "@/features/matchHistory/MatchDetailTable";
import MatchDetailTableMobile from "@/features/matchHistory/MatchDetailTableMobile";

interface Props {
  participantData: GameParticipant[];
}
const MatchDetail = ({ participantData }: Props) => {
  const mapParticipantData = (participants: GameParticipant[]) => {
    const totalTeamKills = participants.reduce((sum, p) => sum + p.kill, 0);
    return participants.map((participant) => ({
      name: participant.riotName,
      tag: participant.riotNameTag,
      champNameEng: participant.champNameEng,
      kda: `${participant.kill} / ${participant.death} / ${participant.assist}`,
      kdaRate: (participant.kill + participant.assist) / participant.death,
      damage: participant.totalDamageChampions,
      damageTaken: participant.totalDamageTaken,
      visionScore: participant.visionScore,
      wards: participant.visionBought,
      items: [
        participant.item0,
        participant.item1,
        participant.item2,
        participant.item3,
        participant.item4,
        participant.item5,
        // participant.item6, // Trinket(와드 토템, 예언자의 렌즈, 파란 정찰 와드 등을 통칭)
      ],
      spells: [participant.summonerSpell1Key, participant.summonerSpell2Key],
      keystone: participant.keystoneIcon,
      perk: participant.substyleIcon,
      killParticipation: totalTeamKills
        ? Number((((participant.kill + participant.assist) / totalTeamKills) * 100).toFixed(2))
        : 0,
    }));
  };

  const winParticipants = mapParticipantData(
    participantData.filter((participant) => participant.gameResult === "승")
  );

  const loseParticipants = mapParticipantData(
    participantData.filter((participant) => participant.gameResult === "패")
  );

  return (
    <>
      {/* PC */}
      <div className="hidden sm:flex sm:flex-col">
        <MatchDetailTable players={winParticipants} isWin />
        <MatchDetailTable players={loseParticipants} isWin={false} />
      </div>

      {/* 모바일 */}
      <div className="flex flex-col sm:hidden">
        <MatchDetailTableMobile players={winParticipants} isWin />
        <MatchDetailTableMobile players={loseParticipants} isWin={false} />
      </div>
    </>
  );
};

export default MatchDetail;
