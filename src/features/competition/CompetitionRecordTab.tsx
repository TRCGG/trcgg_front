import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ApiResponse } from "@/services/apiService";
import { UserRecentRecordsResponse, RecentGameRecord } from "@/data/types/record";
import { CompetitionStatus, PlayerCompetitionItem } from "@/data/types/competition";
import { getRecentRecords } from "@/services/record";
import usePlayerCompetitions from "@/hooks/competition/usePlayerCompetitions";
import PlayerCompetitionCard from "./PlayerCompetitionCard";
import { positionLabel } from "./competitionMeta";

interface Props {
  guildId?: string;
  playerCode: string | null;
  riotName: string;
  riotTag: string;
}

const FILTERS: { label: string; status?: CompetitionStatus }[] = [
  { label: "전체", status: undefined },
  { label: "진행중", status: "IN_PROGRESS" },
  { label: "종료", status: "CLOSED" },
];

const formatLength = (seconds: number): string => {
  const min = Math.floor(seconds / 60);
  return `${min}:${String(seconds % 60).padStart(2, "0")}`;
};

const formatDate = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

const kdaRatio = (game: RecentGameRecord): string => {
  const ratio = game.death === 0 ? game.kill + game.assist : (game.kill + game.assist) / game.death;
  return ratio.toFixed(2);
};

/** 대회 경기 목록. competitionId를 주면 백엔드가 teamName·opponentTeamName을 채워준다. */
const CompetitionGames = ({
  guildId,
  riotName,
  riotTag,
  competition,
  onBack,
}: {
  guildId?: string;
  riotName: string;
  riotTag: string;
  competition: PlayerCompetitionItem;
  onBack: () => void;
}) => {
  const { data, isLoading } = useQuery<ApiResponse<UserRecentRecordsResponse>>({
    queryKey: ["competitionPlayerGames", guildId, riotName, riotTag, competition.competitionId],
    queryFn: () =>
      getRecentRecords(riotName, riotTag, guildId, { competitionId: competition.competitionId }),
    enabled: !!guildId && !!riotName,
    staleTime: 60 * 1000,
  });
  const games = data?.data?.data ?? [];

  const summary = [
    {
      label: "전적",
      value: `${competition.record.win}승 ${competition.record.lose}패`,
      className: "text-primary1",
    },
    {
      label: "승률",
      value: `${competition.record.winRate}%`,
      className: competition.record.winRate > 50 ? "text-yellow" : "text-primary2",
    },
    { label: "KDA", value: String(competition.record.kda), className: "text-primary1" },
    { label: "경기 수", value: String(competition.record.games), className: "text-primary1" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2.5">
        <button type="button" onClick={onBack} className="text-[13px] text-primary2">
          ← 참가 대회
        </button>
        <span className="text-base font-bold text-primary1">{competition.name}</span>
        {competition.team && (
          <span className="text-xs text-primary2">
            {competition.team.name} · {positionLabel(competition.team.position)}
          </span>
        )}
        <Link href={`/competitions/${competition.competitionId}`}>
          <a className="ml-auto text-xs text-blueText hover:text-primary1">대회 현황판 →</a>
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-7 rounded border border-border2 bg-darkBg2 px-5 py-4">
        {summary.map((item) => (
          <div key={item.label} className="flex flex-col gap-1">
            <span className="text-[11px] text-primary2">{item.label}</span>
            <span className={`text-[19px] font-bold tabular-nums ${item.className}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-hidden rounded border border-border2 bg-darkBg2">
          {games.length === 0 ? (
            <div className="px-4 py-11 text-center text-[13px] text-primary3">
              이 대회의 경기 기록이 없습니다
            </div>
          ) : (
            games.map((game) => {
              const isWin = game.gameResult === "승";
              return (
                <div
                  key={game.gameId}
                  className={`grid grid-cols-[6px_84px_1fr_128px_112px_72px] items-center gap-3 border-b border-cardBorder pr-4 last:border-0 ${
                    isWin ? "bg-blueDarken" : "bg-redDarken"
                  }`}
                >
                  <div className={`h-full min-h-[52px] ${isWin ? "bg-blue" : "bg-red"}`} />
                  <div className="flex flex-col gap-0.5 py-3">
                    <span
                      className={`text-[13px] font-bold ${isWin ? "text-blueText" : "text-redText"}`}
                    >
                      {game.gameResult}
                    </span>
                    <span className="text-[11px] text-primary3">
                      {formatLength(game.timePlayed)}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-[13px] text-primary1">{game.champName}</span>
                    <span className="text-[11px] text-primary2">
                      {positionLabel(game.position)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] tabular-nums text-primary1">
                      {game.kill} / {game.death} / {game.assist}{" "}
                      <span className="text-xs text-primary2">({kdaRatio(game)})</span>
                    </span>
                    <span className="text-[11px] text-primary2">시야 {game.visionScore}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span
                      className={`w-fit rounded px-1.5 py-0.5 text-[11px] font-bold ${
                        game.gameType === "3"
                          ? "bg-yellow/10 text-yellow"
                          : "bg-rankBg2 text-primary2"
                      }`}
                    >
                      {game.gameType === "3" ? "★본경기" : "스크림"}
                    </span>
                    <span className="truncate text-[11px] text-primary3">
                      {game.opponentTeamName ? `vs ${game.opponentTeamName}` : "상대 미배정"}
                    </span>
                  </div>
                  <div className="text-right text-[11px] text-primary3">
                    {formatDate(game.createDate)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

const CompetitionRecordTab = ({ guildId, playerCode, riotName, riotTag }: Props) => {
  const [statusFilter, setStatusFilter] = useState<CompetitionStatus | undefined>(undefined);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { competitions, isLoading, error } = usePlayerCompetitions(guildId ?? "", playerCode);

  const filtered = useMemo(
    () =>
      statusFilter ? competitions.filter((item) => item.status === statusFilter) : competitions,
    [competitions, statusFilter]
  );

  const selected = competitions.find((item) => item.competitionId === selectedId) ?? null;

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="rounded border border-border2 bg-darkBg2 py-11 text-center text-[13px] text-primary3">
        대회 기록을 불러오지 못했습니다
      </div>
    );
  }

  if (selected) {
    return (
      <CompetitionGames
        guildId={guildId}
        riotName={riotName}
        riotTag={riotTag}
        competition={selected}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter.label}
            type="button"
            onClick={() => setStatusFilter(filter.status)}
            className={`rounded border px-3.5 py-1.5 text-[13px] ${
              filter.status === statusFilter
                ? "border-blueText bg-blueText/10 text-primary1"
                : "border-border2 bg-darkBg2 text-primary2 hover:text-primary1"
            }`}
          >
            {filter.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-primary2">
          참가한 대회 <span className="text-primary1">{competitions.length}</span>개
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded border border-border2 bg-darkBg2 py-11 text-center text-[13px] text-primary3">
          참가한 대회가 없습니다
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {filtered.map((item) => (
            <PlayerCompetitionCard
              key={item.competitionId}
              item={item}
              onSelect={() => setSelectedId(item.competitionId)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CompetitionRecordTab;
