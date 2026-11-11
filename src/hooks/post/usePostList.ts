import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { PostListItem, PostListQuery, PostPage } from "@/data/types/post";
import { getPosts } from "@/services/post";

const usePostList = (query: PostListQuery, enabled = true) => {
  const { data, isError, isLoading } = useQuery<PostPage<PostListItem>>({
    queryKey: ["post", "list", query],
    queryFn: () => getPosts(query),
    enabled,
    staleTime: 60 * 1000,
    // 탭·페이지를 넘길 때 목록이 비었다 차오르며 깜빡이지 않게 한다.
    placeholderData: keepPreviousData,
  });

  return {
    posts: data?.items ?? [],
    totalCount: data?.totalCount ?? 0,
    totalPages: data?.totalPages ?? 0,
    isError,
    isLoading,
  };
};

export default usePostList;
