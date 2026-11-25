import api from "@/services/index";
import { unwrap } from "@/services/apiService";
import {
  IssueTournamentCodesInput,
  TournamentCode,
  TournamentCodesResponse,
} from "@/data/types/tournament";

// 한 번에 발급한 코드 묶음이 목록 끝에서 잘리지 않도록 최대치로 받는다.
const LIST_LIMIT = 100;

export const getTournamentCodes = async (guildId: string): Promise<TournamentCode[]> => {
  const data = await unwrap(
    api.get<TournamentCodesResponse>(`/api/tournament/${guildId}/codes?limit=${LIST_LIMIT}`)
  );
  return data?.codes ?? [];
};

export const issueTournamentCodes = async (
  guildId: string,
  input: IssueTournamentCodesInput
): Promise<TournamentCode[]> => {
  const data = await unwrap(
    api.post<TournamentCodesResponse>(`/api/tournament/${guildId}/codes`, input)
  );
  return data?.codes ?? [];
};
