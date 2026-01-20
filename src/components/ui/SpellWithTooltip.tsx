import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllSpells, getSpellDataFromCache } from "@/utils/lolData";
import { getSummonerSpellSprite } from "@/utils/spriteLoader";
import Tooltip from "./Tooltip";
import SpriteImage from "./SpriteImage";

interface Props {
  spellKey: string;
  spellName: string;
  width: number;
  height: number;
  className?: string;
  alt?: string;
}

const SpellWithTooltip = ({
  spellKey,
  spellName,
  width,
  height,
  className = "",
  alt = "스펠",
}: Props) => {
  const { data: allSpells } = useQuery({
    queryKey: ["lol-spells"],
    queryFn: fetchAllSpells,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
    enabled: !!spellKey,
  });

  const spellInfo = useMemo(
    () => getSpellDataFromCache(allSpells, spellKey),
    [allSpells, spellKey]
  );

  if (!spellKey) return null;

  const tooltipContent = spellInfo ? (
    <>
      <div className="font-bold text-cyan-400 mb-2">{spellInfo.name}</div>
      {spellInfo.description && (
        <div className="text-gray-300 leading-relaxed">{spellInfo.description}</div>
      )}
    </>
  ) : (
    <div>{spellName}</div>
  );

  return (
    <Tooltip content={tooltipContent}>
      <SpriteImage
        spriteData={getSummonerSpellSprite(spellKey)}
        width={width}
        height={height}
        alt={alt}
        fallbackSrc={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/spell/${spellKey}.png`}
        className={className}
      />
    </Tooltip>
  );
};

export default SpellWithTooltip;
