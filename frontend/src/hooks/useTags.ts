// src/hooks/useTags.ts

import { useQuery } from "@tanstack/react-query";
import { fetchTags } from "@/lib/api-functions";

// タグ一覧を取得するフック
export const useTags = (search?: string) => {
  return useQuery({
    queryKey: ["tags", search],
    queryFn: () => fetchTags(search),
  });
};
