/**
 * KDA 값에 따른 색상 클래스를 반환합니다.
 *
 * @param kda - KDA 값 (숫자 또는 문자열)
 * @returns Tailwind CSS 색상 클래스
 *
 * 색상 기준:
 * - 3 이하: text-primary2 (회색)
 * - 3 초과 5 이하: text-neonGreen (초록)
 * - 5 초과 7 이하: text-blueText (파랑)
 * - 7 초과: text-yellow (주황)
 */
export const getKdaColor = (kda: string | number): string => {
  const kdaValue = typeof kda === "string" ? parseFloat(kda) : kda;

  if (Number.isNaN(kdaValue)) {
    return "text-primary2";
  }

  if (kdaValue <= 3) {
    return "text-primary2";
  }
  if (kdaValue <= 5) {
    return "text-neonGreen";
  }
  if (kdaValue <= 7) {
    return "text-blueText";
  }
  return "text-yellow";
};

/**
 * 승률 값에 따른 색상 클래스를 반환합니다.
 *
 * @param winRate - 승률 값 (숫자 또는 문자열, 퍼센트 기호 포함 가능)
 * @returns Tailwind CSS 색상 클래스
 *
 * 색상 기준:
 * - 50% 이하: text-primary2 (회색)
 * - 50% 초과: text-yellow (주황)
 */
export const getWinRateColor = (winRate: string | number): string => {
  let winRateValue: number;

  if (typeof winRate === "string") {
    // "50.00%" 형식에서 숫자만 추출
    winRateValue = parseFloat(winRate.replace("%", ""));
  } else {
    winRateValue = winRate;
  }

  if (Number.isNaN(winRateValue)) {
    return "text-primary2";
  }

  if (winRateValue <= 50) {
    return "text-primary2";
  }
  return "text-yellow";
};
