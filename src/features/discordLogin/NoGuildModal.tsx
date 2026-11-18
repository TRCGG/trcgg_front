import React from "react";
import Modal from "@/components/modal/Modal";
import { DISCORD_BOT_INSTALL_URL, DISCORD_SUPPORT_URL } from "@/constants/links";
import { logout } from "@/services/auth";

interface NoGuildModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NoGuildModal = ({ isOpen, onClose }: NoGuildModalProps) => {
  const handleBotInstall = () => {
    window.open(DISCORD_BOT_INSTALL_URL, "_blank");
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
          클랜 디스코드 서버에 GMOK 봇을 초대하면 클랜이 자동으로 등록됩니다.
          <br />
          봇을 초대한 뒤 다시 로그인해 주세요.
        </p>
        <p className="text-gray-300 leading-relaxed">
          봇 초대는 서버 관리 권한이 있어야 할 수 있습니다. 권한이 없다면 클랜 운영진에게 봇 초대를
          요청해 주세요.
        </p>
        <p className="text-sm text-gray-400">
          문의가 필요하시면{" "}
          <a
            href={DISCORD_SUPPORT_URL}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-white"
          >
            디스코드 지원 서버
          </a>
          로 연락해 주세요.
        </p>
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={handleBotInstall}
            className="flex-1 bg-blueText hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
          >
            봇 초대하기
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
