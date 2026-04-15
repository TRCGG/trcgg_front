import api from "@/services/index";
import { ApiResponse } from "@/services/apiService";
import { ReplayUploadResponse, ReplayListResponse } from "@/data/types/replay";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const uploadReplays = async (
  guildId: string,
  files: File[]
): Promise<ReplayUploadResponse> => {
  const formData = new FormData();
  formData.append("guildId", guildId);
  files.forEach((file) => formData.append("files", file));

  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/api/replays/web`, {
    method: "POST",
    headers,
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw Object.assign(new Error(errorData.message || `Error: ${response.status}`), {
      status: response.status,
    });
  }

  return response.json();
};

export const getReplayList = async (guildId: string): Promise<ApiResponse<ReplayListResponse>> => {
  try {
    return await api.get(`/api/replays/${guildId}`);
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
};
