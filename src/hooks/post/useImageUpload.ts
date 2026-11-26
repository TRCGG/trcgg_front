import { useState } from "react";
import { isApiError } from "@/services/apiError";
import { requestImageUpload, STORAGE_UPLOAD_FAILED, uploadToStorage } from "@/services/imageUpload";
import { compressImage } from "@/utils/compressImage";
import { IMAGE_UPLOAD_CONTENT_TYPES, ImageUploadContentType } from "@/data/types/imageUpload";

type ContentUpdater = (update: (content: string) => string) => void;

let tokenSeq = 0;
const nextToken = () => {
  tokenSeq += 1;
  return `${Date.now().toString(36)}${tokenSeq.toString(36)}`;
};

const placeholderOf = (token: string) => `![업로드 중…](uploading:${token})`;

const isUploadContentType = (type: string): type is ImageUploadContentType =>
  (IMAGE_UPLOAD_CONTENT_TYPES as readonly string[]).includes(type);

export const imageFilesOf = (files: FileList | null): File[] =>
  Array.from(files ?? []).filter((file) => file.type.startsWith("image/"));

const uploadFailMessage = (error: unknown): string => {
  if (!isApiError(error)) return "이미지를 읽지 못했습니다. 다른 이미지로 시도해 주세요.";
  if (error.errorType === STORAGE_UPLOAD_FAILED)
    return "이미지를 올리지 못했습니다. 10MB 이하인지 확인하고 다시 붙여넣어 주세요.";
  if (error.status === 401) return "로그인이 필요합니다.";
  if (error.status === 403) return "관리 권한이 없습니다.";
  if (error.status === 503) return "이 서버에서는 이미지 업로드를 사용할 수 없습니다.";
  return "이미지를 올리지 못했습니다. 잠시 후 다시 시도해 주세요.";
};

const uploadImage = async (file: File): Promise<string> => {
  const blob = await compressImage(file);
  if (!isUploadContentType(blob.type)) throw new Error(`Unsupported image type: ${blob.type}`);
  const ticket = await requestImageUpload(blob.type);
  await uploadToStorage(ticket, blob);
  return ticket.publicUrl;
};

/**
 * 붙여넣거나 끌어다 놓은 이미지를 자리표시로 먼저 넣고, 올라가면 그 자리를 이미지 마크다운으로 바꾼다.
 * 업로드 중에도 타이핑이 이어지므로 위치가 아니라 업로드마다 고유한 토큰으로 자리를 찾는다.
 */
const useImageUpload = (updateContent: ContentUpdater, notify: (message: string) => void) => {
  const [uploadingCount, setUploadingCount] = useState(0);

  const replacePlaceholder = (token: string, next: string) =>
    updateContent((content) => content.replace(placeholderOf(token), () => next));

  const insertImages = (textarea: HTMLTextAreaElement, files: File[]) => {
    const uploads = files.map((file) => ({ file, token: nextToken() }));
    const inserted = uploads.map(({ token }) => placeholderOf(token)).join("\n");
    const { selectionStart, selectionEnd } = textarea;
    const caret = selectionStart + inserted.length;

    updateContent(
      (content) => content.slice(0, selectionStart) + inserted + content.slice(selectionEnd)
    );
    requestAnimationFrame(() => textarea.setSelectionRange(caret, caret));

    setUploadingCount((count) => count + uploads.length);
    uploads.forEach(({ file, token }) => {
      uploadImage(file)
        .then((publicUrl) => replacePlaceholder(token, `![](${publicUrl})`))
        .catch((error: unknown) => {
          replacePlaceholder(token, "");
          notify(uploadFailMessage(error));
        })
        .finally(() => setUploadingCount((count) => count - 1));
    });
  };

  return { uploadingCount, insertImages };
};

export default useImageUpload;
