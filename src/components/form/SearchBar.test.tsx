import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "@/components/form/SearchBar";

const renderSearchBar = (props: Partial<React.ComponentProps<typeof SearchBar>> = {}) => {
  const user = userEvent.setup();
  const handlers = { onChange: jest.fn(), onSearch: jest.fn(), onFocus: jest.fn() };
  const utils = render(<SearchBar value="" {...handlers} {...props} />);
  return { ...utils, ...handlers, user, input: screen.getByRole("textbox") };
};

describe("SearchBar", () => {
  it("value와 placeholder를 보여준다", () => {
    const { input } = renderSearchBar({ value: "Hide on bush", placeholder: "소환사 검색" });
    expect(input).toHaveValue("Hide on bush");
    expect(input).toHaveAttribute("placeholder", "소환사 검색");
  });

  it("placeholder가 없으면 빈 문자열이다", () => {
    const { input } = renderSearchBar();
    expect(input).toHaveAttribute("placeholder", "");
  });

  it("입력하면 글자마다 onChange를 호출한다", async () => {
    const { user, input, onChange } = renderSearchBar();
    await user.type(input, "Faker");
    // value를 부모가 갱신하지 않으니 매번 빈 칸에 한 글자를 친 값이 넘어온다
    expect(onChange.mock.calls).toEqual([["F"], ["a"], ["k"], ["e"], ["r"]]);
  });

  it("Enter를 누르면 onSearch를 호출한다", async () => {
    const { user, input, onSearch } = renderSearchBar();
    await user.type(input, "{Enter}");
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it("Enter가 아닌 키는 검색하지 않는다", async () => {
    const { user, input, onSearch } = renderSearchBar();
    await user.type(input, "a");
    expect(onSearch).not.toHaveBeenCalled();
  });

  it("입력칸을 누르면 onFocus를 호출한다", async () => {
    const { user, input, onFocus } = renderSearchBar();
    await user.click(input);
    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it("검색 아이콘을 누르면 onSearch를 호출한다", async () => {
    const { user, container, onSearch } = renderSearchBar();
    // 아이콘은 role·label이 없는 svg라 태그로 찾는다
    await user.click(container.querySelector("svg")!);
    expect(onSearch).toHaveBeenCalledTimes(1);
  });
});
