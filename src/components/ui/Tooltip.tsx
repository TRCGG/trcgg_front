import React, { ReactNode, useState } from "react";

interface Props {
  content: ReactNode;
  children: ReactNode;
  className?: string;
}

const Tooltip = ({ content, children, className = "" }: Props) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && content && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 pointer-events-none">
          <div className="px-3 py-2 rounded bg-black text-white text-sm max-w-[320px] break-words overflow-wrap-anywhere">
            {content}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-black" />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
