import React, { useMemo } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchAllRunes, getRuneDataFromCache } from "@/utils/lolData";
import Tooltip from "./Tooltip";

interface Props {
  iconPath: string;
  runeName: string;
  width: number;
  height: number;
  alt?: string;
}

const RuneWithTooltip = ({ iconPath, runeName, width, height, alt = "룬" }: Props) => {
  const { data: allRunes } = useQuery({
    queryKey: ["lol-runes"],
    queryFn: fetchAllRunes,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
    enabled: !!iconPath,
  });

  const runeInfo = useMemo(() => getRuneDataFromCache(allRunes, iconPath), [allRunes, iconPath]);

  if (!iconPath) return null;

  const tooltipContent = runeInfo ? (
    <>
      <div className="font-bold text-purple-400 mb-2">{runeInfo.name}</div>
      {runeInfo.description && (
        <div className="text-gray-300 leading-relaxed">{runeInfo.description}</div>
      )}
    </>
  ) : (
    <div>{runeName}</div>
  );

  return (
    <Tooltip content={tooltipContent}>
      <div style={{ width: `${width}px`, height: `${height}px`, display: "block", lineHeight: 0 }}>
        <Image
          width={width}
          height={height}
          alt={alt}
          src={`https://ddragon.leagueoflegends.com/cdn/img/${iconPath}`}
          loading="lazy"
          unoptimized
          className="block"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </Tooltip>
  );
};

export default RuneWithTooltip;
