import React, { ReactNode, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
  content: ReactNode;
  children: ReactNode;
  className?: string;
  compact?: boolean;
}

const Tooltip = ({ content, children, className = "", compact = false }: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const updatePosition = () => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCoords({ top: rect.top, left: rect.left + rect.width / 2 });
  };

  const show = () => {
    updatePosition();
    setIsVisible(true);
  };

  const hide = () => setIsVisible(false);

  // 모바일: 툴팁이 열려 있을 때 바깥을 탭하거나 스크롤하면 닫는다.
  useEffect(() => {
    if (!isVisible) return undefined;
    const handleOutside = (e: Event) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) hide();
    };
    document.addEventListener("touchstart", handleOutside);
    window.addEventListener("scroll", hide, true);
    return () => {
      document.removeEventListener("touchstart", handleOutside);
      window.removeEventListener("scroll", hide, true);
    };
  }, [isVisible]);

  return (
    <div
      ref={triggerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onTouchStart={show}
    >
      {children}
      {mounted &&
        isVisible &&
        content &&
        createPortal(
          <div
            className="fixed z-[9999] -translate-x-1/2 -translate-y-full pointer-events-none"
            style={{ top: coords.top - 8, left: coords.left }}
          >
            <div
              className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded bg-black text-white text-[11px] sm:text-sm text-left ${
                compact
                  ? "whitespace-nowrap"
                  : "w-[180px] max-w-[240px] sm:w-[240px] sm:max-w-[320px] whitespace-normal break-words"
              }`}
            >
              {content}
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-black" />
          </div>,
          document.body
        )}
    </div>
  );
};

export default Tooltip;
