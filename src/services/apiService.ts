// apiService.ts — axios 기반 HTTP 클라이언트

import axios, { AxiosInstance, AxiosRequestConfig, isAxiosError } from "axios";
import { ApiError, toApiError } from "@/services/apiError";

// 기본 요청 타임아웃(ms). 이 시간 안에 응답이 없으면 요청을 취소해 무한 대기(펜딩)를 막는다.
const DEFAULT_TIMEOUT_MS = 30000;

/**
 * 성공 응답. 요청이 실패하면 이 타입을 반환하지 않고 ApiError를 throw한다.
 *
 * error/errorType 필드는 호출부 마이그레이션이 끝날 때까지 남겨둔 호환용이며 성공 시 항상 null이다.
 * 서비스 레이어가 ApiError를 잡아 이 형태로 되돌리고 있어, 호출부가 모두 예외 기반으로
 * 옮겨간 뒤 제거한다.
 */
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  errorType?: string | null;
  status: number;
}

interface RequestConfig {
  params?: Record<string, string>;
  headers?: Record<string, string>;
  /** 기본 타임아웃으로 부족한 요청(파일 업로드 등)에서만 덮어쓴다. */
  timeout?: number;
}

/** axios가 던진 것을 status·errorType을 보존한 ApiError로 정규화한다. */
const normalizeError = (error: unknown): ApiError => {
  if (!isAxiosError(error)) return toApiError(error);

  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    return new ApiError(408, null, "요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.");
  }

  const { response } = error;
  if (!response) {
    // 응답 자체를 받지 못한 경우 — 네트워크 단절, CORS, DNS 실패 등
    return new ApiError(0, null, error.message || "An unknown error occurred");
  }

  // 백엔드 에러는 Problem Details({ type, title, status, detail })로 오고 message가 없다.
  // message만 보던 탓에 모든 비즈니스 에러가 "Error: 4xx"로 뭉개졌어서 detail·type도 읽는다.
  const body =
    typeof response.data === "object" && response.data !== null
      ? (response.data as Record<string, unknown>)
      : null;

  const message = (() => {
    if (body && typeof body.message === "string") return body.message;
    if (body && typeof body.detail === "string") return body.detail;
    return `Error: ${response.status}`;
  })();

  return new ApiError(
    response.status,
    body && typeof body.type === "string" ? body.type : null,
    message
  );
};

const createClient = (baseUrl: string): AxiosInstance => {
  // Content-Type을 기본값으로 박지 않는다. axios가 본문 종류에 맞춰 정해주는데,
  // FormData일 때 multipart boundary를 붙이려면 이 자리가 비어 있어야 한다.
  const client = axios.create({
    baseURL: baseUrl,
    timeout: DEFAULT_TIMEOUT_MS,
    withCredentials: true, // 쿠키 전송
  });

  // 요청 전처리: 인증 토큰 추가
  client.interceptors.request.use((config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  });

  client.interceptors.response.use(
    // 응답 후처리: 새 토큰이 응답에 포함되어 있으면 저장
    (response) => {
      const newToken = response.headers["x-auth-token"];
      if (newToken && typeof window !== "undefined") {
        localStorage.setItem("authToken", newToken);
      }
      return response;
    },
    // 에러 처리: 401이면 만료된 토큰을 버리고, 항상 ApiError로 바꿔 다시 던진다
    (error: unknown) => {
      const apiError = normalizeError(error);
      if (apiError.status === 401 && typeof window !== "undefined") {
        localStorage.removeItem("authToken");
      }
      throw apiError;
    }
  );

  return client;
};

/** 성공 응답을 ApiResponse로 감싼다. 실패는 인터셉터가 이미 throw했으므로 여기 오지 않는다. */
const toApiResponse = async <T>(
  client: AxiosInstance,
  config: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await client.request<T>(config);
  return {
    // 204 No Content에서 axios는 빈 문자열을 주므로 null로 맞춘다.
    data: response.status === 204 ? null : response.data,
    error: null,
    errorType: null,
    status: response.status,
  };
};

/**
 * ApiError를 예전 { data, error } 형태로 되돌린다.
 *
 * 클라이언트가 throw로 바뀌면서 서비스 레이어의 catch가 비로소 실행되기 시작했다.
 * 호출부 100여 곳이 아직 이 형태를 읽고 있어 그 사이를 잇는 임시 어댑터이며,
 * 호출부가 모두 예외 기반으로 옮겨가면 이 함수와 ApiResponse의 error 필드는 함께 사라진다.
 *
 * status와 errorType을 반드시 실어 보낸다 — 화면 문구 매핑(competitionErrors.ts)이 둘 다 본다.
 */
const toErrorResponse = <T>(error: unknown): ApiResponse<T> => {
  const apiError = toApiError(error);
  return {
    data: null,
    error: apiError.message,
    errorType: apiError.errorType,
    status: apiError.status,
  };
};

const createApiService = (baseUrl?: string) => {
  if (!baseUrl) {
    throw new Error("API base URL is undefined. Check your environment variables.");
  }

  const client = createClient(baseUrl);

  return {
    get<T>(endpoint: string, params?: Record<string, string>, headers?: Record<string, string>) {
      return toApiResponse<T>(client, { method: "GET", url: endpoint, params, headers });
    },

    post<T>(endpoint: string, body?: unknown, config?: RequestConfig) {
      return toApiResponse<T>(client, { method: "POST", url: endpoint, data: body, ...config });
    },

    put<T>(endpoint: string, body?: unknown, config?: RequestConfig) {
      return toApiResponse<T>(client, { method: "PUT", url: endpoint, data: body, ...config });
    },

    patch<T>(endpoint: string, body?: unknown, config?: RequestConfig) {
      return toApiResponse<T>(client, { method: "PATCH", url: endpoint, data: body, ...config });
    },

    /** DELETE는 본문을 받는다 — 삭제 확인값(confirmName 등)을 싣는 엔드포인트가 있다. */
    delete<T>(endpoint: string, options?: RequestConfig & { body?: unknown }) {
      const { body, ...config } = options ?? {};
      return toApiResponse<T>(client, { method: "DELETE", url: endpoint, data: body, ...config });
    },
  };
};

type ApiService = ReturnType<typeof createApiService>;

export { createApiService, toErrorResponse };
export type { ApiResponse, ApiService, RequestConfig };
