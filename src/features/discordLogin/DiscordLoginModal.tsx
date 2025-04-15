import React, { useEffect } from "react";
import Modal from "@/components/modal/Modal";

interface Props {
  isOpen: boolean;
  close: () => void;
  onSave: (value: string) => void;
}

const DiscordLoginModal = ({ isOpen, close, onSave }: Props) => {
  const [guildId, setGuildId] = React.useState<string>("");

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem("guildId");
      if (saved) setGuildId(saved);
    } else {
      setGuildId("");
    }
  }, [isOpen]);

  const handleSave = () => {
    const encoded = btoa(guildId); // Base64 인코딩
    localStorage.setItem("guildId", encoded);
    onSave(encoded);
    close();
  };

  return (
    <Modal isOpen={isOpen} onClose={close}>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">디스코드 로그인</h2>
        <p>디스코드의 길드 코드를 입력해주세요.</p>
        <input
          className="bg-darkBg2 p-2 rounded outline-none"
          value={guildId}
          onChange={(e) => setGuildId(e.target.value)}
        />
        <button
          type="button"
          onClick={handleSave}
          className="bg-[#5865F2] hover:bg-[#4752C4] text-white py-2 px-5 mx-auto rounded"
        >
          저장
        </button>
      </div>
    </Modal>
  );
};

export default DiscordLoginModal;
