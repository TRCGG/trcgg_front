import {
  PostCategory,
  PostUpdateInput,
  POST_CONTENT_MAX,
  POST_SORT_ORDER_MAX,
  POST_TITLE_MAX,
  SORT_ORDER_CATEGORIES,
} from "@/data/types/post";
import { isApiError } from "@/services/apiError";

export interface PostForm {
  category: PostCategory;
  title: string;
  content: string;
  /** 입력칸 그대로의 문자열. 빈 문자열은 순서 미지정이다. */
  sortOrder: string;
}

export interface PostSnapshot {
  category: PostCategory;
  title: string;
  content: string;
  sortOrder: number | null;
}

export type PostFormErrors = Partial<Record<"title" | "content" | "sortOrder", string>>;

export const usesSortOrder = (category: PostCategory) => SORT_ORDER_CATEGORIES.includes(category);

export const validatePostForm = (form: PostForm): PostFormErrors => {
  const errors: PostFormErrors = {};
  const title = form.title.trim();
  if (!title) errors.title = "제목을 입력해 주세요.";
  else if (title.length > POST_TITLE_MAX) errors.title = "제목은 200자까지 입력할 수 있습니다.";

  if (!form.content.trim()) errors.content = "본문을 입력해 주세요.";
  else if (form.content.length > POST_CONTENT_MAX)
    errors.content = "본문은 10,000자까지 입력할 수 있습니다.";

  if (
    usesSortOrder(form.category) &&
    form.sortOrder !== "" &&
    !(/^\d+$/.test(form.sortOrder) && Number(form.sortOrder) <= POST_SORT_ORDER_MAX)
  ) {
    errors.sortOrder = "0 이상의 정수를 입력해 주세요.";
  }
  return errors;
};

/** 순서를 쓰지 않는 카테고리로 옮기면 남아 있던 순서 값을 비운다. */
export const sortOrderOf = (form: PostForm): number | null =>
  usesSortOrder(form.category) && form.sortOrder !== "" ? Number(form.sortOrder) : null;

export const toSnapshot = (form: PostForm): PostSnapshot => ({
  category: form.category,
  title: form.title.trim(),
  content: form.content,
  sortOrder: sortOrderOf(form),
});

/** 바뀐 필드만 PATCH한다. 백엔드는 빈 본문을 400으로 거절한다. */
export const diffPostForm = (form: PostForm, original: PostSnapshot): PostUpdateInput => {
  const next = toSnapshot(form);
  const diff: PostUpdateInput = {};
  if (next.category !== original.category) diff.category = next.category;
  if (next.title !== original.title) diff.title = next.title;
  if (next.content !== original.content) diff.content = next.content;
  if (next.sortOrder !== original.sortOrder) diff.sortOrder = next.sortOrder;
  return diff;
};

export const failMessage = (error: unknown, action: string): string => {
  if (isApiError(error) && error.status === 403) return "관리 권한이 없습니다.";
  if (isApiError(error) && error.status === 404) return "이미 삭제된 글입니다.";
  return `${action}하지 못했습니다. 잠시 후 다시 시도해 주세요.`;
};
