import { ApiResponse } from "@/services/apiService";

/**
 * 대회 API 에러를 화면 문구로 바꾼다.
 * 생성·수정은 409가 두 종류(진행중 중복 / 이름 중복)라 상태 코드만으로 구분되지 않아
 * Problem Details의 type을 먼저 본다.
 */
export const competitionErrorMessage = (res: ApiResponse<unknown>): string => {
  switch (res.errorType) {
    case "competition-in-progress-exists":
      return "이미 진행중인 대회가 있습니다. 그 대회를 종료한 뒤 다시 시도해주세요.";
    case "competition-name-exists":
      return "같은 이름의 대회가 이미 있습니다. 다른 이름을 사용해주세요.";
    case "competition-closed":
      return "종료된 대회입니다.";
    default:
      break;
  }

  if (res.status === 403) return "운영진만 할 수 있는 작업입니다.";
  if (res.status === 404) return "대회를 찾을 수 없습니다.";
  if (res.status === 400) return res.error ?? "요청이 올바르지 않습니다.";
  if (res.status === 409) return res.error ?? "이미 처리된 요청입니다.";
  return "요청에 실패했습니다. 잠시 후 다시 시도해주세요.";
};
