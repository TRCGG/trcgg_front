import api from "@/services";
import { unwrap } from "@/services/apiService";
import {
  AdminPostDetail,
  AdminPostListItem,
  PostCreateInput,
  PostDeleteResponse,
  PostDetail,
  PostDetailResponse,
  PostListItem,
  PostListQuery,
  PostListResponse,
  PostPage,
  PostUpdateInput,
} from "@/data/types/post";

const toParams = ({ category, page, limit }: PostListQuery): Record<string, string> => ({
  ...(category ? { category } : {}),
  page: String(page),
  limit: String(limit),
});

const getPage = async <T>(endpoint: string, query: PostListQuery): Promise<PostPage<T>> => {
  const { body, headers } = await api.getWithHeaders<PostListResponse<T>>(
    endpoint,
    toParams(query)
  );
  return {
    items: body?.data ?? [],
    totalCount: Number(headers["x-total-count"] ?? 0),
    totalPages: Number(headers["x-total-pages"] ?? 0),
  };
};

export const getPosts = async (query: PostListQuery): Promise<PostPage<PostListItem>> =>
  getPage<PostListItem>("/api/posts", query);

export const getPost = async (id: number): Promise<PostDetail> =>
  unwrap(api.get<PostDetailResponse<PostDetail>>(`/api/posts/${id}`));

export const getAdminPosts = async (query: PostListQuery): Promise<PostPage<AdminPostListItem>> =>
  getPage<AdminPostListItem>("/api/admin/posts", query);

export const getAdminPost = async (id: number): Promise<AdminPostDetail> =>
  unwrap(api.get<PostDetailResponse<AdminPostDetail>>(`/api/admin/posts/${id}`));

export const createPost = async (input: PostCreateInput): Promise<AdminPostDetail> =>
  unwrap(api.post<PostDetailResponse<AdminPostDetail>>("/api/admin/posts", input));

export const updatePost = async (id: number, input: PostUpdateInput): Promise<AdminPostDetail> =>
  unwrap(api.patch<PostDetailResponse<AdminPostDetail>>(`/api/admin/posts/${id}`, input));

export const deletePost = async (id: number): Promise<{ id: number }> =>
  unwrap(api.delete<PostDeleteResponse>(`/api/admin/posts/${id}`));
