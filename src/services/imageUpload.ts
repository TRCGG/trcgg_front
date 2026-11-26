import api from "@/services";
import { unwrap } from "@/services/apiService";
import { ApiError } from "@/services/apiError";
import {
  ImageUploadContentType,
  ImageUploadTicket,
  ImageUploadTicketResponse,
} from "@/data/types/imageUpload";

/** S3가 업로드를 거절했다(용량 초과·형식 불일치·허가 만료). 응답이 XML이라 사유는 읽지 않는다. */
export const STORAGE_UPLOAD_FAILED = "storage-upload-failed";

/** 허가는 5분 뒤 만료되므로 올리기 직전에 받는다. */
export const requestImageUpload = async (
  contentType: ImageUploadContentType
): Promise<ImageUploadTicket> =>
  unwrap(api.post<ImageUploadTicketResponse>("/api/admin/uploads/images", { contentType }));

export const uploadToStorage = async ({ url, fields }: ImageUploadTicket, file: Blob) => {
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => form.append(key, value));
  // S3는 file 뒤에 오는 필드를 무시하고 서명 검증에 실패하므로 반드시 마지막에 넣는다.
  form.append("file", file);

  const response = await fetch(url, { method: "POST", body: form, credentials: "omit" }).catch(
    (error: unknown) => {
      throw new ApiError(0, null, error instanceof Error ? error.message : "Network error");
    }
  );
  if (response.status !== 204) {
    throw new ApiError(response.status, STORAGE_UPLOAD_FAILED, "Image upload to storage failed");
  }
};
