import { Children, createContext, isValidElement, ReactNode, useContext } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkUnderline from "@/utils/remarkUnderline";

type Variant = "detail" | "faq" | "preview";

type HeadingLevel = "h1" | "h2" | "h3";

type ClassKey =
  | HeadingLevel
  | "p"
  | "list"
  | "li"
  | "quote"
  | "code"
  | "img"
  | "table"
  | "th"
  | "td"
  | "hr";

// Tailwind는 소스를 문자열로 스캔하므로 변형별 클래스를 조합하지 않고 그대로 적는다.
const CLASSES: Record<Variant, Record<ClassKey, string>> = {
  detail: {
    h1: "mb-2.5 mt-7 text-[21px] font-bold text-board-heading",
    h2: "mb-2 mt-6 text-lg font-bold text-board-heading",
    h3: "mb-1.5 mt-[18px] text-base font-bold text-board-h3",
    p: "mb-3.5 text-[15.5px] leading-[1.85] text-board-prose",
    list: "mb-3.5 pl-5 text-[15.5px] leading-[1.8] text-board-prose",
    li: "mb-1.5 pl-1",
    quote: "mb-3.5 border-l-[3px] border-border2 py-0.5 pl-3.5 text-[15px] text-landing-caption",
    code: "mb-4 overflow-x-auto rounded border border-board-divider bg-darkBg2 px-3.5 py-3 font-mono text-[13px] text-board-h4",
    img: "mb-[18px] mt-2 block max-w-full",
    table: "mb-4 overflow-x-auto text-[14.5px] leading-[1.7]",
    th: "whitespace-nowrap border border-board-divider bg-darkBg2 px-3 py-2 font-bold text-board-heading",
    td: "border border-board-divider px-3 py-2 align-top text-board-prose",
    hr: "my-6 border-board-divider",
  },
  faq: {
    h1: "mb-1.5 mt-1 text-[15px] font-bold text-board-subheading",
    h2: "mb-1.5 mt-1 text-[15px] font-bold text-board-subheading",
    h3: "mb-1.5 mt-1 text-[14.5px] font-bold text-board-h4",
    p: "mb-2.5 text-[14.5px] leading-[1.8] text-landing-bodySecondary",
    list: "mb-2.5 pl-5 text-[14.5px] leading-[1.8] text-landing-bodySecondary",
    li: "mb-1",
    quote: "mb-2.5 border-l-2 border-border2 py-0.5 pl-3 text-sm text-landing-caption",
    code: "mb-2.5 overflow-x-auto rounded border border-board-divider bg-landing-bg px-3 py-2.5 font-mono text-[13px] text-board-h4",
    img: "mb-3 mt-1.5 block max-w-full",
    table: "mb-2.5 overflow-x-auto text-[13.5px] leading-[1.7]",
    th: "whitespace-nowrap border border-board-divider bg-landing-bg px-2.5 py-1.5 font-bold text-board-subheading",
    td: "border border-board-divider px-2.5 py-1.5 align-top text-landing-bodySecondary",
    hr: "my-3 border-board-divider",
  },
  preview: {
    h1: "mb-2 mt-3.5 text-[21px] font-bold text-board-heading",
    h2: "mb-1.5 mt-3 text-lg font-bold text-board-heading",
    h3: "mb-1.5 mt-2.5 text-base font-bold text-board-h3",
    p: "mb-3 text-[15px] leading-[1.8] text-board-prose",
    list: "mb-3 pl-5 text-[15px] leading-[1.8] text-board-prose",
    li: "mb-1",
    quote: "mb-3 border-l-[3px] border-border2 py-0.5 pl-3 text-[14.5px] text-landing-caption",
    code: "mb-3 overflow-x-auto rounded border border-board-divider bg-landing-bgCard px-3 py-2.5 font-mono text-[13px] text-board-h4",
    img: "mb-3 mt-1.5 block max-w-full",
    table: "mb-3 overflow-x-auto text-[14px] leading-[1.7]",
    th: "whitespace-nowrap border border-board-divider bg-landing-bgCard px-3 py-2 font-bold text-board-heading",
    td: "border border-board-divider px-3 py-2 align-top text-board-prose",
    hr: "my-4 border-board-divider",
  },
};

// 본문 제목(h1)이 페이지 제목보다 한 단계 아래에 오도록 태그를 내린다. FAQ는 질문 버튼 아래라 더 내린다.
const HEADING_TAG: Record<Variant, Record<HeadingLevel, "h2" | "h3" | "h4">> = {
  detail: { h1: "h2", h2: "h3", h3: "h4" },
  faq: { h1: "h3", h2: "h3", h3: "h4" },
  preview: { h1: "h2", h2: "h3", h3: "h4" },
};

const ALIGN_CLASS = { center: "text-center", right: "text-right" } as const;

const alignClass = (align: string | undefined) =>
  align === "center" || align === "right" ? ALIGN_CLASS[align] : "text-left";

