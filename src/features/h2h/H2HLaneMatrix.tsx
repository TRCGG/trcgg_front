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
    <div style={{ padding: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "32px repeat(5, 1fr)", gap: 4 }}>
        {/* header row */}
        <div />
        {POSITIONS.map((p) => (
          <div
            key={p}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              padding: "4px 0",
            }}
          >
            <LaneIcon position={p} size={18} />
            <span className="text-primary2" style={{ fontSize: 10 }}>
              {POSITION_LABELS[p]}
            </span>
          </div>
        ))}
        {/* body rows */}
        {POSITIONS.map((myL) => (
          <React.Fragment key={myL}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <LaneIcon position={myL} size={18} />
              <span className="text-primary2" style={{ fontSize: 10 }}>
                {POSITION_LABELS[myL]}
              </span>
            </div>
            {POSITIONS.map((opL) => {
              const cell = matrix[myL]?.[opL] ?? { c: 0, w: 0 };
              const wr = cell.c > 0 ? Math.round((cell.w / cell.c) * 100) : 0;
              return (
                <div
                  key={opL}
                  className="border border-border2"
                  style={{
                    aspectRatio: "1 / 1",
                    borderRadius: 4,
                    background: v2MatrixCellBg(cell.c, wr),
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {cell.c === 0 ? (
                    <span className="text-primary2" style={{ fontSize: 14 }}>
                      ·
                    </span>
                  ) : (
                    <>
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
                      <div className="text-primary2" style={{ fontSize: 10 }}>
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
      <div
        className="text-primary2"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 12,
          fontSize: 10,
        }}
      >
        <span>승률</span>
        <span
          style={{
            display: "inline-block",
            width: 16,
            height: 8,
            background: "rgba(255,107,139,0.42)",
          }}
        />
        <span>0%</span>
        <span
          style={{
            display: "inline-block",
            width: 16,
            height: 8,
            background: "rgba(120,120,120,0.18)",
          }}
        />
        <span>50%</span>
        <span
          style={{
            display: "inline-block",
            width: 16,
            height: 8,
            background: "rgba(107,184,255,0.42)",
          }}
        />
        <span>100%</span>
        <span style={{ marginLeft: "auto" }}>색상 진하기 = 표본 수</span>
      </div>
    </div>
  </SectionCard>
);

export default H2HLaneMatrix;
