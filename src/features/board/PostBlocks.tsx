import { useMemo } from "react";
import { parsePostMarkdown, PostBlock } from "@/utils/postMarkdown";

type Variant = "detail" | "faq" | "preview";

type TextKind = Exclude<PostBlock["kind"], "img">;

// Tailwind는 소스를 문자열로 스캔하므로 변형별 클래스를 조합하지 않고 그대로 적는다.
const CLASSES: Record<Variant, Record<TextKind | "img" | "marker", string>> = {
  detail: {
    h1: "mb-2.5 mt-7 text-[21px] font-bold text-board-heading",
    h2: "mb-2 mt-6 text-lg font-bold text-board-heading",
    h3: "mb-1.5 mt-[18px] text-base font-bold text-board-h3",
    p: "mb-3.5 text-[15.5px] leading-[1.85] text-board-prose",
    li: "mb-1.5 flex gap-2 pl-1 text-[15.5px] leading-[1.8] text-board-prose",
    marker: "min-w-[12px]",
    quote: "mb-3.5 border-l-[3px] border-border2 py-0.5 pl-3.5 text-[15px] text-landing-caption",
    code: "mb-4 overflow-x-auto rounded border border-board-divider bg-darkBg2 px-3.5 py-3 font-mono text-[13px] text-board-h4",
    img: "mb-[18px] mt-2 block max-w-full",
  },
  faq: {
    h1: "mb-1.5 mt-1 text-[15px] font-bold text-board-subheading",
    h2: "mb-1.5 mt-1 text-[15px] font-bold text-board-subheading",
    h3: "mb-1.5 mt-1 text-[14.5px] font-bold text-board-h4",
    p: "mb-2.5 text-[14.5px] leading-[1.8] text-landing-bodySecondary",
    li: "mb-1 flex gap-2 text-[14.5px] leading-[1.8] text-landing-bodySecondary",
    marker: "",
    quote: "mb-2.5 border-l-2 border-border2 py-0.5 pl-3 text-sm text-landing-caption",
    code: "mb-2.5 overflow-x-auto rounded border border-board-divider bg-landing-bg px-3 py-2.5 font-mono text-[13px] text-board-h4",
    img: "mb-3 mt-1.5 block max-w-full",
  },
  preview: {
    h1: "mb-2 mt-3.5 text-[21px] font-bold text-board-heading",
    h2: "mb-1.5 mt-3 text-lg font-bold text-board-heading",
    h3: "mb-1.5 mt-2.5 text-base font-bold text-board-h3",
    p: "mb-3 text-[15px] leading-[1.8] text-board-prose",
    li: "mb-1 flex gap-2 text-[15px] leading-[1.8] text-board-prose",
    marker: "min-w-[12px]",
    quote: "mb-3 border-l-[3px] border-border2 py-0.5 pl-3 text-[14.5px] text-landing-caption",
    code: "mb-3 overflow-x-auto rounded border border-board-divider bg-landing-bgCard px-3 py-2.5 font-mono text-[13px] text-board-h4",
    img: "mb-3 mt-1.5 block max-w-full",
  },
};

// 본문 제목(h1)이 페이지 제목보다 한 단계 아래에 오도록 태그를 내린다. FAQ는 질문 버튼 아래라 더 내린다.
const HEADING_TAG: Record<Variant, Record<"h1" | "h2" | "h3", "h2" | "h3" | "h4">> = {
  detail: { h1: "h2", h2: "h3", h3: "h4" },
  faq: { h1: "h3", h2: "h3", h3: "h4" },
  preview: { h1: "h2", h2: "h3", h3: "h4" },
};

const renderBlock = (block: PostBlock, variant: Variant, key: number) => {
  const cls = CLASSES[variant];
  switch (block.kind) {
    case "h1":
    case "h2":
    case "h3": {
      const Tag = HEADING_TAG[variant][block.kind];
      return (
        <Tag key={key} className={cls[block.kind]}>
          {block.text}
        </Tag>
      );
    }
    case "p":
      return (
        <p key={key} className={cls.p}>
          {block.text}
        </p>
      );
    case "li":
      return (
        <div key={key} className={cls.li}>
          <span aria-hidden="true" className={cls.marker}>
            {block.marker}
          </span>
          <span>{block.text}</span>
        </div>
      );
    case "quote":
      return (
        <div key={key} className={cls.quote}>
          {block.text}
        </div>
      );
    case "code":
      return (
        <pre key={key} className={cls.code}>
          {block.text}
        </pre>
      );
    default:
      return (
        // 관리자가 넣는 임의의 외부 URL이라 next/image의 도메인 허용 목록에 올릴 수 없다.
        // eslint-disable-next-line @next/next/no-img-element
        <img key={key} src={block.src} alt={block.alt} className={cls.img} />
      );
  }
};

interface PostBlocksProps {
  content: string;
  variant: Variant;
}

const PostBlocks = ({ content, variant }: PostBlocksProps) => {
  const blocks = useMemo(() => parsePostMarkdown(content), [content]);
  return <>{blocks.map((block, i) => renderBlock(block, variant, i))}</>;
};

export const hasPostBlocks = (content: string) => parsePostMarkdown(content).length > 0;

export default PostBlocks;
