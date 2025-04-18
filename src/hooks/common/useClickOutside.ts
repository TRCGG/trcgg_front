import { RefObject, useEffect } from "react";

const useClickOutside = (ref: RefObject<HTMLElement | null>, onOutsideClick: () => void) => {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutsideClick();
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onOutsideClick]);
};
export default useClickOutside;
