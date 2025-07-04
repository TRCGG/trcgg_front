import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className }: Props) => {
  return (
    <div className={`bg-darkBg2 rounded border border-border2 ${className || ""}`}>{children}</div>
  );
};

export default Card;
