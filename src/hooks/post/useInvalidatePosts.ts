import { useQueryClient } from "@tanstack/react-query";

/** 글 하나를 고쳐도 공개 목록·상세와 관리 목록의 순서·건수가 함께 바뀌어 전부 무효화한다. */
const useInvalidatePosts = () => {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "post" || query.queryKey[0] === "adminPost",
    });
};

export default useInvalidatePosts;
