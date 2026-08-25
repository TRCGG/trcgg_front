import { marked } from "marked";
import { CONTACT_EMAIL, DISCORD_INVITE_URL } from "@/constants/links";

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

// 문서에 하드코딩하지 않고 상수를 참조하기 위한 치환 테이블. gfm 자동 링크가 걸리도록 파싱 전에 치환한다.
const TEMPLATE_VARS: Record<string, string> = {
  DISCORD_INVITE: DISCORD_INVITE_URL,
  CONTACT_EMAIL,
};

const fillTemplateVars = (markdown: string): string =>
  markdown.replace(/\{\{(\w+)\}\}/g, (match, key: string) => TEMPLATE_VARS[key] ?? match);

// public/ 의 마크다운 문서를 HTML 문자열로 변환한다. 신뢰된 자체 콘텐츠라 별도 sanitize는 생략.
export const renderMarkdown = (markdown: string): string =>
  marked.parse(fillTemplateVars(markdown));
