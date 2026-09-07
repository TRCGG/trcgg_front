import { ApiResponse } from "@/services/apiService";
import api from "@/services/index";
import { ChampionListResponse } from "@/data/types/champion";

/**
 * 챔피언 전체 목록(한글 이름순). 파라미터가 없다.
 * 대회 신청의 champions에 넣을 id를 여기서 얻는다.
 */
export const getChampions = async (): Promise<ApiResponse<ChampionListResponse>> => {
  try {
    return await api.get("/api/champions");
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
};
