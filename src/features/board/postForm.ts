import {
  PostCategory,
  PostUpdateInput,
  POST_CONTENT_MAX,
  POST_TITLE_MAX,
  SORT_ORDER_CATEGORIES,
} from "@/data/types/post";
import { isApiError } from "@/services/apiError";

export interface PostForm {
  category: PostCategory;
  title: string;
  content: string;
}

export interface PostSnapshot {
  category: PostCategory;
  title: string;
  content: string;
  sortOrder: number | null;
}

export type PostFormErrors = Partial<Record<"title" | "content", string>>;

export const usesSortOrder = (category: PostCategory) => SORT_ORDER_CATEGORIES.includes(category);

export const validatePostForm = (form: PostForm): PostFormErrors => {
  const errors: PostFormErrors = {};
  const title = form.title.trim();
  if (!title) errors.title = "제목을 입력해 주세요.";
  else if (title.length > POST_TITLE_MAX) errors.title = "제목은 200자까지 입력할 수 있습니다.";

  if (!form.content.trim()) errors.content = "본문을 입력해 주세요.";
  else if (form.content.length > POST_CONTENT_MAX)
    errors.content = "본문은 10,000자까지 입력할 수 있습니다.";
  return errors;
};

/**
 * 순서는 관리 목록의 화살표로만 바꾼다. 새 글이나 분류를 옮긴 글은 null로 저장해 그 분류의 맨 뒤에
 * 붙인다(백엔드가 sort_order ASC NULLS LAST, id ASC로 정렬한다). 원래 분류로 되돌리면 값을 복원한다.
 */
export const toSnapshot = (form: PostForm, original?: PostSnapshot | null): PostSnapshot => ({
  category: form.category,
  title: form.title.trim(),
  content: form.content,
  sortOrder: original && form.category === original.category ? original.sortOrder : null,
});

/** 바뀐 필드만 PATCH한다. 백엔드는 빈 본문을 400으로 거절한다. */
export const diffPostForm = (form: PostForm, original: PostSnapshot): PostUpdateInput => {
  const next = toSnapshot(form, original);
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
