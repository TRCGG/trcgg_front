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
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    const { method, headers = {}, body, params } = options;

    let url = `${this.baseUrl}${endpoint}`;

    // Handle query parameters for GET requests
    if (method === "GET" && params) {
      const queryParams = new URLSearchParams(params).toString();
      url += `?${queryParams}`;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }

      return {
        data,
        error: null,
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

  public async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET", params });
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
//
// // Usage example
// const api = ApiService.getInstance("https://api.example.com");
//
// // GET request with query parameters
// const getUsers = async () => {
//   const response = await api.get<User[]>("/users", { page: "1", limit: "10" });
//   if (response.error) {
//     console.error("Error fetching users:", response.error);
//   } else {
//     console.log("Users:", response.data);
//   }
// };
//
// // POST request
// const createUser = async (userData: User) => {
//   const response = await api.post<User>("/users", userData);
//   if (response.error) {
//     console.error("Error creating user:", response.error);
//   } else {
//     console.log("Created user:", response.data);
//   }
// };
