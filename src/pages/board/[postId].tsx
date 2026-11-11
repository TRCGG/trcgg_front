import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { NextPageWithLayout } from "@/data/types/next";
import { POST_CATEGORY_LABEL } from "@/data/types/post";
import usePostDetail from "@/hooks/post/usePostDetail";
import { getBoardLayout } from "@/features/board/BoardLayout";
import PostBlocks from "@/features/board/PostBlocks";
import { formatPostDate, parsePostId } from "@/features/board/postMeta";
import { BTN_NEUTRAL } from "@/features/board/buttonClass";

const PostDetailPage: NextPageWithLayout = () => {
  const router = useRouter();
  const postId = router.isReady ? parsePostId(router.query.postId) : null;
  const { post, isNotFound, isError, isLoading } = usePostDetail(postId);

  const renderBody = () => {
    if (!router.isReady || isLoading) return <LoadingSpinner />;
    if (isNotFound || postId === null) {
      return (
        <div className="border-b border-t border-b-board-divider border-t-border2 py-20 text-center">
          <p className="mb-1.5 text-base font-bold text-board-subheading">
            존재하지 않거나 비공개된 글입니다.
          </p>
          <p className="text-sm text-board-meta">삭제되었거나 공개가 중단된 글일 수 있습니다.</p>
        </div>
      );
    }
    if (isError || !post) {
      return (
        <div className="border-t border-border2 py-20 text-center text-sm text-board-meta">
          글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </div>
      );
    }

    const published = formatPostDate(post.publishDate);
    const updated = formatPostDate(post.updateDate);

    return (
      <article>
        <Head>
          <title>{`${post.title} - GMOK 게시판`}</title>
        </Head>
        <div className="mb-2 text-[13px] text-landing-caption">
          {POST_CATEGORY_LABEL[post.category]}
        </div>
        <h1 className="mb-3 text-[26px] font-bold leading-[1.4] tracking-[-0.4px] text-landing-heading">
          {post.title}
        </h1>
        <div className="mb-7 border-b border-board-divider pb-[18px] text-[13px] tabular-nums text-board-meta">
          작성 {published}
          {updated !== published && <> · 수정 {updated}</>}
        </div>
        <div className="min-h-[200px]">
          <PostBlocks content={post.content} variant="detail" />
        </div>
      </article>
    );
  };

  const listHref = post ? `/board?category=${post.category}` : "/board";

  return (
    <div className="mx-auto max-w-[800px]">
      <Head>
        <title>게시판 - GMOK</title>
      </Head>
      <Link href={listHref}>
        <a className="mb-5 inline-flex items-center gap-1.5 text-[13px] text-board-meta hover:text-primary1">
          <span aria-hidden="true">←</span>
          목록으로
        </a>
      </Link>
      {renderBody()}
      <div className="mt-6 flex justify-end border-t border-board-divider pt-5">
        <Link href={listHref}>
          <a className={`${BTN_NEUTRAL} px-5 py-[9px]`}>목록</a>
        </Link>
      </div>
    </div>
  );
};

PostDetailPage.getLayout = getBoardLayout;

export default PostDetailPage;
