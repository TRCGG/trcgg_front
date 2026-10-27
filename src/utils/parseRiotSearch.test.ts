import { handleRiotNameSearch } from "@/utils/parseRiotSearch";

describe("handleRiotNameSearch", () => {
  test.each([
    {
      desc: "이름과 태그를 #으로 나누고 공백은 제거한다",
      input: "DOFI #KR1",
      expected: ["DOFI", "KR1"],
    },
    { desc: "공백만 입력하면 둘 다 null이다", input: " ", expected: [null, null] },
    { desc: "태그가 없으면 태그 자리는 null이다", input: "DOFI", expected: ["DOFI", null] },
    {
      desc: "이름이 없으면 태그가 있어도 전체가 null이다",
      input: "#KR1",
      expected: [null, null],
    },
    {
      desc: "이름 가운데 공백은 유지한다",
      input: "나는 DOFI#KR1",
      expected: ["나는 DOFI", "KR1"],
    },
    {
      desc: "#은 있는데 태그가 없으면 태그 자리는 null이다",
      input: "DOFI#",
      expected: ["DOFI", null],
    },
  ])("$desc", ({ input, expected }) => {
    expect(handleRiotNameSearch(input)).toEqual(expected);
  });
});
