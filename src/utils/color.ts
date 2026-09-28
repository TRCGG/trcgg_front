/** #RRGGBB 토큰을 rgba 문자열로. 팔레트 밖 색을 새로 적지 않으려고 쓴다. */
export const withAlpha = (hex: string, alpha: number): string => {
  const v = hex.replace("#", "");
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
