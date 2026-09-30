import { useCallback, useEffect, useState } from "react";
import {
  CompetitionApplicationItem,
  CompetitionPosition,
  CompetitionTeamWithRoster,
  RosterSaveInput,
} from "@/data/types/competition";
import { sortByPosition } from "@/features/competition/competitionMeta";

/** 팀에 놓인 사람. 신청서 정보를 그대로 들고 있어야 칩·팀 카드가 같은 값을 보여준다. */
export interface RosterSlotMember {
  playerCode: string;
  riotName: string;
  riotNameTag: string;
  /** 신청서의 주 라인. 신청서가 없으면 null */
  position: CompetitionPosition | null;
}

export interface DraftTeam {
  /** 서버에 이미 있는 팀이면 id가 있다. 없으면 저장 시 생성된다. */
  id?: number;
  name: string;
  captainPlayerCode: string | null;
  members: RosterSlotMember[];
}

/** 백엔드 MAX_TEAMS_PER_COMPETITION과 같은 값. 넘기면 409 team-limit-exceeded. */
export const MAX_TEAMS = 20;

const emptyTeam = (index: number): DraftTeam => ({
  name: `${index + 1}팀`,
  captainPlayerCode: null,
  members: [],
});

const fromServer = (teams: CompetitionTeamWithRoster[]): DraftTeam[] =>
  teams.map((team) => ({
    id: team.id,
    name: team.name,
    captainPlayerCode: team.captainPlayerCode,
    members: sortByPosition(
      team.roster.map((member) => ({
        playerCode: member.playerCode,
        riotName: member.riotName,
        riotNameTag: member.riotNameTag,
        position: member.position,
      }))
    ),
  }));

/**
 * 로스터 편성 초안. 저장(PUT /roster)은 전체를 한 번에 보내고 payload에 없는 팀은 삭제되므로,
 * 화면 상태가 곧 저장될 전체 모습이다.
 */
const useRosterDraft = (serverTeams: CompetitionTeamWithRoster[], ready: boolean) => {
  const [teams, setTeams] = useState<DraftTeam[]>([]);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  // 서버 팀 구성이 바뀔 때만 초안을 다시 세운다. 편집 중 재조회가 덮어쓰지 않도록.
  const serverKey = ready ? serverTeams.map((team) => team.id).join(",") : null;
  useEffect(() => {
    if (!ready || serverKey === loadedKey) return;
    setTeams(fromServer(serverTeams));
    setLoadedKey(serverKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, serverKey]);

  /** 한 대회에서 한 사람은 한 팀에만 속할 수 있다(DB 유니크) — 배치 전에 다른 팀에서 뺀다. */
  const place = useCallback((member: RosterSlotMember, teamIndex: number) => {
    setTeams((prev) =>
      prev.map((team, index) => {
        const others = team.members.filter((m) => m.playerCode !== member.playerCode);
        if (index === teamIndex) {
          return { ...team, members: sortByPosition([...others, member]) };
        }
        const captainPlayerCode =
          team.captainPlayerCode === member.playerCode ? null : team.captainPlayerCode;
        return { ...team, members: others, captainPlayerCode };
      })
    );
  }, []);

  const removeMember = useCallback((teamIndex: number, playerCode: string) => {
    setTeams((prev) =>
      prev.map((team, index) => {
        if (index !== teamIndex) return team;
        return {
          ...team,
          members: team.members.filter((m) => m.playerCode !== playerCode),
          captainPlayerCode: team.captainPlayerCode === playerCode ? null : team.captainPlayerCode,
        };
      })
    );
  }, []);

  const addTeam = useCallback(
    () => setTeams((prev) => (prev.length >= MAX_TEAMS ? prev : [...prev, emptyTeam(prev.length)])),
    []
  );

  const removeTeam = useCallback(
    (teamIndex: number) => setTeams((prev) => prev.filter((_, index) => index !== teamIndex)),
    []
  );

  const renameTeam = useCallback(
    (teamIndex: number, name: string) =>
      setTeams((prev) =>
        prev.map((team, index) => (index === teamIndex ? { ...team, name } : team))
      ),
    []
  );

  const setCaptain = useCallback(
    (teamIndex: number, playerCode: string | null) =>
      setTeams((prev) =>
        prev.map((team, index) =>
          index === teamIndex ? { ...team, captainPlayerCode: playerCode } : team
        )
      ),
    []
  );

  const clearAll = useCallback(
    () =>
      setTeams((prev) => prev.map((team) => ({ ...team, members: [], captainPlayerCode: null }))),
    []
  );

  const placedCodes = new Set(
    teams.flatMap((team) => team.members.map((member) => member.playerCode))
  );

  const toPayload = (): RosterSaveInput => ({
    teams: teams.map((team) => ({
      id: team.id,
      name: team.name.trim(),
      captainPlayerCode: team.captainPlayerCode,
      members: team.members.map((member) => ({ playerCode: member.playerCode })),
    })),
  });

  /** 저장 전 검증 — 백엔드 유니크 제약(팀명)과 필수값을 미리 걸러 400·409를 줄인다. */
  const validate = (): string | null => {
    if (teams.length === 0) return "팀을 하나 이상 추가해주세요.";
    if (teams.length > MAX_TEAMS) return `한 대회에 팀은 ${MAX_TEAMS}개까지 만들 수 있습니다.`;
    const names = teams.map((team) => team.name.trim());
    if (names.some((name) => name.length === 0)) return "팀명을 모두 입력해주세요.";
    if (new Set(names).size !== names.length) return "팀명이 중복되었습니다.";
    return null;
  };

  return {
    teams,
    placedCodes,
    placedCount: placedCodes.size,
    canAddTeam: teams.length < MAX_TEAMS,
    place,
    removeMember,
    addTeam,
    removeTeam,
    renameTeam,
    setCaptain,
    clearAll,
    toPayload,
    validate,
  };
};

/** 승인된 신청서만 로스터에 올릴 수 있다. */
export const approvedApplicants = (
  applications: CompetitionApplicationItem[]
): CompetitionApplicationItem[] =>
  applications.filter((application) => application.status === "APPROVED");

export default useRosterDraft;
