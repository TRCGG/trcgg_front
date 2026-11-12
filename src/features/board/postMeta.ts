import { PostCategory, POST_CATEGORY_LABEL } from "@/data/types/post";

export type BoardTab = PostCategory | "all";

export const BOARD_TABS: { key: BoardTab; label: string }[] = [
  { key: "all", label: "전체" },
  ...(Object.keys(POST_CATEGORY_LABEL) as PostCategory[]).map((key) => ({
    key,
    label: POST_CATEGORY_LABEL[key],
  })),
];

export const BOARD_PAGE_SIZE = 10;
/** 관리 화면의 FAQ·이용방법 탭은 순서를 바꾸는 곳이라 페이지를 나누지 않고 한 번에 보여 준다. */
export const ADMIN_ORDERED_PAGE_SIZE = 100;

const NEW_BADGE_MS = 7 * 24 * 60 * 60 * 1000;

export const formatPostDate = (iso: string | null): string => {
  if (!iso) return "-";
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
};

export const isNewPost = (publishDate: string | null): boolean =>
  !!publishDate && Date.now() - new Date(publishDate).getTime() < NEW_BADGE_MS;

export type PostStatus = "published" | "unpublished" | "draft";

/** 한 번도 공개한 적 없는 글(publishDate 없음)만 임시저장이다. 공개했다 내린 글은 비공개. */
export const getPostStatus = (post: {
  isPublished: boolean;
  publishDate: string | null;
}): PostStatus => {
  if (post.isPublished) return "published";
  return post.publishDate ? "unpublished" : "draft";
};

export const POST_STATUS_LABEL: Record<PostStatus, string> = {
  published: "공개",
  unpublished: "비공개",
  draft: "임시저장",
};

export const parseBoardTab = (value: unknown): BoardTab =>
  typeof value === "string" && BOARD_TABS.some((tab) => tab.key === value)
    ? (value as BoardTab)
    : "all";

const parsePositiveInt = (value: unknown): number | null => {
  const n = typeof value === "string" && /^\d+$/.test(value) ? Number(value) : NaN;
  return Number.isSafeInteger(n) && n >= 1 ? n : null;
};

export const parsePage = (value: unknown): number => parsePositiveInt(value) ?? 1;

export const parsePostId = (value: unknown): number | null => parsePositiveInt(value);
