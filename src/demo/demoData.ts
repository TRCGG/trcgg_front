import type { LanePosition } from "@/data/types/h2h";
import type { GameParticipant } from "@/data/types/record";

export const DEMO_GUILD_ID = "demo";
export const DEMO_GUILD_NAME = "데모 클랜";
export const LANES: LanePosition[] = ["TOP", "JUG", "MID", "ADC", "SUP"];

type ChampClass = "fighter" | "tank" | "assassin" | "mage" | "marksman" | "enchanter" | "engage";

interface Champ {
  eng: string;
  kor: string;
  cls: ChampClass;
}

const CHAMPS: Record<LanePosition, Champ[]> = {
  TOP: [
    { eng: "Darius", kor: "다리우스", cls: "fighter" },
    { eng: "Garen", kor: "가렌", cls: "fighter" },
    { eng: "Camille", kor: "카밀", cls: "fighter" },
    { eng: "Ornn", kor: "오른", cls: "tank" },
    { eng: "Jax", kor: "잭스", cls: "fighter" },
    { eng: "Aatrox", kor: "아트록스", cls: "fighter" },
    { eng: "Sett", kor: "세트", cls: "fighter" },
    { eng: "Malphite", kor: "말파이트", cls: "tank" },
  ],
  JUG: [
    { eng: "LeeSin", kor: "리 신", cls: "assassin" },
    { eng: "Viego", kor: "비에고", cls: "assassin" },
    { eng: "Graves", kor: "그레이브즈", cls: "assassin" },
    { eng: "Kayn", kor: "케인", cls: "assassin" },
    { eng: "Vi", kor: "바이", cls: "fighter" },
    { eng: "Sejuani", kor: "세주아니", cls: "tank" },
    { eng: "Elise", kor: "엘리스", cls: "mage" },
    { eng: "JarvanIV", kor: "자르반 4세", cls: "fighter" },
  ],
  MID: [
    { eng: "Ahri", kor: "아리", cls: "mage" },
    { eng: "Syndra", kor: "신드라", cls: "mage" },
    { eng: "Orianna", kor: "오리아나", cls: "mage" },
    { eng: "Yone", kor: "요네", cls: "assassin" },
    { eng: "Zed", kor: "제드", cls: "assassin" },
    { eng: "Viktor", kor: "빅토르", cls: "mage" },
    { eng: "Sylas", kor: "사일러스", cls: "mage" },
    { eng: "Leblanc", kor: "르블랑", cls: "mage" },
  ],
  ADC: [
    { eng: "Jinx", kor: "징크스", cls: "marksman" },
    { eng: "Kaisa", kor: "카이사", cls: "marksman" },
    { eng: "Ezreal", kor: "이즈리얼", cls: "marksman" },
    { eng: "Jhin", kor: "진", cls: "marksman" },
    { eng: "Caitlyn", kor: "케이틀린", cls: "marksman" },
    { eng: "Xayah", kor: "자야", cls: "marksman" },
    { eng: "Ashe", kor: "애쉬", cls: "marksman" },
    { eng: "Varus", kor: "바루스", cls: "marksman" },
  ],
  SUP: [
    { eng: "Thresh", kor: "쓰레쉬", cls: "engage" },
    { eng: "Nautilus", kor: "노틸러스", cls: "engage" },
    { eng: "Lulu", kor: "룰루", cls: "enchanter" },
    { eng: "Rakan", kor: "라칸", cls: "engage" },
    { eng: "Leona", kor: "레오나", cls: "engage" },
    { eng: "Nami", kor: "나미", cls: "enchanter" },
    { eng: "Karma", kor: "카르마", cls: "enchanter" },
    { eng: "Bard", kor: "바드", cls: "enchanter" },
  ],
};

const ITEMS: Record<ChampClass, number[]> = {
  fighter: [3078, 6333, 3053, 3071, 3047, 6610, 3742, 3111],
  tank: [3075, 3143, 3065, 3742, 3047, 3111, 3068],
  assassin: [6692, 3142, 6694, 3158, 3071, 3814, 3026],
  mage: [6655, 3089, 3135, 3157, 3020, 4645, 3165],
  marksman: [6672, 3031, 3094, 3036, 3006, 3072, 3046],
  enchanter: [3504, 3107, 3222, 3011, 3009, 6617],
  engage: [3190, 3109, 3050, 3047, 3193, 3075],
};

