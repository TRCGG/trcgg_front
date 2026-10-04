import { ReplayFailReason } from "@/data/types/replay";

export const FAIL_REASON_LABEL: Record<ReplayFailReason, string> = {
  invalid_extension: ".rofl 파일이 아닙니다",
  invalid_format: "유효하지 않은 리플레이 파일입니다",
  parse_failed: "리플레이 데이터 파싱에 실패했습니다",
  "duplicated replay data": "이미 등록된 리플레이입니다",
  save_failed: "저장에 실패했습니다",
};

/** 표에 없는 사유가 와도 빈칸으로 두지 않는다. */
export const failReasonLabel = (reason: string): string =>
  Object.prototype.hasOwnProperty.call(FAIL_REASON_LABEL, reason)
    ? FAIL_REASON_LABEL[reason as ReplayFailReason]
    : "업로드에 실패했습니다";

export const MAX_FILE_SIZE_MB = 50;
export const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;
// Cloudflare 무료 플랜의 요청 바디 한계(100MB)에 걸리지 않도록, 한 요청의 총 용량을
// 90MB 이하 & 파일 10개 이하(백엔드 multer 제한)로 묶어서 나눠 전송한다.
export const MAX_REQUEST_BYTES = 90 * 1024 * 1024;
export const MAX_FILES_PER_REQUEST = 10;

export interface UploadUnit {
  /** 화면 목록에 담긴 원본. 배치 처리 후 목록에서 제거할 때 식별자로 쓴다. */
  original: File;
  /** 실제로 전송할 파일. 슬라이싱이 불가능한 파일은 원본과 같다. */
  upload: File;
}

// 파일들을 요청당 용량·개수 한계 안에서 배치로 묶는다. 기준은 원본이 아니라 전송할 크기라,
// 슬라이싱된 파일은 개수 상한(10개)까지 한 요청에 담긴다.
export const buildUploadBatches = (list: UploadUnit[]): UploadUnit[][] => {
  const batches: UploadUnit[][] = [];
  let current: UploadUnit[] = [];
  let currentBytes = 0;
  list.forEach((unit) => {
    const exceedsSize = currentBytes + unit.upload.size > MAX_REQUEST_BYTES;
    const exceedsCount = current.length >= MAX_FILES_PER_REQUEST;
    if (current.length > 0 && (exceedsSize || exceedsCount)) {
      batches.push(current);
      current = [];
      currentBytes = 0;
    }
    current.push(unit);
    currentBytes += unit.upload.size;
  });
  if (current.length > 0) batches.push(current);
  return batches;
};

export type ExcludeReason = "extension" | "oversize";

export const EXCLUDE_LABEL: Record<ExcludeReason, string> = {
  extension: ".rofl 아님",
  oversize: `${MAX_FILE_SIZE_MB}MB 초과`,
};

export interface ExcludedFile {
  name: string;
  sizeMB: string;
  reason: ExcludeReason;
}

/** 새로 담긴 파일을 확장자·용량으로 갈라낸다. 이미 담긴 이름은 조용히 건너뛴다. */
export const classifyIncoming = (
  incoming: FileList,
  takenNames: Set<string>
): { valid: File[]; excluded: ExcludedFile[] } => {
  const seen = new Set(takenNames);
  const valid: File[] = [];
  const excluded: ExcludedFile[] = [];

  Array.from(incoming).forEach((file) => {
    if (seen.has(file.name)) return;
    seen.add(file.name);
    const sizeMB = (file.size / 1024 / 1024).toFixed(1);
    if (!file.name.toLowerCase().endsWith(".rofl")) {
      excluded.push({ name: file.name, sizeMB, reason: "extension" });
    } else if (file.size > MAX_FILE_SIZE) {
      excluded.push({ name: file.name, sizeMB, reason: "oversize" });
    } else {
      valid.push(file);
    }
  });

  return { valid, excluded };
};

// 대회 업로드는 파일 처리 전에 대회를 검증하고, 실패하면 요청 전체가 400으로 끝난다.
// 400 문구로 뭉개지지 않도록 Problem Details의 type을 먼저 본다.
const COMPETITION_UPLOAD_ERROR = new Map<string, string>(
  Object.entries({
    "competition-not-open":
      "진행중인 대회에만 경기를 올릴 수 있습니다. 대회가 종료되었는지 확인해주세요.",
    "competition-not-found": "대회를 찾을 수 없습니다. 삭제되었는지 확인해주세요.",
    "no-open-competition": "진행중인 대회가 없습니다.",
    "competition-requires-game-type":
      "일반내전은 대회에 올릴 수 없습니다. 경기 유형을 다시 골라주세요.",
  })
);

export const uploadErrorMessage = (err: unknown): string => {
  const status =
    err && typeof err === "object" && "status" in err ? (err as { status: number }).status : 0;
  const errorType =
    err && typeof err === "object" && "errorType" in err
      ? (err as { errorType: string | null }).errorType
      : null;
  const competitionMessage = errorType ? COMPETITION_UPLOAD_ERROR.get(errorType) : undefined;
  if (competitionMessage) return competitionMessage;
  if (status === 401) return "인증에 실패했습니다. 다시 로그인해주세요.";
  if (status === 403) return "리플레이 업로드 권한이 없습니다.";
  if (status === 400) return "요청이 올바르지 않습니다. 길드 정보를 확인해주세요.";
  if (status === 408)
    return "업로드 시간이 초과되었습니다. 파일 수를 줄이거나 잠시 후 다시 시도해주세요.";
  return "업로드 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
};
