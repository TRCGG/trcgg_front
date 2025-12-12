import React from "react";
import Modal from "@/components/modal/Modal";
import { logout } from "@/services/auth";

interface NoGuildModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NoGuildModal = ({ isOpen, onClose }: NoGuildModalProps) => {
  const handleDiscordInquiry = () => {
    // 디스코드 채널 URL로 이동
    window.open("https://kr.dicoall.com/server/1081871833747427328", "_blank");
  };

  const handleClose = async () => {
    // 백엔드 로그아웃 API 호출
    await logout();
    onClose();

    // 페이지 새로고침으로 로그아웃 상태 반영
    window.location.href = "/";
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold mb-2">서비스에 등록된 길드를 찾을 수 없습니다</h2>
        <p className="text-gray-300 leading-relaxed">
          현재 이용 중인 클랜이 없거나, 시스템에 아직 등록되지 않은 상태입니다.
        </p>
        <p className="text-gray-300 leading-relaxed">
          길드 등록이나 문의가 필요하시면 아래 디스코드 채널로 들어오셔서 문의를 남겨주세요.
          <br />
          확인 후 빠르게 안내드리겠습니다.
        </p>
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={handleDiscordInquiry}
            className="flex-1 bg-blueText hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
          >
            디스코드 문의하기
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 bg-darkBg2 hover:bg-grayHover text-white py-2 px-4 rounded border border-border2 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default NoGuildModal;
