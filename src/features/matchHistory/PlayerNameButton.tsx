import { useRouter } from "next/router";
import React from "react";

const PlayerNameButton = ({ name, tag }: { name: string; tag: string }) => {
  const router = useRouter();
  return (
    <div className="relative group min-w-0 w-full">
      <button
        type="button"
        className="truncate w-full overflow-hidden whitespace-nowrap text-center"
        onClick={() => {
          router.push(`/summoners/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`);
        }}
      >
        {name}
      </button>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block px-3 py-1 rounded bg-black text-white z-10">
        {name} #{tag}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-black" />
      </div>
    </div>
  );
};

export default PlayerNameButton;
