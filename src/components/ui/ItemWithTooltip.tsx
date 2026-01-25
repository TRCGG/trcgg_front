import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllItems, getItemDataFromCache } from "@/utils/lolData";
import { getItemSprite } from "@/utils/spriteLoader";
import Tooltip from "./Tooltip";
import SpriteImage from "./SpriteImage";

interface Props {
  itemId: number;
  width: number;
  height: number;
  className?: string;
  alt?: string;
}

const ItemWithTooltip = ({ itemId, width, height, className = "", alt = "아이템" }: Props) => {
  const { data: allItems } = useQuery({
    queryKey: ["lol-items"],
    queryFn: fetchAllItems,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
    enabled: itemId !== 0,
  });

  const itemInfo = useMemo(() => getItemDataFromCache(allItems, itemId), [allItems, itemId]);

  if (itemId === 0) return null;

  const tooltipContent = itemInfo ? (
    <>
      <div className="font-bold text-yellow mb-2">{itemInfo.name}</div>
      {itemInfo.plaintext && (
        <div className="text-gray-300 mb-2 leading-relaxed">{itemInfo.plaintext}</div>
      )}
      {itemInfo.description && (
        <div className="text-gray-400 leading-relaxed mt-2">{itemInfo.description}</div>
      )}
      <div className="mt-2">
        <span className="text-gray-300">가격: </span>
        <span className="text-yellow font-semibold">{itemInfo.gold.total}G</span>
      </div>
    </>
  ) : null;

  return (
    <Tooltip content={tooltipContent}>
      <SpriteImage
        spriteData={getItemSprite(itemId)}
        width={width}
        height={height}
        alt={alt}
        fallbackSrc={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/item/${itemId}.png`}
        className={className}
      />
    </Tooltip>
  );
};

export default ItemWithTooltip;
