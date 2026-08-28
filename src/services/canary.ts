import api from "@/services/index";

export const getCanary = async () => {
  try {
    return await api.get("/api/canary");
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
};
