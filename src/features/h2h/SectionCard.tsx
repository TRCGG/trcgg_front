import React from "react";

interface Props {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
}

const SectionCard = ({ title, subtitle, rightSlot, children }: Props) => (
  <div
    className="bg-darkBg2 border border-border2"
    style={{
      borderRadius: 4,
      overflow: "hidden",
    }}
  >
    <div
      className="border-b border-border2"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "12px 16px",
      }}
    >
      <div>
        <div className="text-primary1" style={{ fontSize: 14, fontWeight: 600 }}>
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
