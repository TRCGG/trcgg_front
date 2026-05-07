import usePlayerMmr from "@/hooks/mmr/usePlayerMmr";

interface Props {
  puuid?: string;
  guildId?: string;
}

const MmrBadge = ({ puuid, guildId }: Props) => {
  const { data: response, isLoading, isError } = usePlayerMmr(puuid, guildId);

  if (!puuid || !guildId) {
    return (
      <div className="flex items-center text-sm text-gray">
        <span>MMR 없음</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center text-sm text-gray">
        <span>MMR 로딩중</span>
      </div>
    );
  }

  if (isError || (response && response.error)) {
    return (
      <div className="flex items-center text-sm text-redText">
        <span>MMR 오류</span>
      </div>
    );
  }

  const mmr = response?.data;

  if (!mmr) {
    return (
      <div className="flex items-center text-sm text-gray">
        <span>MMR 없음</span>
      </div>
    );
  }

  const delta = mmr.lastMatchDelta;
  const showDelta = delta !== null && delta !== 0;

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-white">
      <span className="text-xl font-bold">{mmr.mmr}</span>
      <span className="text-sm text-primary2">MMR</span>
      {showDelta && (
        <span className={`text-sm font-semibold ${delta > 0 ? "text-green-500" : "text-redText"}`}>
          {delta > 0 ? "+" : ""}
          {delta}
        </span>
      )}
      {mmr.gamesPlayed > 0 && (
        <span className="text-xs text-gray">
          {mmr.wins}승 {mmr.losses}패 ({mmr.winRate}%)
        </span>
      )}
    </div>
  );
};

export default MmrBadge;
