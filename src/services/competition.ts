import { unwrap } from "@/services/apiService";
import api from "@/services/index";
import buildQuery from "@/utils/buildQuery";
import {
  ApplicationDecideInput,
  ApplicationListResponse,
  ApplicationMutationResponse,
  ApplicationResponse,
  Competition,
  CompetitionApplicationItem,
  CompetitionApplicationStatus,
  CompetitionApplicationUpdateInput,
  CompetitionApplyInput,
  CompetitionChampionStat,
  CompetitionChampionStatResponse,
  CompetitionCreateInput,
  CompetitionDetail,
  CompetitionDetailResponse,
  CompetitionGameType,
  CompetitionHeadToHeadResult,
  CompetitionListResponse,
  CompetitionMatchTeamItem,
  CompetitionPosition,
  CompetitionRemoveResponse,
  CompetitionRemoveResult,
  CompetitionResolveResponse,
  CompetitionResolveResult,
  CompetitionResponse,
  CompetitionStandings,
  CompetitionStatus,
  CompetitionSummary,
  CompetitionTeamRecordItem,
  CompetitionTeamRoster,
  CompetitionTeamWithRoster,
  CompetitionUpdateInput,
  CompetitionUserStat,
  CompetitionUserStatResponse,
  HeadToHeadResponse,
  MatchGameTypeChangeResponse,
  MatchGameTypeChangeResult,
  MatchTeamAssignInput,
  MatchTeamListResponse,
  PlayerCompetitionItem,
  PlayerCompetitionListResponse,
  RosterSaveInput,
  StandingsResponse,
  TeamListResponse,
  TeamRecordListResponse,
  TeamResponse,
} from "@/data/types/competition";

// guildId는 useGuildManagement가 보관하는 이미 Base64 인코딩된 값 — 그대로 path에 쓴다
// (백엔드 competition.routes가 decodeGuildIdMiddleware로 디코드한다).
const BASE = (guildId: string) => `/api/competitions/${guildId}`;

// ── 대회 ──

export const createCompetition = async (
  guildId: string,
  body: CompetitionCreateInput
): Promise<Competition> => {
  return unwrap(api.post<CompetitionResponse>(BASE(guildId), body));
};

export const getCompetitions = async (
  guildId: string,
  params?: { season?: string; status?: CompetitionStatus }
): Promise<CompetitionSummary[]> => {
  const query = buildQuery({ season: params?.season, status: params?.status });
  return unwrap(api.get<CompetitionListResponse>(`${BASE(guildId)}${query}`));
};

/** 이름 생략 시 진행중 대회, 없으면 최근 종료 대회를 돌려준다. */
export const resolveCompetition = async (
  guildId: string,
  name?: string
): Promise<CompetitionResolveResult> => {
  return unwrap(
    api.get<CompetitionResolveResponse>(`${BASE(guildId)}/resolve${buildQuery({ name })}`)
  );
};

export const getCompetitionDetail = async (
  guildId: string,
  competitionId: number
): Promise<CompetitionDetail> => {
  return unwrap(api.get<CompetitionDetailResponse>(`${BASE(guildId)}/${competitionId}`));
};

export const updateCompetition = async (
  guildId: string,
  competitionId: number,
  body: CompetitionUpdateInput
): Promise<Competition> => {
  return unwrap(api.patch<CompetitionResponse>(`${BASE(guildId)}/${competitionId}`, body));
};

export const changeCompetitionStatus = async (
  guildId: string,
  competitionId: number,
  status: CompetitionStatus
): Promise<Competition> => {
  return unwrap(
    api.patch<CompetitionResponse>(`${BASE(guildId)}/${competitionId}/status`, { status })
  );
};

/**
 * 대회 삭제. 대회명을 confirmName으로 다시 받아 확인하고, 속한 경기를 함께 soft-delete한다.
 */
export const removeCompetition = async (
  guildId: string,
  competitionId: number,
  confirmName: string
): Promise<CompetitionRemoveResult> => {
  return unwrap(
    api.delete<CompetitionRemoveResponse>(`${BASE(guildId)}/${competitionId}`, {
      body: { confirmName },
    })
  );
};

// ── 신청 ──

