import { createApiService } from "@/services/apiService";

const api = createApiService(process.env.NEXT_PUBLIC_API_BASE_URL!);

export default api;
