import React, { CSSProperties } from "react";
import { SpriteImage as SpriteImageType } from "@/data/types/sprite";

const DDRAGON_VERSION = process.env.NEXT_PUBLIC_DDRAGON_VERSION;

interface Props {
  spriteData: SpriteImageType | null;
  width: number;
  height: number;
  alt: string;
  title?: string;
  className?: string;
  fallbackSrc?: string;
}

/**
 * ddragon sprite sheet를 사용하는 이미지 컴포넌트
 * sprite sheet에서 특정 위치의 이미지 표시
 */
const SpriteImage = ({ spriteData, width, height, alt, title, className, fallbackSrc }: Props) => {
  // sprite 데이터가 없으면 fallback 이미지 사용
  if (!spriteData) {
    if (fallbackSrc) {
      return (
        <img
          src={fallbackSrc}
          alt={alt}
          title={title}
          width={width}
          height={height}
          className={className}
        />
      );
    }
    return <div style={{ width, height }} className={className} />;
  }

  const spriteUrl = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/sprite/${spriteData.sprite}`;

  // 스케일 비율 계산 (원본 sprite 크기는 48x48, 표시할 크기에 맞게 조정)
  const scaleX = width / spriteData.w;
  const scaleY = height / spriteData.h;

  const style: CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    backgroundImage: `url(${spriteUrl})`,
    backgroundPosition: `-${spriteData.x * scaleX}px -${spriteData.y * scaleY}px`,
    backgroundSize: `${1024 * scaleX}px ${1024 * scaleY}px`, // sprite sheet는 보통 512px 또는 1024px
    backgroundRepeat: "no-repeat",
    display: "inline-block",
  };

  return <div style={style} className={className} title={title} role="img" aria-label={alt} />;
};

export default SpriteImage;
