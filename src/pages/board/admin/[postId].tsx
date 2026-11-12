import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { NextPageWithLayout } from "@/data/types/next";
import useAdminPostDetail from "@/hooks/post/useAdminPostDetail";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import AdminGate from "@/features/board/AdminGate";
import { getBoardLayout } from "@/features/board/BoardLayout";
import PostEditor from "@/features/board/PostEditor";
import { parsePostId } from "@/features/board/postMeta";

const EditPost = () => {
  const router = useRouter();
  const { isSiteAdmin } = useGuildManagement();
  const postId = router.isReady ? parsePostId(router.query.postId) : null;
  const { post, isNotFound, isError, isLoading } = useAdminPostDetail(postId, isSiteAdmin);

  if (!router.isReady || isLoading) return <LoadingSpinner />;

  if (!post) {
    return (
      <div className="mx-auto max-w-[900px] border-t border-border2 py-20 text-center text-sm text-board-meta">
        <p className="mb-4">
          {isNotFound || postId === null || !isError
            ? "존재하지 않거나 삭제된 글입니다."
            : "글을 불러오지 못했습니다."}
        </p>
        <Link href="/board/admin">
          <a className="text-landing-bodySecondary underline underline-offset-[3px]">
            관리 목록으로
          </a>
        </Link>
      </div>
    );
  }

  return (
    <PostEditor key={post.id} post={post} listHref={`/board/admin?category=${post.category}`} />
  );
};

const EditPostPage: NextPageWithLayout = () => (
  <AdminGate>
    <Head>
      <title>글 수정 - GMOK 게시판</title>
    </Head>
    <EditPost />
  </AdminGate>
);

EditPostPage.getLayout = getBoardLayout;

export default EditPostPage;
