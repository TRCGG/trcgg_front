export interface SpriteImage {
  full: string;
  sprite: string;
  group: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ChampionSprite {
  id: string;
  key: string;
  name: string;
  image: SpriteImage;
}

export interface ItemSprite {
  name: string;
  description: string;
  image: SpriteImage;
}

export interface SummonerSpellSprite {
  id: string;
  name: string;
  description: string;
  image: SpriteImage;
}

export interface SpriteData {
  champions: Record<string, ChampionSprite>;
  items: Record<string, ItemSprite>;
  summonerSpells: Record<string, SummonerSpellSprite>;
}
