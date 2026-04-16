export type ReplayFailReason =
  | "invalid_extension"
  | "invalid_format"
  | "parse_failed"
  | "duplicate"
  | "save_failed";

export interface ReplayUploadSuccess {
  fileName: string;
  replayCode: string;
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
