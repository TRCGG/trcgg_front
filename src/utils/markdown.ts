import { marked } from "marked";

// GitHub 스타일 heading slug. 문서 내 언어 전환 앵커(#gmok-...-english 등)와 일치시키기 위함.
const slugify = (text: string): string =>
  text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N} -]/gu, "")
    .replace(/ /g, "-");

// 문서 간 상대경로 링크(./PRIVACY.md 등)를 렌더된 페이지 경로로 치환.
const LEGAL_DOC_ROUTES: Record<string, string> = {
  "PRIVACY.md": "/privacy",
  "TERMS.md": "/terms",
};

const rewriteDocLink = (href: string): string => {
  const match = href.match(/^\.?\/?([A-Za-z]+\.md)(#.*)?$/);
  if (!match) return href;
  const route = LEGAL_DOC_ROUTES[match[1]];
  return route ? `${route}${match[2] ?? ""}` : href;
};

const renderer = new marked.Renderer();
renderer.heading = (text, level, raw) => `<h${level} id="${slugify(raw)}">${text}</h${level}>`;
renderer.link = (href, title, text) => {
  const finalHref = rewriteDocLink(href ?? "");
  const titleAttr = title ? ` title="${title}"` : "";
  return `<a href="${finalHref}"${titleAttr}>${text}</a>`;
};

marked.use({ gfm: true, headerIds: false, mangle: false, renderer });

// public/ 의 마크다운 문서를 HTML 문자열로 변환한다. 신뢰된 자체 콘텐츠라 별도 sanitize는 생략.
export const renderMarkdown = (markdown: string): string => marked.parse(markdown);
