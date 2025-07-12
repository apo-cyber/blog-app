// src/lib/api-functions.ts

import { api } from "./api";
import {
  BlogPost,
  BlogPostInput,
  Tag,
  PaginatedResponse,
  User,
  Comment,
  CommentCreate,
  CommentUpdate,
  CommentCount,
} from "@/types";

// 認証関連のAPI関数

// サインアップ
export const signup = async (data: {
  username: string;
  email: string;
  password: string;
  password2: string;
}): Promise<{ user: User; detail: string }> => {
  const response = await api.post("/auth/signup/", data);
  return response.data;
};

// ブログ記事関連のAPI関数

// 記事一覧を取得
export const fetchBlogPosts = async (params?: {
  page?: number;
  search?: string;
  tag?: string;
  author?: string;
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

// 記事を作成
export const createBlogPost = async (
  data: BlogPostInput
): Promise<BlogPost> => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("is_published", String(data.is_published));

  // タグIDを追加
  data.tag_ids.forEach((tagId) => {
    formData.append("tag_ids", String(tagId));
  });

  // 画像がある場合は追加
  if (data.image) {
    formData.append("image", data.image);
  }

  const response = await api.post("/posts/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 記事を更新
export const updateBlogPost = async (
  id: number,
  data: BlogPostInput
): Promise<BlogPost> => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("is_published", String(data.is_published));

  // タグIDを追加
  data.tag_ids.forEach((tagId) => {
    formData.append("tag_ids", String(tagId));
  });

  // 画像がある場合は追加
  if (data.image) {
    formData.append("image", data.image);
  }

  const response = await api.patch(`/posts/${id}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 記事を削除
export const deleteBlogPost = async (id: number): Promise<void> => {
  await api.delete(`/posts/${id}/`);
};

// 記事の公開状態を切り替え
export const togglePublishBlogPost = async (
  id: number,
  isPublished: boolean
): Promise<BlogPost> => {
  const response = await api.patch(`/posts/${id}/`, {
    is_published: isPublished,
  });
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

// 自分の投稿を取得
export const fetchMyPosts = async (): Promise<BlogPost[]> => {
  const response = await api.get("/posts/my_posts/");
  return response.data;
};

// いいねした投稿を取得
export const fetchLikedPosts = async (): Promise<BlogPost[]> => {
  const response = await api.get("/posts/liked_posts/");
  return response.data;
};

// タグ関連のAPI関数

// タグ一覧を取得
export const fetchTags = async (search?: string): Promise<Tag[]> => {
  const response = await api.get("/tags/", {
    params: { search },
  });
  return response.data;
};

// タグを作成
export const createTag = async (name: string): Promise<Tag> => {
  const response = await api.post("/tags/", { name });
  return response.data;
};

// タグを削除
export const deleteTag = async (id: number): Promise<void> => {
  await api.delete(`/tags/${id}/`);
};

// コメント関連のAPI関数
export const getComments = async (postId: number): Promise<Comment[]> => {
  const response = await api.get(`/posts/${postId}/comments/`);
  return response.data.results || response.data;
};

export const createComment = async (
  postId: number,
  commentData: CommentCreate
): Promise<Comment> => {
  const response = await api.post(`/posts/${postId}/comments/`, commentData);
  return response.data;
};

export const createReply = async (
  commentId: number,
  replyData: CommentCreate
): Promise<Comment> => {
  const response = await api.post(`/comments/${commentId}/reply/`, replyData);
  return response.data;
};

export const getCommentCount = async (
  postId: number
): Promise<CommentCount> => {
  const response = await api.get(`/posts/${postId}/comments/count/`);
  return response.data;
};

export const updateComment = async (
  commentId: number,
  commentData: CommentUpdate
): Promise<Comment> => {
  const response = await api.put(`/comments/${commentId}/`, commentData);
  return response.data;
};

export const deleteComment = async (commentId: number): Promise<void> => {
  await api.delete(`/comments/${commentId}/`);
};
