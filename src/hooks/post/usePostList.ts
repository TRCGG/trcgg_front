import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { PostListItem, PostListQuery, PostPage } from "@/data/types/post";
import { getPosts } from "@/services/post";

const usePostList = (query: PostListQuery, enabled = true) => {
  const { data, isError, isLoading, isPlaceholderData } = useQuery<PostPage<PostListItem>>({
    queryKey: ["post", "list", query],
    queryFn: () => getPosts(query),
    enabled,
    staleTime: 60 * 1000,
    // 탭·페이지를 넘기는 동안 건수·페이저가 0으로 튀지 않게 이전 값을 유지한다. 목록은 스피너로 가린다.
    placeholderData: keepPreviousData,
  });

  return {
    posts: data?.items ?? [],
    totalCount: data?.totalCount ?? 0,
    totalPages: data?.totalPages ?? 0,
    isError,
    isLoading,
    isPlaceholderData,
  };
};

export default usePostList;
