// 게시판 본문은 관리자가 입력한 마크다운 원문이다. 백엔드 계약상 raw HTML로 렌더링하면 안 되므로
// marked(renderMarkdown) 대신 블록 단위로 쪼개 React 텍스트 노드로만 그린다.

export type PostBlock =
  | { kind: "h1" | "h2" | "h3" | "p" | "quote" | "code"; text: string }
  | { kind: "li"; text: string; marker: string }
  | { kind: "img"; alt: string; src: string };

/** 인라인 문법은 표시하지 않고 기호만 걷어낸다 (굵게·코드·링크는 텍스트만 남는다). */
const stripInline = (text: string): string =>
  text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1");

export const parsePostMarkdown = (markdown: string): PostBlock[] => {
  const blocks: PostBlock[] = [];
  let paragraph: string[] = [];
  let code: string[] | null = null;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    blocks.push({ kind: "p", text: stripInline(paragraph.join(" ")) });
    paragraph = [];
  };

  markdown
    .replace(/\r/g, "")
    .split("\n")
    .forEach((line) => {
      if (/^```/.test(line)) {
        if (code) {
          blocks.push({ kind: "code", text: code.join("\n") });
          code = null;
        } else {
          flushParagraph();
          code = [];
        }
        return;
      }
      if (code) {
        code.push(line);
        return;
      }

      const heading = line.match(/^(#{1,3})\s+(.*)$/);
      const bullet = line.match(/^\s*[-*]\s+(.*)$/);
      const ordered = line.match(/^\s*(\d+)\.\s+(.*)$/);
      const quote = line.match(/^>\s?(.*)$/);
      const image = line.match(/^!\[([^\]]*)\]\((\S+?)\)\s*$/);

      if (heading) {
        flushParagraph();
        const kind = (["h1", "h2", "h3"] as const)[heading[1].length - 1];
        blocks.push({ kind, text: stripInline(heading[2]) });
      } else if (bullet) {
        flushParagraph();
        blocks.push({ kind: "li", text: stripInline(bullet[1]), marker: "·" });
      } else if (ordered) {
        flushParagraph();
        blocks.push({ kind: "li", text: stripInline(ordered[2]), marker: `${ordered[1]}.` });
      } else if (quote) {
        flushParagraph();
        blocks.push({ kind: "quote", text: stripInline(quote[1]) });
      } else if (image) {
        flushParagraph();
        // javascript: 같은 스킴이 src로 들어가지 않게 http(s)만 받는다.
        if (/^https?:\/\//i.test(image[2]))
          blocks.push({ kind: "img", alt: image[1], src: image[2] });
      } else if (!line.trim()) {
        flushParagraph();
      } else {
        paragraph.push(line.trim());
      }
    });

  // 닫히지 않은 코드 펜스도 버리지 않는다.
  if (code) blocks.push({ kind: "code", text: (code as string[]).join("\n") });
  flushParagraph();
  return blocks;
};
