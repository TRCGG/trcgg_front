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

      {/* 파일 업로드 섹션 */}
      <section className="mt-4 bg-darkBg2 border border-border2 rounded p-4 space-y-4">
        <h2 className="text-sm font-medium text-primary1">파일 업로드</h2>

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
                className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-10 cursor-pointer transition-colors duration-150 select-none ${
                  isDragging
                    ? "border-blueText bg-blueHover"
                    : "border-border1 hover:border-blueText2 hover:bg-rankBg3"
                }`}
              >
                <svg
                  className={`w-10 h-10 ${isDragging ? "text-blueText" : "text-primary2"}`}
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
                <p className={`text-sm ${isDragging ? "text-blueText" : "text-primary2"}`}>
                  파일을 끌어다 놓거나{" "}
                  <span className="text-blueText2 underline underline-offset-2">클릭하여 선택</span>
                  하세요
                </p>
                <p className="text-xs text-primary2 opacity-60">.rofl 파일만 업로드 가능합니다</p>
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
                <ul className="space-y-1.5">
                  {files.map((file, index) => (
                    <li
                      key={file.name}
                      className="flex items-center justify-between bg-rankBg2 rounded px-3 py-2 text-sm"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <svg
                          className="w-4 h-4 text-blueText2 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                          />
                        </svg>
                        <span className="text-primary1 truncate">{file.name}</span>
                        <span className="text-primary2 text-xs flex-shrink-0">
                          ({(file.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        aria-label={`${file.name} 제거`}
                        onClick={() => removeFile(index)}
                        className="text-primary2 hover:text-redText transition-colors flex-shrink-0 ml-2"
                      >
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* 업로드 버튼 */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={files.length === 0 || isUploading}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    files.length === 0 || isUploading
                      ? "bg-rankBg1 text-primary2 cursor-not-allowed opacity-50"
                      : "bg-blueButton hover:bg-blueText2 text-white"
                  }`}
                >
                  {isUploading ? (
                    <span className="flex items-center gap-2">
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
                    </span>
                  ) : (
                    `업로드 (${files.length}개)`
                  )}
                </button>
              </div>

              {/* 업로드 오류 */}
              {uploadError && (
                <div className="flex items-center gap-2 bg-redDarken border border-redLighten rounded px-4 py-3 text-sm text-redText">
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
                <div className="space-y-3">
                  {uploadResult.succeeded.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-neonGreen">
                        성공 ({uploadResult.succeeded.length}건)
                      </p>
                      {uploadResult.succeeded.map((item: ReplayUploadSuccess) => (
                        <div
                          key={item.replayCode}
                          className="flex items-center justify-between bg-rankBg2 border border-border1 rounded px-3 py-2 text-sm"
                        >
                          <div className="flex items-center gap-2">
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
                            <span className="text-primary1">{item.fileName}</span>
                          </div>
                          <span className="text-xs text-blueText2 font-mono">
                            {item.replayCode}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {uploadResult.failed.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-redText">
                        실패 ({uploadResult.failed.length}건)
                      </p>
                      {uploadResult.failed.map((item: ReplayUploadFailed) => (
                        <div
                          key={item.fileName}
                          className="flex items-center justify-between bg-redDarken border border-redLighten rounded px-3 py-2 text-sm"
                        >
                          <div className="flex items-center gap-2">
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
                            <span className="text-primary1">{item.fileName}</span>
                          </div>
                          <span className="text-xs text-redText">
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
      </section>

      {/* 최근 업로드 섹션 */}
      <section className="mt-4 mb-10 bg-darkBg2 border border-border2 rounded p-4">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-medium text-primary1">최근 업로드</h2>
          <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-rankBg1 border border-border1 text-xs text-primary2">
            {replayList.length}
          </span>
        </div>

        {/* 헤더 */}
        <div className="grid grid-cols-[1.5rem_70px_60px_1fr] sm:grid-cols-[2rem_120px_90px_1fr] gap-2 px-3 py-2 text-xs text-primary2 border-b border-border2">
          <span>#</span>
          <span>게시자</span>
          <span>시간</span>
          <span>리플레이 코드</span>
        </div>

        {isLoadingList && (
          <div className="text-center py-8 text-sm text-primary2">데이터를 불러오는 중...</div>
        )}

        {!isLoadingList && replayList.length === 0 && (
          <div className="text-center py-8 text-sm text-primary2">업로드된 리플레이가 없습니다</div>
        )}

        {!isLoadingList && replayList.length > 0 && (
          <ul>
            {replayList.map((log, index) => (
              <li
                key={log.replayCode}
                className="grid grid-cols-[1.5rem_70px_60px_1fr] sm:grid-cols-[2rem_120px_90px_1fr] gap-2 items-center px-3 py-2.5 text-sm border-b border-border2 last:border-0 hover:bg-rankBg3 transition-colors"
              >
                <span className="text-primary2 text-xs">{index + 1}</span>
                <span className="text-primary1 truncate">{log.createUser}</span>
                <span className="text-primary2 text-xs">{formatTimeAgo(log.createDate)}</span>
                <span className="text-blueText2 font-mono text-xs truncate">{log.replayCode}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Replay;
