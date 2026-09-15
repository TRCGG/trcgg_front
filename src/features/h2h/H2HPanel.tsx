import { useMemo } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { FrequentOpponent, H2HCandidate, H2HDetail } from "@/data/types/h2h";
import { getFrequentOpponents, getH2HDetail } from "@/services/h2h";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import H2HEmptyState from "./H2HEmptyState";
import H2HResultSection from "./H2HResultSection";

interface Props {
  riotName: string;
  riotTag: string;
  guildId?: string;
}

interface SelectedOpponent {
  riotName: string;
  riotNameTag?: string;
}

const isCandidateList = (
  data: H2HDetail | H2HCandidate[] | null | undefined
): data is H2HCandidate[] => Array.isArray(data);

const isH2HDetail = (data: H2HDetail | H2HCandidate[] | null | undefined): data is H2HDetail =>
  !!data && !Array.isArray(data) && "me" in data;

const buildVs = (o: SelectedOpponent) =>
  o.riotNameTag ? `${o.riotName}#${o.riotNameTag}` : o.riotName;

const BackToSearchButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="cursor-pointer self-start border-none bg-transparent text-[13px] text-primary2"
  >
    ← 다시 검색
  </button>
);

const parseVs = (vs: string): SelectedOpponent => {
  const i = vs.indexOf("#");
  return i === -1 ? { riotName: vs } : { riotName: vs.slice(0, i), riotNameTag: vs.slice(i + 1) };
};

const H2HPanel = ({ riotName, riotTag, guildId }: Props) => {
  const router = useRouter();
  const vsParam = typeof router.query.vs === "string" ? router.query.vs : null;
  const opponent = useMemo<SelectedOpponent | null>(
    () => (vsParam ? parseVs(vsParam) : null),
    [vsParam]
  );

  const pushVs = (vs: string | null) => {
    const query = { ...router.query };
    delete query.rel;
    if (vs) query.vs = vs;
    else delete query.vs;
    router.push({ pathname: router.pathname, query }, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  const { data: frequentData, isLoading: isLoadingFrequent } = useQuery<FrequentOpponent[]>({
    queryKey: ["h2hFrequent", guildId, riotName, riotTag],
    queryFn: () => getFrequentOpponents(guildId!, riotName, { riotNameTag: riotTag, limit: 12 }),
    staleTime: 5 * 60 * 1000,
    enabled: !!guildId && !!riotName && !opponent,
  });

  const {
    data: detailData,
    isLoading: isLoadingDetail,
    isFetching: isFetchingDetail,
  } = useQuery<H2HDetail | H2HCandidate[] | null>({
    queryKey: ["h2hDetail", guildId, riotName, riotTag, opponent],
    queryFn: () =>
      getH2HDetail(
        guildId!,
        { riotName, riotNameTag: riotTag },
        { riotName: opponent!.riotName, riotNameTag: opponent!.riotNameTag }
      ),
    staleTime: 3 * 60 * 1000,
    enabled: !!guildId && !!riotName && !!opponent,
  });

  const frequent = useMemo<FrequentOpponent[]>(() => frequentData ?? [], [frequentData]);

  const handleSelect = (o: SelectedOpponent) => pushVs(buildVs(o));

  const handleClear = () => pushVs(null);

  // 상대 미선택 → 빈 상태
  if (!opponent) {
    return (
      <H2HEmptyState
        frequent={frequent}
        isLoadingFrequent={isLoadingFrequent}
        guildId={guildId}
        meName={riotName}
        meTag={riotTag}
        onSelect={handleSelect}
      />
    );
  }

  if (isLoadingDetail || isFetchingDetail) {
    return <LoadingSpinner />;
  }

  const detail = detailData;

  // 동명이인 후보 여러 명
  if (isCandidateList(detail)) {
    return (
      <div className="flex flex-col gap-4">
        <BackToSearchButton onClick={handleClear} />
        <div className="rounded border border-border2 bg-darkBg2 p-4">
          <div className="mb-3 text-sm text-primary1">
            여러 명의 후보가 있어요. 한 명을 선택해 주세요.
          </div>
          <div className="flex flex-col gap-2">
            {detail.map((c) => (
              <button
                key={c.playerCode}
                type="button"
                onClick={() => handleSelect({ riotName: c.riotName, riotNameTag: c.riotNameTag })}
                className="flex cursor-pointer items-center gap-1.5 rounded border border-border2 bg-darkBg1 px-[14px] py-2.5 text-left text-sm text-primary1"
              >
                <b>{c.riotName}</b>
                <span className="text-primary2">#{c.riotNameTag}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 정상 결과
  if (isH2HDetail(detail)) {
    return (
      <H2HResultSection
        data={detail}
        guildId={guildId}
        meName={riotName}
        meTag={riotTag}
        onSelect={handleSelect}
        onClear={handleClear}
      />
    );
  }

  // 멤버 없음 / 오류
  return (
    <div className="flex flex-col gap-4">
      <BackToSearchButton onClick={handleClear} />
      <div className="rounded border border-border2 bg-darkBg2 p-8 text-center text-primary2">
        <b className="text-primary1">
          {opponent.riotName}
          {opponent.riotNameTag ? `#${opponent.riotNameTag}` : ""}
        </b>
        <div className="mt-1.5 text-[13px]">상대를 찾을 수 없거나 함께한 기록이 없어요.</div>
      </div>
    </div>
  );
};

export default H2HPanel;
