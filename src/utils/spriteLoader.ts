import { SpriteImage } from "@/data/types/sprite";

const DDRAGON_VERSION = process.env.NEXT_PUBLIC_DDRAGON_VERSION;

// 메모리 캐시
let spriteDataCache: {
  champions: Map<string, SpriteImage>;
  items: Map<string, SpriteImage>;
  summonerSpells: Map<string, SpriteImage>;
} | null = null;

/**
 * ddragon에서 sprite 데이터 캐싱
 */
export const loadSpriteData = async (): Promise<void> => {
  if (spriteDataCache) {
    return;
  }

  try {
    const [championsRes, itemsRes, spellsRes] = await Promise.all([
      fetch(`https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/data/en_US/champion.json`),
      fetch(`https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/data/en_US/item.json`),
      fetch(`https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/data/en_US/summoner.json`),
    ]);

    const [championsData, itemsData, spellsData] = await Promise.all([
      championsRes.json(),
      itemsRes.json(),
      spellsRes.json(),
    ]);

    // 챔피언 sprite 맵
    const champions = new Map<string, SpriteImage>();
    Object.entries(championsData.data as Record<string, { image: SpriteImage }>).forEach(
      ([key, value]) => {
        champions.set(key, value.image);
      }
    );

    // 아이템 sprite 맵
    const items = new Map<string, SpriteImage>();
    Object.entries(itemsData.data as Record<string, { image: SpriteImage }>).forEach(
      ([key, value]) => {
        items.set(key, value.image);
      }
    );

    // 스펠 sprite 맵
    const summonerSpells = new Map<string, SpriteImage>();
    Object.entries(spellsData.data as Record<string, { image: SpriteImage }>).forEach(
      ([key, value]) => {
        summonerSpells.set(key, value.image);
      }
    );

    spriteDataCache = { champions, items, summonerSpells };
  } catch (error) {
    // Sprite 로딩 실패는 무시 (fallback 이미지 사용)
  }
};

/**
 * 챔피언 sprite 정보 가져오기
 */
export const getChampionSprite = (championName: string): SpriteImage | null => {
  if (!spriteDataCache) return null;
  return spriteDataCache.champions.get(championName) || null;
};

/**
 * 아이템 sprite 정보 가져오기
 */
export const getItemSprite = (itemId: string | number): SpriteImage | null => {
  if (!spriteDataCache) return null;
  return spriteDataCache.items.get(String(itemId)) || null;
};

/**
 * 소환사 주문 sprite 정보 가져오기
 */
export const getSummonerSpellSprite = (spellKey: string): SpriteImage | null => {
  if (!spriteDataCache) return null;
  return spriteDataCache.summonerSpells.get(spellKey) || null;
};

/**
 * sprite가 로드되었는지 확인
 */
export const isSpriteDataLoaded = (): boolean => {
  return spriteDataCache !== null;
};
