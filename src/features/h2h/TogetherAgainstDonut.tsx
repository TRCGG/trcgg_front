interface Props {
  withGames: number;
  againstGames: number;
  size?: number;
}

const TogetherAgainstDonut = ({ withGames, againstGames, size = 80 }: Props) => {
  const total = withGames + againstGames;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const withFrac = total ? withGames / total : 0;
  const withDash = withFrac * c;
  const againstDash = c - withDash;

  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size}>
        <circle
          className="stroke-rankBg3"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
        />
        <circle
          className="stroke-blueText"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeDasharray={`${withDash} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <circle
          className="stroke-yellow"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeDasharray={`${againstDash} ${c}`}
          strokeDashoffset={-withDash}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          className="fill-primary1"
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fontSize={16}
          fontWeight={700}
        >
          {total}
        </text>
      </svg>
      <div className="flex flex-col gap-1">
        <span className="text-primary2 text-[11px]">
          <span className="bg-blueText inline-block w-2 h-2 mr-1 rounded-sm" />
          함께 {withGames}
        </span>
        <span className="text-primary2 text-[11px]">
          <span className="bg-yellow inline-block w-2 h-2 mr-1 rounded-sm" />
          맞붙어 {againstGames}
        </span>
      </div>
    </div>
  );
};

export default TogetherAgainstDonut;
