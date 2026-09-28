import api from "@/services/index";
import { unwrap } from "@/services/apiService";
import {
  ReplayListResponse,
  ReplayLog,
  ReplayUploadData,
  ReplayUploadResponse,
} from "@/data/types/replay";

// 업로드가 응답 없이 무한 대기(펜딩)하는 것을 막기 위한 요청 타임아웃(ms)
const UPLOAD_TIMEOUT_MS = 120000;

export const uploadReplays = async (
  guildId: string,
  files: File[],
  nick: string,
  /**
   * 대회 귀속. gameType 2(스크림)·3(본경기)에만 competitionId를 붙일 수 있고, 생략하면
   * 백엔드가 길드의 진행중 대회를 찾는다. gameType 1(일반내전)에 competitionId를 주면 400.
   */
  scope?: { gameType?: "1" | "2" | "3"; competitionId?: number }
): Promise<ReplayUploadData> => {
  const decodedGuildId = atob(guildId);
  const formData = new FormData();
  formData.append("guildId", decodedGuildId);
  formData.append("nick", nick);
  if (scope?.gameType) formData.append("gameType", scope.gameType);
  if (scope?.competitionId != null) formData.append("competitionId", String(scope.competitionId));
  files.forEach((file) => formData.append("files", file));

  // FormData는 axios가 multipart boundary까지 붙여 준다.
  return unwrap(
    api.post<ReplayUploadResponse>("/api/replays/web", formData, { timeout: UPLOAD_TIMEOUT_MS })
  );
};

export const getReplayList = async (guildId: string): Promise<ReplayLog[]> => {
  return unwrap(api.get<ReplayListResponse>(`/api/replays/${guildId}`));
};

// 리플레이 삭제 — 목록의 replayCode가 삭제 API의 gameId에 매치됨. guildId는 이미 Base64
export const deleteReplay = async (guildId: string, gameId: string): Promise<void> => {
  await api.delete(`/api/matches/${guildId}/games/${gameId}`);
};
