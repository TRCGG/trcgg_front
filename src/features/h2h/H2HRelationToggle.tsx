import { H2HRelation } from "@/data/types/h2h";

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
  <div className="bg-darkBg2 border border-border2 inline-flex rounded p-1 gap-1">
    {ITEMS.map((it) => {
      const active = value === it.k;
      const accent = it.k === "with" ? "bg-blueButton" : "bg-redButton";
      return (
        <button
          key={it.k}
          type="button"
          onClick={() => onChange(it.k)}
          className={`flex items-center gap-2 rounded border-none px-4 py-2 text-sm font-normal transition-colors duration-[120ms] ${
            active ? `${accent} text-white` : "bg-transparent text-primary2"
          }`}
        >
          <span>{it.label}</span>
          <span
            className={`rounded-full px-1.5 py-px text-xs ${
              active ? "bg-black/25 text-white/70" : "bg-rankBg2 text-primary2"
            }`}
          >
            {counts[it.k]}
          </span>
        </button>
      );
    })}
  </div>
);

export default H2HRelationToggle;
