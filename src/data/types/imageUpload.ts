export const IMAGE_UPLOAD_CONTENT_TYPES = ["image/webp", "image/png", "image/jpeg"] as const;

export type ImageUploadContentType = (typeof IMAGE_UPLOAD_CONTENT_TYPES)[number];

export interface ImageUploadTicket {
  /** S3 버킷 주소. 여기로 multipart/form-data POST를 보낸다. */
  url: string;
  /** 서명된 폼 필드. 파일보다 먼저, 받은 그대로 넣는다. */
  fields: Record<string, string>;
  /** 업로드가 끝나면 본문에 넣을 주소 */
  publicUrl: string;
}

export interface ImageUploadTicketResponse {
  status: string;
  message: string;
  data: ImageUploadTicket;
}
