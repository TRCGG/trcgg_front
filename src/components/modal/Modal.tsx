// components/ui/Modal.tsx
import { ReactNode, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <button
      type="button"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 cursor-default"
      onClick={onClose}
    >
      <button
        type="button"
        className="bg-darkBg1 text-white p-6 rounded-md shadow-xl min-w-[300px] relative cursor-default"
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 방지
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-4 text-2xl font-bold"
        >
          ×
        </button>
        {children}
      </button>
    </button>
  );
};

export default Modal;
