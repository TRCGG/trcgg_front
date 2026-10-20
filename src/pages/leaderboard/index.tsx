import type { NextPage } from "next";
import Image from "next/image";
import { useMemo, useState } from "react";
import SummonerPageHeader from "@/components/layout/SummonerPageHeader";
import TextCard from "@/components/ui/TextCard";
import usePageHeader from "@/hooks/common/usePageHeader";
import useClanLeaderboard from "@/hooks/leaderboard/useClanLeaderboard";
import ActivityHero, { buildRecentDays } from "@/features/leaderboard/ActivityHero";
import HighlightCards from "@/features/leaderboard/HighlightCards";
import LeaderboardCard, { LeaderboardRow } from "@/features/leaderboard/LeaderboardCard";
import LeaderboardPositionFilter, {
  LANE_ICONS,
} from "@/features/leaderboard/LeaderboardPositionFilter";
import LaneMidLogo from "@/assets/images/laneMid.png";
import { Position } from "@/services/statistics";
import { ChampionCombination, PentakillEntry } from "@/data/types/leaderboard";
import { lastLeaderboardRefresh } from "@/utils/leaderboardSchedule";

const pct = (value: number | string) => `${Number(value).toFixed(2)}%`;

const winRateClass = (value: number | string) => {
  const v = Number(value);
  if (v >= 60) return "text-blueText";
  if (v < 50) return "text-teamLoss";
  return "text-primary1";
};

const comboRows = (combos: ChampionCombination[] = []): LeaderboardRow[] =>
  combos.map((c) => ({
    key: c.champions.map((ch) => ch.champNameEng).join("+"),
    champions: c.champions,
    sub: `${c.win}승 ${c.lose}패`,
    value: pct(c.winRate),
    valueClass: winRateClass(c.winRate),
  }));

// 펜타킬은 경기 단위로 오므로 유저별로 합친다. 동률이면 최근에 달성한 유저가 위다.
const pentaRows = (entries: PentakillEntry[] = []): LeaderboardRow[] => {
  const byPlayer = new Map<string, { entry: PentakillEntry; count: number; last: string }>();
  entries.forEach((entry) => {
    const prev = byPlayer.get(entry.playerCode);
    byPlayer.set(entry.playerCode, {
      entry,
      count: (prev?.count ?? 0) + entry.pentaKills,
      last: prev && prev.last > entry.registeredDate ? prev.last : entry.registeredDate,
    });
  });
  return Array.from(byPlayer.values())
    .sort((a, b) => b.count - a.count || b.last.localeCompare(a.last))
    .slice(0, 5)
    .map(({ entry, count }) => ({
      key: entry.playerCode,
      players: [entry],
      sub: "",
      value: `${count}회`,
      valueClass: "text-yellow",
    }));
};

const formatRange = (days: string[]) => {
  const [y, m, d] = days[0].split("-");
  const [, m2, d2] = days[days.length - 1].split("-");
  return `${y}.${m}.${d} – ${m2}.${d2}`;
};

