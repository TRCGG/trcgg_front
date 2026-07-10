import Card from "@/components/ui/Card";
import React from "react";

interface Props {
  riotName: string;
  riotTag?: string;
}

const EmptySearchResultCard = ({ riotName, riotTag }: Props) => {
  return (
    <main>
      <Card className="w-full mt-14">
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-7 text-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4A4F57"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <p className="text-sm text-primary1">검색 결과가 없습니다</p>
          <p className="text-xs text-primary2">
            해당 클랜 내 &quot;{riotName}
            {riotTag ? ` #${riotTag}` : ""}&quot; 기록을 찾지 못했습니다.
          </p>
        </div>
      </Card>
    </main>
  );
};

export default EmptySearchResultCard;
