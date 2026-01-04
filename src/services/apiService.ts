// apiService.ts

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string>;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
  headers?: Headers;
}

// 인터셉터 타입 정의
type RequestInterceptor = (
  url: string,
  options: RequestOptions
) => { url: string; options: RequestOptions };

type ResponseInterceptor = (
  response: Response,
  data: unknown
) => Promise<{ response: Response; data: unknown }>;

type ErrorInterceptor = (
  error: unknown,
  requestOptions: { url: string; options: RequestOptions }
) => Promise<unknown>;

class ApiService {
  private static instance: ApiService;

  private baseUrl: string;

  private requestInterceptors: RequestInterceptor[] = [];

  private responseInterceptors: ResponseInterceptor[] = [];

  private errorInterceptors: ErrorInterceptor[] = [];

  private constructor(baseUrl: string) {
    this.baseUrl = baseUrl;

    // 기본 인터셉터 설정
    this.setupDefaultInterceptors();
  }

  public static getInstance(baseUrl: string): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService(baseUrl);
    }
    return ApiService.instance;
  }

  // 기본 인터셉터 설정
  private setupDefaultInterceptors(): void {
    // 요청 전처리: 인증 토큰 추가
    this.addRequestInterceptor((url, options) => {
      // 로컬 스토리지에서 토큰 가져오기
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

      if (token) {
        // eslint-disable-next-line no-param-reassign
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      return { url, options };
    });

    // 응답 후처리: 토큰 갱신
    this.addResponseInterceptor(async (response, data) => {
      // 새 토큰이 응답에 포함되어 있는 경우 저장
      const newToken = response.headers.get("x-auth-token");
      if (newToken && typeof window !== "undefined") {
        localStorage.setItem("authToken", newToken);
      }

      return { response, data };
    });

    // 에러 처리: 401 에러 시 로그아웃
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.addErrorInterceptor(async (error, requestOptions) => {
      if (error && typeof error === "object" && "status" in error && error.status === 401) {
        // 토큰 만료 또는 인증 오류
        if (typeof window !== "undefined") {
          localStorage.removeItem("authToken");
          // 로그인 페이지로 리다이렉트 등의 처리
          // window.location.href = "/login";
        }
      }

      throw error; // 에러를 다시 던져서 호출자가 처리할 수 있게 함
    });
  }

  // 요청 인터셉터 추가
  public addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  // 응답 인터셉터 추가
  public addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  // 에러 인터셉터 추가
  public addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  // 요청 인터셉터 실행
  private async applyRequestInterceptors(
    url: string,
    options: RequestOptions
  ): Promise<{ url: string; options: RequestOptions }> {
    let result = { url, options };

    // eslint-disable-next-line no-restricted-syntax
    for (const interceptor of this.requestInterceptors) {
      result = interceptor(result.url, result.options);
    }

    return result;
  }

  // 응답 인터셉터 실행
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async applyResponseInterceptors<T>(
    response: Response,
    data: unknown
  ): Promise<{ response: Response; data: unknown }> {
    let result = { response, data };

    // eslint-disable-next-line no-restricted-syntax
    for (const interceptor of this.responseInterceptors) {
      // eslint-disable-next-line no-await-in-loop
      result = await interceptor(result.response, result.data);
    }

    return result;
  }

  // 에러 인터셉터 실행
  private async applyErrorInterceptors(
    error: unknown,
    requestOptions: { url: string; options: RequestOptions }
  ): Promise<unknown> {
    let result = error;

    // eslint-disable-next-line no-restricted-syntax
    for (const interceptor of this.errorInterceptors) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await interceptor(result, requestOptions);
      } catch (e) {
        result = e;
      }
    }

    return result;
  }

  private async request<T>(endpoint: string, options: RequestOptions): Promise<ApiResponse<T>> {
    const { method, headers = {}, body, params } = options;

    let url = `${this.baseUrl}${endpoint}`;

    // Handle query parameters
    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });

      const queryString = queryParams.toString();
      if (queryString) {
        url += `${url.includes("?") ? "&" : "?"}${queryString}`;
      }
    }

    // 요청 옵션 생성
    const requestOptions: RequestOptions = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    };

    try {
      // 요청 인터셉터 적용
      const interceptedRequest = await this.applyRequestInterceptors(url, requestOptions);

      // fetch 요청 실행
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const response = await fetch(interceptedRequest.url, {
        ...interceptedRequest.options,
        credentials: "include", // 쿠키 전송을 위한 설정
      });

      // 응답 데이터 파싱
      let data: unknown;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // 응답 인터셉터 적용
      const interceptedResponse = await this.applyResponseInterceptors<T>(response, data);

      // 응답 처리
      if (response.ok) {
        return {
          data: interceptedResponse.data as T,
          error: null,
          status: response.status,
          headers: response.headers,
        };
      }
      const error = {
        data: null,
        error:
          typeof interceptedResponse.data === "object" &&
          interceptedResponse.data !== null &&
          "message" in interceptedResponse.data
            ? String(interceptedResponse.data.message)
            : `Error: ${response.status}`,
        status: response.status,
        headers: response.headers,
      };

      // 에러 인터셉터 적용
      await this.applyErrorInterceptors(error, {
        url: interceptedRequest.url,
        options: interceptedRequest.options,
      });

      return error;
    } catch (error: unknown) {
      // 네트워크 오류 등 예외 처리
      const errorResponse = {
        data: null,
        error: error instanceof Error ? error.message : "An unknown error occurred",
        status: 0,
      };

      // 에러 인터셉터 적용
      await this.applyErrorInterceptors(errorResponse, { url, options: requestOptions });

      return errorResponse;
    }
  }

  // GET 요청 메서드
  public async get<T>(
    endpoint: string,
    params?: Record<string, string>,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "GET",
      params,
      headers,
    });
  }

  // POST 요청 메서드
  public async post<T>(
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body,
      headers,
    });
  }

  // PUT 요청 메서드
  public async put<T>(
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body,
      headers,
    });
  }

  // DELETE 요청 메서드
  public async delete<T>(
    endpoint: string,
    params?: Record<string, string>,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      params,
      headers,
    });
  }

  // PATCH 요청 메서드
  public async patch<T>(
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body,
      headers,
    });
  }
}

// API 서비스 인스턴스 생성 함수
const createApiService = (baseUrl?: string): ApiService => {
  if (!baseUrl) {
    throw new Error("API base URL is undefined. Check your environment variables.");
  }
  return ApiService.getInstance(baseUrl);
};

export { ApiService, createApiService };
export type { ApiResponse };
