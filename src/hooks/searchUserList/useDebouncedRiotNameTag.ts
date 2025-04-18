import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { handleRiotNameSearch } from "@/utils/parseRiotSearch";

interface DebouncedTerm {
  riotName: string;
  riotNameTag: string | null;
}

/**
 * 검색어를 디바운싱해서 Name과 Tag를 리턴하는 함수
 * @param searchTerm 입력한 검색어
 */
const useDebouncedRiotNameTag = (searchTerm: string) => {
  const [isTyping, setTyping] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState<DebouncedTerm>({
    riotName: "",
    riotNameTag: null,
  });

  const debouncedSearch = useMemo(
    () =>
      debounce((term: string) => {
        const [riotName, riotNameTag] = handleRiotNameSearch(term);
        setDebouncedTerm({
          riotName: riotName || "",
          riotNameTag: riotNameTag || null,
        });
        setTyping(false);
      }, 700),
    []
  );

  useEffect(() => {
    setTyping(true);
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  return { debouncedTerm, isTyping };
};

export default useDebouncedRiotNameTag;
