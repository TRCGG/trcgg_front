import Head from "next/head";
import { useRouter } from "next/router";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { NextPageWithLayout } from "@/data/types/next";
import { isPostCategory } from "@/data/types/post";
import AdminGate from "@/features/board/AdminGate";
import { getBoardLayout } from "@/features/board/BoardLayout";
import PostEditor from "@/features/board/PostEditor";

const NewPostPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { category } = router.query;
  const fromCategory = isPostCategory(category) ? category : null;

  return (
    <AdminGate>
      <Head>
        <title>글쓰기 - GMOK 게시판</title>
      </Head>
      {router.isReady ? (
        <PostEditor
          initialCategory={fromCategory ?? "devlog"}
          listHref={fromCategory ? `/board/admin?category=${fromCategory}` : "/board/admin"}
        />
      ) : (
        <LoadingSpinner />
      )}
    </AdminGate>
  );
};

NewPostPage.getLayout = getBoardLayout;

export default NewPostPage;
