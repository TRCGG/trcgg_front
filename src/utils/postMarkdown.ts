// 게시판 본문은 관리자가 입력한 마크다운 원문이다. 백엔드 계약상 raw HTML로 렌더링하면 안 되므로
// marked(renderMarkdown) 대신 블록 단위로 쪼개 React 텍스트 노드로만 그린다.

export type PostBlock =
  | { kind: "h1" | "h2" | "h3" | "p" | "quote" | "code"; text: string }
  | { kind: "li"; text: string; marker: string }
  | { kind: "img"; alt: string; src: string };

export type InlineNode =
  | { kind: "text" | "code"; text: string }
  | { kind: "strong"; children: InlineNode[] }
  | { kind: "link"; text: string; href: string };

const INLINE = /`([^`]+)`|\*\*(.+?)\*\*|!\[([^\]]*)\]\([^)]*\)|\[([^\]]*)\]\(([^)\s]*)\)/g;

export const parseInline = (text: string): InlineNode[] => {
  const nodes: InlineNode[] = [];
  let last = 0;
  const pushText = (value: string) => {
    if (!value) return;
    const prev = nodes[nodes.length - 1];
    if (prev?.kind === "text") prev.text += value;
    else nodes.push({ kind: "text", text: value });
  };

  Array.from(text.matchAll(INLINE)).forEach((m) => {
    const [whole, code, strong, imageAlt, linkText, href] = m;
    pushText(text.slice(last, m.index));
    last = (m.index ?? 0) + whole.length;
    if (code !== undefined) nodes.push({ kind: "code", text: code });
    else if (strong !== undefined) nodes.push({ kind: "strong", children: parseInline(strong) });
    // 문단 중간의 이미지는 블록 이미지만 그리는 규칙대로 alt만 남긴다.
    else if (imageAlt !== undefined) pushText(imageAlt);
    // javascript: 같은 스킴이 href로 들어가지 않게 http(s)만 링크로 만든다.
    else if (/^https?:\/\//i.test(href)) nodes.push({ kind: "link", text: linkText, href });
    else pushText(linkText);
  });
  pushText(text.slice(last));
  return nodes;
};

export const parsePostMarkdown = (markdown: string): PostBlock[] => {
  const blocks: PostBlock[] = [];
  let paragraph: string[] = [];
  let code: string[] | null = null;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    blocks.push({ kind: "p", text: paragraph.join(" ") });
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
        blocks.push({ kind, text: heading[2] });
      } else if (bullet) {
        flushParagraph();
        blocks.push({ kind: "li", text: bullet[1], marker: "·" });
      } else if (ordered) {
        flushParagraph();
        blocks.push({ kind: "li", text: ordered[2], marker: `${ordered[1]}.` });
      } else if (quote) {
        flushParagraph();
        blocks.push({ kind: "quote", text: quote[1] });
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
