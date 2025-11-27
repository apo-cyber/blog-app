import { api } from "./api";
import { BlogPost, Tag, PaginatedResponse } from "@/types";

// =======================
// ブログ記事関連のAPI関数
// =======================

// 記事一覧を取得
export const fetchBlogPosts = async (params?: {
  page?: number;
  search?: string;
  tag?: string;
  ordering?: string;
}): Promise<PaginatedResponse<BlogPost>> => {
  const response = await api.get("/posts/", { params });
  return response.data;
};

// 記事詳細を取得
export const fetchBlogPost = async (id: number): Promise<BlogPost> => {
  const response = await api.get(`/posts/${id}/`);
  return response.data;
};

// いいねを追加
export const likeBlogPost = async (id: number): Promise<any> => {
  const response = await api.post(`/posts/${id}/like/`);
  return response.data;
};

// いいねを削除
export const unlikeBlogPost = async (id: number): Promise<any> => {
  const response = await api.delete(`/posts/${id}/like/`);
  return response.data;
};

// いいね状態を取得
export const fetchLikeStatus = async (
  id: number
): Promise<{ is_liked: boolean; likes_count: number }> => {
  const response = await api.get(`/posts/${id}/like_status/`);
  return response.data;
};

// =======================
// タグ関連のAPI関数
// =======================

// タグ一覧を取得
export const fetchTags = async (search?: string): Promise<Tag[]> => {
  const response = await api.get("/tags/", {
    params: { search },
  });
  return response.data;
};
