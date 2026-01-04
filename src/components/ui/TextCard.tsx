import Card from "@/components/ui/Card";

interface Props {
  text: string;
}

const TextCard = ({ text }: Props) => {
  return (
    <main className="mt-14 flex flex-col gap-3 md:min-w-[1080px]">
      <div className="flex flex-col text-white">
        <Card className="w-full p-4 text-center">
          <p>{text}</p>
        </Card>
      </div>
    </main>
  );
};

export default TextCard;
