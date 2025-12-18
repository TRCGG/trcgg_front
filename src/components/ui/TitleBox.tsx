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
    <div className={`bg-darkBg2 rounded border border-border2 p-3 ${className || ""}`}>
      {/* 데스크톱 레이아웃 */}
      <div className="hidden md:flex items-end justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl text-blueText2 font-light">{clanName}</span>
          <h1 className="text-2xl text-primary1 font-light">{title}</h1>
          {date && <span className="text-sm text-primary2">{date}</span>}
        </div>
        {description && <div className="text-sm text-primary2">{description}</div>}
      </div>

      {/* 모바일 레이아웃 */}
      <div className="flex md:hidden flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg text-blueText2 font-light">{clanName}</span>
          <h1 className="text-lg text-primary1 font-light">{title}</h1>
        </div>
        {(date || description) && (
          <div className="flex items-center justify-between gap-2">
            {date && <span className="text-xs text-primary2">{date}</span>}
            {description && <div className="text-xs text-primary2">{description}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default TitleBox;
