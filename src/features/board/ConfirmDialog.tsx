import { ReactNode, useEffect } from "react";
import { BTN_CANCEL } from "@/features/board/buttonClass";

interface ConfirmDialogProps {
  title: string;
  onCancel: () => void;
  children: ReactNode;
  /** 취소 버튼 오른쪽에 붙는 동작 버튼들 */
  actions: ReactNode;
}

const ConfirmDialog = ({ title, onCancel, children, actions }: ConfirmDialogProps) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="board-dialog-title"
        className="w-full max-w-[420px] rounded-md border border-border2 bg-board-dialog p-5 sm:p-6"
      >
        <h2 id="board-dialog-title" className="mb-3 text-[17px] font-bold text-landing-heading">
          {title}
        </h2>
        {children}
        <div className="flex flex-wrap justify-end gap-1.5">
          <button type="button" onClick={onCancel} className={`${BTN_CANCEL} px-3.5 py-2`}>
            취소
          </button>
          {actions}
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
