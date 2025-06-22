// src/hooks/useBlogPosts.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBlogPosts,
  fetchBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  likeBlogPost,
  unlikeBlogPost,
  fetchMyPosts,
  fetchLikedPosts,
  togglePublishBlogPost,
} from "@/lib/api-functions";
import { BlogPostInput } from "@/types";
import toast from "react-hot-toast";

// ブログ記事一覧を取得するフック
export const useBlogPosts = (params?: {
  page?: number;
  search?: string;
  tag?: string;
  author?: string;
  ordering?: string;
}) => {
  return useQuery({
    queryKey: ["blogPosts", params],
    queryFn: () => fetchBlogPosts(params),
  });
};

// ブログ記事詳細を取得するフック
export const useBlogPost = (id: number) => {
  return useQuery({
    queryKey: ["blogPost", id],
    queryFn: () => fetchBlogPost(id),
    enabled: !!id,
  });
};

// ブログ記事を作成するフック
export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BlogPostInput) => createBlogPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      toast.success("記事を投稿しました！");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "記事の投稿に失敗しました");
    },
  });
};

// ブログ記事を更新するフック
export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BlogPostInput }) =>
      updateBlogPost(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      queryClient.invalidateQueries({ queryKey: ["blogPost", variables.id] });
      toast.success("記事を更新しました！");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "記事の更新に失敗しました");
    },
  });
};

// ブログ記事を削除するフック
export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteBlogPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      toast.success("記事を削除しました");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "記事の削除に失敗しました");
    },
  });
};

// いいね機能のフック
export const useLikeBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isLiked }: { id: number; isLiked: boolean }) =>
      isLiked ? unlikeBlogPost(id) : likeBlogPost(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      queryClient.invalidateQueries({ queryKey: ["blogPost", variables.id] });
      toast.success(
        variables.isLiked ? "いいねを解除しました" : "いいねしました！"
      );
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "エラーが発生しました");
    },
  });
};

// 自分の投稿を取得するフック
export const useMyPosts = () => {
  return useQuery({
    queryKey: ["myPosts"],
    queryFn: fetchMyPosts,
    retry: false, // 認証エラーの場合はリトライしない
  });
};

// いいねした投稿を取得するフック
export const useLikedPosts = () => {
  return useQuery({
    queryKey: ["likedPosts"],
    queryFn: fetchLikedPosts,
    retry: false, // 認証エラーの場合はリトライしない
  });
};
// 記事の公開状態を切り替えるフック
export const useTogglePublishBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isPublished }: { id: number; isPublished: boolean }) =>
      togglePublishBlogPost(id, isPublished),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      queryClient.invalidateQueries({ queryKey: ["blogPost", variables.id] });
      toast.success(
        variables.isPublished
          ? "記事を公開しました！"
          : "記事を非公開にしました"
      );
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.detail || "公開状態の切り替えに失敗しました"
      );
    },
  });
};
