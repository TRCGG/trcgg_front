import { ChangeEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  AdminPostDetail,
  PostCategory,
  POST_CATEGORIES,
  POST_CATEGORY_LABEL,
  POST_CONTENT_MAX,
  POST_TITLE_MAX,
} from "@/data/types/post";
import usePostMutations from "@/hooks/post/usePostMutations";
import { useBoardToast } from "@/features/board/BoardToast";
import ConfirmDialog from "@/features/board/ConfirmDialog";
import PostBlocks, { hasPostBlocks } from "@/features/board/PostBlocks";
import {
  BTN_CANCEL,
  BTN_DANGER,
  BTN_DANGER_OUTLINE,
  BTN_NEUTRAL,
  BTN_PRIMARY,
} from "@/features/board/buttonClass";
import {
  diffPostForm,
  failMessage,
  PostForm,
  PostFormErrors,
  PostSnapshot,
  toSnapshot,
  validatePostForm,
} from "@/features/board/postForm";
import { getPostStatus, POST_STATUS_LABEL } from "@/features/board/postMeta";

interface PostEditorProps {
  /** 없으면 새 글 작성이다. */
  post?: AdminPostDetail;
  /** 새 글의 처음 분류. 관리 목록에서 보던 탭을 이어받는다. */
  initialCategory?: PostCategory;
  listHref: string;
}

const snapshotOf = (post: AdminPostDetail): PostSnapshot => ({
  category: post.category,
  title: post.title,
  content: post.content,
  sortOrder: post.sortOrder,
});

const fieldBorder = (error?: string) => (error ? "border-board-dangerBorder" : "border-border2");

const labelClass = "mb-1.5 block text-[13px] text-landing-bodySecondary";
const errorClass = "mt-1 text-[12.5px] text-board-dangerText";
const inputClass =
  "w-full rounded border bg-darkBg2 px-2.5 text-sm text-board-heading placeholder:text-board-faint";

