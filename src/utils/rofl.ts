/**
 * .rofl 업로드 슬라이싱
 *
 *   [헤더 288B][재생용 페이로드 — 가변][메타데이터 약 119KB][메타데이터 길이 4B]
 *
 * 백엔드가 실제로 쓰는 것은 헤더(매직 바이트 검증·patch_version)와 파일 끝 메타데이터
 * (statsJson 등 전적 데이터 전부)뿐이다. 그 사이 재생용 암호화 페이로드는 파일의 99% 이상을
 * 차지하지만 LoL 클라이언트 전용이라 서버가 읽지 않는다.
 *
 *
 * 메타데이터 시작 위치는 파일마다 다르지만(가운데 페이로드 길이가 게임마다 다르다)
 * 백엔드가 맨 뒤 4바이트에 적힌 길이로 끝에서부터 역산하므로, 페이로드만 들어내고
 * [헤더][메타데이터][길이]로 이어 붙여도 같은 계산이 그대로 맞는다.
 */

const HEADER_LENGTH = 288;
const TAIL_SIZE_BYTES = 4;
// 메타데이터는 10인 × 367개 필드로 게임 길이와 무관하게 118KB대로 거의 고정이다.
// 상한을 넉넉히 잡아, 맨 뒤 4바이트가 길이가 아닌(=구조가 다른) 파일만 걸러낸다.
const METADATA_MAX_BYTES = 8 * 1024 * 1024;

/**
 * .rofl에서 백엔드가 쓰는 구간만 잘라 업로드용 File을 만든다.
 * 구조가 맞지 않거나(구형 리플 등) 읽기에 실패하면 원본을 그대로 돌려준다 — 유효성 판단은 백엔드가 한다.
 */
export const sliceRoflForUpload = async (file: File): Promise<File> => {
  if (file.size <= HEADER_LENGTH + TAIL_SIZE_BYTES) return file;

  try {
    const tail = new DataView(await file.slice(file.size - TAIL_SIZE_BYTES).arrayBuffer());
    const metaLength = tail.getUint32(0, true); // little endian
    const metaStart = file.size - TAIL_SIZE_BYTES - metaLength;
    if (metaLength <= 0 || metaLength > METADATA_MAX_BYTES || metaStart < HEADER_LENGTH) {
      return file;
    }

    // slice()는 디스크의 해당 구간을 참조하는 Blob일 뿐이라 전체가 메모리에 올라오지 않는다.
    return new File(
      [
        file.slice(0, HEADER_LENGTH),
        file.slice(metaStart, file.size - TAIL_SIZE_BYTES),
        file.slice(file.size - TAIL_SIZE_BYTES),
      ],
      file.name,
      { type: file.type, lastModified: file.lastModified }
    );
  } catch {
    return file;
  }
};
