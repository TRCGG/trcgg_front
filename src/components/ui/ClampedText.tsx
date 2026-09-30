import { useRef, useState } from "react";
import Tooltip from "./Tooltip";

interface Props {
  text: string | null;
  /** 비어 있을 때 대신 보일 글자 */
  fallback?: string;
  className?: string;
}

/** 두 줄까지만 보이고, 실제로 잘렸을 때만 마우스를 올리면 전체 내용을 툴팁으로 보여준다. */
const ClampedText = ({ text, fallback = "-", className = "" }: Props) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [clamped, setClamped] = useState(false);

  const measure = () => {
    const el = ref.current;
    if (el) setClamped(el.scrollHeight > el.clientHeight);
  };

  if (!text) return <span className={className}>{fallback}</span>;

  return (
    <Tooltip
      content={clamped ? <span className="whitespace-pre-wrap">{text}</span> : null}
      className="block min-w-0"
    >
      <span
        ref={ref}
        onMouseEnter={measure}
        onTouchStart={measure}
        className={`line-clamp-2 whitespace-pre-wrap break-words ${className}`}
      >
        {text}
      </span>
    </Tooltip>
  );
};

export default ClampedText;
