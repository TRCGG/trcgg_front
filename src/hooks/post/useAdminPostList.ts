import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AdminPostListItem, PostListQuery, PostPage } from "@/data/types/post";
import { getAdminPosts } from "@/services/post";

const useAdminPostList = (query: PostListQuery, enabled: boolean) => {
  const { data, isError, isLoading, isFetching } = useQuery<PostPage<AdminPostListItem>>({
    queryKey: ["adminPost", "list", query],
    queryFn: () => getAdminPosts(query),
    enabled,
    placeholderData: keepPreviousData,
  });

  return {
    posts: data?.items ?? [],
    totalCount: data?.totalCount ?? 0,
    totalPages: data?.totalPages ?? 0,
    isError,
    isLoading,
    isFetching,
  };
};

export default useAdminPostList;
