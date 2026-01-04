import Image from "next/image";
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
        <Image
          src={fallbackSrc}
          alt={alt}
          title={title}
          width={width}
          height={height}
          className={className}
          unoptimized
        />
      );
    }
    return <div style={{ width, height }} className={className} />;
  }

  const spriteUrl = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/sprite/${spriteData.sprite}`;

  const scaleX = width / spriteData.w;
  const scaleY = height / spriteData.h;

  const style: CSSProperties = {
    width: `${spriteData.w}px`,
    height: `${spriteData.h}px`,
    backgroundImage: `url(${spriteUrl})`,
    backgroundPosition: `-${spriteData.x}px -${spriteData.y}px`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "auto",
    transform: `scale(${scaleX}, ${scaleY})`,
    transformOrigin: "top left",
    display: "inline-block",
  };

  return (
    <div style={{ width, height, overflow: "hidden" }} className={className}>
      <div style={style} title={title} role="img" aria-label={alt} />
    </div>
  );
};

export default SpriteImage;
