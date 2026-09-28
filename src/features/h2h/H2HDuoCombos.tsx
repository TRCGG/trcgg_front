import { useEffect, useRef, useState } from "react";
import { H2HDuoChamp, H2HLaneCombo, LanePosition } from "@/data/types/h2h";
import colors from "@/styles/colors";
import useChampionKoNames from "@/hooks/useChampionKoNames";
import { LanePos, POSITION_LABELS, v2WinRateColor } from "./h2hHelpers";
import ChampPortrait from "./ChampPortrait";
import LaneTabs, { LaneTabValue } from "./LaneTabs";
import SectionCard from "./SectionCard";
import H2HTopLanePairCard from "./H2HTopLanePairCard";
import LoadMoreButton from "./LoadMoreButton";

const PAGE_SIZE = 5;

interface DuoGroup {
  champ: string;
  lane: LanePosition;
  games: number;
  wins: number;
  kdaSum: number;
  children: H2HDuoChamp[];
}

interface ChildRowProps {
  combo: H2HDuoChamp;
  koName: (en?: string | null) => string;
}

// 펼친 자식 행 — 팀원 챔피언 (팀원 KDA 표기)
const DuoChildRow = ({ combo, koName }: ChildRowProps) => {
  const wr = Math.round((combo.wins / combo.count) * 100);
  const winPct = (combo.wins / combo.count) * 100;
  return (
    <div className="hover:bg-rankBg2 flex items-center gap-3 px-3 py-2 border-t border-border2">
      <span className="text-blueText shrink-0 w-[22px] text-center text-xs font-bold">+</span>
      <ChampPortrait en={combo.oppo} lane={combo.oppoLane} size={30} />
      <div className="min-w-0 flex-1">
        <div className="text-primary1 truncate text-xs">{koName(combo.oppo)}</div>
        <div className="text-primary2 text-[9px] mt-px">{POSITION_LABELS[combo.oppoLane]}</div>
      </div>
      <div className="w-16 text-center text-xs tabular-nums">
        <b className="text-blueText">{combo.wins}</b>
        <span className="text-primary2">승 </span>
        <b className="text-redText">{combo.count - combo.wins}</b>
        <span className="text-primary2">패</span>
      </div>
      <div className="bg-rankBg3 shrink-0 relative w-[84px] h-3.5 rounded-[3px] overflow-hidden">
        <div className="bg-blueText h-full opacity-[0.55]" style={{ width: `${winPct}%` }} />
        <span className="text-primary2 absolute right-[5px] top-0 bottom-0 flex items-center text-[9px] tabular-nums">
          {combo.count}판
        </span>
      </div>
      <div className="w-[54px] text-center">
        <div className="text-primary1 text-xs tabular-nums">{combo.mateKda}</div>
        <div className="text-primary2 text-[9px]">팀원 KDA</div>
      </div>
      <div className="w-11 text-right">
        <div className="text-sm font-bold tabular-nums" style={{ color: v2WinRateColor(wr) }}>
          {wr}%
        </div>
      </div>
    </div>
  );
};

interface GroupProps {
  group: DuoGroup;
  koName: (en?: string | null) => string;
  defaultOpen: boolean;
}

