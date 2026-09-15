export type ReplayFailReason =
  | "invalid_extension"
  | "invalid_format"
  | "parse_failed"
  | "duplicate"
  | "save_failed";

/**
 * 대회 경기의 자동 팀 귀속 결과. 일반내전이면 null.
 * assigned=양 진영 모두 팀에 붙음, mercenary=한쪽만(용병전),
 * unassigned=자동 판정 실패 — 운영진이 경기 탭에서 직접 지정해야 한다.
 */
export interface ReplayTeamAssignment {
  status: "assigned" | "mercenary" | "unassigned";
  blueTeamId?: number | null;
  redTeamId?: number | null;
}

export interface ReplayUploadSuccess {
  fileName: string;
  replayCode: string;
  teamAssignment?: ReplayTeamAssignment | null;
}

export interface ReplayUploadFailed {
  fileName: string;
  reason: ReplayFailReason;
}

export interface ReplayUploadData {
  succeeded: ReplayUploadSuccess[];
  failed: ReplayUploadFailed[];
}

export interface ReplayUploadResponse {
  status: string;
  message: string;
  data: ReplayUploadData;
}

export interface ReplayLog {
  replayCode: string;
  fileName: string;
  gameType: string;
  season: string;
  patchVersion: string;
  createUser: string;
  guildId: string;
  createDate: string;
}

export interface ReplayListResponse {
  data: ReplayLog[];
}
