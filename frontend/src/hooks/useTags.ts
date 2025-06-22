// src/hooks/useTags.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTags, createTag, deleteTag } from "@/lib/api-functions";
import toast from "react-hot-toast";

// タグ一覧を取得するフック
export const useTags = (search?: string) => {
  return useQuery({
    queryKey: ["tags", search],
    queryFn: () => fetchTags(search),
  });
};

// タグを作成するフック
export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createTag(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("タグを作成しました！");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "タグの作成に失敗しました");
    },
  });
};

// タグを削除するフック
export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("タグを削除しました");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "タグの削除に失敗しました");
    },
  });
};
