import { NextRouter } from "next/router";

/**
 * 플레이어 이름과 태그를 추출하여 검색 페이지로 이동하는 함수
 * @param value 사용자가 입력한 검색어 (예: "DOFI #KR1")
 * @param router Next.js의 useRouter 인스턴스
 */
export const handleRiotNameSearch = (value: string, router: NextRouter) => {
  // 공백을 포함한 riotName, riotNameTag 분리 정규표현식
  const regex = /^\s*([\S].*[\S]?)\s*#\s*([\S]+)\s*$/;
  const match = value.match(regex);

  if (match) {
    const riotName = match[1].trim(); // 불필요한 앞뒤 공백만 제거
    const riotNameTag = match[2].trim();

    router.push(`/summoners/${encodeURIComponent(riotName)}/${encodeURIComponent(riotNameTag)}`);
  } else {
    alert("게임 이름과 태그를 올바른 형식으로 입력해 주세요.");
  }
};
