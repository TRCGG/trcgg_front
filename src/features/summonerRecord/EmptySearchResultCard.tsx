import Card from "@/components/ui/Card";
import React from "react";

interface Props {
  riotName: string;
  riotTag?: string;
}

const EmptySearchResultCard = ({ riotName, riotTag }: Props) => {
  return (
    <main>
      <Card className="w-full p-4 text-center text-white mt-14">
        <p>
          해당 클랜 내 &quot;{riotName}
          {riotTag ? ` #${riotTag}` : ""}&quot;의 검색 결과가 없습니다.
        </p>
      </Card>
    </main>
  );
};

export default EmptySearchResultCard;