// 내 챔피언 + 라인 듀오 그룹 (헤더 = 내 KDA)
const DuoGroupCard = ({ group, koName, defaultOpen }: GroupProps) => {
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
        <div className="min-w-0 flex-1">
          <div className="text-primary1 truncate text-sm font-bold">{koName(group.champ)}</div>
        </div>
        <div className="w-20 text-center shrink-0">
          <div className="text-primary1 text-xs tabular-nums">{group.games}게임</div>
          <div className="text-[11px] tabular-nums">
            <b className="text-blueText">{group.wins}</b>
            <span className="text-primary2">승 </span>
            <b className="text-redText">{group.games - group.wins}</b>
            <span className="text-primary2">패</span>
          </div>
        </div>
        <div className="bg-rankBg3 shrink-0 relative w-[84px] h-4 rounded-[3px] overflow-hidden">
          <div className="bg-blueText h-full opacity-[0.6]" style={{ width: `${winPct}%` }} />
          <span className="text-white absolute left-1.5 top-0 bottom-0 flex items-center text-[9px]">
            {children.length}팀원
          </span>
        </div>
        <div className="w-[54px] text-center shrink-0">
          <div className="text-primary1 text-[13px] tabular-nums">{kda}</div>
          <div className="text-primary2 text-[9px]">내 KDA</div>
        </div>
        <div className="w-11 text-right shrink-0">
          <div className="text-base font-bold tabular-nums" style={{ color: v2WinRateColor(wr) }}>
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
          className="transition-transform duration-[120ms] shrink-0"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        >
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          {open && (
            <div className="bg-black/25">
              {children.map((c, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <DuoChildRow key={i} combo={c} koName={koName} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface Props {
  combos: H2HDuoChamp[];
  topLaneCombo: H2HLaneCombo | null;
}

const H2HDuoCombos = ({ combos, topLaneCombo }: Props) => {
  const koName = useChampionKoNames();
  const [lane, setLane] = useState<LaneTabValue>("ALL");
  const [visible, setVisible] = useState(PAGE_SIZE);

  // 라인 탭 변경 시 다시 처음부터
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [lane]);

  const totalGames = combos.reduce((s, c) => s + c.count, 0) || 1;
  const laneShare = (v: LanePos) =>
    Math.round(
      (combos.filter((c) => c.mineLane === v).reduce((s, c) => s + c.count, 0) / totalGames) * 100
    );

  const filtered = lane === "ALL" ? combos : combos.filter((c) => c.mineLane === lane);

  const groupsMap: Record<string, DuoGroup> = {};
  filtered.forEach((c) => {
    const key = `${c.mine}|${c.mineLane}`; // 내 챔피언 + 라인 복합 키
    if (!groupsMap[key]) {
      groupsMap[key] = {
        champ: c.mine,
        lane: c.mineLane,
        games: 0,
        wins: 0,
        kdaSum: 0,
        children: [],
      };
    }
    const grp = groupsMap[key];
    grp.games += c.count;
    grp.wins += c.wins;
    grp.kdaSum += (parseFloat(c.myKda) || 0) * c.count;
    grp.children.push(c);
  });
  // 그룹 정렬 고정: 합산 판수 desc, 동률 시 승률 desc
  const groups = Object.values(groupsMap).sort(
    (a, b) => b.games - a.games || b.wins / b.games - a.wins / a.games
  );
  const shown = groups.slice(0, visible);
  const remaining = groups.length - shown.length;

  const prevCountRef = useRef(shown.length);
  const prevCount = prevCountRef.current;
  useEffect(() => {
    prevCountRef.current = shown.length;
  }, [shown.length]);

  return (
    <SectionCard
      title="자주 가는 듀오 픽"
      subtitle="헤더 KDA = 내 챔피언 기준 · 펼친 행 KDA = 함께한 팀원 기준"
      rightSlot={<LaneTabs value={lane} onChange={setLane} share={laneShare} />}
    >
      <div className="p-3 flex flex-col gap-2.5">
        {topLaneCombo && (
          <H2HTopLanePairCard
            label="가장 많이 함께한 포지션"
            myLane={topLaneCombo.mine}
            oppoLane={topLaneCombo.oppo}
            count={topLaneCombo.count}
            wins={topLaneCombo.wins}
            separator="+"
          />
        )}
        {groups.length > 0 ? (
          shown.map((g, i) => {
            const isNew = i >= prevCount;
            return (
              <div
                key={`${g.champ}|${g.lane}`}
                className={isNew ? "motion-safe:animate-fadeUp" : undefined}
                style={isNew ? { animationDelay: `${(i - prevCount) * 60}ms` } : undefined}
              >
                <DuoGroupCard group={g} koName={koName} defaultOpen={false} />
              </div>
            );
          })
        ) : (
          <div className="text-primary2 p-6 text-center text-[13px]">해당 라인 듀오가 없어요</div>
        )}
        {remaining > 0 && (
          <LoadMoreButton onClick={() => setVisible((v) => v + PAGE_SIZE)} remaining={remaining} />
        )}
      </div>
    </SectionCard>
  );
};

export default H2HDuoCombos;
