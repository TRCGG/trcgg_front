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
    case "competition-not-recruiting":
      return "모집 중인 대회만 신청을 받습니다.";
    case "application-duplicate":
      return "이미 이 대회에 신청한 계정입니다.";
    case "champion-not-found":
      return "등록되지 않은 챔피언이 있습니다. 목록에서 다시 골라주세요.";
    case "champion-duplicate":
      return "같은 챔피언을 두 번 고를 수 없습니다.";
    case "sub-position-invalid":
      return "부 포지션이 올바르지 않습니다. 주 포지션과 겹칠 수 없고 '전체'는 단독으로만 고를 수 있습니다.";
    case "match-team-required":
      return "한쪽 진영에는 팀이 있어야 합니다. 양쪽을 모두 비울 수는 없습니다.";
    case "match-team-duplicate":
      return "같은 팀을 양쪽 진영에 둘 수 없습니다.";
    case "team-not-in-competition":
      return "이 대회에 속한 팀이 아닙니다.";
    case "match-not-found":
      return "이 대회에서 해당 경기를 찾을 수 없습니다.";
    case "team-limit-exceeded":
      return "한 대회에 팀은 20개까지 만들 수 있습니다.";
    case "roster-limit-exceeded":
      return "한 팀에 5명까지 편성할 수 있습니다.";
    case "team-name-exists":
      return "같은 이름의 팀이 있습니다. 팀명을 다르게 지어주세요.";
    case "team-duplicate":
      return "같은 팀이 두 번 들어갔습니다. 새로고침 후 다시 시도해주세요.";
    case "team-not-found":
      return "삭제된 팀이 포함돼 있습니다. 새로고침 후 다시 시도해주세요.";
    case "team-has-matches":
      return "경기가 귀속된 팀은 삭제할 수 없습니다. 경기 결과 탭에서 해당 경기의 팀 배정을 먼저 해제해주세요.";
    default:
      break;
  }

  if (res.status === 403) return "운영진만 할 수 있는 작업입니다.";
  if (res.status === 404) return "대회를 찾을 수 없습니다.";
  if (res.status === 400) return res.error ?? "요청이 올바르지 않습니다.";
  if (res.status === 409) return res.error ?? "이미 처리된 요청입니다.";
  return "요청에 실패했습니다. 잠시 후 다시 시도해주세요.";
};
