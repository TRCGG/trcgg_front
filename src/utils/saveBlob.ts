const saveBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  // 클릭 직후 해제하면 일부 브라우저에서 다운로드가 시작되기 전에 URL이 사라진다
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

export default saveBlob;