interface Rune {
  icon: string;
  name: string;
}

const KEYSTONES: Record<ChampClass, Rune> = {
  fighter: { icon: "perk-images/Styles/Precision/Conqueror/Conqueror.png", name: "정복자" },
  tank: {
    icon: "perk-images/Styles/Resolve/GraspOfTheUndying/GraspOfTheUndying.png",
    name: "착취의 손아귀",
  },
  assassin: { icon: "perk-images/Styles/Domination/Electrocute/Electrocute.png", name: "감전" },
  mage: { icon: "perk-images/Styles/Sorcery/ArcaneComet/ArcaneComet.png", name: "신비로운 유성" },
  marksman: {
    icon: "perk-images/Styles/Precision/LethalTempo/LethalTempoTemp.png",
    name: "치명적 속도",
  },
  enchanter: { icon: "perk-images/Styles/Sorcery/SummonAery/SummonAery.png", name: "콩콩이 소환" },
  engage: {
    icon: "perk-images/Styles/Resolve/VeteranAftershock/VeteranAftershock.png",
    name: "여진",
  },
};

const SUBSTYLES: Rune[] = [
  { icon: "perk-images/Styles/7201_Precision.png", name: "정밀" },
  { icon: "perk-images/Styles/7200_Domination.png", name: "지배" },
  { icon: "perk-images/Styles/7202_Sorcery.png", name: "마법" },
  { icon: "perk-images/Styles/7204_Resolve.png", name: "결의" },
  { icon: "perk-images/Styles/7203_Whimsy.png", name: "영감" },
];

const SPELLS = {
  flash: { key: "SummonerFlash", name: "점멸" },
  ignite: { key: "SummonerDot", name: "점화" },
  teleport: { key: "SummonerTeleport", name: "순간이동" },
  smite: { key: "SummonerSmite", name: "강타" },
  heal: { key: "SummonerHeal", name: "회복" },
  exhaust: { key: "SummonerExhaust", name: "탈진" },
  barrier: { key: "SummonerBarrier", name: "방어막" },
};

const SECOND_SPELLS: Record<LanePosition, (typeof SPELLS)[keyof typeof SPELLS][]> = {
  TOP: [SPELLS.teleport, SPELLS.teleport, SPELLS.ignite],
  JUG: [SPELLS.smite],
  MID: [SPELLS.ignite, SPELLS.teleport, SPELLS.barrier],
  ADC: [SPELLS.heal, SPELLS.heal, SPELLS.barrier],
  SUP: [SPELLS.ignite, SPELLS.exhaust],
};

export interface DemoPlayer {
  playerCode: string;
  riotName: string;
  riotNameTag: string;
  main: LanePosition;
  sub: LanePosition;
  skill: number;
  /** 라인별 선호 챔피언(앞쪽일수록 자주 고른다) */
  pool: Partial<Record<LanePosition, Champ[]>>;
}

/** 데모의 주인공. 랜딩의 "데모 보기"가 이 소환사 화면으로 들어간다. */
export const DEMO_FEATURED = { riotName: "지목데모", riotNameTag: "KR1" };

const ROSTER: [string, string, LanePosition, LanePosition, number][] = [
  ["지목데모", "KR1", "MID", "JUG", 0.56],
  ["바위게사냥꾼", "KR1", "JUG", "TOP", 0.54],
  ["탑신병자", "0001", "TOP", "JUG", 0.52],
  ["포탑다이버", "KR2", "TOP", "MID", 0.47],
  ["와드요정", "KR1", "SUP", "ADC", 0.55],
  ["원딜은외로워", "KR1", "ADC", "SUP", 0.5],
  ["점멸아껴", "KR1", "MID", "ADC", 0.48],
  ["한타장인", "7777", "SUP", "TOP", 0.51],
  ["정글차이", "KR1", "JUG", "MID", 0.49],
  ["막타의신", "KR1", "ADC", "MID", 0.57],
  ["미드갱가요", "KR3", "MID", "JUG", 0.45],
  ["그브장인", "KR1", "JUG", "ADC", 0.5],
  ["서폿은사랑", "KR1", "SUP", "MID", 0.46],
  ["솔킬제조기", "KR1", "TOP", "MID", 0.53],
  ["용싸움", "KR1", "ADC", "TOP", 0.44],
  ["바론스틸", "KR1", "JUG", "SUP", 0.5],
];

