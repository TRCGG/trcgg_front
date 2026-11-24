import type { Nodes, PhrasingContent, Root } from "mdast";

type PhrasingParent = Extract<Nodes, { children: PhrasingContent[] }>;

const PHRASING_PARENTS: ReadonlySet<Nodes["type"]> = new Set([
  "paragraph",
  "heading",
  "emphasis",
  "strong",
  "delete",
  "link",
  "linkReference",
  "tableCell",
]);

const isPhrasingParent = (node: Nodes): node is PhrasingParent => PHRASING_PARENTS.has(node.type);

const isTag = (node: PhrasingContent, tag: RegExp) => node.type === "html" && tag.test(node.value);

const OPEN = /^<u>$/i;
const CLOSE = /^<\/u>$/i;

const wrapUnderlines = (children: PhrasingContent[]) => {
  for (let i = 0; i < children.length; i += 1) {
    if (isTag(children[i], OPEN)) {
      const end = children.findIndex((node, j) => j > i && isTag(node, CLOSE));
      if (end !== -1) {
        const inner = children.slice(i + 1, end);
        children.splice(i, end - i + 1, {
          type: "emphasis",
          data: { hName: "u" },
          children: inner,
        });
      }
    }
  }
};

const walk = (node: Nodes) => {
  if (!("children" in node)) return;
  const { children } = node;
  children.forEach(walk);
  if (isPhrasingParent(node)) wrapUnderlines(node.children);
};

// 마크다운에는 밑줄 문법이 없어 문단 안의 <u>…</u> 쌍만 밑줄로 바꾼다. 그 밖의 HTML은 글자로 보인다.
const remarkUnderline = () => (tree: Root) => {
  walk(tree);
};

export default remarkUnderline;
