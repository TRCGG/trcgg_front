import { useQuery } from "@tanstack/react-query";
import { PostDetail } from "@/data/types/post";
import { getPost } from "@/services/post";
import { isApiError } from "@/services/apiError";

const usePostDetail = (id: number | null) => {
  const { data, error, isError, isLoading } = useQuery<PostDetail>({
    queryKey: ["post", "detail", id],
    queryFn: () => getPost(id as number),
    enabled: id !== null,
    staleTime: 60 * 1000,
  });

  return {
    post: data ?? null,
    // 초안·삭제된 글도 404라 "없음"과 "비공개"를 구분하지 않는다.
    isNotFound: isApiError(error) && error.status === 404,
    isError,
    isLoading,
  };
};

export default usePostDetail;
