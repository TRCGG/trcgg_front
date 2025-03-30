type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

class ApiService {
  private static instance: ApiService;

  private baseUrl: string;

  private constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public static getInstance(baseUrl: string): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService(baseUrl);
    }
    return ApiService.instance;
  }

  private async request<T>(endpoint: string, options: RequestOptions): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = new Headers({
      "Content-Type": "application/json",
      ...options.headers,
    });

    try {
      const response = await fetch(url, {
        method: options.method,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      const data = await response.json();

      return {
        data: response.ok ? data : null,
        error: response.ok ? null : data.message || "An error occurred",
        status: response.status,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "An unknown error occurred",
        status: 500,
      };
    }
  }

  public async get<T>(
    endpoint: string | number,
    params?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const finalEndpoint = typeof endpoint === "string" ? endpoint : `/${endpoint}`;
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.request<T>(`${finalEndpoint}${queryString}`, { method: "GET" });
  }

  public async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "POST", body });
  }

  public async put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "PUT", body });
  }

  public async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  public async patch<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "PATCH", body });
  }
}

// API 요청 팩토리
const createApiRequest = <T>(endpoint: string) => {
  const apiService = ApiService.getInstance("https://api.example.com");

  return {
    get: (params?: Record<string, string>) => apiService.get<T>(endpoint, params),
    post: (body: unknown) => apiService.post<T>(endpoint, body),
    put: (body: unknown) => apiService.put<T>(endpoint, body),
    delete: () => apiService.delete<T>(endpoint),
    patch: (body: unknown) => apiService.patch<T>(endpoint, body),
  };
};

export { ApiService, createApiRequest };
