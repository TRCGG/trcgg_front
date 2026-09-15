// apiService.ts — axios 기반 HTTP 클라이언트

import axios, { AxiosInstance, AxiosRequestConfig, isAxiosError } from "axios";
import { ApiError, toApiError } from "@/services/apiError";

// 기본 요청 타임아웃(ms). 이 시간 안에 응답이 없으면 요청을 취소해 무한 대기(펜딩)를 막는다.
const DEFAULT_TIMEOUT_MS = 30000;

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

/** 응답 본문을 그대로 돌려준다. 실패는 인터셉터가 이미 ApiError로 throw했다. */
const send = async <T>(client: AxiosInstance, config: AxiosRequestConfig): Promise<T> => {
  const response = await client.request<T>(config);
  // 204 No Content에서 axios는 빈 문자열을 주므로 null로 맞춘다.
  return (response.status === 204 ? null : response.data) as T;
};

/**
 * 성공 응답에서 백엔드 봉투({ status, message, data })를 벗겨 페이로드만 남긴다.
 *
 * 봉투의 status·message를 읽는 호출부가 한 곳도 없어, 서비스 함수는 이 함수를 거쳐
 * 실제 데이터 타입을 그대로 노출한다. 그래야 훅의 반환 타입이 컴포넌트 prop 타입과 맞는다.
 */
const unwrap = async <E extends { data: unknown }>(request: Promise<E>): Promise<E["data"]> => {
  const body = await request;
  // React Query는 undefined를 쿼리 결과로 받으면 예외를 던진다. 봉투에 data가 빠져 있을 때
  // "데이터 없음"이 "요청 실패"로 둔갑하지 않도록 null로 맞춘다.
  return (body?.data ?? null) as E["data"];
};

const createApiService = (baseUrl?: string) => {
  if (!baseUrl) {
    throw new Error("API base URL is undefined. Check your environment variables.");
  }

  const client = createClient(baseUrl);

  return {
    get<T>(endpoint: string, params?: Record<string, string>, headers?: Record<string, string>) {
      return send<T>(client, { method: "GET", url: endpoint, params, headers });
    },

    post<T>(endpoint: string, body?: unknown, config?: RequestConfig) {
      return send<T>(client, { method: "POST", url: endpoint, data: body, ...config });
    },

    put<T>(endpoint: string, body?: unknown, config?: RequestConfig) {
      return send<T>(client, { method: "PUT", url: endpoint, data: body, ...config });
    },

    patch<T>(endpoint: string, body?: unknown, config?: RequestConfig) {
      return send<T>(client, { method: "PATCH", url: endpoint, data: body, ...config });
    },

    /** DELETE는 본문을 받는다 — 삭제 확인값(confirmName 등)을 싣는 엔드포인트가 있다. */
    delete<T>(endpoint: string, options?: RequestConfig & { body?: unknown }) {
      const { body, ...config } = options ?? {};
      return send<T>(client, { method: "DELETE", url: endpoint, data: body, ...config });
    },
  };
};

type ApiService = ReturnType<typeof createApiService>;

export { createApiService, unwrap };
export type { ApiService, RequestConfig };
