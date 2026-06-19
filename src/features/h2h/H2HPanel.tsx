import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/services/apiService";
import {
  FrequentOpponent,
  FrequentOpponentsResponse,
  H2HCandidate,
  H2HDetail,
  H2HDetailResponse,
} from "@/data/types/h2h";
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

const H2HPanel = ({ riotName, riotTag, guildId }: Props) => {
  const [opponent, setOpponent] = useState<SelectedOpponent | null>(null);

  const { data: frequentData, isLoading: isLoadingFrequent } = useQuery<
    ApiResponse<FrequentOpponentsResponse>
  >({
    queryKey: ["h2hFrequent", guildId, riotName, riotTag],
    queryFn: () => getFrequentOpponents(guildId!, riotName, { riotNameTag: riotTag, limit: 12 }),
    staleTime: 5 * 60 * 1000,
    enabled: !!guildId && !!riotName && !opponent,
  });

  const {
    data: detailData,
    isLoading: isLoadingDetail,
    isFetching: isFetchingDetail,
  } = useQuery<ApiResponse<H2HDetailResponse>>({
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

  const frequent = useMemo<FrequentOpponent[]>(
    () => frequentData?.data?.data ?? [],
    [frequentData]
  );

  const handleSelect = (o: SelectedOpponent) => setOpponent(o);

  const handleClear = () => setOpponent(null);

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

  const detail = detailData?.data?.data;

  // 동명이인 후보 여러 명
  if (isCandidateList(detail)) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <button
          type="button"
          onClick={handleClear}
          className="text-primary2"
          style={{
            alignSelf: "flex-start",
            fontSize: 13,
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          ← 다시 검색
        </button>
        <div
          className="bg-darkBg2 border border-border2"
          style={{
            borderRadius: 4,
            padding: 16,
          }}
        >
          <div className="text-primary1" style={{ fontSize: 14, marginBottom: 12 }}>
            여러 명의 후보가 있어요. 한 명을 선택해 주세요.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {detail.map((c) => (
              <button
                key={c.playerCode}
                type="button"
                onClick={() => setOpponent({ riotName: c.riotName, riotNameTag: c.riotNameTag })}
                className="bg-darkBg1 border border-border2 text-primary1"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 14px",
                  borderRadius: 4,
                  fontSize: 14,
                  textAlign: "left",
                  cursor: "pointer",
                }}
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
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <button
        type="button"
        onClick={handleClear}
        className="text-primary2"
        style={{
          alignSelf: "flex-start",
          fontSize: 13,
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        ← 다시 검색
      </button>
      <div
        className="text-primary2 bg-darkBg2 border border-border2"
        style={{
          padding: 32,
          textAlign: "center",
          borderRadius: 4,
        }}
      >
        <b className="text-primary1">
          {opponent.riotName}
          {opponent.riotNameTag ? `#${opponent.riotNameTag}` : ""}
        </b>
        <div style={{ marginTop: 6, fontSize: 13 }}>
          상대를 찾을 수 없거나 함께한 기록이 없어요.
        </div>
      </div>
    </div>
  );
};

export default H2HPanel;
