import type { NextPage } from "next";
import React, { useState, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import SummonerPageHeader from "@/components/layout/SummonerPageHeader";
import TitleBox from "@/components/ui/TitleBox";
import TextCard from "@/components/ui/TextCard";
import useUserSearchController from "@/hooks/searchUserList/useUserSearchController";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import { uploadReplays, getReplayList } from "@/services/replay";
import { ApiResponse } from "@/services/apiService";
import {
  ReplayUploadData,
  ReplayUploadFailed,
  ReplayUploadSuccess,
  ReplayFailReason,
  ReplayListResponse,
} from "@/data/types/replay";
import { formatTimeAgo } from "@/utils/parseTime";

const FAIL_REASON_LABEL: Record<ReplayFailReason, string> = {
  invalid_extension: ".rofl 파일이 아닙니다",
  invalid_format: "유효하지 않은 리플레이 파일입니다",
  parse_failed: "리플레이 데이터 파싱에 실패했습니다",
  duplicate: "이미 등록된 리플레이입니다",
  save_failed: "저장에 실패했습니다",
};

const Replay: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<ReplayUploadData | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { guildId, guilds, isLoggedIn, username, handleGuildChange } = useGuildManagement();
  const {
    data: userSearchData,
    isLoading,
    isError,
    handleSearchButtonClick,
  } = useUserSearchController(searchTerm, guildId);

  const selectedGuild = guilds.find((guild) => guild.id === guildId);
  const clanName = selectedGuild?.name || "클랜";

  const {
    data: replayListData,
    isLoading: isLoadingList,
    refetch: refetchList,
  } = useQuery<ApiResponse<ReplayListResponse>>({
    queryKey: ["replayList", guildId],
    queryFn: () => getReplayList(guildId),
    enabled: !!guildId && isLoggedIn,
    staleTime: 60 * 1000,
  });

  const replayList = replayListData?.data?.data?.slice(0, 10) ?? [];

  const totalSizeMB = (files.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024).toFixed(1);

  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const roflFiles = Array.from(incoming).filter((f) => f.name.toLowerCase().endsWith(".rofl"));
    if (roflFiles.length === 0) return;
    setFiles((prev) => {
      const existingNames = new Set(prev.map((f) => f.name));
      return [...prev, ...roflFiles.filter((f) => !existingNames.has(f.name))];
    });
    setUploadResult(null);
    setUploadError(null);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode((prev) => (prev === code ? null : prev)), 1500);
    } catch {
      setCopiedCode(null);
    }
  };

  const handleUpload = async () => {
    if (!guildId || files.length === 0) return;
    setIsUploading(true);
    setUploadResult(null);
    setUploadError(null);
    try {
      const result = await uploadReplays(guildId, files, username ?? "");
      setUploadResult(result.data);
      setFiles([]);
      await refetchList();
    } catch (err: unknown) {
      const status =
        err && typeof err === "object" && "status" in err ? (err as { status: number }).status : 0;
      if (status === 401) setUploadError("인증에 실패했습니다. 다시 로그인해주세요.");
      else if (status === 403) setUploadError("리플레이 업로드 권한이 없습니다.");
      else if (status === 400)
        setUploadError("요청이 올바르지 않습니다. 길드 정보를 확인해주세요.");
      else setUploadError("업로드 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full md:max-w-[1080px] mx-auto">
      <SummonerPageHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearchButtonClick}
        isLoading={isLoading}
        isError={isError}
        users={userSearchData?.data}
        guilds={guilds}
        selectedGuildId={guildId}
        onGuildChange={handleGuildChange}
        username={username}
        isLoggedIn={isLoggedIn}
      />

      <TitleBox
        className="mt-10"
        clanName={clanName}
        title="리플레이 업로드"
        description="내전 리플레이 파일(.rofl)을 업로드하면 자동으로 전적에 반영됩니다."
      />

      {/* 콘솔: 업로드(좌) + 최근 업로드(우) */}
      <div className="mt-4 mb-10 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 items-start">
        {/* 파일 업로드 패널 */}
        <section className="bg-darkBg2 border border-border2 rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border2">
            <span className="w-[22px] h-[22px] rounded-md grid place-items-center bg-blueText/10 text-blueText">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
            </span>
            <h2 className="text-sm font-bold text-primary1">파일 업로드</h2>
          </div>

          <div className="p-4 flex flex-col gap-3.5">
            {(() => {
              if (!isLoggedIn) return <TextCard text="로그인 후 이용해주세요" />;
              if (guilds.length === 0) return <TextCard text="소속된 클랜이 없습니다" />;
              return (
                <>
                  {/* 드래그 앤 드롭 존 */}
                  <div
                    role="button"
                    tabIndex={0}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                    className={`flex flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed py-9 px-5 cursor-pointer transition-colors duration-150 select-none text-center ${
                      isDragging
                        ? "border-blueText bg-blueHover"
                        : "border-border1 hover:border-blueText2 hover:bg-rankBg3"
                    }`}
                  >
                    <span
                      className={`w-[52px] h-[52px] rounded-2xl grid place-items-center transition-colors ${
                        isDragging ? "bg-blueText/20 text-blueText" : "bg-blueText/10 text-primary2"
                      }`}
                    >
                      <svg
                        className="w-[26px] h-[26px]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                        />
                      </svg>
                    </span>
                    <p className={`text-sm ${isDragging ? "text-blueText" : "text-primary1"}`}>
                      파일을 끌어다 놓거나{" "}
                      <span className="text-blueText underline underline-offset-2">
                        클릭하여 선택
                      </span>
                      하세요
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-primary3 border border-border1 rounded-full px-2.5 py-[3px]">
                      <b className="text-blueText2 font-bold">.rofl</b> 파일만 업로드 가능
                    </span>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".rofl"
                    multiple
                    className="hidden"
                    onChange={(e) => addFiles(e.target.files)}
                  />

                  {/* 선택된 파일 목록 */}
                  {files.length > 0 && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary2">선택된 파일</span>
                        <button
                          type="button"
                          onClick={() => setFiles([])}
                          className="text-xs text-primary3 hover:text-redText transition-colors"
                        >
                          모두 지우기
                        </button>
                      </div>

                      <ul className="flex flex-col gap-2">
                        {files.map((file, index) => (
                          <li
                            key={file.name}
                            className="flex items-center gap-2.5 bg-rankBg2 border border-cardBorder rounded-lg px-3 py-2.5"
                          >
                            <span className="shrink-0 text-[9px] font-extrabold tracking-wide leading-none text-yellow bg-yellow/10 border border-yellow/25 rounded-[5px] px-1.5 py-1">
                              ROFL
                            </span>
                            <span className="flex-1 min-w-0 truncate text-[13px] text-primary1">
                              {file.name}
                            </span>
                            <span className="shrink-0 text-[11px] text-primary2 tabular-nums">
                              {(file.size / 1024 / 1024).toFixed(1)} MB
                            </span>
                            <button
                              type="button"
                              aria-label={`${file.name} 제거`}
                              onClick={() => removeFile(index)}
                              className="shrink-0 w-6 h-6 rounded-md grid place-items-center text-primary3 hover:text-redText hover:bg-redText/10 transition-colors"
                            >
                              <svg
                                className="w-[15px] h-[15px]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </li>
                        ))}
                      </ul>

                      {/* 요약 + 업로드 버튼 */}
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-primary3 tabular-nums">
                          총 <b className="text-primary2 font-bold">{files.length}개</b> ·{" "}
                          {totalSizeMB} MB
                        </span>
                        <button
                          type="button"
                          onClick={handleUpload}
                          disabled={files.length === 0 || isUploading}
                          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-150 ${
                            files.length === 0 || isUploading
                              ? "bg-rankBg1 text-primary2 cursor-not-allowed opacity-50"
                              : "bg-bluePrimary hover:opacity-90 text-white"
                          }`}
                        >
                          {isUploading ? (
                            <>
                              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v8H4z"
                                />
                              </svg>
                              업로드 중...
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                                />
                              </svg>
                              업로드 ({files.length})
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  )}

                  {/* 업로드 오류 */}
                  {uploadError && (
                    <div className="flex items-center gap-2 bg-redDarken border border-redLighten rounded-md px-4 py-3 text-sm text-redText">
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                      </svg>
                      {uploadError}
                    </div>
                  )}

                  {/* 업로드 결과 */}
                  {uploadResult && (
                    <div className="flex flex-col gap-3">
                      {uploadResult.succeeded.length > 0 && (
                        <div className="flex flex-col gap-1.5">
                          <p className="text-xs font-bold text-neonGreen">
                            성공 ({uploadResult.succeeded.length}건)
                          </p>
                          {uploadResult.succeeded.map((item: ReplayUploadSuccess) => (
                            <div
                              key={item.replayCode}
                              className="flex items-center justify-between gap-2.5 bg-rankBg2 border border-border1 rounded-md px-3 py-2 text-sm"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <svg
                                  className="w-4 h-4 text-neonGreen flex-shrink-0"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2.5}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 12.75l6 6 9-13.5"
                                  />
                                </svg>
                                <span className="text-primary1 truncate">{item.fileName}</span>
                              </div>
                              <span className="text-xs text-blueText2 font-mono flex-shrink-0">
                                {item.replayCode}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      {uploadResult.failed.length > 0 && (
                        <div className="flex flex-col gap-1.5">
                          <p className="text-xs font-bold text-redText">
                            실패 ({uploadResult.failed.length}건)
                          </p>
                          {uploadResult.failed.map((item: ReplayUploadFailed) => (
                            <div
                              key={item.fileName}
                              className="flex items-center justify-between gap-2.5 bg-redDarken border border-redLighten rounded-md px-3 py-2 text-sm"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <svg
                                  className="w-4 h-4 text-redText flex-shrink-0"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2.5}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                                <span className="text-primary1 truncate">{item.fileName}</span>
                              </div>
                              <span className="text-xs text-redText flex-shrink-0">
                                {item.reason.includes("duplicate")
                                  ? "이미 등록된 리플레이 데이터입니다"
                                  : FAIL_REASON_LABEL[item.reason]}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </section>

        {/* 최근 업로드 패널 */}
        <section className="bg-darkBg2 border border-border2 rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border2">
            <span className="w-[22px] h-[22px] rounded-md grid place-items-center bg-blueText/10 text-blueText">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
                />
              </svg>
            </span>
            <h2 className="text-sm font-bold text-primary1">최근 업로드</h2>
            <span className="ml-auto inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full bg-rankBg1 border border-border1 text-[11px] text-primary2 tabular-nums">
              {replayList.length}
            </span>
          </div>

          <div className="px-3 py-1.5">
            {isLoadingList && (
              <div className="text-center py-10 text-sm text-primary2">데이터를 불러오는 중...</div>
            )}

            {!isLoadingList && replayList.length === 0 && (
              <div className="text-center py-10 text-sm text-primary2">
                업로드된 리플레이가 없습니다
              </div>
            )}

            {!isLoadingList && replayList.length > 0 && (
              <ul className="flex flex-col">
                {replayList.map((log) => (
                  <li
                    key={log.replayCode}
                    className="flex items-center gap-3 px-1.5 py-2.5 border-b border-rankBg3 last:border-0"
                  >
                    <div className="min-w-0 flex-1 flex flex-col gap-0.5">
                      <span className="text-[13px] text-primary1 truncate">{log.createUser}</span>
                      <span className="text-[11px] text-blueText2 font-mono truncate">
                        {log.replayCode}
                      </span>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <span className="text-[11px] text-primary3 tabular-nums">
                        {formatTimeAgo(log.createDate)}
                      </span>
                      <button
                        type="button"
                        aria-label="리플레이 코드 복사"
                        onClick={() => handleCopy(log.replayCode)}
                        className="w-[26px] h-[26px] rounded-md grid place-items-center border border-border1 text-primary3 hover:text-blueText hover:border-blueText2 transition-colors"
                      >
                        {copiedCode === log.replayCode ? (
                          <svg
                            className="w-3.5 h-3.5 text-neonGreen"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-[13px] h-[13px]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <rect x="9" y="9" width="11" height="11" rx="2" />
                            <path d="M5 15V5a2 2 0 012-2h10" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Replay;
