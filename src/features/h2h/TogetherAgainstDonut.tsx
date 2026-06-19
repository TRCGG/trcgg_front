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
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span className="text-primary2" style={{ fontSize: 11 }}>
          <span
            className="bg-blueText"
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              marginRight: 4,
              borderRadius: 2,
            }}
          />
          함께 {withGames}
        </span>
        <span className="text-primary2" style={{ fontSize: 11 }}>
          <span
            className="bg-yellow"
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              marginRight: 4,
              borderRadius: 2,
            }}
          />
          맞붙어 {againstGames}
        </span>
      </div>
    </div>
  );
};

export default TogetherAgainstDonut;