const PostEditor = ({ post, initialCategory = "devlog", listHref }: PostEditorProps) => {
  const router = useRouter();
  const toast = useBoardToast();
  const { create, update, remove } = usePostMutations();

  const [form, setForm] = useState<PostForm>(() =>
    post
      ? {
          category: post.category,
          title: post.title,
          content: post.content,
        }
      : {
          category: initialCategory,
          title: "",
          content: "",
        }
  );
  const [original, setOriginal] = useState<PostSnapshot | null>(() =>
    post ? snapshotOf(post) : null
  );
  const [errors, setErrors] = useState<PostFormErrors>({});
  const [preview, setPreview] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const diff = original ? diffPostForm(form, original) : {};
  const dirty = Object.keys(diff).length > 0;
  const pending = create.isPending || update.isPending || remove.isPending;
  const titleLength = form.title.trim().length;

  const setField =
    (key: keyof PostForm) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const validate = () => {
    const next = validatePostForm(form);
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submitCreate = (isPublished: boolean) => {
    if (!validate()) return;
    create.mutate(
      { ...toSnapshot(form), isPublished },
      {
        onSuccess: (created) => {
          toast(isPublished ? "등록되었습니다." : "임시 저장되었습니다.");
          router.push(`/board/admin?category=${created.category}`);
        },
        onError: (error) => toast(failMessage(error, "저장")),
      }
    );
  };

  const submitEdit = () => {
    if (!post || !validate() || !dirty) return;
    update.mutate(
      { id: post.id, input: diff },
      {
        onSuccess: (saved) => {
          setOriginal(snapshotOf(saved));
          toast("저장되었습니다.");
        },
        onError: (error) => toast(failMessage(error, "저장")),
      }
    );
  };

  const setPublished = (isPublished: boolean, onDone?: () => void) => {
    if (!post) return;
    update.mutate(
      { id: post.id, input: { isPublished } },
      {
        onSuccess: () => {
          onDone?.();
          toast(isPublished ? "공개했습니다." : "비공개로 전환했습니다.");
        },
        onError: (error) => toast(failMessage(error, "처리")),
      }
    );
  };

  const confirmDelete = () => {
    if (!post) return;
    remove.mutate(post.id, {
      onSuccess: () => {
        toast("삭제되었습니다.");
        router.push(`/board/admin?category=${post.category}`);
      },
      onError: (error) => toast(failMessage(error, "삭제")),
    });
  };

  const segmentClass = (on: boolean) =>
    `border border-border2 px-3 py-1.5 text-[13px] ${
      on ? "bg-board-segmentActive text-board-heading" : "bg-darkBg2 text-board-meta"
    }`;

  return (
    <div className="mx-auto max-w-[900px]">
      <Link href={listHref}>
        <a className="mb-5 inline-flex items-center gap-1.5 text-[13px] text-board-meta hover:text-primary1">
          <span aria-hidden="true">←</span>
          관리 목록으로
        </a>
      </Link>
      <div className="mb-[22px] flex flex-wrap items-baseline gap-2.5">
        <h1 className="text-[26px] font-bold tracking-[-0.4px] text-board-heading">
          {post ? "글 수정" : "글쓰기"}
        </h1>
        {post && (
          <>
            <span
              className={`text-[13px] ${
                post.isPublished ? "text-board-published" : "text-board-meta"
              }`}
            >
              {POST_STATUS_LABEL[getPostStatus(post)]}
            </span>
            <Link href={`/board/${post.id}`}>
              <a className="ml-1 text-[13px] text-landing-bodySecondary underline underline-offset-[3px]">
                사용자 화면에서 보기
              </a>
            </Link>
          </>
        )}
      </div>

      <div className="border-t border-border2">
        <div className="flex flex-wrap gap-x-4 gap-y-3 border-b border-board-rowLine py-[18px]">
          <div className="flex-[0_1_200px]">
            <label htmlFor="post-category">
              <span className={labelClass}>분류</span>
              <select
                id="post-category"
                value={form.category}
                onChange={setField("category")}
                className={`${inputClass} h-10 border-border2 [color-scheme:dark]`}
              >
                {POST_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {POST_CATEGORY_LABEL[category]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="border-b border-board-rowLine py-[18px]">
          <label htmlFor="post-title">
            <span className="mb-1.5 flex items-baseline justify-between">
              <span className="text-[13px] text-landing-bodySecondary">제목</span>
              <span
                aria-hidden="true"
                className={`text-xs tabular-nums ${
                  titleLength > POST_TITLE_MAX ? "text-board-dangerText" : "text-board-faint"
                }`}
              >
                {titleLength}/{POST_TITLE_MAX}
              </span>
            </span>
            <input
              id="post-title"
              type="text"
              maxLength={POST_TITLE_MAX}
              value={form.title}
              onChange={setField("title")}
              className={`${inputClass} h-[42px] px-3 text-[15px] ${fieldBorder(errors.title)}`}
            />
          </label>
          {errors.title && (
            <div role="alert" className={errorClass}>
              {errors.title}
            </div>
          )}
        </div>

        <div className="py-[18px]">
          <div className="mb-1.5 flex flex-wrap items-end justify-between gap-2">
            <div role="tablist" aria-label="본문 보기" className="flex">
              <button
                type="button"
                role="tab"
                aria-selected={!preview}
                onClick={() => setPreview(false)}
                className={`${segmentClass(!preview)} rounded-l border-r-0`}
              >
                본문
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={preview}
                onClick={() => setPreview(true)}
                className={`${segmentClass(preview)} rounded-r`}
              >
                미리보기
              </button>
            </div>
            <span
              className={`text-xs tabular-nums ${
                form.content.length > POST_CONTENT_MAX
                  ? "text-board-dangerText"
                  : "text-board-faint"
              }`}
            >
              {form.content.length.toLocaleString()}/{POST_CONTENT_MAX.toLocaleString()}
            </span>
          </div>
          {preview ? (
            <div className="min-h-[380px] rounded border border-border2 bg-darkBg2 px-[18px] py-3.5">
              {hasPostBlocks(form.content) ? (
                <PostBlocks content={form.content} variant="preview" />
              ) : (
                <p className="text-sm text-board-faint">작성된 내용이 없습니다.</p>
              )}
            </div>
          ) : (
            <label htmlFor="post-content">
              <span className="sr-only">본문 (마크다운)</span>
              <textarea
                id="post-content"
                maxLength={POST_CONTENT_MAX}
                value={form.content}
                onChange={setField("content")}
                className={`min-h-[380px] w-full resize-y rounded border bg-darkBg2 px-3.5 py-3 font-mono text-sm leading-[1.7] text-board-subheading ${fieldBorder(
                  errors.content
                )}`}
              />
            </label>
          )}
          {errors.content && (
            <div role="alert" className={errorClass}>
              {errors.content}
            </div>
          )}
          <ul className="mt-2.5 list-disc pl-4 text-[12.5px] leading-[1.8] text-board-meta">
            <li>마크다운 문법을 사용할 수 있습니다.</li>
            <li>
              이미지는 외부 URL로만 첨부할 수 있습니다. 디스코드 첨부 링크는 일정 시간이 지나면
              만료되므로 사용하지 마세요.
            </li>
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-board-divider pt-[18px]">
          <div>
            {post && (
              <button
                type="button"
                disabled={pending}
                onClick={() => setDeleteOpen(true)}
                className={`${BTN_DANGER_OUTLINE} px-4 py-[9px]`}
              >
                삭제
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={listHref}>
              <a className={`${BTN_CANCEL} px-4 py-[9px]`}>취소</a>
            </Link>
            {post ? (
              <>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => setPublished(!post.isPublished)}
                  className={`${BTN_NEUTRAL} px-4 py-[9px]`}
                >
                  {post.isPublished ? "비공개 전환" : "공개"}
                </button>
                <button
                  type="button"
                  disabled={!dirty || pending}
                  onClick={submitEdit}
                  className={`${BTN_PRIMARY} px-[18px] py-[9px]`}
                >
                  저장
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => submitCreate(false)}
                  className={`${BTN_NEUTRAL} px-4 py-[9px]`}
                >
                  임시 저장
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => submitCreate(true)}
                  className={`${BTN_PRIMARY} px-[18px] py-[9px]`}
                >
                  등록
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {post && deleteOpen && (
        <ConfirmDialog
          title="게시글 삭제"
          onCancel={() => setDeleteOpen(false)}
          actions={
            <>
              {post.isPublished && (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => setPublished(false, () => setDeleteOpen(false))}
                  className={`${BTN_NEUTRAL} px-3.5 py-2`}
                >
                  비공개 전환
                </button>
              )}
              <button
                type="button"
                disabled={pending}
                onClick={confirmDelete}
                className={`${BTN_DANGER} px-3.5 py-2`}
              >
                삭제
              </button>
            </>
          }
        >
          <p className="mb-1 truncate text-sm text-landing-body">{post.title}</p>
          <p className="mb-5 text-sm leading-[1.7] text-landing-caption">
            삭제한 글은 복구할 수 없습니다. 노출만 중단하려면 &apos;비공개 전환&apos;을 이용하세요.
          </p>
        </ConfirmDialog>
      )}
    </div>
  );
};

export default PostEditor;
