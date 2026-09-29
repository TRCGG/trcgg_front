/**
 * API 요청 실패를 나타내는 예외.
 *
 * 이전 클라이언트는 실패를 throw하지 않고 { data: null, error } 객체로 resolve했다.
 * 그래서 React Query가 실패를 성공으로 간주해 isError가 영영 false였고, 서버 에러가
 * "검색 결과 없음"으로 표시됐다. 실패는 반드시 reject로 전파되어야 한다.
 *
 * status/errorType을 함께 싣는 이유: 화면 문구 매핑(competitionErrors.ts)이 HTTP 상태와
 * Problem Details의 type을 모두 보고 분기하기 때문에, 메시지 문자열만으로는 복원할 수 없다.
 */
export class ApiError extends Error {
  /** HTTP 상태 코드. 응답을 받지 못한 경우(네트워크 단절 등) 0, 타임아웃은 408. */
  readonly status: number;

  /** 백엔드 Problem Details의 type (예: "competition-in-progress-exists"). 없으면 null. */
  readonly errorType: string | null;

  constructor(status: number, errorType: string | null, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errorType = errorType;

    // 빌드 타깃이 ES5로 다운레벨되면 Error 상속 시 프로토타입 체인이 끊겨 instanceof가 실패한다.
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /** 응답 자체를 받지 못한 경우 — 재시도할 가치가 있는지 판단할 때 쓴다. */
  get isNetworkError(): boolean {
    return this.status === 0 || this.status === 408;
  }
}

export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError;

/**
 * 알 수 없는 예외를 ApiError로 정규화한다.
 * 서비스 레이어가 예외를 기존 { data, error } 형태로 되돌릴 때 쓴다(마이그레이션 중 임시).
 */
export const toApiError = (error: unknown): ApiError => {
  if (isApiError(error)) return error;
  return new ApiError(0, null, error instanceof Error ? error.message : "Unknown error");
};