export const applyToCompetition = async (
  guildId: string,
  competitionId: number,
  body: CompetitionApplyInput
): Promise<ApplicationMutationResponse["data"]> => {
  return unwrap(
    api.post<ApplicationMutationResponse>(`${BASE(guildId)}/${competitionId}/applications`, body)
  );
};

/** 본인 신청서. 신청 이력이 없으면 data가 null이다. */
export const getMyApplication = async (
  guildId: string,
  competitionId: number
): Promise<CompetitionApplicationItem | null> => {
  return unwrap(api.get<ApplicationResponse>(`${BASE(guildId)}/${competitionId}/applications/me`));
};

export const updateMyApplication = async (
  guildId: string,
  competitionId: number,
  body: CompetitionApplicationUpdateInput
): Promise<ApplicationMutationResponse["data"]> => {
  return unwrap(
    api.patch<ApplicationMutationResponse>(
      `${BASE(guildId)}/${competitionId}/applications/me`,
      body
    )
  );
};

export const cancelMyApplication = async (
  guildId: string,
  competitionId: number
): Promise<CompetitionApplicationItem | null> => {
  return unwrap(
    api.delete<ApplicationResponse>(`${BASE(guildId)}/${competitionId}/applications/me`)
  );
};

export const getApplications = async (
  guildId: string,
  competitionId: number,
  params?: { status?: CompetitionApplicationStatus }
): Promise<CompetitionApplicationItem[]> => {
  const query = buildQuery({ status: params?.status });
  return unwrap(
    api.get<ApplicationListResponse>(`${BASE(guildId)}/${competitionId}/applications${query}`)
  );
};

/** 일괄 승인·거절. status를 PENDING으로 보내면 결정을 되돌린다. */
export const decideApplications = async (
  guildId: string,
  competitionId: number,
  body: ApplicationDecideInput
): Promise<CompetitionApplicationItem[]> => {
  return unwrap(
    api.patch<ApplicationListResponse>(
      `${BASE(guildId)}/${competitionId}/applications/decide`,
      body
    )
  );
};

// ── 팀·로스터 ──

export const createTeam = async (
  guildId: string,
  competitionId: number,
  name: string
): Promise<CompetitionTeamRoster> => {
  return unwrap(api.post<TeamResponse>(`${BASE(guildId)}/${competitionId}/teams`, { name }));
};

export const getTeams = async (
  guildId: string,
  competitionId: number
): Promise<CompetitionTeamWithRoster[]> => {
  return unwrap(api.get<TeamListResponse>(`${BASE(guildId)}/${competitionId}/teams`));
};

/** 로스터 전체 저장. payload에 없는 팀은 삭제되므로 항상 전체를 보낸다. */
export const saveRoster = async (
  guildId: string,
  competitionId: number,
  body: RosterSaveInput
): Promise<CompetitionTeamWithRoster[]> => {
  return unwrap(api.put<TeamListResponse>(`${BASE(guildId)}/${competitionId}/roster`, body));
};

export const updateTeam = async (
  guildId: string,
  competitionId: number,
  teamId: number,
  body: { name?: string; captainPlayerCode?: string | null }
): Promise<CompetitionTeamRoster> => {
  return unwrap(api.patch<TeamResponse>(`${BASE(guildId)}/${competitionId}/teams/${teamId}`, body));
};

export const removeTeam = async (
  guildId: string,
  competitionId: number,
  teamId: number
): Promise<CompetitionTeamRoster> => {
  return unwrap(api.delete<TeamResponse>(`${BASE(guildId)}/${competitionId}/teams/${teamId}`));
};

export const addTeamMember = async (
  guildId: string,
  competitionId: number,
  teamId: number,
  body: { playerCode: string; position: CompetitionPosition }
): Promise<CompetitionTeamRoster> => {
  return unwrap(
    api.post<TeamResponse>(`${BASE(guildId)}/${competitionId}/teams/${teamId}/members`, body)
  );
};

export const removeTeamMember = async (
  guildId: string,
  competitionId: number,
  teamId: number,
  playerCode: string
): Promise<CompetitionTeamRoster> => {
  return unwrap(
    api.delete<TeamResponse>(
      `${BASE(guildId)}/${competitionId}/teams/${teamId}/members/${encodeURIComponent(playerCode)}`
    )
  );
};

