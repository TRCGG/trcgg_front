import type { Nodes, Root } from "mdast";
import { defaultUrlTransform } from "react-markdown";
import { CONTACT_EMAIL, DISCORD_SUPPORT_URL } from "@/constants/links";

// GitHub 스타일 heading slug. 문서 내 언어 전환 앵커(#gmok-...-english 등)와 일치시키기 위함.
const slugify = (text: string): string =>
  text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N} -]/gu, "")
    .replace(/ /g, "-");

const plainText = (node: Nodes): string => {
  if ("value" in node) return node.value;
  if (!("children" in node)) return "";
  const { children }: { children: Nodes[] } = node;
  return children.map(plainText).join("");
};

const addHeadingIds = (node: Nodes) => {
  if (node.type === "heading") {
    // eslint-disable-next-line no-param-reassign -- remark 플러그인은 트리를 직접 고치는 방식이다
    node.data = { ...node.data, hProperties: { id: slugify(plainText(node)) } };
    return;
  }
  if ("children" in node) {
    const { children }: { children: Nodes[] } = node;
    children.forEach(addHeadingIds);
  }
};

export const remarkHeadingIds = () => (tree: Root) => {
  addHeadingIds(tree);
};

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

export const legalUrlTransform = (url: string) => defaultUrlTransform(rewriteDocLink(url));

// 문서에 하드코딩하지 않고 상수를 참조하기 위한 치환 테이블. gfm 자동 링크가 걸리도록 파싱 전에 치환한다.
const TEMPLATE_VARS: Record<string, string> = {
  DISCORD_INVITE: DISCORD_SUPPORT_URL,
  CONTACT_EMAIL,
};

export const fillTemplateVars = (markdown: string): string =>
  markdown.replace(/\{\{(\w+)\}\}/g, (match, key: string) => TEMPLATE_VARS[key] ?? match);
