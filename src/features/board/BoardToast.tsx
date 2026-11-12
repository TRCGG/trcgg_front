import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const TOAST_MS = 2200;

const BoardToastContext = createContext<(message: string) => void>(() => {});

/** BoardLayout이 페이지 이동 사이에도 유지되므로, 저장 후 목록으로 넘어가도 안내가 남는다. */
export const BoardToastProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((next: string) => {
    if (timer.current) clearTimeout(timer.current);
    setMessage(next);
    timer.current = setTimeout(() => setMessage(""), TOAST_MS);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  return (
    <BoardToastContext.Provider value={show}>
      {children}
      {message && (
        <div
          role="status"
          className="fixed bottom-7 left-1/2 z-[110] max-w-[calc(100%-32px)] -translate-x-1/2 rounded border border-border2 bg-board-toast px-4 py-2.5 text-[13.5px] text-board-heading"
        >
          {message}
        </div>
      )}
    </BoardToastContext.Provider>
  );
};

export const useBoardToast = () => useContext(BoardToastContext);
