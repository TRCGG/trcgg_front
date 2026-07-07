import colors from "@/styles/colors";
import { LanePos, POSITIONS, POSITION_LABELS } from "./h2hHelpers";
import LaneIcon from "./LaneIcon";

export type LaneTabValue = "ALL" | LanePos;

interface Props {
  value: LaneTabValue;
  onChange: (next: LaneTabValue) => void;
  /** 각 라인의 플레이 비중(%) — "전체"엔 표기하지 않음 */
  share: (lane: LanePos) => number;
}

const TABS: [LaneTabValue, string][] = [
  ["ALL", "전체"],
  ...POSITIONS.map((p): [LaneTabValue, string] => [p, POSITION_LABELS[p]]),
];

// 라인 탭 — 전체 / 탑 / 정글 / 미드 / 원딜 / 서폿 (라인별 비중% 포함)
const LaneTabs = ({ value, onChange, share }: Props) => (
  <div className="flex flex-wrap items-center justify-end gap-1.5">
    {TABS.map(([v, label]) => {
      const active = value === v;
      const pct = v === "ALL" ? null : share(v);
      return (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`flex items-center gap-1 rounded border border-border2 px-2.5 py-1.5 text-sm ${
            active ? "bg-primary1 text-blueDarken" : "bg-darkBg2 text-primary2"
          }`}
        >
          {v !== "ALL" && <LaneIcon position={v} size={15} />}
          {label}
          {pct != null && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: active ? colors.blueDarken : colors.blueText,
                fontFeatureSettings: '"tnum"',
              }}
            >
              {pct}%
            </span>
          )}
        </button>
      );
    })}
  </div>
);

export default LaneTabs;
