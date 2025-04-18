/**
 * 플레이어 이름과 태그를 추출하여 검색 페이지로 이동하는 함수
 * @param value 사용자가 입력한 검색어 (예: "DOFI #KR1")
 */
export const handleRiotNameSearch = (value: string) => {
  // 공백을 포함한 riotName, riotNameTag 분리 정규표현식
  const [name, tag] = value.split("#");

  const riotName = name?.trim();
  const riotNameTag = tag?.trim();

  if (!riotName) return [null, null];
  if (!riotNameTag) return [riotName, null];
  return [riotName, riotNameTag];
};
