import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Checkbox from "@/components/ui/Checkbox";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { NextPageWithLayout } from "@/data/types/next";
import { AdminPostListItem, POST_CATEGORY_LABEL } from "@/data/types/post";
import useAdminPostList from "@/hooks/post/useAdminPostList";
import usePostMutations, { BulkResult } from "@/hooks/post/usePostMutations";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import AdminGate from "@/features/board/AdminGate";
import { getBoardLayout } from "@/features/board/BoardLayout";
import BoardPager from "@/features/board/BoardPager";
import { useBoardToast } from "@/features/board/BoardToast";
import CategoryTabs from "@/features/board/CategoryTabs";
import ConfirmDialog from "@/features/board/ConfirmDialog";
import { BTN_DANGER, BTN_NEUTRAL, BTN_PRIMARY } from "@/features/board/buttonClass";
import { failMessage, usesSortOrder } from "@/features/board/postForm";
import {
  ADMIN_ORDERED_PAGE_SIZE,
  BOARD_PAGE_SIZE,
  BoardTab,
  formatPostDate,
  getPostStatus,
  parseBoardTab,
  parsePage,
  POST_STATUS_LABEL,
  PostStatus,
} from "@/features/board/postMeta";

const bulkMessage = ({ succeeded, failed }: BulkResult, done: string) =>
  failed === 0
    ? `${succeeded}건을 ${done}`
    : `${succeeded + failed}건 중 ${failed}건을 처리하지 못했습니다.`;

