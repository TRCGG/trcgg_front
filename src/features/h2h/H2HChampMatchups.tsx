import { useEffect, useState } from "react";
import { H2HMatchup, LanePosition } from "@/data/types/h2h";
import colors from "@/styles/colors";
import useChampionKoNames from "@/hooks/useChampionKoNames";
import { LanePos, TopLanePair, v2WinRateColor } from "./h2hHelpers";
import ChampPortrait from "./ChampPortrait";
import LaneTabs, { LaneTabValue } from "./LaneTabs";
import SectionCard from "./SectionCard";
import H2HTopLanePairCard from "./H2HTopLanePairCard";
import LoadMoreButton from "./LoadMoreButton";

const PAGE_SIZE = 5;

interface MatchupGroup {
  champ: string;
  lane: LanePosition;
  games: number;
  wins: number;
  kdaSum: number;
  children: H2HMatchup[];
}

interface ChildRowProps {
  matchup: H2HMatchup;
  koName: (en?: string | null) => string;
}

// 펼친 자식 행 — 상대 챔피언 매치업
const MatchupChildRow = ({ matchup, koName }: ChildRowProps) => {
  const wr = Math.round((matchup.wins / matchup.count) * 100);
  const winPct = (matchup.wins / matchup.count) * 100;
  // 교차 신호: 맞라인 = 노란 테두리 / 다른 라인 = 회색 테두리
  const cross = matchup.myLane !== matchup.oppoLane;
  const laneColor = cross ? colors.primary2 : colors.yellow;
  return (
    <div
      className="hover:bg-rankBg2 flex items-center gap-3 px-3 py-2"
      style={{ borderTop: `1px solid ${colors.border2}` }}
    >
      <span
        className="text-redText shrink-0"
        style={{ width: 22, textAlign: "center", fontSize: 10, fontWeight: 700 }}
      >
        VS
      </span>
      <ChampPortrait
        en={matchup.oppoChamp}
        lane={matchup.oppoLane}
        size={30}
        ringColor={laneColor}
      />
      <div className="min-w-0" style={{ flex: 1 }}>
        <div className="text-primary1 truncate" style={{ fontSize: 13 }}>
          {koName(matchup.oppoChamp)}
        </div>
      </div>
      <div style={{ width: 64, textAlign: "center", fontSize: 12, fontFeatureSettings: '"tnum"' }}>
        <b className="text-blueText">{matchup.wins}</b>
        <span className="text-primary2">승 </span>
        <b className="text-redText">{matchup.count - matchup.wins}</b>
        <span className="text-primary2">패</span>
      </div>
      <div
        className="bg-rankBg3 shrink-0"
        style={{ position: "relative", width: 84, height: 14, borderRadius: 3, overflow: "hidden" }}
      >
        <div
          className="bg-blueText"
          style={{ height: "100%", width: `${winPct}%`, opacity: 0.55 }}
        />
        <span
          className="text-primary2"
          style={{
            position: "absolute",
            right: 5,
            top: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            fontSize: 9,
            fontFeatureSettings: '"tnum"',
          }}
        >
          {matchup.count}판
        </span>
      </div>
      <div style={{ width: 54, textAlign: "center" }}>
        <div className="text-primary1" style={{ fontSize: 12, fontFeatureSettings: '"tnum"' }}>
          {matchup.myKda}
        </div>
        <div className="text-primary2" style={{ fontSize: 9 }}>
          내 KDA
        </div>
      </div>
      <div style={{ width: 44, textAlign: "right" }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: v2WinRateColor(wr),
            fontFeatureSettings: '"tnum"',
          }}
        >
          {wr}%
        </div>
      </div>
    </div>
  );
};

interface GroupProps {
  group: MatchupGroup;
  koName: (en?: string | null) => string;
  defaultOpen: boolean;
}

