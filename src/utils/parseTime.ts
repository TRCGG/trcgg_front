/**
 * 시간 관련 파싱 함수
 * @param ISO 형식의 시간 값
 */
export const formatTimeAgo = (createDate: string): string => {
  const now = new Date();
  const created = new Date(createDate);
  const diffMs = now.getTime() - created.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years >= 1) return `${years}년 전`;
  if (months >= 1) return `${months}개월 전`;
  if (weeks >= 1) return `${weeks}주 전`;
  if (days >= 1) return `${days}일 전`;
  if (hours >= 1) return `${hours}시간 전`;
  if (minutes >= 1) return `${minutes}분 전`;
  return `방금 전`;
};
