import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { NextPageWithLayout } from "@/data/types/next";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import usePostList from "@/hooks/post/usePostList";
import { getBoardLayout } from "@/features/board/BoardLayout";
import { BTN_NEUTRAL, BTN_PRIMARY } from "@/features/board/buttonClass";
import BoardPager from "@/features/board/BoardPager";
import CategoryTabs from "@/features/board/CategoryTabs";
import FaqAccordion from "@/features/board/FaqAccordion";
import PostListPlain from "@/features/board/PostListPlain";
import { BOARD_PAGE_SIZE, BoardTab, parseBoardTab, parsePage } from "@/features/board/postMeta";

const BoardPage: NextPageWithLayout = () => {
  const router = useRouter();
  const tab = parseBoardTab(router.query.category);
  const page = parsePage(router.query.page);
  const { isSiteAdmin } = useGuildManagement();

  const { posts, totalCount, totalPages, isLoading, isPlaceholderData, isError } = usePostList(
    { category: tab === "all" ? undefined : tab, page, limit: BOARD_PAGE_SIZE },
    // 쿼리스트링을 읽기 전에 1페이지·전체로 한 번 더 요청하지 않도록 기다린다.
    router.isReady
  );

  const go = (nextTab: BoardTab, nextPage: number) => {
    const query: Record<string, string> = {};
    if (nextTab !== "all") query.category = nextTab;
    if (nextPage > 1) query.page = String(nextPage);
    router.push({ pathname: "/board", query }, undefined, { shallow: true });
  };

  const renderList = () => {
    if (!router.isReady || isLoading || isPlaceholderData) return <LoadingSpinner />;
    if (isError) {
      return (
        <div className="border-t border-border2 py-[60px] text-center text-sm text-board-meta">
          글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </div>
      );
    }
    // FAQ 탭은 목록에 본문이 실려 오므로 상세로 넘기지 않고 펼쳐 보여 준다.
    return tab === "faq" ? (
      <FaqAccordion key={page} posts={posts} />
    ) : (
      <PostListPlain posts={posts} />
    );
  };

  return (
    <div className="mx-auto max-w-[960px]">
      <Head>
        <title>게시판 - GMOK</title>
        <meta name="description" content="GMOK 게시판. 개발 일지, FAQ, 사용방법, 공지." />
      </Head>

      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-[22px] font-bold tracking-[-0.4px] text-board-heading sm:text-[26px]">
          게시판
        </h1>
        {isSiteAdmin && (
          <div className="flex items-center gap-2">
            <Link href={tab === "all" ? "/board/admin/new" : `/board/admin/new?category=${tab}`}>
              <a className={`${BTN_PRIMARY} px-[18px] py-[9px]`}>글쓰기</a>
            </Link>
            <Link href="/board/admin">
              <a className={`${BTN_NEUTRAL} px-[18px] py-[9px]`}>관리</a>
            </Link>
          </div>
        )}
      </div>

      <CategoryTabs active={tab} onSelect={(next) => go(next, 1)} />

      <div className="flex items-center justify-between px-0.5 pb-2.5 pt-3.5 text-[13px] text-board-meta">
        <span>
          총 <b className="font-bold text-landing-body">{totalCount}</b>건
        </span>
        {totalPages > 0 && (
          <span>
            {Math.min(page, totalPages)} / {totalPages} 페이지
          </span>
        )}
      </div>

      {renderList()}

      <BoardPager page={page} totalPages={totalPages} onChange={(next) => go(tab, next)} />
    </div>
  );
};

BoardPage.getLayout = getBoardLayout;

export default BoardPage;
