import { competitionErrorMessage } from "@/features/competition/competitionErrors";
import { ApiError } from "@/services/apiError";

describe("competitionErrorMessage", () => {
  describe("부계정 신청 (sub-account-not-allowed)", () => {
    it.each([
      {
        desc: "메시지에 담긴 본계정을 안내한다",
        message: "sub account (main: 본계정#KR1)",
        expected: "본계정(본계정#KR1)으로 신청해주세요",
      },
      {
        desc: "main: 뒤에 공백이 없어도 뽑는다",
        message: "sub account (main:본계정#KR1)",
        expected: "본계정(본계정#KR1)으로 신청해주세요",
      },
      {
        desc: "본계정 앞뒤 공백은 지운다",
        message: "sub account (main:   본계정#KR1  )",
        expected: "본계정(본계정#KR1)으로 신청해주세요",
      },
      {
        desc: "본계정 표기가 없으면 일반 안내를 한다",
        message: "sub account",
        expected: "본계정으로 신청해주세요",
      },
      {
        desc: "닫는 괄호가 없으면 일반 안내를 한다",
        message: "sub account (main: 본계정#KR1",
        expected: "본계정으로 신청해주세요",
      },
    ])("$desc", ({ message, expected }) => {
      const error = new ApiError(400, "sub-account-not-allowed", message);
      expect(competitionErrorMessage(error)).toContain(expected);
    });
  });

  it.each([
    { errorType: "main-account-not-found", keyword: "본계정이 더 이상 존재하지 않습니다" },
    { errorType: "competition-in-progress-exists", keyword: "이미 진행중인 대회" },
    { errorType: "competition-name-exists", keyword: "같은 이름의 대회" },
    { errorType: "competition-closed", keyword: "종료된 대회" },
    { errorType: "competition-not-recruiting", keyword: "모집 중인 대회만" },
    { errorType: "application-duplicate", keyword: "이미 이 대회에 신청한" },
    { errorType: "champion-not-found", keyword: "등록되지 않은 챔피언" },
    { errorType: "champion-duplicate", keyword: "같은 챔피언을 두 번" },
    { errorType: "sub-position-invalid", keyword: "부 포지션이 올바르지 않습니다" },
    { errorType: "match-team-required", keyword: "한쪽 진영에는 팀이" },
    { errorType: "match-team-duplicate", keyword: "같은 팀을 양쪽 진영에" },
    { errorType: "team-not-in-competition", keyword: "이 대회에 속한 팀이 아닙니다" },
    { errorType: "match-not-found", keyword: "해당 경기를 찾을 수 없습니다" },
    { errorType: "team-limit-exceeded", keyword: "20개까지" },
    { errorType: "team-name-exists", keyword: "같은 이름의 팀" },
    { errorType: "team-duplicate", keyword: "같은 팀이 두 번" },
    { errorType: "team-not-found", keyword: "삭제된 팀" },
    { errorType: "team-has-matches", keyword: "경기가 귀속된 팀" },
  ])("$errorType이면 '$keyword' 문구를 반환한다", ({ errorType, keyword }) => {
    const error = new ApiError(400, errorType, "");
    expect(competitionErrorMessage(error)).toContain(keyword);
  });

  it("같은 409라도 errorType으로 진행중 중복과 이름 중복을 구분한다", () => {
    const inProgress = new ApiError(409, "competition-in-progress-exists", "conflict");
    const nameTaken = new ApiError(409, "competition-name-exists", "conflict");
    expect(competitionErrorMessage(inProgress)).toContain("이미 진행중인 대회");
    expect(competitionErrorMessage(nameTaken)).toContain("같은 이름의 대회");
  });

  it("모르는 errorType이면 상태 코드 문구를 반환한다", () => {
    const error = new ApiError(403, "unknown-type", "");
    expect(competitionErrorMessage(error)).toBe("운영진만 할 수 있는 작업입니다.");
  });

  describe("상태 코드", () => {
    it.each([
      { status: 403, expected: "운영진만 할 수 있는 작업입니다." },
      { status: 404, expected: "대회를 찾을 수 없습니다." },
      { status: 500, expected: "요청에 실패했습니다. 잠시 후 다시 시도해주세요." },
    ])("$status이면 '$expected'", ({ status, expected }) => {
      const error = new ApiError(status, null, "백엔드 메시지");
      expect(competitionErrorMessage(error)).toBe(expected);
    });

    it.each([
      { status: 400, fallback: "요청이 올바르지 않습니다." },
      { status: 409, fallback: "이미 처리된 요청입니다." },
    ])("$status이면 백엔드 메시지를, 없으면 '$fallback'을 보여준다", ({ status, fallback }) => {
      expect(competitionErrorMessage(new ApiError(status, null, "백엔드 메시지"))).toBe(
        "백엔드 메시지"
      );
      expect(competitionErrorMessage(new ApiError(status, null, ""))).toBe(fallback);
    });
  });

  describe("ApiError가 아닌 값", () => {
    it.each([new Error("Network Error"), null, "Network Error"])(
      "%p이면 기본 문구를 반환한다",
      (input) => {
        expect(competitionErrorMessage(input)).toBe(
          "요청에 실패했습니다. 잠시 후 다시 시도해주세요."
        );
      }
    );
  });
});
