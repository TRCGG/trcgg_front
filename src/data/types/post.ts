export const POST_CATEGORIES = ["devlog", "faq", "guide", "etc"] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];

export const POST_CATEGORY_LABEL: Record<PostCategory, string> = {
  devlog: "개발 일지",
  faq: "FAQ",
  guide: "사용방법",
  etc: "기타",
};

/** 노출 순서(sortOrder)로 정렬되는 카테고리. 나머지는 처음 공개한 시각 최신순이다. */
export const SORT_ORDER_CATEGORIES: readonly PostCategory[] = ["faq", "guide"];

export const POST_TITLE_MAX = 200;
export const POST_CONTENT_MAX = 10_000;

export const isPostCategory = (value: unknown): value is PostCategory =>
  typeof value === "string" && (POST_CATEGORIES as readonly string[]).includes(value);

export interface PostListItem {
  id: number;
  category: PostCategory;
  title: string;
  /** category=faq로 조회할 때만 실린다. */
  content?: string;
  sortOrder: number | null;
  publishDate: string | null;
}

export interface AdminPostListItem extends PostListItem {
  isPublished: boolean;
  updateDate: string;
}

export interface PostDetail {
  id: number;
  category: PostCategory;
  title: string;
  content: string;
  sortOrder: number | null;
  publishDate: string | null;
  updateDate: string;
}

export interface AdminPostDetail extends PostDetail {
  isPublished: boolean;
  createDate: string;
}

export interface PostListQuery {
  category?: PostCategory;
  page: number;
  limit: number;
}

export interface PostPage<T> {
  items: T[];
  totalCount: number;
  totalPages: number;
}

export interface PostCreateInput {
  category: PostCategory;
  title: string;
  content: string;
  isPublished?: boolean;
  sortOrder?: number | null;
}

export type PostUpdateInput = Partial<PostCreateInput>;

export interface PostListResponse<T> {
  status: string;
  message: string;
  data: T[];
}

export interface PostDetailResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface PostDeleteResponse {
  status: string;
  message: string;
  data: { id: number };
}