/** 경기 상세에는 없지만 상대전적 지표에 필요한 값 */
export interface DemoExtra {
  kda: number;
  dpm: number;
  laneGoldDiff: number;
  td15: number;
  plates: number;
  expPerMin: number;
  deadPct: number;
  jungleCsEnemy: number;
  gold: number;
  cs: number;
  selfMit: number;
  wardsP: number;
  wardsK: number;
  controlW: number;
  ccTime: number;
  underTurretTd: number;
  turretTd: number;
  objDmg: number;
  buildingDmg: number;
  epicKills: number;
  objSteals: number;
  healShield: number;
  missPings: number;
}

export interface DemoParticipant extends GameParticipant {
  playerCode: string;
  extra: DemoExtra;
}

export interface DemoMatch {
  gameId: string;
  date: Date;
  winner: "blue" | "red";
  participants: DemoParticipant[];
}

export interface DemoDataset {
  players: DemoPlayer[];
  matches: DemoMatch[];
  now: number;
}

// 시드 고정 난수(Park–Miller). 새로고침해도 같은 데모가 보이도록 한다.
const seededRandom = (seed: number) => {
  let state = seed % 2147483647;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
};

const DAY_MS = 24 * 60 * 60 * 1000;
const DAYS_BACK = 80;

const generate = (now: number): DemoDataset => {
  const rand = seededRandom(20261112);
  const int = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
  const pick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
  const shuffle = <T>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rand() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };
  const around = (base: number, spread = 0.35) =>
    Math.max(0, base * (1 + (rand() + rand() + rand() - 1.5) * spread));

  const players: DemoPlayer[] = ROSTER.map(([riotName, riotNameTag, main, sub, skill], i) => ({
    playerCode: `DEMO_${String(i + 1).padStart(3, "0")}`,
    riotName,
    riotNameTag,
    main,
    sub,
    skill,
    pool: {
      [main]: shuffle(CHAMPS[main]).slice(0, 4),
      [sub]: shuffle(CHAMPS[sub]).slice(0, 2),
    },
  }));
  const featured = players[0];

  // 일정한 내전 시간대(KST 21시 전후)에 몰아서 치른 것처럼 날짜를 만든다.
  const today = new Date(now);
  const kstMidnight =
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()) - 9 * 60 * 60 * 1000;
  const slots: Date[] = [];
  for (let d = DAYS_BACK; d >= 0; d -= 1) {
    const isWeekend = [0, 5, 6].includes(new Date(kstMidnight - d * DAY_MS).getUTCDay());
    if (rand() < (isWeekend ? 0.7 : 0.35)) {
      const games = int(2, 6);
      const start = kstMidnight - d * DAY_MS + (20 * 60 + int(0, 90)) * 60 * 1000;
      for (let g = 0; g < games; g += 1) {
        const at = start + g * int(35, 48) * 60 * 1000;
        if (at < now) slots.push(new Date(at));
      }
    }
  }

  // 경기마다 이번에 가고 싶은 라인을 정하고(주 라인 65%, 부 라인 25%, 그 밖 10%) 그 순서로 채운다.
  const assignLanes = (pool: DemoPlayer[]): Map<LanePosition, DemoPlayer[]> => {
    const wants = new Map<DemoPlayer, LanePosition>();
    pool.forEach((p) => {
      const r = rand();
      let lane = pick(LANES);
      if (r < 0.65) lane = p.main;
      else if (r < 0.9) lane = p.sub;
      wants.set(p, lane);
    });
    const remaining = [...pool];
    const result = new Map<LanePosition, DemoPlayer[]>();
    shuffle(LANES).forEach((lane) => {
      const chosen: DemoPlayer[] = [];
      [
        (p: DemoPlayer) => wants.get(p) === lane,
        (p: DemoPlayer) => p.main === lane,
        (p: DemoPlayer) => p.sub === lane,
        () => true,
      ].forEach((matches) => {
        while (chosen.length < 2) {
          const idx = remaining.findIndex(matches);
          if (idx === -1) break;
          chosen.push(remaining.splice(idx, 1)[0]);
        }
      });
      result.set(lane, chosen);
    });
    return result;
  };

  const matches: DemoMatch[] = slots.map((date, index) => {
    const others = shuffle(players.slice(1));
    const ten = rand() < 0.68 ? [featured, ...others.slice(0, 9)] : others.slice(0, 10);
    const lanes = assignLanes(shuffle(ten));

    const teams: Record<"blue" | "red", { lane: LanePosition; player: DemoPlayer }[]> = {
      blue: [],
      red: [],
    };
    LANES.forEach((lane) => {
      const [a, b] = shuffle(lanes.get(lane)!);
      teams.blue.push({ lane, player: a });
      teams.red.push({ lane, player: b });
    });

    const power = (side: "blue" | "red") =>
      teams[side].reduce((sum, { player }) => sum + player.skill, 0);
    const blueWinChance = Math.min(
      0.85,
      Math.max(0.15, 0.52 + (power("blue") - power("red")) * 1.4)
    );
    const winner: "blue" | "red" = rand() < blueWinChance ? "blue" : "red";
    const timePlayed = int(1450, 2350);
    const minutes = timePlayed / 60;
    const gameId = `DEMO-${String(index + 1).padStart(4, "0")}`;

    const used = new Set<string>();
    const pickChamp = (player: DemoPlayer, lane: LanePosition): Champ => {
      const favourites = (player.pool[lane] ?? []).filter((c) => !used.has(c.eng));
      const candidates =
        favourites.length && rand() < 0.8
          ? favourites.slice(0, rand() < 0.35 ? 1 : favourites.length)
          : CHAMPS[lane].filter((c) => !used.has(c.eng));
      const champ = pick(candidates);
      used.add(champ.eng);
      return champ;
    };

    const laneGold = new Map<LanePosition, number>();
    LANES.forEach((lane) => {
      const blueAhead = winner === "blue" ? 220 : -220;
      laneGold.set(lane, Math.round(blueAhead + (rand() - 0.5) * 1800));
    });

    const KILL: Record<LanePosition, number> = { TOP: 4.5, JUG: 5.5, MID: 6.5, ADC: 7.5, SUP: 1.5 };
    const ASSIST: Record<LanePosition, number> = { TOP: 5, JUG: 8, MID: 6.5, ADC: 6, SUP: 12 };
    const DPM: Record<LanePosition, number> = { TOP: 680, JUG: 540, MID: 820, ADC: 880, SUP: 300 };
    const TAKEN: Record<LanePosition, number> = {
      TOP: 1100,
      JUG: 1000,
      MID: 700,
      ADC: 650,
      SUP: 750,
    };
    const VISION: Record<LanePosition, number> = {
      TOP: 0.7,
      JUG: 1.3,
      MID: 0.8,
      ADC: 0.8,
      SUP: 2.4,
    };
    const CS: Record<LanePosition, number> = { TOP: 7.2, JUG: 6, MID: 7.8, ADC: 8.4, SUP: 1.2 };

    const participants: DemoParticipant[] = (["blue", "red"] as const).flatMap((side) =>
      teams[side].map(({ lane, player }): DemoParticipant => {
        const won = side === winner;
        const champ = pickChamp(player, lane);
        const edge = (player.skill - 0.5) * 2;
        const kill = Math.round(around(KILL[lane] * (won ? 1.3 : 0.75) * (1 + edge)));
        const death = Math.max(0, Math.round(around(won ? 3.5 : 6, 0.5) * (1 - edge * 0.5)));
        const assist = Math.round(around(ASSIST[lane] * (won ? 1.25 : 0.8)));
        const damage = Math.round(around(DPM[lane] * (won ? 1.1 : 0.92)) * minutes);
        const items = shuffle(ITEMS[champ.cls]).slice(0, won ? 6 : 5);
        while (items.length < 6) items.push(0);
        const second = pick(SECOND_SPELLS[lane]);
        const goldDiff = (laneGold.get(lane) ?? 0) * (side === "blue" ? 1 : -1);
        const penta = (lane === "ADC" || lane === "MID") && won && kill >= 12 && rand() < 0.25;

        return {
          gameId,
          season: String(date.getFullYear()),
          createDate: date.toISOString(),
          gameResult: won ? "승" : "패",
          gameTeam: side,
          timePlayed,
          playerCode: player.playerCode,
          riotName: player.riotName,
          riotNameTag: player.riotNameTag,
          champName: champ.kor,
          champNameEng: champ.eng,
          position: lane,
          level: Math.min(18, int(12, 16) + (won ? 1 : 0) + (minutes > 33 ? 1 : 0)),
          kill: penta ? Math.max(kill, 14) : kill,
          death,
          assist,
          pentaKills: penta ? 1 : 0,
          totalDamageChampions: damage,
          totalDamageTaken: Math.round(around(TAKEN[lane]) * minutes),
          visionScore: Math.round(around(VISION[lane]) * minutes),
          visionBought: int(lane === "SUP" ? 4 : 1, lane === "SUP" ? 10 : 5),
          item0: items[0],
          item1: items[1],
          item2: items[2],
          item3: items[3],
          item4: items[4],
          item5: items[5],
          item6: lane === "SUP" ? 3364 : 3340,
          summonerSpell1Key: SPELLS.flash.key,
          summonerSpell1Name: SPELLS.flash.name,
          summonerSpell2Key: second.key,
          summonerSpell2Name: second.name,
          keystoneIcon: KEYSTONES[champ.cls].icon,
          keystoneName: KEYSTONES[champ.cls].name,
          substyleIcon: pick(SUBSTYLES).icon,
          substyleName: "",
          extra: {
            kda: Math.round(((kill + assist) / Math.max(1, death)) * 100) / 100,
            dpm: Math.round(damage / minutes),
            laneGoldDiff: goldDiff,
            td15: int(0, lane === "SUP" ? 5 : 4) + (goldDiff > 0 ? 1 : 0),
            plates: lane === "JUG" ? int(0, 1) : int(0, goldDiff > 0 ? 5 : 2),
            expPerMin: Math.round(around(lane === "SUP" ? 330 : 480, 0.15)),
            deadPct: Math.round(around(won ? 7 : 13, 0.4) * 10) / 10,
            jungleCsEnemy: lane === "JUG" ? int(0, goldDiff > 0 ? 18 : 8) : 0,
            gold: Math.round(around(lane === "SUP" ? 300 : 420, 0.15) * minutes),
            cs: Math.round(around(CS[lane], 0.15) * minutes),
            selfMit: Math.round(around(lane === "TOP" ? 900 : 350) * minutes),
            wardsP: Math.round(around(lane === "SUP" ? 1.3 : 0.4) * minutes),
            wardsK: Math.round(around(lane === "SUP" ? 0.4 : 0.2) * minutes),
            controlW: int(lane === "SUP" ? 4 : 1, lane === "SUP" ? 10 : 5),
            ccTime: int(5, champ.cls === "engage" || champ.cls === "tank" ? 70 : 30),
            underTurretTd: int(0, 3),
            turretTd: int(0, won ? 4 : 2),
            objDmg: Math.round(around(lane === "JUG" ? 900 : 400) * minutes),
            buildingDmg: Math.round(
              around(lane === "SUP" ? 60 : 220) * minutes * (won ? 1.4 : 0.6)
            ),
            epicKills: lane === "JUG" ? int(won ? 2 : 0, won ? 5 : 2) : 0,
            objSteals: lane === "JUG" && rand() < 0.08 ? 1 : 0,
            healShield: Math.round(around(champ.cls === "enchanter" ? 450 : 40) * minutes),
            missPings: int(0, 6),
          },
        };
      })
    );

    return { gameId, date, winner, participants };
  });

  return { players, matches, now };
};

let cached: DemoDataset | null = null;

/** 데모 데이터는 처음 요청될 때 한 번 만들어 둔다. */
export const getDemoDataset = (): DemoDataset => {
  if (!cached) cached = generate(Date.now());
  return cached;
};
