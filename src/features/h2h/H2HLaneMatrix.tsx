import React from "react";
import { H2HLaneMatrix as LaneMatrixData } from "@/data/types/h2h";
import { POSITIONS, POSITION_LABELS, v2MatrixCellBg, v2WinRateColor } from "./h2hHelpers";
import LaneIcon from "./LaneIcon";
import SectionCard from "./SectionCard";

interface Props {
  matrix: LaneMatrixData;
}

const H2HLaneMatrix = ({ matrix }: Props) => (
  <SectionCard title="라인 매트릭스" subtitle="세로 — 내 라인 / 가로 — 상대 라인">
    <div className="p-4">
      <div className="grid grid-cols-[32px_repeat(5,_1fr)] gap-1">
        {/* header row */}
        <div />
        {POSITIONS.map((p) => (
          <div key={p} className="flex flex-col items-center gap-0.5 py-1 px-0">
            <LaneIcon position={p} size={18} />
            <span className="text-primary2 text-[10px]">{POSITION_LABELS[p]}</span>
          </div>
        ))}
        {/* body rows */}
        {POSITIONS.map((myL) => (
          <React.Fragment key={myL}>
            <div className="flex flex-col items-center justify-center gap-0.5">
              <LaneIcon position={myL} size={18} />
              <span className="text-primary2 text-[10px]">{POSITION_LABELS[myL]}</span>
            </div>
            {POSITIONS.map((opL) => {
              const cell = matrix[myL]?.[opL] ?? { c: 0, w: 0 };
              const wr = cell.c > 0 ? Math.round((cell.w / cell.c) * 100) : 0;
              return (
                <div
                  key={opL}
                  className="border border-border2 aspect-square rounded flex flex-col items-center justify-center"
                  style={{ background: v2MatrixCellBg(cell.c, wr) }}
                >
                  {cell.c === 0 ? (
                    <span className="text-primary2 text-sm">·</span>
                  ) : (
                    <>
                      <div
                        className="text-sm font-bold tabular-nums"
                        style={{ color: v2WinRateColor(wr) }}
                      >
                        {wr}%
                      </div>
                      <div className="text-primary2 text-[10px]">
                        {cell.w}-{cell.c - cell.w}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="text-primary2 flex items-center gap-2 mt-3 text-[10px]">
        <span>승률</span>
        <span className="inline-block w-4 h-2 bg-[rgba(255,107,139,0.42)]" />
        <span>0%</span>
        <span className="inline-block w-4 h-2 bg-[rgba(120,120,120,0.18)]" />
        <span>50%</span>
        <span className="inline-block w-4 h-2 bg-[rgba(107,184,255,0.42)]" />
        <span>100%</span>
        <span className="ml-auto">색상 진하기 = 표본 수</span>
      </div>
    </div>
  </SectionCard>
);

export default H2HLaneMatrix;
