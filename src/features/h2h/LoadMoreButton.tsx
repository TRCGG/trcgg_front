interface Props {
  onClick: () => void;
  remaining: number;
}

const LoadMoreButton = ({ onClick, remaining }: Props) => (
  <button
    type="button"
    onClick={onClick}
    className="bg-darkBg2 border border-border2 text-primary1 hover:bg-grayHover w-full rounded py-2.5 text-sm transition-colors"
  >
    더보기 ({remaining})
  </button>
);

export default LoadMoreButton;
