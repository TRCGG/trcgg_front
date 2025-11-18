import { ReactNode } from "react";

interface Props {
  clanName: string;
  title: string;
  date?: string;
  description?: string | ReactNode;
  className?: string;
}

const TitleBox = ({ clanName, title, date, description, className }: Props) => {
  return (
    <div
      className={`flex items-end justify-between bg-darkBg2 rounded border border-border2 p-3 ${className || ""}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl sm:text-2xl text-blueText2 font-light">{clanName}</span>
        <h1 className="text-xl sm:text-2xl text-primary1 font-light">{title}</h1>
        {date && <span className="text-xs sm:text-sm text-primary2 self-end">{date}</span>}
      </div>
      {description && (
        <div className="text-xs sm:text-sm text-primary2 self-end">{description}</div>
      )}
    </div>
  );
};

export default TitleBox;
