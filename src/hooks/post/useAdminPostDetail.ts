import { useQuery } from "@tanstack/react-query";
import { AdminPostDetail } from "@/data/types/post";
import { getAdminPost } from "@/services/post";
import { isApiError } from "@/services/apiError";

const useAdminPostDetail = (id: number | null, enabled: boolean) => {
  const { data, error, isError, isLoading } = useQuery<AdminPostDetail>({
    queryKey: ["adminPost", "detail", id],
    queryFn: () => getAdminPost(id as number),
    enabled: enabled && id !== null,
  });

  return {
    post: data ?? null,
    isNotFound: isApiError(error) && error.status === 404,
    isError,
    isLoading,
  };
};

export default useAdminPostDetail;
