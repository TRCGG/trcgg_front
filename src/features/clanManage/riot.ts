// riotNameTag는 저장 형식에 따라 "#" 유무가 다를 수 있어 방어적으로 처리한다.
export const stripHash = (tag: string): string => (tag ?? "").replace(/^#/, "");

// 표시용 태그 ("#KR1")
export const withHash = (tag: string): string => `#${stripHash(tag)}`;

// "닉네임#KR1" 형태 입력을 name / tag로 분리 (tag는 # 제외).
// 태그 앞뒤·이름 끝 공백은 제거해 "김숙희 #Code" → { name: "김숙희", tag: "Code" }
export const parseRiotId = (input: string): { name: string; tag: string } => {
  const s = (input ?? "").trim();
  const i = s.indexOf("#");
  if (i === -1) return { name: s, tag: "" };
  return { name: s.slice(0, i).trim(), tag: stripHash(s.slice(i)).trim() };
};
