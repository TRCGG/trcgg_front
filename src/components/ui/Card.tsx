import { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const Card = ({ title, children, className }: CardProps) => {
  return (
    <div className={`bg-darkBg2 rounded border border-border2 ${className || ""}`}>
      <div className="text-primary1 p-2 pl-3 text-2xl font-medium items-center">{title}</div>
      <hr className="border-t-2 border-border2" />
      <div className="flex flex-col space-y-4 p-3 text-white">{children}</div>
    </div>
  );
};

export default Card;
