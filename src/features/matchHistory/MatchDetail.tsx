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
      spellNames: [participant.summonerSpell1Name, participant.summonerSpell2Name],
      keystone: participant.keystoneIcon,
      keystoneName: participant.keystoneName,
      perk: participant.substyleIcon,
      perkName: participant.substyleName,
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

  const allMapped = [...winParticipants, ...loseParticipants];
  const maxDamage = Math.max(...allMapped.map((p) => p.damage), 1);
  const maxDamageTaken = Math.max(...allMapped.map((p) => p.damageTaken), 1);

  return (
    <>
      {/* PC */}
      <div className="hidden sm:flex sm:flex-col">
        <MatchDetailTable
          players={winParticipants}
          isWin
          maxDamage={maxDamage}
          maxDamageTaken={maxDamageTaken}
        />
        <MatchDetailTable
          players={loseParticipants}
          isWin={false}
          maxDamage={maxDamage}
          maxDamageTaken={maxDamageTaken}
        />
      </div>

      {/* 모바일 */}
      <div className="flex flex-col sm:hidden">
        <MatchDetailTableMobile
          players={winParticipants}
          isWin
          maxDamage={maxDamage}
          maxDamageTaken={maxDamageTaken}
        />
        <MatchDetailTableMobile
          players={loseParticipants}
          isWin={false}
          maxDamage={maxDamage}
          maxDamageTaken={maxDamageTaken}
        />
      </div>
    </>
  );
};

export default MatchDetail;
