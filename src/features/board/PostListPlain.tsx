import Link from "next/link";
import { PostListItem, POST_CATEGORY_LABEL } from "@/data/types/post";
import { formatPostDate, isNewPost } from "@/features/board/postMeta";

const PostListPlain = ({ posts }: { posts: PostListItem[] }) => (
  <div className="border-t border-border2">
    {posts.map((post) => (
      <Link key={post.id} href={`/board/${post.id}`}>
        <a className="flex w-full items-center gap-[18px] border-b border-board-rowLine px-1.5 py-[13px] hover:bg-board-rowHover sm:py-[15px]">
          <span className="hidden w-16 shrink-0 text-[13px] text-landing-caption sm:block">
            {POST_CATEGORY_LABEL[post.category]}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1.5">
              <span className="truncate text-[15px] text-board-title">{post.title}</span>
              {isNewPost(post.publishDate) && (
                <span
                  aria-label="새 글"
                  className="shrink-0 rounded-sm bg-landing-gold px-1 text-[10px] font-bold leading-[15px] text-landing-bg"
                >
                  N
                </span>
              )}
            </span>
            <span className="mt-0.5 flex gap-1.5 text-[12.5px] tabular-nums text-board-meta sm:hidden">
              <span className="text-landing-caption">{POST_CATEGORY_LABEL[post.category]}</span>
              <span aria-hidden="true">·</span>
              <span>{formatPostDate(post.publishDate)}</span>
            </span>
          </span>
          <span className="hidden shrink-0 text-[13px] tabular-nums text-board-meta sm:block">
            {formatPostDate(post.publishDate)}
          </span>
        </a>
      </Link>
    ))}
    {posts.length === 0 && (
      <div className="border-b border-board-rowLine py-[60px] text-center text-sm text-board-meta">
        등록된 글이 없습니다.
      </div>
    )}
  </div>
);

export default PostListPlain;
