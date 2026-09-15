import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  /** 디스코드 CDN URL. 없거나 불러오기에 실패하면 이름 첫 글자로 대체한다. */
  src?: string | null;
  /** 대체 표시에 쓸 이름. 첫 글자만 보여준다. */
  name: string;
  size: number;
  className?: string;
}

/**
 * 프로필 아이콘.
 *
 * 디스코드에서 프로필을 바꾸면 이전 URL이 404가 되는데, DB에 남은 예전 URL로
 * 요청이 나가 깨진 이미지가 보였다. 실패하면 기본 아이콘으로 내려앉고,
 * src가 새 URL로 갱신되면 다시 이미지를 시도한다.
 */
const Avatar = ({ src, name, size, className = "" }: Props) => {
  const [failed, setFailed] = useState(false);

  // 갱신된 URL은 이전 실패와 무관하게 다시 시도해야 한다.
  useEffect(() => {
    setFailed(false);
  }, [src]);

  const box = { width: size, height: size };

  if (!src || failed) {
    return (
      <span
        style={box}
        className={`flex shrink-0 items-center justify-center rounded-full border border-border1 bg-rankBg2 text-primary1 ${className}`}
      >
        {name.charAt(0) || "?"}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={name}
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className={`shrink-0 rounded-full border border-border1 object-cover ${className}`}
    />
  );
};

export default Avatar;