const Leaderboard: NextPage = () => {
  const [position, setPosition] = useState<Position>("ALL");
  const { headerProps, guildId, guilds, isLoggedIn, isLoadingGuilds } = usePageHeader();
  const q = useClanLeaderboard(guildId, position);
  // 정오 전에는 어제 정오 집계를 보고 있으므로 기간 끝도 어제다.
  const days = useMemo(() => buildRecentDays(new Date(lastLeaderboardRefresh(Date.now()))), []);

  const clanName = guilds.find((guild) => guild.id === guildId)?.name ?? "클랜";
  const positionIcon =
    position === "ALL"
      ? { src: LaneMidLogo, active: false }
      : { src: LANE_ICONS[position], active: true };

  const groups: {
    label: string;
    cols: string;
    cards: {
      title: string;
      filtered?: boolean;
      rows: LeaderboardRow[];
      query: { isPending: boolean; isError: boolean };
    }[];
  }[] = [
    {
      label: "멤버",
      cols: "lg:grid-cols-3",
      cards: [
        {
          title: "판수",
          filtered: true,
          query: q.mostGames,
          rows: (q.mostGames.data ?? []).map((u) => ({
            key: u.playerCode,
            players: [u],
            sub: `${u.win}승 ${u.lose}패`,
            value: `${u.totalCount}판`,
            valueClass: "text-primary1",
          })),
        },
        {
          title: "우수 성적",
          filtered: true,
          query: q.bestUsers,
          rows: (q.bestUsers.data ?? []).map((u) => ({
            key: u.playerCode,
            players: [u],
            sub: `${u.totalCount}판`,
            value: pct(u.winRate),
            valueClass: winRateClass(u.winRate),
          })),
        },
        {
          title: "함께한 듀오",
          query: q.duos,
          rows: (q.duos.data ?? []).map((d) => ({
            key: d.players.map((p) => p.playerCode).join("+"),
            players: d.players,
            sub: pct(d.winRate),
            value: `${d.totalCount}판`,
            valueClass: "text-primary1",
          })),
        },
      ],
    },
    {
      label: "챔피언",
      cols: "lg:grid-cols-2",
      cards: [
        {
          title: "챔피언 픽률",
          filtered: true,
          query: q.pickRate,
          rows: (q.pickRate.data ?? []).map((c) => ({
            key: c.champNameEng,
            champions: [c],
            sub: `${c.matchCount}경기`,
            value: pct(c.pickRate),
            valueClass: "text-blueText",
          })),
        },
        {
          title: "챔피언 메타",
          filtered: true,
          query: q.metaChampions,
          rows: (q.metaChampions.data ?? []).map((c) => ({
            key: c.champNameEng,
            champions: [c],
            sub: `${c.win}승 ${c.lose}패`,
            value: pct(c.winRate),
            valueClass: winRateClass(c.winRate),
          })),
        },
        { title: "강한 바텀 조합", query: q.botCombos, rows: comboRows(q.botCombos.data) },
        {
          title: "강한 미드·정글 조합",
          query: q.midJugCombos,
          rows: comboRows(q.midJugCombos.data),
        },
      ],
    },
    {
      label: "기록",
      cols: "lg:grid-cols-3",
      cards: [
        {
          title: "현재 연승",
          query: q.winStreaks,
          rows: (q.winStreaks.data ?? []).map((s) => ({
            key: s.playerCode,
            players: [s],
            sub: "",
            value: `${s.streak}연승`,
            valueClass: "text-blueText",
          })),
        },
        {
          title: "최근 상승세",
          query: q.risingStars,
          rows: (q.risingStars.data ?? []).map((r) => ({
            key: r.playerCode,
            players: [r],
            sub: `${pct(r.previous.winRate)} → ${pct(r.current.winRate)}`,
            value: `+${r.improvementPp.toFixed(2)}%p`,
            valueClass: "text-neonGreen",
          })),
        },
        {
          title: "펜타킬",
          query: q.highlights,
          rows: pentaRows(q.highlights.data?.pentakills.entries),
        },
      ],
    },
  ];

  // 공개 길드가 있으면 비로그인도 볼 수 있어, 볼 수 있는 길드가 없을 때만 막는다
  if (!isLoadingGuilds && guilds.length === 0) {
    return (
      <div className="w-full md:max-w-[1080px] mx-auto">
        <SummonerPageHeader {...headerProps} />
        <TextCard text={isLoggedIn ? "소속된 클랜이 없습니다" : "로그인 후 이용해주세요"} />
      </div>
    );
  }

  return (
    <div className="w-full md:max-w-[1080px] mx-auto pb-16">
      <SummonerPageHeader {...headerProps} />
      <h1 className="sr-only">{clanName} 리더보드</h1>

      <section className="mt-10">
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-primary2">
          <span className="px-2 py-[3px] rounded-sm bg-primaryLaneBg border border-primaryLaneBorder text-blueText font-bold">
            {clanName}
          </span>
          <span className="px-2 py-[3px] rounded-sm border border-border2 text-primary1">
            최근 30일
          </span>
          <span>{formatRange(days)} · 매일 정오 갱신</span>
        </div>
        <ActivityHero
          activity={q.activity.data}
          isLoading={q.activity.isPending}
          isError={q.activity.isError}
          days={days}
        />
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-primary1">명장면</h2>
        <HighlightCards
          highlights={q.highlights.data}
          isLoading={q.highlights.isPending}
          isError={q.highlights.isError}
        />
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-3">
          <h2 className="text-lg font-bold text-primary1">전체 순위</h2>
          <span className="flex items-center gap-1 text-xs text-primary3">
            포지션 필터는
            <span className="flex opacity-70">
              <Image src={LaneMidLogo} alt="" width={12} height={12} />
            </span>
            표시 항목에만 적용
          </span>
          <div className="w-full sm:w-auto sm:ml-auto">
            <LeaderboardPositionFilter selected={position} onSelect={setPosition} />
          </div>
        </div>

        {groups.map((group) => (
          <div key={group.label} className="mt-7">
            <h3 className="pb-3 text-[15px] font-bold text-white">{group.label}</h3>
            <div className={`grid grid-cols-1 md:grid-cols-2 ${group.cols} gap-4`}>
              {group.cards.map((card) => (
                <LeaderboardCard
                  key={card.title}
                  title={card.title}
                  positionIcon={card.filtered ? positionIcon : undefined}
                  rows={card.rows}
                  isLoading={card.query.isPending}
                  isError={card.query.isError}
                />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Leaderboard;
