// src/hooks/useBlogPosts.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBlogPosts,
  fetchBlogPost,
  likeBlogPost,
  unlikeBlogPost,
  fetchLikeStatus,
} from "@/lib/api-functions";
import toast from "react-hot-toast";

// ブログ記事一覧を取得するフック
export const useBlogPosts = (params?: {
  page?: number;
  search?: string;
  tag?: string;
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

// いいね状態を取得するフック
export const useLikeStatus = (id: number) => {
  return useQuery({
    queryKey: ["likeStatus", id],
    queryFn: () => fetchLikeStatus(id),
    enabled: !!id,
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
      queryClient.invalidateQueries({ queryKey: ["likeStatus", variables.id] });
      toast.success(
        variables.isLiked ? "いいねを解除しました" : "いいねしました！"
      );
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "エラーが発生しました");
    },
  });
};
