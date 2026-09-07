import { CompetitionStatus } from "@/data/types/competition";
import { COMPETITION_FILTERS } from "./competitionMeta";

interface Props {
  selected?: CompetitionStatus;
  onSelect: (status?: CompetitionStatus) => void;
  totalCount: number;
}

const CompetitionStatusFilter = ({ selected, onSelect, totalCount }: Props) => (
  <div className="flex flex-wrap items-center gap-2">
    {COMPETITION_FILTERS.map((filter) => {
      const active = filter.status === selected;
      return (
        <button
          key={filter.label}
          type="button"
          onClick={() => onSelect(filter.status)}
          className={`rounded px-3.5 py-1.5 text-[13px] transition-colors ${
            active
              ? "border border-blueText bg-blueText/10 text-primary1"
              : "border border-border2 bg-darkBg2 text-primary2 hover:text-primary1"
          }`}
        >
          {filter.label}
        </button>
      );
    })}
    <span className="ml-auto text-[13px] text-primary2">
      총 <span className="text-primary1">{totalCount}</span>개
    </span>
  </div>
);

export default CompetitionStatusFilter;
