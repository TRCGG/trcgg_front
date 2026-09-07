import {
  CompetitionApplicationStatus,
  CompetitionPosition,
  CompetitionStatus,
  CompetitionSubPosition,
  CompetitionSummary,
  PracticeLevel,
} from "@/data/types/competition";

interface StatusMeta {
  label: string;
  textClass: string;
  bgClass: string;
}

// 상태 표기는 목록·현황판·전적 탭에서 같아야 하므로 한곳에서 관리한다.
const STATUS_META: Record<CompetitionStatus, StatusMeta> = {
  RECRUITING: { label: "모집중", textClass: "text-blueText", bgClass: "bg-blueText/10" },
  IN_PROGRESS: { label: "진행중", textClass: "text-neonGreen", bgClass: "bg-neonGreen/10" },
  CLOSED: { label: "종료", textClass: "text-primary2", bgClass: "bg-rankBg2" },
};

export const getCompetitionStatusMeta = (status: CompetitionStatus): StatusMeta =>
  STATUS_META[status] ?? STATUS_META.CLOSED;

/** 목록 필터. "전체"는 status 파라미터를 생략한다. */
// satisfies는 Next 12의 SWC 파서가 처리하지 못해(tsc만 통과) 타입 주석으로 쓴다.
export const COMPETITION_FILTERS: readonly { label: string; status?: CompetitionStatus }[] = [
  { label: "전체", status: undefined },
  { label: "모집중", status: "RECRUITING" },
  { label: "진행중", status: "IN_PROGRESS" },
  { label: "종료", status: "CLOSED" },
];

/** 모집중이면 아직 팀이 없으니 신청 인원을, 그 뒤로는 참가 인원·팀 수를 보여준다. */
export const formatParticipants = (competition: CompetitionSummary): string => {
  if (competition.status === "RECRUITING") {
    return `${competition.applicationCount}명 신청`;
  }
  return `${competition.participantCount}명 · ${competition.teamCount}팀`;
};

export const formatGameSummary = (competition: CompetitionSummary): string => {
  const { scrimCount, mainCount } = competition;
  if (scrimCount + mainCount === 0) return "경기 전";
  return `스크림 ${scrimCount} · ★본경기 ${mainCount}`;
};

/** 카드 좌측 아이콘에 쓸 대회명 첫 글자. */
export const competitionInitial = (name: string): string => name.trim().charAt(0) || "?";

/** PositionFilter와 같은 표기를 쓴다 — 화면 간 라인 이름이 어긋나지 않게. */
const POSITION_LABELS: Record<CompetitionPosition, string> = {
  TOP: "탑",
  JUG: "정글",
  MID: "미드",
  ADC: "원딜",
  SUP: "서폿",
};

export const positionLabel = (position: CompetitionPosition): string =>
  POSITION_LABELS[position] ?? position;

/** 부포지션 표기. ALL이 섞여 있거나 4개 이상이면 "전체"로 접는다. */
export const subPositionLabel = (subPositions: CompetitionSubPosition[]): string => {
  if (subPositions.includes("ALL") || subPositions.length >= 4) return "부 전체";
  if (subPositions.length === 0) return "-";
  return `부 ${subPositions.map((p) => positionLabel(p as CompetitionPosition)).join(" · ")}`;
};

interface ApplicationStatusMeta {
  label: string;
  textClass: string;
  bgClass: string;
}

const APPLICATION_STATUS_META: Record<CompetitionApplicationStatus, ApplicationStatusMeta> = {
  PENDING: { label: "대기", textClass: "text-yellow", bgClass: "bg-yellow/10" },
  APPROVED: { label: "승인", textClass: "text-neonGreen", bgClass: "bg-neonGreen/10" },
  REJECTED: { label: "거절", textClass: "text-redText", bgClass: "bg-redDarken" },
};

export const getApplicationStatusMeta = (
  status: CompetitionApplicationStatus
): ApplicationStatusMeta => APPLICATION_STATUS_META[status] ?? APPLICATION_STATUS_META.PENDING;

export const APPLICATION_TABS: readonly {
  status: CompetitionApplicationStatus;
  label: string;
}[] = [
  { status: "PENDING", label: "대기" },
  { status: "APPROVED", label: "승인" },
  { status: "REJECTED", label: "거절" },
];

/** 연습 희망 정도 표기. 값은 백엔드 PRACTICE_LEVELS와 같은 순서다. */
export const PRACTICE_LEVEL_OPTIONS: readonly { value: PracticeLevel; label: string }[] = [
  { value: "NONE", label: "거의 없음" },
  { value: "RARE", label: "가끔" },
  { value: "MODERATE", label: "적당히" },
  { value: "OFTEN", label: "자주" },
  { value: "ACTIVE", label: "적극적" },
];

/** 내 신청서 상태별 안내. 수정·취소 가능 여부를 함께 알린다. */
export const applicationStatusHint = (status: CompetitionApplicationStatus): string => {
  switch (status) {
    case "APPROVED":
      return "승인되었습니다. 로스터가 확정되면 팀이 배정됩니다.";
    case "REJECTED":
      return "운영진이 이번 신청을 거절했습니다. 대기열에 남아 있어 결원 발생 시 재승인될 수 있습니다.";
    default:
      return "운영진 승인을 기다리는 중입니다. 마감 전까지 수정·취소할 수 있습니다.";
  }
};
