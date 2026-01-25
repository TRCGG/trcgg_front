// Data Dragon API에서 LOL 아이템, 스펠, 룬 데이터를 가져오는 유틸리티

const DDRAGON_VERSION = process.env.NEXT_PUBLIC_DDRAGON_VERSION || "14.24.1";
const DDRAGON_BASE_URL = "https://ddragon.leagueoflegends.com/cdn";

interface ItemData {
  name: string;
  description: string;
  plaintext: string;
  gold: {
    total: number;
  };
}

interface SummonerSpellData {
  name: string;
  description: string;
}

interface RuneData {
  id: number;
  key: string;
  icon: string;
  name: string;
  slots: Array<{
    runes: Array<{
      id: number;
      key: string;
      icon: string;
      name: string;
      shortDesc: string;
      longDesc: string;
    }>;
  }>;
}

// HTML 태그 제거
const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ");
};

// 전체 아이템 데이터 가져오기 (React Query용)
export const fetchAllItems = async (): Promise<Record<string, ItemData>> => {
  const response = await fetch(`${DDRAGON_BASE_URL}/${DDRAGON_VERSION}/data/ko_KR/item.json`);
  const json = await response.json();
  return json.data;
};

// 특정 아이템 데이터 추출
export const getItemDataFromCache = (
  allItems: Record<string, ItemData> | undefined,
  itemId: number
): ItemData | null => {
  if (itemId === 0 || !allItems) return null;

  const itemData = allItems[itemId.toString()];
  if (!itemData) return null;

  return {
    name: itemData.name,
    description: stripHtml(itemData.description),
    plaintext: itemData.plaintext || "",
    gold: itemData.gold,
  };
};

// 전체 소환사 주문 데이터 가져오기 (React Query용)
export const fetchAllSpells = async (): Promise<Record<string, SummonerSpellData>> => {
  const response = await fetch(`${DDRAGON_BASE_URL}/${DDRAGON_VERSION}/data/ko_KR/summoner.json`);
  const json = await response.json();
  return json.data;
};

// 특정 소환사 주문 데이터 추출
export const getSpellDataFromCache = (
  allSpells: Record<string, SummonerSpellData> | undefined,
  spellKey: string
): SummonerSpellData | null => {
  if (!spellKey || !allSpells) return null;

  const spellData = allSpells[spellKey];
  if (!spellData) return null;

  return {
    name: spellData.name,
    description: stripHtml(spellData.description),
  };
};

// 전체 룬 데이터 가져오기 (React Query용)
export const fetchAllRunes = async (): Promise<RuneData[]> => {
  const response = await fetch(
    `${DDRAGON_BASE_URL}/${DDRAGON_VERSION}/data/ko_KR/runesReforged.json`
  );
  return response.json();
};

// 특정 룬 데이터 추출 (icon path로 검색)
export const getRuneDataFromCache = (
  allRunes: RuneData[] | undefined,
  iconPath: string
): { name: string; description: string } | null => {
  if (!iconPath || !allRunes) return null;

  // icon path에서 파일명 추출 (예: "perk-images/Styles/Domination/Electrocute/Electrocute.png" -> "Electrocute")
  const pathParts = iconPath.split("/");
  const fileName = pathParts[pathParts.length - 1]?.replace(".png", "");

  // 모든 룬 스타일과 룬을 순회하며 검색
  // 먼저 메인 스타일 자체 확인
  const matchingStyle = allRunes.find((style) => style.icon.includes(fileName));
  if (matchingStyle) {
    return {
      name: matchingStyle.name,
      description: "",
    };
  }

  // 각 슬롯의 룬들 확인
  const foundRune = allRunes
    .flatMap((style) => style.slots)
    .flatMap((slot) => slot.runes)
    .find((rune) => rune.icon.includes(fileName));

  if (foundRune) {
    return {
      name: foundRune.name,
      description: stripHtml(foundRune.shortDesc || foundRune.longDesc),
    };
  }

  return null;
};
