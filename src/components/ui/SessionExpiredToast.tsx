import { useEffect } from "react";

const TOAST_MS = 4000;

interface SessionExpiredToastProps {
  open: boolean;
  onClose: () => void;
}

const SessionExpiredToast = ({ open, onClose }: SessionExpiredToastProps) => {
  useEffect(() => {
    if (!open) return undefined;
    const timer = setTimeout(onClose, TOAST_MS);
    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="status"
      className="fixed bottom-7 left-1/2 z-[110] max-w-[calc(100%-32px)] -translate-x-1/2 rounded border border-border2 bg-board-toast px-4 py-2.5 text-[13.5px] text-board-heading"
    >
      로그인이 만료되었습니다. 다시 로그인해 주세요.
    </div>
  );
};

export default SessionExpiredToast;
