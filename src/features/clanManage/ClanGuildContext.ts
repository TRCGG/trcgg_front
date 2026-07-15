import { createContext, useContext } from "react";

// 지속 레이아웃(ClanManageLayout)이 보유한 선택 길드 ID를 하위 페이지 콘텐츠에 전달.
// 레이아웃이 리마운트되지 않으므로 prop 대신 context로 내려 길드 전환도 동기화한다.
const ClanGuildContext = createContext<string>("");

export const useClanGuild = (): string => useContext(ClanGuildContext);

export default ClanGuildContext;
