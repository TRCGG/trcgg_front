import {
  TournamentCode,
  TournamentCodeStatus,
  TournamentSpectatorType,
} from "@/data/types/tournament";

export const SERIES_OPTIONS = [
  { label: "단판", count: 1 },
  { label: "BO3", count: 3 },
  { label: "BO5", count: 5 },
] as const;

export type SeriesOption = (typeof SERIES_OPTIONS)[number];

export const SPECTATOR_OPTIONS: { label: string; value: TournamentSpectatorType }[] = [
  { label: "허용", value: "ALL" },
  { label: "불가", value: "NONE" },
];

export const SPECTATOR_LABEL: Record<TournamentSpectatorType, string> = {
  ALL: "허용",
  LOBBYONLY: "로비 인원만",
  NONE: "불가",
};

export const STATUS_LABEL: Record<TournamentCodeStatus, string> = {
  PENDING: "대기",
  COMPLETED: "기록 완료",
  INVALID: "만료",
};

export const ROOM_SETTINGS = [
  { label: "맵", value: "소환사의 협곡" },
  { label: "인원", value: "5 vs 5" },
  { label: "밴픽", value: "토너먼트 드래프트" },
] as const;

export interface TournamentCodeRow extends TournamentCode {
  seriesLabel: string;
  setNumber: number;
}

const seriesLabelOf = (size: number): string =>
  SERIES_OPTIONS.find((option) => option.count === size)?.label ?? `${size}개 묶음`;

/**
 * 백엔드는 코드마다 시리즈 정보를 저장하지 않는다. 한 번의 발급 요청은 같은 발급 시각으로
 * 저장되므로 시각이 같은 코드를 한 시리즈로 묶고, 목록 API가 묶음 안을 코드 값 순으로
 * 정렬해 주는 순서대로 세트 번호를 매긴다.
 */
export const groupIntoSeries = (codes: TournamentCode[]): TournamentCodeRow[] => {
  const groups = new Map<string, TournamentCode[]>();
  codes.forEach((code) => {
    const group = groups.get(code.issuedDate);
    if (group) group.push(code);
    else groups.set(code.issuedDate, [code]);
  });

  return Array.from(groups.values()).flatMap((group) =>
    group.map((code, index) => ({
      ...code,
      seriesLabel: seriesLabelOf(group.length),
      setNumber: index + 1,
    }))
  );
};

/** 가장 먼저 발급된 시리즈의 가장 앞 세트부터 쓴다. 목록은 최신 발급이 앞에 온다. */
export const findNextCode = (rows: TournamentCodeRow[]): TournamentCodeRow | undefined => {
  const pending = rows.filter((row) => row.status === "PENDING");
  return pending.reduce<TournamentCodeRow | undefined>((next, row) => {
    if (!next) return row;
    if (row.issuedDate < next.issuedDate) return row;
    if (row.issuedDate === next.issuedDate && row.setNumber < next.setNumber) return row;
    return next;
  }, undefined);
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const formatIssuedTime = (iso: string): string => {
  const date = new Date(iso);
  const time = date.toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit" });
  if (isSameDay(date, new Date())) return time;
  return `${date.getMonth() + 1}.${date.getDate()} ${time}`;
};
