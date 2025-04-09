/**
 * 플레이어 이름과 태그를 추출하여 검색 페이지로 이동하는 함수
 * @param value 사용자가 입력한 검색어 (예: "DOFI #KR1")
 * @param router Next.js의 useRouter 인스턴스
 */
export const handleRiotNameSearch = (value: string) => {
  // 공백을 포함한 riotName, riotNameTag 분리 정규표현식
  const regex = /^\s*([\S].*[\S]?)\s*(?:#\s*([\S]+))?\s*$/;
  const match = value.match(regex);

  if (match) {
    const riotName: string = match[1].trim();
    const riotNameTag: string | null = match[2] ? match[2].trim() : null;
    return [riotName, riotNameTag];
  }
  return [null, null];
};
