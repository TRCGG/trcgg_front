import Link from "next/link";
import React from "react";

const PlayerNameButton = ({
  name,
  tag,
  isCenter = true,
  className,
}: {
  name: string;
  tag: string;
  isCenter?: boolean;
  className?: string;
}) => {
  return (
    <div className="relative group min-w-0 w-full">
      {/* 레거시 next/link는 className을 <a>로 전달하지 않으므로, 말줄임 스타일은
          NavBar와 동일하게 자식 요소(span)에 직접 적용한다. */}
      <Link href={`/summoners/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`}>
        <span
          className={`block truncate w-full cursor-pointer ${isCenter ? "text-center" : "text-left"} ${className ?? ""}`}
        >
          {name}
        </span>
      </Link>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block px-3 py-1 rounded bg-black text-white z-10 whitespace-nowrap w-max">
        <span>{name}</span>
        <span className="text-primary2"> #{tag}</span>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-black" />
      </div>
    </div>
  );
};

export default PlayerNameButton;
