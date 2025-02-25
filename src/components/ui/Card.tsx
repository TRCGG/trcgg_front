import { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
}

const Card = ({ title, children }: CardProps) => {
  return (
    <div className="bg-darkBg2 rounded border border-border2">
      <div className="text-primary1 p-3 text-xl font-medium">{title}</div>
      <hr className="border-t-2 border-border2" />
      <div className="flex flex-col space-y-4 p-3 text-white">{children}</div>
    </div>
  );
};

export default Card;
