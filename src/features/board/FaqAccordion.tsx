import { useState } from "react";
import { PostListItem } from "@/data/types/post";
import PostBlocks from "@/features/board/PostBlocks";

const FaqAccordion = ({ posts }: { posts: PostListItem[] }) => {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="border-t border-border2">
      {posts.map((post) => {
        const expanded = openId === post.id;
        const panelId = `faq-panel-${post.id}`;
        return (
          <div key={post.id} className="border-b border-board-rowLine">
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => setOpenId(expanded ? null : post.id)}
              className="flex w-full items-center gap-3 px-1.5 py-4 text-left"
            >
              <span aria-hidden="true" className="shrink-0 text-[15px] font-bold text-landing-gold">
                Q.
              </span>
              <span
                className={`min-w-0 flex-1 text-[15px] ${
                  expanded ? "text-landing-heading" : "text-board-h3"
                }`}
              >
                {post.title}
              </span>
              <span
                aria-hidden="true"
                className="w-4 shrink-0 text-center text-lg leading-none text-board-meta"
              >
                {expanded ? "−" : "+"}
              </span>
            </button>
            {expanded && (
              <div
                id={panelId}
                className="border-t border-board-rowLine bg-board-panel pb-3.5 pl-9 pr-[22px] pt-[18px]"
              >
                <PostBlocks content={post.content ?? ""} variant="faq" />
              </div>
            )}
          </div>
        );
      })}
      {posts.length === 0 && (
        <div className="border-b border-board-rowLine py-[60px] text-center text-sm text-board-meta">
          등록된 질문이 없습니다.
        </div>
      )}
    </div>
  );
};

export default FaqAccordion;
