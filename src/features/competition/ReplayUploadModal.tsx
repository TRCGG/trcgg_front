import React, { useRef, useState } from "react";
import Modal from "@/components/modal/Modal";
import { uploadReplays } from "@/services/replay";
import { sliceRoflForUpload } from "@/utils/rofl";
import { ReplayUploadData, ReplayUploadFailed, ReplayUploadSuccess } from "@/data/types/replay";
import {
  EXCLUDE_LABEL,
  ExcludedFile,
  FAIL_REASON_LABEL,
  MAX_FILES_PER_REQUEST,
  UploadUnit,
  buildUploadBatches,
  classifyIncoming,
  uploadErrorMessage,
} from "@/utils/replayUpload";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  guildId: string;
  competitionId: number;
  competitionName: string;
  /** 백엔드는 진행중 대회에만 경기를 붙인다(competition-not-open). */
  isInProgress: boolean;
  nick: string;
  onUploaded: () => void;
}

/** 2=스크림 / 3=본경기. 일반내전(1)은 대회에 붙지 않으므로 고를 수 없다. */
const KINDS: { value: "2" | "3"; label: string }[] = [
  { value: "2", label: "스크림" },
  { value: "3", label: "★ 본경기" },
];

const ReplayUploadModal = ({
  isOpen,
  onClose,
  guildId,
  competitionId,
  competitionName,
  isInProgress,
  nick,
  onUploaded,
}: Props) => {
  const [gameType, setGameType] = useState<"2" | "3" | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [excluded, setExcluded] = useState<ExcludedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [result, setResult] = useState<ReplayUploadData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setGameType(null);
    setFiles([]);
    setExcluded([]);
    setIsDragging(false);
    setProgress(null);
    setResult(null);
    setError(null);
  };

  const handleClose = () => {
    if (isUploading) return;
    reset();
    onClose();
  };

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const taken = new Set([...files.map((f) => f.name), ...excluded.map((e) => e.name)]);
    const { valid, excluded: rejected } = classifyIncoming(incoming, taken);
    if (valid.length > 0) {
      setFiles((prev) => [...prev, ...valid]);
      setResult(null);
      setError(null);
    }
    if (rejected.length > 0) setExcluded((prev) => [...prev, ...rejected]);
  };

  const handleUpload = async () => {
    if (!gameType || files.length === 0 || isUploading) return;
    setIsUploading(true);
    setResult(null);
    setError(null);
    const total = files.length;
    setProgress({ done: 0, total });

    const units: UploadUnit[] = await Promise.all(
      files.map(async (file) => ({ original: file, upload: await sliceRoflForUpload(file) }))
    );

    const succeeded: ReplayUploadSuccess[] = [];
    const failed: ReplayUploadFailed[] = [];
    let done = 0;
    let errorMsg: string | null = null;

    // eslint-disable-next-line no-restricted-syntax
    for (const batch of buildUploadBatches(units)) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const res = await uploadReplays(
          guildId,
          batch.map((unit) => unit.upload),
          nick,
          { gameType, competitionId }
        );
        succeeded.push(...(res.data?.succeeded ?? []));
        failed.push(...(res.data?.failed ?? []));
        done += batch.length;
        setProgress({ done, total });
        setResult({ succeeded: [...succeeded], failed: [...failed] });
        setFiles((prev) => prev.filter((f) => !batch.some((unit) => unit.original === f)));
      } catch (err: unknown) {
        errorMsg = uploadErrorMessage(err);
        break;
      }
    }

    if (errorMsg) setError(errorMsg);
    else setExcluded([]);

    setProgress(null);
    setIsUploading(false);
    if (succeeded.length > 0) onUploaded();
  };

  const unassigned = (result?.succeeded ?? []).filter(
    (item) => item.teamAssignment?.status === "unassigned"
  );
  const canUpload = isInProgress && !!gameType && files.length > 0 && !isUploading;

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="flex w-[300px] flex-col gap-4 text-left sm:w-[460px]">
        <div>
          <h2 className="text-base font-bold text-primary1">{competitionName} · 리플레이 업로드</h2>
          <p className="mt-1 text-xs text-primary2">
            이 대회에 귀속됩니다. 유형만 고르면 대회는 자동 지정됩니다.
          </p>
        </div>

        {!isInProgress && (
          <p className="rounded border border-yellow/30 bg-yellow/[0.08] px-3 py-2.5 text-xs leading-relaxed text-yellow">
            진행중인 대회에만 경기를 올릴 수 있습니다. 대회를 시작한 뒤 다시 시도해 주세요.
          </p>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold text-primary1">경기 유형</span>
            <span className="text-[11px] font-bold text-redText">필수</span>
          </div>
          <div className="flex gap-2">
            {KINDS.map((kind) => (
              <button
                key={kind.value}
                type="button"
                onClick={() => setGameType(kind.value)}
                className={`flex-1 rounded border py-2.5 text-[13px] ${
                  gameType === kind.value
                    ? "border-blueText bg-blueText/10 text-primary1"
                    : "border-border2 bg-darkBg2 text-primary2 hover:text-primary1"
                }`}
              >
                {kind.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            addFiles(e.dataTransfer.files);
          }}
          className={`flex flex-col items-center gap-1.5 rounded border border-dashed px-4 py-7 ${
            isDragging ? "border-blueText bg-blueText/[0.06]" : "border-border2 bg-darkBg2"
          }`}
        >
          <span className="text-[13px] text-primary2">
            {files.length > 0
              ? `${files.length}개 선택됨 — 더 추가하려면 클릭하거나 끌어다 놓으세요`
              : "리플레이 파일을 끌어다 놓거나 클릭해 선택하세요"}
          </span>
          <span className="text-[11px] text-primary3">최대 {MAX_FILES_PER_REQUEST}개 · .rofl</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".rofl"
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />

        {files.length > 0 && (
          <div className="flex max-h-[140px] flex-col overflow-y-auto rounded border border-border2 bg-darkBg2">
            {files.map((file, index) => (
              <div
                key={file.name}
                className="flex items-center gap-2 border-b border-cardBorder px-3 py-2 last:border-0"
              >
                <span className="min-w-0 flex-1 truncate text-xs text-primary1">{file.name}</span>
                <span className="shrink-0 text-[11px] text-primary3">
                  {(file.size / 1024 / 1024).toFixed(1)}MB
                </span>
                <button
                  type="button"
                  onClick={() => setFiles((prev) => prev.filter((_, i) => i !== index))}
                  className="shrink-0 text-sm text-primary3 hover:text-redText"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {excluded.length > 0 && (
          <div className="flex flex-col gap-1 rounded border border-border2 bg-darkBg2 px-3 py-2.5">
            {excluded.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-[11px]">
                <span className="min-w-0 flex-1 truncate text-primary2">{item.name}</span>
                <span className="shrink-0 text-redText">{EXCLUDE_LABEL[item.reason]}</span>
              </div>
            ))}
          </div>
        )}

        <p className="rounded border border-border2 bg-darkBg2 px-3 py-2.5 text-[11px] leading-relaxed text-primary2">
          경기 참가자를 <span className="text-primary1">대회 로스터</span>와 대조해 팀에 자동
          귀속합니다. 판정되지 않은 경기는 업로드 후 알려드립니다.
        </p>

        {error && <p className="text-xs text-redText">{error}</p>}

        {result && (
          <div className="flex flex-col gap-1.5 rounded border border-border2 bg-darkBg2 px-3 py-2.5 text-[11px]">
            <span className="text-primary1">
              성공 {result.succeeded.length}건 · 실패 {result.failed.length}건
            </span>
            {result.failed.map((item) => (
              <div key={item.fileName} className="flex items-center gap-2">
                <span className="min-w-0 flex-1 truncate text-primary2">{item.fileName}</span>
                <span className="shrink-0 text-redText">{FAIL_REASON_LABEL[item.reason]}</span>
              </div>
            ))}
            {unassigned.length > 0 && (
              <span className="mt-0.5 leading-relaxed text-yellow">
                {unassigned.length}건은 참가자가 대회 로스터와 맞지 않아 팀이 정해지지 않았습니다.
                경기 탭에서 팀을 직접 지정해 주세요.
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={isUploading}
            className="h-9 rounded border border-border2 bg-darkBg2 px-4 text-[13px] text-primary2 disabled:opacity-40"
          >
            {result ? "닫기" : "취소"}
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!canUpload}
            className="ml-auto h-9 rounded bg-bluePrimary px-5 text-[13px] text-white disabled:opacity-40"
          >
            {progress ? `업로드 중 ${progress.done}/${progress.total}` : "업로드"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ReplayUploadModal;
