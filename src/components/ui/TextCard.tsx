import Card from "@/components/ui/Card";

interface Props {
  text: string;
}

const TextCard = ({ text }: Props) => {
  return (
    <main className="mt-14 flex flex-col gap-3 md:min-w-[1080px]">
      <Card className="w-full">
        <div className="flex flex-col items-center justify-center gap-3 px-4 py-7 text-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4A4F57"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8h.01M11 12h1v4h1" />
          </svg>
          <p className="text-sm text-primary1">{text}</p>
        </div>
      </Card>
    </main>
  );
};

export default TextCard;