const AdminPostList = () => {
  const router = useRouter();
  const toast = useBoardToast();
  const { isSiteAdmin } = useGuildManagement();
  const tab = parseBoardTab(router.query.category);
  const page = parsePage(router.query.page);
  const ordered = tab !== "all" && usesSortOrder(tab);
  const pageSize = ordered ? ADMIN_ORDERED_PAGE_SIZE : BOARD_PAGE_SIZE;

  const { posts, totalCount, totalPages, isLoading, isPlaceholderData, isError } = useAdminPostList(
    { category: tab === "all" ? undefined : tab, page, limit: pageSize },
    router.isReady && isSiteAdmin
  );
  const { bulkPublish, bulkRemove, move } = usePostMutations();

  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  // 다른 탭·페이지의 글이 보이지 않는 채로 선택에 남지 않게 한다.
  useEffect(() => {
    setChecked(new Set());
  }, [tab, page]);

  const selected = posts.filter((post) => checked.has(post.id));
  const allChecked = posts.length > 0 && posts.every((post) => checked.has(post.id));
  const bulkPending = bulkPublish.isPending || bulkRemove.isPending;

  const go = (nextTab: BoardTab, nextPage: number) => {
    const query: Record<string, string> = {};
    if (nextTab !== "all") query.category = nextTab;
    if (nextPage > 1) query.page = String(nextPage);
    router.push({ pathname: "/board/admin", query }, undefined, { shallow: true });
  };

  // 마지막 페이지의 글을 모두 지우면 빈 페이지에 남으므로 마지막 페이지로 당긴다.
  useEffect(() => {
    if (totalPages > 0 && page > totalPages) go(tab, totalPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- go는 렌더마다 새로 만들어져 넣으면 매번 실행된다
  }, [totalPages, page, tab]);

  const toggle = (id: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () =>
    setChecked(allChecked ? new Set() : new Set(posts.map((post) => post.id)));

  const setPublished = (isPublished: boolean) => {
    // 이미 그 상태인 글은 요청하지 않는다. 건수는 사용자가 고른 만큼 알린다.
    const ids = selected.filter((post) => post.isPublished !== isPublished).map((p) => p.id);
    const done = isPublished ? "공개했습니다." : "비공개로 전환했습니다.";
    const skipped = selected.length - ids.length;
    bulkPublish.mutate(
      { ids, isPublished },
      {
        onSuccess: (result) => {
          setChecked(new Set());
          setBulkDeleteOpen(false);
          toast(bulkMessage({ ...result, succeeded: result.succeeded + skipped }, done));
        },
        onError: (error) => toast(failMessage(error, "처리")),
      }
    );
  };

  const removeSelected = () =>
    bulkRemove.mutate(
      selected.map((post) => post.id),
      {
        onSuccess: (result) => {
          setChecked(new Set());
          setBulkDeleteOpen(false);
          toast(
            result.failed === 0
              ? `${result.succeeded}건이 삭제되었습니다.`
              : bulkMessage(result, "삭제했습니다.")
          );
        },
        onError: (error) => toast(failMessage(error, "삭제")),
      }
    );

  const moveRow = (post: AdminPostListItem, direction: -1 | 1) => {
    if (tab === "all") return;
    move.mutate(
      // 한 페이지에 분류 전체가 있으면 서버 재조회 없이 화면 목록으로 계산한다.
      { category: tab, id: post.id, direction, posts: totalPages === 1 ? posts : undefined },
      { onError: (error) => toast(failMessage(error, "순서를 변경")) }
    );
  };

  const rowState = (post: AdminPostListItem, i: number) => ({
    index: (page - 1) * pageSize + i,
    isChecked: checked.has(post.id),
    status: getPostStatus(post),
    isMoving: move.isPending && move.variables?.id === post.id,
  });

  const rowHighlight = (isChecked: boolean, isMoving: boolean) =>
    isChecked || isMoving ? "bg-landing-gold/[0.06]" : "";

  const renderCheckbox = (post: AdminPostListItem, isChecked: boolean) => (
    <Checkbox
      aria-label={`${post.title} 선택`}
      checked={isChecked}
      onChange={() => toggle(post.id)}
    />
  );

  const renderTitle = (post: AdminPostListItem, className: string) => (
    <Link href={`/board/admin/${post.id}`}>
      <a
        className={`${className} hover:underline ${
          post.isPublished ? "text-board-title" : "text-landing-bodySecondary"
        }`}
      >
        {post.title}
      </a>
    </Link>
  );

  const renderOrder = (
    post: AdminPostListItem,
    index: number,
    isMoving: boolean,
    arrowClass: string
  ) => (
    <div className="flex items-center gap-0.5">
      <span className="min-w-[22px]">
        {isMoving ? (
          <span
            role="status"
            aria-label="순서 저장 중"
            className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-landing-gold border-t-transparent align-middle"
          />
        ) : (
          (post.sortOrder ?? "-")
        )}
      </span>
      <button
        type="button"
        aria-label="위로"
        disabled={index === 0 || move.isPending}
        onClick={() => moveRow(post, -1)}
        className={`${arrowClass} p-0 text-[11px] text-landing-bodySecondary disabled:cursor-default disabled:opacity-25`}
      >
        ▲
      </button>
      <button
        type="button"
        aria-label="아래로"
        disabled={index === totalCount - 1 || move.isPending}
        onClick={() => moveRow(post, 1)}
        className={`${arrowClass} p-0 text-[11px] text-landing-bodySecondary disabled:cursor-default disabled:opacity-25`}
      >
        ▼
      </button>
    </div>
  );

  const statusClass = (status: PostStatus) =>
    status === "published" ? "text-board-published" : "text-board-meta";

  const renderRow = (post: AdminPostListItem, i: number) => {
    const { index, isChecked, status, isMoving } = rowState(post, i);
    return (
      <tr
        key={post.id}
        className={`border-b border-board-rowLine transition-colors ${rowHighlight(
          isChecked,
          isMoving
        )}`}
      >
        <td className="py-3 pl-3">{renderCheckbox(post, isChecked)}</td>
        <td className={`whitespace-nowrap px-3 py-3 text-[13px] ${statusClass(status)}`}>
          {POST_STATUS_LABEL[status]}
        </td>
        <td className="px-2 py-3 text-[13px] text-landing-caption">
          {POST_CATEGORY_LABEL[post.category]}
        </td>
        <td className="max-w-0 px-2 py-3">
          {renderTitle(post, "block max-w-full truncate text-[14.5px]")}
        </td>
        {ordered && (
          <td className="px-2 py-3 tabular-nums text-landing-bodySecondary">
            {renderOrder(post, index, isMoving, "h-5 w-5")}
          </td>
        )}
        <td className="px-2 py-3 text-[13px] tabular-nums text-board-meta">
          {formatPostDate(post.updateDate)}
        </td>
      </tr>
    );
  };

  const renderCard = (post: AdminPostListItem, i: number) => {
    const { index, isChecked, status, isMoving } = rowState(post, i);
    return (
      <li
        key={post.id}
        className={`flex items-start gap-3 border-b border-board-rowLine px-1.5 py-3 transition-colors ${rowHighlight(
          isChecked,
          isMoving
        )}`}
      >
        <span className="pt-[3px]">{renderCheckbox(post, isChecked)}</span>
        <div className="min-w-0 flex-1">
          {renderTitle(post, "line-clamp-2 break-all text-[14.5px] leading-[1.5]")}
          <div className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[12.5px] tabular-nums text-board-meta">
            <span className={statusClass(status)}>{POST_STATUS_LABEL[status]}</span>
            <span aria-hidden="true">·</span>
            <span className="text-landing-caption">{POST_CATEGORY_LABEL[post.category]}</span>
            <span aria-hidden="true">·</span>
            <span>{formatPostDate(post.updateDate)}</span>
          </div>
        </div>
        {ordered && (
          <div className="shrink-0 tabular-nums text-landing-bodySecondary">
            {renderOrder(post, index, isMoving, "h-8 w-8")}
          </div>
        )}
      </li>
    );
  };

  const newPostHref = tab === "all" ? "/board/admin/new" : `/board/admin/new?category=${tab}`;

  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[22px] font-bold tracking-[-0.4px] text-board-heading sm:text-[26px]">
          게시판 관리
        </h1>
        <Link href={newPostHref}>
          <a className={`${BTN_PRIMARY} px-[18px] py-[9px]`}>글쓰기</a>
        </Link>
      </div>

      <CategoryTabs active={tab} onSelect={(next) => go(next, 1)} />

      <div className="flex flex-wrap justify-between gap-2 px-0.5 pb-2.5 pt-3.5 text-[13px] text-board-meta">
        <span>
          총 <b className="font-bold text-landing-body">{totalCount}</b>건 (초안 포함) · 제목을
          누르면 수정, 공개 전환·삭제는 체크 후 진행합니다.
        </span>
        {ordered &&
          (move.isPending ? (
            <span className="text-landing-goldLight">순서를 저장하는 중…</span>
          ) : (
            <span>
              노출 순서대로 정렬됩니다. 새 글은 맨 뒤에 붙고, 순서 열의 화살표로 변경할 수 있습니다.
            </span>
          ))}
      </div>

      {selected.length > 0 && (
        <div
          role="region"
          aria-label="선택한 글 일괄 처리"
          className="mb-2.5 flex flex-wrap items-center gap-2 rounded border border-board-selectionBorder bg-board-selectionBg px-3 py-[9px]"
        >
          <span className="text-sm text-board-heading">
            <b className="text-landing-goldLight">{selected.length}</b>개 선택
          </span>
          <button
            type="button"
            onClick={() => setChecked(new Set())}
            className="px-1 py-0.5 text-[13px] text-landing-caption underline underline-offset-[3px]"
          >
            선택 해제
          </button>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              disabled={bulkPending}
              onClick={() => setPublished(true)}
              className={`${BTN_NEUTRAL} px-3 py-[7px] text-[13px]`}
            >
              공개
            </button>
            <button
              type="button"
              disabled={bulkPending}
              onClick={() => setPublished(false)}
              className={`${BTN_NEUTRAL} px-3 py-[7px] text-[13px]`}
            >
              비공개 전환
            </button>
            <button
              type="button"
              disabled={bulkPending}
              onClick={() => setBulkDeleteOpen(true)}
              className={`${BTN_DANGER} px-3 py-[7px] text-[13px]`}
            >
              삭제
            </button>
          </div>
        </div>
      )}

      {!router.isReady || isLoading || isPlaceholderData ? (
        <LoadingSpinner />
      ) : (
        <div className="border-t border-border2">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- 규칙이 Checkbox 컴포넌트 안의 input을 보지 못한다 */}
          <label
            htmlFor="admin-check-all-mobile"
            className="flex items-center gap-3 border-b border-board-rowLine bg-board-panel px-1.5 py-2.5 text-[12.5px] text-board-meta md:hidden"
          >
            <Checkbox id="admin-check-all-mobile" checked={allChecked} onChange={toggleAll} />이
            페이지 전체 선택
          </label>
          <ul className="md:hidden">{posts.map(renderCard)}</ul>
          <table className="hidden w-full border-collapse text-sm md:table">
            <thead>
              <tr className="bg-board-panel text-left text-[12.5px] text-board-meta">
                <th scope="col" className="w-9 py-2.5 pl-3">
                  <Checkbox
                    aria-label="이 페이지 글 전체 선택"
                    checked={allChecked}
                    onChange={toggleAll}
                  />
                </th>
                <th scope="col" className="w-24 px-3 py-2.5 font-normal">
                  상태
                </th>
                <th scope="col" className="w-[84px] px-2 py-2.5 font-normal">
                  분류
                </th>
                <th scope="col" className="px-2 py-2.5 font-normal">
                  제목
                </th>
                {ordered && (
                  <th scope="col" className="w-[78px] px-2 py-2.5 font-normal">
                    순서
                  </th>
                )}
                <th scope="col" className="w-24 px-2 py-2.5 font-normal">
                  수정일
                </th>
              </tr>
            </thead>
            <tbody>{posts.map(renderRow)}</tbody>
          </table>
          {(isError || posts.length === 0) && (
            <div className="border-b border-board-rowLine py-[52px] text-center text-sm text-board-meta">
              {isError ? "글을 불러오지 못했습니다." : "등록된 글이 없습니다."}
            </div>
          )}
        </div>
      )}

      <BoardPager page={page} totalPages={totalPages} onChange={(next) => go(tab, next)} />

      {bulkDeleteOpen && selected.length > 0 && (
        <ConfirmDialog
          title={`선택한 글 ${selected.length}개 삭제`}
          onCancel={() => setBulkDeleteOpen(false)}
          actions={
            <>
              <button
                type="button"
                disabled={bulkPending}
                onClick={() => setPublished(false)}
                className={`${BTN_NEUTRAL} px-3.5 py-2`}
              >
                비공개 전환
              </button>
              <button
                type="button"
                disabled={bulkPending}
                onClick={removeSelected}
                className={`${BTN_DANGER} px-3.5 py-2`}
              >
                {selected.length}개 삭제
              </button>
            </>
          }
        >
          <div className="mb-3 max-h-[140px] overflow-y-auto rounded border border-board-divider bg-darkBg2 px-2.5 py-2">
            {selected.map((post) => (
              <div key={post.id} className="truncate text-[13px] leading-[1.8] text-board-prose">
                {post.title}
              </div>
            ))}
          </div>
          <p className="mb-5 text-sm leading-[1.7] text-landing-caption">
            삭제한 글은 복구할 수 없습니다. 노출만 중단하려면 &apos;비공개 전환&apos;을 이용하세요.
          </p>
        </ConfirmDialog>
      )}
    </div>
  );
};

const AdminPostListPage: NextPageWithLayout = () => (
  <AdminGate>
    <Head>
      <title>게시판 관리 - GMOK</title>
    </Head>
    <AdminPostList />
  </AdminGate>
);

AdminPostListPage.getLayout = getBoardLayout;

export default AdminPostListPage;
