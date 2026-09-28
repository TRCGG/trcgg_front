import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

interface GuildState {
  /** Base64 인코딩된 선택 길드 ID */
  guildId: string;
  setGuildId: (encodedGuildId: string) => void;
}

const GuildContext = createContext<GuildState>({ guildId: "", setGuildId: () => {} });

export const GuildProvider = ({ children }: { children: ReactNode }) => {
  const [guildId, setGuildIdState] = useState("");

  // localStorage를 렌더 중 읽으면 SSR에서 터지므로 마운트 후 복원한다.
  useEffect(() => {
    const saved = localStorage.getItem("guildId");
    if (saved) setGuildIdState(saved);
  }, []);

  const setGuildId = useCallback((encodedGuildId: string) => {
    localStorage.setItem("guildId", encodedGuildId);
    setGuildIdState(encodedGuildId);
  }, []);

  // 인라인 객체를 넘기면 렌더마다 참조가 바뀌어 소비자가 모두 리렌더된다.
  const value = useMemo(() => ({ guildId, setGuildId }), [guildId, setGuildId]);

  return <GuildContext.Provider value={value}>{children}</GuildContext.Provider>;
};

export const useGuildContext = (): GuildState => useContext(GuildContext);
