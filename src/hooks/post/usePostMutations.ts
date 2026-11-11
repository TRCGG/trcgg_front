import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AdminPostDetail,
  AdminPostListItem,
  PostCategory,
  PostCreateInput,
  PostUpdateInput,
} from "@/data/types/post";
import { createPost, deletePost, getAdminPosts, updatePost } from "@/services/post";
import useInvalidatePosts from "@/hooks/post/useInvalidatePosts";

export interface BulkResult {
  succeeded: number;
  failed: number;
}

// 일괄 API가 없어 글마다 요청을 보낸다. 일부만 실패해도 나머지는 반영되므로 건수로 알린다.
const runEach = async (
  ids: number[],
  fn: (id: number) => Promise<unknown>
): Promise<BulkResult> => {
  const results = await Promise.allSettled(ids.map(fn));
  const failed = results.filter((r) => r.status === "rejected").length;
  return { succeeded: results.length - failed, failed };
};

const ADMIN_FETCH_LIMIT = 100;

const fetchAllAdminPosts = async (category: PostCategory): Promise<AdminPostListItem[]> => {
  const first = await getAdminPosts({ category, page: 1, limit: ADMIN_FETCH_LIMIT });
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, first.totalPages - 1) }, (_, i) =>
      getAdminPosts({ category, page: i + 2, limit: ADMIN_FETCH_LIMIT })
    )
  );
  return [first, ...rest].flatMap((page) => page.items);
};

/**
 * 이웃 글과 자리를 바꾼 뒤 카테고리 전체를 1부터 다시 번호 매긴다. 미지정(null)이나 중복 순서가
 * 섞여 있으면 두 글의 값만 맞바꿔서는 화면 순서가 바뀌지 않기 때문이다. 값이 바뀐 글만 PATCH한다.
 */
const reorder = async (category: PostCategory, id: number, direction: -1 | 1) => {
  const posts = await fetchAllAdminPosts(category);
  const from = posts.findIndex((post) => post.id === id);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= posts.length) return;

  const ordered = [...posts];
  [ordered[from], ordered[to]] = [ordered[to], ordered[from]];
  const changes = ordered
    .map((post, i) => ({ id: post.id, sortOrder: i + 1, previous: post.sortOrder }))
    .filter((change) => change.sortOrder !== change.previous);

  await Promise.all(
    changes.map((change) => updatePost(change.id, { sortOrder: change.sortOrder }))
  );
};

const usePostMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidatePosts();

  const cacheDetail = (post: AdminPostDetail) =>
    queryClient.setQueryData(["adminPost", "detail", post.id], post);

  const create = useMutation({
    mutationFn: (input: PostCreateInput) => createPost(input),
    onSuccess: cacheDetail,
    onSettled: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, input }: { id: number; input: PostUpdateInput }) => updatePost(id, input),
    onSuccess: cacheDetail,
    onSettled: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSettled: invalidate,
  });

  const bulkPublish = useMutation({
    mutationFn: ({ ids, isPublished }: { ids: number[]; isPublished: boolean }) =>
      runEach(ids, (id) => updatePost(id, { isPublished })),
    onSettled: invalidate,
  });

  const bulkRemove = useMutation({
    mutationFn: (ids: number[]) => runEach(ids, deletePost),
    onSettled: invalidate,
  });

  const move = useMutation({
    mutationFn: ({
      category,
      id,
      direction,
    }: {
      category: PostCategory;
      id: number;
      direction: -1 | 1;
    }) => reorder(category, id, direction),
    onSettled: invalidate,
  });

  return { create, update, remove, bulkPublish, bulkRemove, move };
};

export default usePostMutations;