// http(s) 외부 주소와 각주용 문서 안 앵커만 허용한다. 나머지는 링크·이미지가 되지 않는다.
const SAFE_URL = /^(https?:\/\/|#)/i;

const urlTransform = (url: string) => (SAFE_URL.test(url) ? url : "");

// 인용·목록 항목 안의 문단과 목록은 바깥 블록의 글꼴을 따르고 간격만 좁힌다.
type Container = "root" | "quote" | "list";

const ContainerContext = createContext<Container>("root");

const NESTED_P_CLASS: Record<Exclude<Container, "root">, string> = {
  quote: "mt-2 first:mt-0",
  list: "mt-1 first:mt-0",
};

interface BlockProps {
  className: string;
  children?: ReactNode;
}

const Paragraph = ({ className, children }: BlockProps) => {
  const container = useContext(ContainerContext);
  return <p className={container === "root" ? className : NESTED_P_CLASS[container]}>{children}</p>;
};

const List = ({ ordered, className, children }: BlockProps & { ordered: boolean }) => {
  const container = useContext(ContainerContext);
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag
      className={`${ordered ? "list-decimal" : "list-disc"} ${
        container === "list" ? "mt-1 pl-5" : className
      }`}
    >
      {children}
    </Tag>
  );
};

// 코드블록은 <pre><code>로 들어오므로 인라인 코드 스타일이 블록 안에 겹치지 않게 <code>를 벗긴다.
const unwrapCode = (children: ReactNode) =>
  Children.map(children, (child) =>
    isValidElement<{ children?: ReactNode }>(child) ? child.props.children : child
  );

interface HeadingProps {
  id?: string;
  className?: string;
  children?: ReactNode;
}

const makeComponents = (variant: Variant): Components => {
  const cls = CLASSES[variant];
  const heading = (level: HeadingLevel, { id, className, children }: HeadingProps) => {
    const Tag = HEADING_TAG[variant][level];
    // 각주 제목은 remark-gfm이 sr-only 클래스를 붙여 넘긴다.
    return (
      <Tag id={id} className={className ?? cls[level]}>
        {children}
      </Tag>
    );
  };

  return {
    h1: (props) => heading("h1", props),
    h2: (props) => heading("h2", props),
    h3: (props) => heading("h3", props),
    h4: (props) => heading("h3", props),
    h5: (props) => heading("h3", props),
    h6: (props) => heading("h3", props),
    p: ({ children }) => <Paragraph className={cls.p}>{children}</Paragraph>,
    ul: ({ children }) => (
      <List ordered={false} className={cls.list}>
        {children}
      </List>
    ),
    ol: ({ children }) => (
      <List ordered className={cls.list}>
        {children}
      </List>
    ),
    li: ({ id, className, children }) => (
      <li id={id} className={`${cls.li} ${className === "task-list-item" ? "list-none" : ""}`}>
        <ContainerContext.Provider value="list">{children}</ContainerContext.Provider>
      </li>
    ),
    blockquote: ({ children }) => (
      <blockquote className={cls.quote}>
        <ContainerContext.Provider value="quote">{children}</ContainerContext.Provider>
      </blockquote>
    ),
    pre: ({ children }) => <pre className={cls.code}>{unwrapCode(children)}</pre>,
    code: ({ children }) => (
      <code className="rounded bg-landing-bgElevated px-1.5 py-0.5 font-mono text-[0.88em] text-board-h4">
        {children}
      </code>
    ),
    strong: ({ children }) => <strong className="font-bold text-board-heading">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    del: ({ children }) => <del className="line-through">{children}</del>,
    u: ({ children }) => <u className="underline underline-offset-[3px]">{children}</u>,
    a: ({ id, href, children }) => {
      if (!href) return <span>{children}</span>;
      const external = !href.startsWith("#");
      return (
        <a
          id={id}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="text-landing-periwinkle underline underline-offset-2 hover:text-landing-periwinkleHover"
        >
          {children}
        </a>
      );
    },
    // 관리자가 넣는 임의의 외부 URL이라 next/image의 도메인 허용 목록에 올릴 수 없다.
    // eslint-disable-next-line @next/next/no-img-element
    img: ({ src, alt }) => (src ? <img src={src} alt={alt ?? ""} className={cls.img} /> : null),
    table: ({ children }) => (
      <div className={cls.table}>
        <table className="w-full border-collapse">{children}</table>
      </div>
    ),
    th: ({ style, children }) => (
      <th scope="col" className={`${cls.th} ${alignClass(style?.textAlign)}`}>
        {children}
      </th>
    ),
    td: ({ style, children }) => (
      <td className={`${cls.td} ${alignClass(style?.textAlign)}`}>{children}</td>
    ),
    hr: () => <hr className={cls.hr} />,
  };
};

const COMPONENTS: Record<Variant, Components> = {
  detail: makeComponents("detail"),
  faq: makeComponents("faq"),
  preview: makeComponents("preview"),
};

const REMARK_PLUGINS = [remarkGfm, remarkUnderline];

const REMARK_REHYPE_OPTIONS = { footnoteLabel: "각주", footnoteBackLabel: "본문으로 돌아가기" };

interface PostBlocksProps {
  content: string;
  variant: Variant;
}

const PostBlocks = ({ content, variant }: PostBlocksProps) => (
  <ReactMarkdown
    remarkPlugins={REMARK_PLUGINS}
    remarkRehypeOptions={REMARK_REHYPE_OPTIONS}
    urlTransform={urlTransform}
    components={COMPONENTS[variant]}
  >
    {content}
  </ReactMarkdown>
);

export const hasPostBlocks = (content: string) => content.trim().length > 0;

export default PostBlocks;
