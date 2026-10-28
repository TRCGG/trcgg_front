import { getKdaColor, getWinRateColor } from "@/utils/statColors";

describe("getKdaColor", () => {
  it.each([
    {
      desc: "3이하의 KDA는 text-primary2 색상을 띤다",
      input: 3,
      expected: "text-primary2",
    },
    {
      desc: "3을 막 넘은 KDA는 text-neonGreen 색상을 띤다",
      input: 3.01,
      expected: "text-neonGreen",
    },
    {
      desc: "3초과, 5이하의 KDA는 text-neonGreen 색상을 띤다",
      input: 5,
      expected: "text-neonGreen",
    },
    {
      desc: "5를 막 넘은 KDA는 text-blueText 색상을 띤다",
      input: 5.01,
      expected: "text-blueText",
    },
    {
      desc: "5초과, 7이하의 KDA는 text-blueText 색상을 띤다",
      input: 7,
      expected: "text-blueText",
    },
    {
      desc: "7을 막 넘은 KDA는 text-yellow 색상을 띤다",
      input: 7.01,
      expected: "text-yellow",
    },
    {
      desc: "7초과의 KDA는 text-yellow 색상을 띤다",
      input: 10,
      expected: "text-yellow",
    },
    {
      desc: "문자열 KDA도 숫자로 바꿔 판단한다",
      input: "4.5",
      expected: "text-neonGreen",
    },
    {
      desc: "숫자가 아닌 KDA는 text-primary2 색상을 띤다",
      input: "MAX",
      expected: "text-primary2",
    },
  ])("$desc", ({ input, expected }) => {
    expect(getKdaColor(input)).toBe(expected);
  });
});

describe("getWinRateColor", () => {
  it.each([
    {
      desc: "50이하의 승률은 text-primary2 색상을 띤다",
      input: 50,
      expected: "text-primary2",
    },
    {
      desc: "50 초과의 값은 text-yellow 색상을 띤다",
      input: 50.01,
      expected: "text-yellow",
    },
    {
      desc: "% 붙은 문자열 승률도 숫자로 바꿔 판단한다",
      input: "66.67%",
      expected: "text-yellow",
    },
    {
      desc: "숫자가 아닌 값은 text-primary2 색상을 띤다",
      input: "MAX",
      expected: "text-primary2",
    },
  ])("$desc", ({ input, expected }) => {
    expect(getWinRateColor(input)).toBe(expected);
  });
});