// 챔피언 + 라인 그룹 (펼침 헤더)
const ChampGroup = ({ group, koName, defaultOpen }: GroupProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const wr = Math.round((group.wins / group.games) * 100);
  const winPct = (group.wins / group.games) * 100;
  const kda = (group.kdaSum / group.games).toFixed(2);
  const children = [...group.children].sort((a, b) => b.count - a.count);
  return (
    <div
      className="bg-darkBg1 border border-border2 overflow-hidden rounded"
      style={{ borderLeft: `3px solid ${v2WinRateColor(wr)}` }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="hover:bg-rankBg2 flex w-full items-center gap-3 px-3 py-2.5 text-left"
      >
        <ChampPortrait en={group.champ} lane={group.lane} size={42} mine />
        <div className="min-w-0" style={{ flex: 1 }}>
          <div className="text-primary1 truncate" style={{ fontSize: 14, fontWeight: 700 }}>
            {koName(group.champ)}
          </div>
        </div>
        <div style={{ width: 80, textAlign: "center", flexShrink: 0 }}>
          <div className="text-primary1" style={{ fontSize: 12, fontFeatureSettings: '"tnum"' }}>
            {group.games}게임
          </div>
          <div style={{ fontSize: 11, fontFeatureSettings: '"tnum"' }}>
            <b className="text-blueText">{group.wins}</b>
            <span className="text-primary2">승 </span>
            <b className="text-redText">{group.games - group.wins}</b>
            <span className="text-primary2">패</span>
          </div>
        </div>
        <div
          className="bg-rankBg3 shrink-0"
          style={{
            position: "relative",
            width: 84,
            height: 16,
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <div
            className="bg-blueText"
            style={{ height: "100%", width: `${winPct}%`, opacity: 0.6 }}
          />
          <span
            className="text-white"
            style={{
              position: "absolute",
              left: 6,
              top: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              fontSize: 9,
            }}
          >
            {children.length}개 매치업
          </span>
        </div>
        <div style={{ width: 54, textAlign: "center", flexShrink: 0 }}>
          <div className="text-primary1" style={{ fontSize: 13, fontFeatureSettings: '"tnum"' }}>
            {kda}
          </div>
          <div className="text-primary2" style={{ fontSize: 9 }}>
            내 KDA
          </div>
        </div>
        <div style={{ width: 44, textAlign: "right", flexShrink: 0 }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: v2WinRateColor(wr),
              fontFeatureSettings: '"tnum"',
            }}
          >
            {wr}%
          </div>
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke={colors.primary2}
          strokeWidth="2"
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 120ms",
            flexShrink: 0,
          }}
        >
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div style={{ background: "rgba(0,0,0,0.25)" }}>
          {children.map((m, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <MatchupChildRow key={i} matchup={m} koName={koName} />
          ))}
        </div>
      )}
    </div>
  );
};

interface Props {
  matchups: H2HMatchup[];
  topLanePair: TopLanePair | null;
}

const H2HChampMatchups = ({ matchups, topLanePair }: Props) => {
  const koName = useChampionKoNames();
  const [lane, setLane] = useState<LaneTabValue>("ALL");
  const [sameLaneOnly, setSameLaneOnly] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  // 라인 탭·맞라인만 변경 시 다시 처음부터
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [lane, sameLaneOnly]);

  const totalGames = matchups.reduce((s, m) => s + m.count, 0) || 1;
  const laneShare = (v: LanePos) =>
    Math.round(
      (matchups.filter((m) => m.myLane === v).reduce((s, m) => s + m.count, 0) / totalGames) * 100
    );

  const filtered = matchups
    .filter((m) => lane === "ALL" || m.myLane === lane)
    .filter((m) => !sameLaneOnly || m.myLane === m.oppoLane);

  const groupsMap: Record<string, MatchupGroup> = {};
  filtered.forEach((m) => {
    const key = `${m.myChamp}|${m.myLane}`; // 내 챔피언 + 라인 복합 키
    if (!groupsMap[key]) {
      groupsMap[key] = {
        champ: m.myChamp,
        lane: m.myLane,
        games: 0,
        wins: 0,
        kdaSum: 0,
        children: [],
      };
    }
    const grp = groupsMap[key];
    grp.games += m.count;
    grp.wins += m.wins;
    grp.kdaSum += (parseFloat(m.myKda) || 0) * m.count;
    grp.children.push(m);
  });
  // 그룹 정렬 고정: 합산 판수 desc, 동률 시 승률 desc
  const groups = Object.values(groupsMap).sort(
    (a, b) => b.games - a.games || b.wins / b.games - a.wins / a.games
  );
  const shown = groups.slice(0, visible);
  const remaining = groups.length - shown.length;

  return (
    <SectionCard
      title="라인 · 챔피언 매치업"
      rightSlot={
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          <LaneTabs value={lane} onChange={setLane} share={laneShare} />
          <button
            type="button"
            onClick={() => setSameLaneOnly((v) => !v)}
            className="border text-sm"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "6px 10px",
              borderRadius: 999,
              flexShrink: 0,
              borderColor: sameLaneOnly ? colors.yellow : colors.border2,
              background: sameLaneOnly ? "rgba(255,200,0,0.12)" : colors.darkBg2,
              color: sameLaneOnly ? colors.yellow : colors.primary2,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: sameLaneOnly ? colors.yellow : colors.primary2,
              }}
            />
            맞라인만
          </button>
          <span
            className="bg-rankBg2 border border-border2 text-primary1"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "6px 10px",
              borderRadius: 999,
              fontSize: 11,
              flexShrink: 0,
            }}
          >
            판수순
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      }
    >
      <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
        {topLanePair && (
          <H2HTopLanePairCard label="가장 많이 맞붙은 라인" {...topLanePair} separator="vs" />
        )}
        {groups.length > 0 ? (
          shown.map((g) => (
            <ChampGroup
              key={`${g.champ}|${g.lane}`}
              group={g}
              koName={koName}
              defaultOpen={false}
            />
          ))
        ) : (
          <div className="text-primary2" style={{ padding: 24, textAlign: "center", fontSize: 13 }}>
            해당 라인 매치업이 없어요
          </div>
        )}
        {remaining > 0 && (
          <LoadMoreButton onClick={() => setVisible((v) => v + PAGE_SIZE)} remaining={remaining} />
        )}
      </div>
    </SectionCard>
  );
};

export default H2HChampMatchups;
