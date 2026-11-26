const MAX_EDGE = 1920;
const QUALITY = 0.85;

const toBlob = (canvas: HTMLCanvasElement, type: string) =>
  new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, type, QUALITY);
  });

/**
 * 긴 변을 1920px 이하로 줄여 WebP로 다시 인코딩한다. 다시 그리면서 EXIF(위치 정보)도 빠진다.
 * WebP 인코딩을 지원하지 않는 브라우저(구형 Safari)는 요청을 무시하고 PNG를 돌려주므로 JPEG로 다시 만든다.
 */
export const compressImage = async (file: Blob): Promise<Blob> => {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D context is unavailable");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const webp = await toBlob(canvas, "image/webp");
  if (webp?.type === "image/webp") return webp;
  const jpeg = await toBlob(canvas, "image/jpeg");
  if (jpeg?.type !== "image/jpeg") throw new Error("Image encoding failed");
  return jpeg;
};
