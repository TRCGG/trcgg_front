import { buildUploadBatches } from "@/utils/replayUpload";

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
