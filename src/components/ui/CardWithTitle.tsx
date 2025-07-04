import { ReactNode } from "react";
import Card from "@/components/ui/Card";

interface Props {
  title: string;
  children: ReactNode;
  className?: string;
}

const CardWithTitle = ({ title, children, className }: Props) => {
  return (
    <Card className={className}>
      <div className="text-primary1 p-2 pl-3 text-2xl font-medium items-center">{title}</div>
      <hr className="border-t-2 border-border2" />
      <div className="flex flex-col space-y-4 p-3 text-white">{children}</div>
    </Card>
  );
};

export default CardWithTitle;