/** 이 팀의 상대 팀별 전적(스크림·본경기 분리). 항목마다 상대 팀 하나다. */
export const getTeamRecords = async (
  guildId: string,
  competitionId: number,
  teamId: number
): Promise<CompetitionTeamRecordItem[]> => {
  return unwrap(
    api.get<TeamRecordListResponse>(`${BASE(guildId)}/${competitionId}/teams/${teamId}/records`)
  );
};

// ── 경기 ──

export const getCompetitionMatches = async (
  guildId: string,
  competitionId: number,
  params?: { unassigned?: boolean }
): Promise<CompetitionMatchTeamItem[]> => {
  const query = buildQuery({
    unassigned: params?.unassigned === undefined ? undefined : String(params.unassigned),
  });
  return unwrap(
    api.get<MatchTeamListResponse>(`${BASE(guildId)}/${competitionId}/matches${query}`)
  );
};

/** 경기 한 건의 진영별 팀 귀속. null을 보내면 귀속을 해제한다. */
export const assignMatchTeams = async (
  guildId: string,
  competitionId: number,
  customMatchId: string,
  body: MatchTeamAssignInput
): Promise<CompetitionMatchTeamItem[]> => {
  return unwrap(
    api.put<MatchTeamListResponse>(
      `${BASE(guildId)}/${competitionId}/matches/${encodeURIComponent(customMatchId)}/teams`,
      body
    )
  );
};

/** 경기 유형 일괄 변경(2=스크림 / 3=본경기). 최대 100건. */
export const changeMatchGameType = async (
  guildId: string,
  competitionId: number,
  body: { customMatchIds: string[]; gameType: CompetitionGameType }
): Promise<MatchGameTypeChangeResult> => {
  return unwrap(
    api.patch<MatchGameTypeChangeResponse>(
      `${BASE(guildId)}/${competitionId}/matches/game-type`,
      body
    )
  );
};

// ── 순위표·전적·통계 ──

export const getStandings = async (
  guildId: string,
  competitionId: number
): Promise<CompetitionStandings> => {
  return unwrap(api.get<StandingsResponse>(`${BASE(guildId)}/${competitionId}/standings`));
};

/** 두 팀의 맞대결 전적 + 경기 목록. 응답이 배열이 아니라 단일 객체다. */
export const getTeamHeadToHead = async (
  guildId: string,
  competitionId: number,
  teamA: number,
  teamB: number
): Promise<CompetitionHeadToHeadResult> => {
  const query = buildQuery({ teamA, teamB });
  return unwrap(api.get<HeadToHeadResponse>(`${BASE(guildId)}/${competitionId}/records${query}`));
};

interface CompetitionStatisticsParams {
  position?: "ALL" | CompetitionPosition;
  sortBy?: "totalCount" | "winRate";
  page?: number;
  limit?: number;
  /** "2" | "3" | "2,3" — 생략 시 전체 */
  gameType?: string;
}

export const getCompetitionUserStatistics = async (
  guildId: string,
  competitionId: number,
  params?: CompetitionStatisticsParams
): Promise<CompetitionUserStat[]> => {
  const query = buildQuery({ ...params });
  return unwrap(
    api.get<CompetitionUserStatResponse>(
      `${BASE(guildId)}/${competitionId}/statistics/users${query}`
    )
  );
};

export const getCompetitionChampionStatistics = async (
  guildId: string,
  competitionId: number,
  params?: CompetitionStatisticsParams
): Promise<CompetitionChampionStat[]> => {
  const query = buildQuery({ ...params });
  return unwrap(
    api.get<CompetitionChampionStatResponse>(
      `${BASE(guildId)}/${competitionId}/statistics/champions${query}`
    )
  );
};

/** 선수 한 명이 참여한 대회 목록 — 전적 페이지의 대회 탭에서 쓴다. */
export const getPlayerCompetitions = async (
  guildId: string,
  playerCode: string,
  params?: { status?: CompetitionStatus }
): Promise<PlayerCompetitionItem[]> => {
  const query = buildQuery({ status: params?.status });
  return unwrap(
    api.get<PlayerCompetitionListResponse>(
      `${BASE(guildId)}/players/${encodeURIComponent(playerCode)}/competitions${query}`
    )
  );
};
