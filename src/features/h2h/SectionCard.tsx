import React from "react";

interface Props {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
  // 모바일(<640px)에서 제목과 rightSlot을 2행으로 분리한다.
  // 필터가 많아 한 행에 넣으면 제목이 여러 줄로 접히는 카드에서 사용.
  stackOnMobile?: boolean;
  children: React.ReactNode;
}

const SectionCard = ({ title, subtitle, rightSlot, stackOnMobile, children }: Props) => (
  <div
    className="bg-darkBg2 border border-border2"
    style={{
      borderRadius: 4,
      overflow: "hidden",
    }}
  >
    <div
      className={`border-b border-border2 flex gap-3 px-4 py-3 ${
        stackOnMobile
          ? "flex-col items-stretch sm:flex-row sm:items-center sm:justify-between"
          : "items-center justify-between"
      }`}
    >
      <div>
        <div className="text-primary1" style={{ fontSize: 14, fontWeight: 700 }}>
          {title}
        </div>
        {subtitle && (
          <div className="text-primary2" style={{ fontSize: 11, marginTop: 2 }}>
            {subtitle}
          </div>
        )}
      </div>
      {rightSlot}
    </div>
    {children}
  </div>
);

export default SectionCard;
