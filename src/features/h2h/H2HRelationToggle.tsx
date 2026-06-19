import { H2HRelation } from "@/data/types/h2h";
import colors from "@/styles/colors";

interface Props {
  value: H2HRelation;
  onChange: (value: H2HRelation) => void;
  counts: { with: number; against: number };
}

const ITEMS: { k: H2HRelation; label: string }[] = [
  { k: "with", label: "함께한" },
  { k: "against", label: "맞붙은" },
];

const H2HRelationToggle = ({ value, onChange, counts }: Props) => (
  <div
    className="bg-darkBg2 border border-border2"
    style={{
      display: "inline-flex",
      borderRadius: 4,
      padding: 4,
      gap: 4,
    }}
  >
    {ITEMS.map((it) => {
      const active = value === it.k;
      const accent = it.k === "with" ? colors.blueButton : colors.redButton;
      return (
        <button
          key={it.k}
          type="button"
          onClick={() => onChange(it.k)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            fontSize: 14,
            fontWeight: 500,
            borderRadius: 4,
            border: "none",
            background: active ? accent : "transparent",
            color: active ? colors.white : colors.primary2,
            transition: "background 120ms",
          }}
        >
          <span>{it.label}</span>
          <span
            style={{
              fontSize: 12,
              color: active ? "rgba(255,255,255,0.7)" : colors.primary2,
              padding: "1px 6px",
              borderRadius: 999,
              background: active ? "rgba(0,0,0,0.25)" : colors.rankBg2,
            }}
          >
            {counts[it.k]}
          </span>
        </button>
      );
    })}
  </div>
);

export default H2HRelationToggle;
