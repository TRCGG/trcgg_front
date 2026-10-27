import { handleRiotNameSearch } from "@/utils/parseRiotSearch";

describe("handleRiotNameSearch", () => {
  test("이름과 태그를 #으로 나누고 공백은 제거한다", () => {
    const result = handleRiotNameSearch("DOFI #KR1");
    expect(result).toEqual(["DOFI", "KR1"]);
  });

  test("공백만 입력하면 둘 다 null이다", () => {
    const result = handleRiotNameSearch(" ");
    expect(result).toEqual([null, null]);
  });

  test("태그가 없으면 태그 자리는 null이다", () => {
    const result = handleRiotNameSearch("DOFI");
    expect(result).toEqual(["DOFI", null]);
  });

  test("이름이 없으면 태그가 있어도 전체가 null이다", () => {
    const result = handleRiotNameSearch("#KR1");
    expect(result).toEqual([null, null]);
  });

  test("이름 가운데 공백은 유지한다", () => {
    const result = handleRiotNameSearch("나는 DOFI#KR1");
    expect(result).toEqual(["나는 DOFI", "KR1"]);
  });

  test("#은 있는데 태그가 없으면 태그 자리는 null이다", () => {
    const result = handleRiotNameSearch("DOFI#");
    expect(result).toEqual(["DOFI", null]);
  });
});
