import { ApiError } from "@/services/apiError";
import { buildUploadBatches, classifyIncoming, uploadErrorMessage } from "@/utils/replayUpload";

const MB = 1024 * 1024;

const makeUploadUnit = (originalMB: number, uploadMB = originalMB) => ({
  original: { size: originalMB * MB } as File,
  upload: { size: uploadMB * MB } as File,
});

describe("buildUploadBatches", () => {
  it("빈 목록이면 빈 배열을 반환한다", () => {
    const result = buildUploadBatches([]);
    expect(result).toEqual([]);
  });
  it("합계가 90MB 이하면 한 배치에 담긴다", () => {
    const a = makeUploadUnit(45);
    const b = makeUploadUnit(45);
    const result = buildUploadBatches([a, b]);
    expect(result).toEqual([[a, b]]);
  });

  it("다음 파일을 더하면 90MB를 넘을 때 새 배치를 시작한다", () => {
    const a = makeUploadUnit(40);
    const b = makeUploadUnit(50);
    const c = makeUploadUnit(1);
    const result = buildUploadBatches([a, b, c]);
    expect(result).toEqual([[a, b], [c]]);
  });

  it("10개가 차면 용량이 남아도 새 배치를 시작한다", () => {
    const units = Array.from({ length: 11 }, () => makeUploadUnit(1));
    const result = buildUploadBatches(units);
    expect(result).toEqual([units.slice(0, 10), units.slice(10)]);
  });

  it("90MB를 넘는 파일 하나는 단독 배치가 된다", () => {
    const a = makeUploadUnit(100);
    const b = makeUploadUnit(10);
    const result = buildUploadBatches([a, b]);
    expect(result).toEqual([[a], [b]]);
  });

  it("원본이 아니라 전송할 파일(upload) 크기로 계산한다", () => {
    const a = makeUploadUnit(60, 1);
    const b = makeUploadUnit(60, 1);
    const result = buildUploadBatches([a, b]);
    expect(result).toEqual([[a, b]]);
  });
});

const makeFile = (name: string, sizeMB: number) => ({ name, size: sizeMB * MB }) as File;

const toFileList = (files: File[]) => files as unknown as FileList;

describe("classifyIncoming", () => {
  it(".rofl 파일은 valid에 담긴다", () => {
    const file = makeFile("game.rofl", 10);
    const result = classifyIncoming(toFileList([file]), new Set());
    expect(result).toEqual({ valid: [file], excluded: [] });
  });

  it("확장자는 대소문자를 가리지 않는다 (.ROFL)", () => {
    const file = makeFile("game.ROFL", 10);
    const result = classifyIncoming(toFileList([file]), new Set());
    expect(result).toEqual({ valid: [file], excluded: [] });
  });

  it(".rofl이 아니면 extension 사유로 제외된다", () => {
    const file = makeFile("game.rof", 10);
    const result = classifyIncoming(toFileList([file]), new Set());
    expect(result).toEqual({
      valid: [],
      excluded: [{ name: "game.rof", sizeMB: "10.0", reason: "extension" }],
    });
  });

  it("정확히 50MB인 파일은 valid에 담긴다", () => {
    const file = makeFile("game.rofl", 50);
    const result = classifyIncoming(toFileList([file]), new Set());
    expect(result).toEqual({ valid: [file], excluded: [] });
  });

  it("50MB를 넘으면 oversize 사유로 제외된다", () => {
    const file = { name: "game.rofl", size: 50 * MB + 1 } as File;
    const result = classifyIncoming(toFileList([file]), new Set());
    expect(result).toEqual({
      valid: [],
      excluded: [{ name: "game.rofl", sizeMB: "50.0", reason: "oversize" }],
    });
  });

  it("확장자와 용량이 모두 옳지 않으면 extension 사유가 우선한다", () => {
    const file = makeFile("game.txt", 60);
    const result = classifyIncoming(toFileList([file]), new Set());
    expect(result).toEqual({
      valid: [],
      excluded: [{ name: "game.txt", sizeMB: "60.0", reason: "extension" }],
    });
  });

  it("이미 담긴 이름은 valid에도 excluded에도 들어가지 않는다", () => {
    const taken = makeFile("game.rofl", 10);
    const takenInvalid = makeFile("notes.txt", 10);
    const fresh = makeFile("new.rofl", 10);
    const result = classifyIncoming(
      toFileList([taken, takenInvalid, fresh]),
      new Set(["game.rofl", "notes.txt"])
    );
    expect(result).toEqual({ valid: [fresh], excluded: [] });
  });

  it("한 번에 같은 이름이 두 개 들어오면 첫 번째만 처리한다", () => {
    const first = makeFile("game.rofl", 10);
    const second = makeFile("game.rofl", 20);
    const result = classifyIncoming(toFileList([first, second]), new Set());
    expect(result).toEqual({ valid: [first], excluded: [] });
  });

  it.each([
    { sizeMB: 3, expected: "3.0" },
    { sizeMB: 12.34, expected: "12.3" },
    { sizeMB: 12.36, expected: "12.4" },
    { sizeMB: 0.04, expected: "0.0" },
  ])("sizeMB는 소수 첫째 자리까지의 문자열이다: $sizeMB → $expected", ({ sizeMB, expected }) => {
    const file = makeFile("game.txt", sizeMB);
    const result = classifyIncoming(toFileList([file]), new Set());
    expect(result.excluded[0].sizeMB).toBe(expected);
  });
});

describe("uploadErrorMessage", () => {
  it("대회 errorType이면 상태 코드와 관계없이 대회 문구를 반환한다", () => {
    const error = new ApiError(400, "competition-not-open", "Bad Request");
    expect(uploadErrorMessage(error)).toContain("진행중인 대회에만");
  });

  it("모르는 errorType이면 상태 코드 문구를 반환한다", () => {
    const error = new ApiError(400, "unknown-type", "Bad Request");
    expect(uploadErrorMessage(error)).toContain("요청이 올바르지 않습니다");
  });

  it.each([
    { status: 401, keyword: "인증에 실패" },
    { status: 403, keyword: "권한이 없습니다" },
    { status: 400, keyword: "요청이 올바르지 않습니다" },
    { status: 408, keyword: "시간이 초과" },
    { status: 500, keyword: "업로드 중 오류" },
  ])("$status이면 '$keyword' 문구를 반환한다", ({ status, keyword }) => {
    const error = new ApiError(status, null, "");
    expect(uploadErrorMessage(error)).toContain(keyword);
  });

  it("status가 없는 에러면 기본 문구를 반환한다", () => {
    expect(uploadErrorMessage(new Error("Network Error"))).toContain("업로드 중 오류");
  });

  it.each([null, undefined, "Network Error"])(
    "객체가 아닌 값(%p)이 와도 기본 문구를 반환한다",
    (input) => {
      expect(uploadErrorMessage(input)).toContain("업로드 중 오류");
    }
  );
});
